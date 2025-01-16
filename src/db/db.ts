import Database from "@tauri-apps/plugin-sql";
import { drizzle } from "drizzle-orm/sqlite-proxy";
import * as schema from "../db/schema";

export type SelectQueryResult = {
  // biome-ignore lint/suspicious/noExplicitAny:
  [key: string]: any;
};

export const sqlite = await Database.load("sqlite:database.db");

export const db = drizzle<typeof schema>(
  async (sql, params, method) => {
    // biome-ignore lint/suspicious/noExplicitAny:
    let rows: any = [];
    let results = [];

    if (!isSelectQuery(sql)) {
      await sqlite.execute(sql, params).catch((e) => {
        console.error("SQL Error:", e);
        return [];
      });
      return { rows: [] };
    }

    rows = await sqlite.select(sql, params).catch((e) => {
      console.error("SQL Error:", e);
      return [];
    });

    // biome-ignore lint/suspicious/noExplicitAny:
    rows = rows.map((row: any) => {
      return Object.values(row);
    });
    results = method === "all" ? rows : rows[0];
    return { rows: results };
  },
  { schema: schema, logger: true },
);

function isSelectQuery(sql: string): boolean {
  const selectRegex = /^\s*SELECT\b/i;
  return selectRegex.test(sql);
}
