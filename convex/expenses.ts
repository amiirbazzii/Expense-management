import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc, Id } from "./_generated/dataModel";

// Add a new expense
export const create = mutation({
  args: {
    amount: v.number(),
    description: v.string(),
    category: v.optional(v.string()),
    date: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    
    return await ctx.db.insert("expenses", {
      userId,
      amount: args.amount,
      description: args.description,
      category: args.category,
      date: args.date ?? Date.now(),
    });
  },
});

// Get all expenses for the current user
export const list = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    const limit = args.limit ?? 50;
    
    return await ctx.db
      .query("expenses")
      .withIndex("by_user", q => q.eq("userId", userId))
      .order("desc")
      .take(limit);
  },
});

// Get expense by ID
export const getById = query({
  args: { id: v.id("expenses") },
  handler: async (ctx, args) => {
    const expense = await ctx.db.get(args.id);
    
    if (!expense) {
      return null;
    }
    
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || expense.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }
    
    return expense;
  },
});

// Get total expenses for the current month
export const currentMonthTotal = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
    
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_date", q => 
        q.eq("userId", userId)
          .gte("date", startOfMonth)
          .lte("date", endOfMonth)
      )
      .collect();
    
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  },
});

// Get total expenses for a specific date
export const dailyTotal = query({
  args: {
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    
    const startOfDay = new Date(args.date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(args.date);
    endOfDay.setHours(23, 59, 59, 999);
    
    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_date", q => 
        q.eq("userId", userId)
          .gte("date", startOfDay.getTime())
          .lte("date", endOfDay.getTime())
      )
      .collect();
    
    return expenses.reduce((total, expense) => total + expense.amount, 0);
  },
});

// Compare current month to previous month
export const compareMonths = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    
    const now = new Date();
    
    // Current month range
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).getTime();
    
    // Previous month range
    const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).getTime();
    const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999).getTime();
    
    // Get current month expenses
    const currentMonthExpenses = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_date", q => 
        q.eq("userId", userId)
          .gte("date", startOfCurrentMonth)
          .lte("date", endOfCurrentMonth)
      )
      .collect();
    
    // Get previous month expenses
    const previousMonthExpenses = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_date", q => 
        q.eq("userId", userId)
          .gte("date", startOfPreviousMonth)
          .lte("date", endOfPreviousMonth)
      )
      .collect();
    
    const currentMonthTotal = currentMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
    const previousMonthTotal = previousMonthExpenses.reduce((total, expense) => total + expense.amount, 0);
    
    return {
      currentMonth: currentMonthTotal,
      previousMonth: previousMonthTotal,
      difference: currentMonthTotal - previousMonthTotal,
      percentage: previousMonthTotal > 0 
        ? ((currentMonthTotal - previousMonthTotal) / previousMonthTotal * 100) 
        : 0,
    };
  },
}); 