import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const filesSchema = sqliteTable("files", {
  id: integer("id").primaryKey().unique(),
  filePath: text("file_path"),
  fileHash: text("file_hash").notNull().unique(),
  taskIdentifier: text("task_identifier").notNull().unique(),

  title: text("title"),
  comment: text("comment"),
  album: text("album"),
  genre: text("genre"),
  year: text("year"),

  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export type TPodcast = typeof filesSchema.$inferSelect;
