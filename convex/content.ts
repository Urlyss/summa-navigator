import { query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { v } from "convex/values";

// Helper utilities to avoid repeating the same indexed lookups
const getPartByOriginalId = async (db: any, originalId: string) => {
  return db
    .query("parts")
    .withIndex("by_original_id", (q: any) => q.eq("original_id", originalId))
    .unique();
};

const getTreatiseByOriginalId = async (
  db: any,
  partId: Id<"parts">,
  treatiseOriginalId: number
) => {
  return db
    .query("treatises")
    .withIndex("by_part_and_original", (q: any) =>
      q.eq("part_id", partId).eq("original_id", treatiseOriginalId)
    )
    .unique();
};

const getQuestionByOriginalId = async (
  db: any,
  treatiseId: Id<"treatises">,
  questionOriginalId: number
) => {
  return db
    .query("questions")
    .withIndex("by_treatise_and_original", (q: any) =>
      q.eq("treatise_id", treatiseId).eq("original_id", questionOriginalId)
    )
    .unique();
};

export const getAllParts = query({
  args: {},
  handler: async ({ db }) => {
    return db.query("parts").withIndex("by_order").collect();
  },
});

export const getPartWithTreatises = query({
  args: { originalId: v.string() },
  handler: async ({ db }, { originalId }) => {
    const part = await getPartByOriginalId(db, originalId);

    if (!part) return null;

    const treatises = await db
      .query("treatises")
      .withIndex("by_part_and_original", (q: any) => q.eq("part_id", part._id))
      .collect();

    return { ...part, treatises };
  },
});

export const getTreatiseWithQuestions = query({
  args: { partOriginalId: v.string(), treatiseOriginalId: v.number() },
  handler: async ({ db }, { partOriginalId, treatiseOriginalId }) => {
    const part = await getPartByOriginalId(db, partOriginalId);
    if (!part) return null;

    const treatise = await getTreatiseByOriginalId(
      db,
      part._id,
      treatiseOriginalId
    );
    if (!treatise) return null;

    const questions = await db
      .query("questions")
      .withIndex("by_treatise_and_original", (q: any) =>
        q.eq("treatise_id", treatise._id)
      )
      .collect();

    return { ...treatise, questions, part };
  },
});

export const getQuestionWithArticles = query({
  args: {
    partOriginalId: v.string(),
    treatiseOriginalId: v.number(),
    questionOriginalId: v.number(),
  },
  handler: async (
    { db },
    { partOriginalId, treatiseOriginalId, questionOriginalId }
  ) => {
    const part = await getPartByOriginalId(db, partOriginalId);
    if (!part) return null;

    const treatise = await getTreatiseByOriginalId(
      db,
      part._id,
      treatiseOriginalId
    );
    if (!treatise) return null;

    const question = await getQuestionByOriginalId(
      db,
      treatise._id,
      questionOriginalId
    );
    if (!question) return null;

    const articles = await db
      .query("articles")
      .withIndex("by_question_and_original", (q: any) =>
        q.eq("question_id", question._id)
      )
      .collect();

    return { ...question, articles, treatise, part };
  },
});

export const getArticleFull = query({
  args: {
    partOriginalId: v.string(),
    treatiseOriginalId: v.number(),
    questionOriginalId: v.number(),
    articleOriginalId: v.number(),
  },
  handler: async (
    { db },
    { partOriginalId, treatiseOriginalId, questionOriginalId, articleOriginalId }
  ) => {
    const part = await getPartByOriginalId(db, partOriginalId);
    if (!part) return null;

    const treatise = await getTreatiseByOriginalId(
      db,
      part._id,
      treatiseOriginalId
    );
    if (!treatise) return null;

    const question = await getQuestionByOriginalId(
      db,
      treatise._id,
      questionOriginalId
    );
    if (!question) return null;

    const article = await db
      .query("articles")
      .withIndex("by_question_and_original", (q: any) =>
        q.eq("question_id", question._id).eq("original_id", articleOriginalId)
      )
      .unique();

    if (!article) return null;

    return { ...article, question, treatise, part };
  },
});

