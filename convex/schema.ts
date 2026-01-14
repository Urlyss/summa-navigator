import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  parts: defineTable({
    original_id: v.string(),
    title: v.string(),
    order: v.number(),
  }).index("by_original_id", ["original_id"]).index("by_order", ["order"]),

  treatises: defineTable({
    original_id: v.number(),
    title: v.string(),
    part_id: v.id("parts"),
  }).index("by_part_and_original", ["part_id", "original_id"]),

  questions: defineTable({
    original_id: v.number(),
    title: v.string(),
    description: v.array(v.string()),
    treatise_id: v.id("treatises"),
  }).index("by_treatise_and_original", ["treatise_id", "original_id"]),

  articles: defineTable({
    original_id: v.number(),
    title: v.string(),
    body: v.array(v.string()),
    counter: v.array(v.string()),
    objections: v.array(
      v.object({
        id: v.number(),
        text: v.array(v.string()),
      })
    ),
    replies: v.array(
      v.object({
        id: v.number(),
        text: v.array(v.string()),
      })
    ),
    question_id: v.id("questions"),
  }).index("by_question_and_original", ["question_id", "original_id"]),
});

