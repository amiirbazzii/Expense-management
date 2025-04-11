import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create or update user when they sign in
export const createOrUpdate = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", q => q.eq("userId", userId))
      .unique();
    
    if (existingUser) {
      // Update existing user
      return await ctx.db.patch(existingUser._id, {
        name: args.name,
        email: args.email,
      });
    } else {
      // Create new user
      return await ctx.db.insert("users", {
        userId,
        name: args.name,
        email: args.email,
      });
    }
  },
});

// Get current user
export const me = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }
    
    const userId = identity.subject;
    
    return await ctx.db
      .query("users")
      .withIndex("by_user_id", q => q.eq("userId", userId))
      .unique();
  },
});

// Update user preferences
export const updatePreferences = mutation({
  args: {
    preferences: v.object({
      currency: v.optional(v.string()),
      notificationsEnabled: v.optional(v.boolean()),
    }),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", q => q.eq("userId", userId))
      .unique();
    
    if (!user) {
      throw new Error("User not found");
    }
    
    return await ctx.db.patch(user._id, {
      preferences: args.preferences,
    });
  },
}); 