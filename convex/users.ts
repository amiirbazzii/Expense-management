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

// Create a user from Clerk webhook
export const createUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_user_id", q => q.eq("userId", args.clerkId))
      .unique();
    
    if (existingUser) {
      // User already exists, return existing user ID
      return existingUser._id;
    }
    
    // Create new user
    return await ctx.db.insert("users", {
      userId: args.clerkId,
      name: `${args.firstName || ''} ${args.lastName || ''}`.trim(),
      email: args.email || '',
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });
  },
});

// Update a user from Clerk webhook
export const updateUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.optional(v.string()),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Find the user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", q => q.eq("userId", args.clerkId))
      .unique();
    
    if (!user) {
      // User not found, create them
      return await ctx.db.insert("users", {
        userId: args.clerkId,
        name: `${args.firstName || ''} ${args.lastName || ''}`.trim(),
        email: args.email || '',
        imageUrl: args.imageUrl,
        updatedAt: Date.now(),
      });
    }
    
    // Update existing user
    return await ctx.db.patch(user._id, {
      name: `${args.firstName || ''} ${args.lastName || ''}`.trim(),
      email: args.email || '',
      imageUrl: args.imageUrl,
      updatedAt: Date.now(),
    });
  },
});

// Delete a user from Clerk webhook
export const deleteUser = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    // Find the user by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_user_id", q => q.eq("userId", args.clerkId))
      .unique();
    
    if (!user) {
      // User not found
      return null;
    }
    
    // Delete the user
    await ctx.db.delete(user._id);
    return user._id;
  },
}); 