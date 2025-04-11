import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  expenses: defineTable({
    userId: v.string(),
    amount: v.number(),
    description: v.string(),
    category: v.optional(v.string()),
    date: v.number(), // Unix timestamp
  })
  .index("by_user", ["userId"])
  .index("by_user_and_date", ["userId", "date"]),

  users: defineTable({
    userId: v.string(),
    name: v.string(),
    email: v.string(),
    imageUrl: v.optional(v.string()),
    createdAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
    preferences: v.optional(v.object({
      currency: v.optional(v.string()),
      notificationsEnabled: v.optional(v.boolean()),
    })),
  })
  .index("by_user_id", ["userId"]),
}); 