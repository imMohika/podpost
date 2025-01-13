import { drizzle } from "drizzle-orm/sqlite-proxy";
import Database from "@tauri-apps/plugin-sql";
import * as schema from "../db/schema";

export type SelectQueryResult = {
  [key: string]: any;
};

export const sqlite = await Database.load("sqlite:database.db");

export const db = drizzle<typeof schema>(
  async (sql, params, method) => {
    let rows: any = [];
    let results = [];

    if (!isSelectQuery(sql)) {
      rows = await sqlite.execute(sql, params).catch((e) => {
        console.error("SQL Error:", e);
        return [];
      });
      return { rows: [] };
    }

    rows = await sqlite.select(sql, params).catch((e) => {
      console.error("SQL Error:", e);
      return [];
    });

    rows = rows.map((row: any) => {
      return Object.values(row);
    });
    results = method === "all" ? rows : rows[0];
    return { rows: results };
  },
  { schema: schema, logger: true }
);

function isSelectQuery(sql: string): boolean {
  const selectRegex = /^\s*SELECT\b/i;
  return selectRegex.test(sql);
}
