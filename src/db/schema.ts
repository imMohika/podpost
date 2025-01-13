import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const filesSchema = sqliteTable("files", {
  id: integer("id").primaryKey().unique(),
  filePath: text("file_path"),
  fileHash: text("file_hash").notNull().unique(),

  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});

export type Podcast = typeof filesSchema.$inferSelect;
