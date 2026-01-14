import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { db as staticDb } from "../lib/db";

export const importAll = mutation({
  args: {},
  handler: async ({ db }) => {
    // This mutation is intended to be called once from a script.
    // It imports the static data from lib/db into Convex.

    // Clear existing data (order matters due to references).
    const articles = await db.query("articles").collect();
    for (const article of articles) {
      await db.delete(article._id);
    }

    const questions = await db.query("questions").collect();
    for (const question of questions) {
      await db.delete(question._id);
    }

    const treatises = await db.query("treatises").collect();
    for (const treatise of treatises) {
      await db.delete(treatise._id);
    }

    const parts = await db.query("parts").collect();
    for (const part of parts) {
      await db.delete(part._id);
    }

    // Now insert fresh data using the same logical structure as scripts/data.ts.
    const partIdMap = new Map<string, string>();
    const treatiseIdMap = new Map<string, string>();
    const questionIdMap = new Map<string, string>();

    for (const part of staticDb) {
      const partDoc = await db.insert("parts", {
        original_id: part.id,
        title: part.title,
        order: part.order,
      });
      partIdMap.set(part.id, partDoc.toString());

      for (const treatise of part.treatises) {
        const treatiseDoc = await db.insert("treatises", {
          original_id: treatise.id,
          title: treatise.title,
          part_id: partDoc,
        });
        treatiseIdMap.set(`${part.id}-${treatise.id}`, treatiseDoc.toString());

        for (const question of treatise.questions) {
          const descriptionArray = Array.isArray(question.description)
            ? question.description
            : [question.description];

          const questionDoc = await db.insert("questions", {
            original_id: question.id,
            title: question.title,
            description: descriptionArray,
            treatise_id: treatiseDoc,
          });
          questionIdMap.set(
            `${treatiseDoc.toString()}-${question.id}`,
            questionDoc.toString()
          );

          for (const article of question.articles) {
            await db.insert("articles", {
              original_id: article.id,
              title: Array.isArray(article.title)
                ? article.title.join(" ")
                : article.title,
              body: Array.isArray(article.body) ? article.body : article.body ?? [],
              counter: Array.isArray(article.counter)
                ? article.counter
                : article.counter ?? [],
              objections: article.objections ?? [],
              replies: article.replies ?? [],
              question_id: questionDoc,
            });
          }
        }
      }
    }

    return { success: true };
  },
});

