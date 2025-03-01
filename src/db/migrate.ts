import { BaseDirectory, resourceDir } from "@tauri-apps/api/path";
import { readDir, readTextFile } from "@tauri-apps/plugin-fs";
import { sqlite } from "./db";

export type ProxyMigrator = (migrationQueries: string[]) => Promise<void>;

export async function migrate() {
  const resourcePath = await resourceDir();
  const dirPath = `${resourcePath}/migrations`;

  const files = await readDir("migrations", {
    baseDir: BaseDirectory.Resource,
  });
  let migrations = files.filter((file) => file.name?.endsWith(".sql"));

  // sort migrations by the first 4 characters of the file name
  migrations = migrations.sort((a, b) => {
    const aHash = a.name?.replace(".sql", "").slice(0, 4);
    const bHash = b.name?.replace(".sql", "").slice(0, 4);

    if (aHash && bHash) {
      return aHash.localeCompare(bHash);
    }

    return 0;
  });

  const migrationTableCreate = /*sql*/ `
		CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hash text NOT NULL UNIQUE,
			created_at numeric
		)
	`;

  await sqlite.execute(migrationTableCreate, []);

  for (const migration of migrations) {
    const hash = migration.name?.replace(".sql", "");

    const dbMigrations = (await sqlite.select(
      /*sql*/ `SELECT id, hash, created_at FROM "__drizzle_migrations" ORDER BY created_at DESC`,
    )) as unknown as { id: number; hash: string; created_at: number }[];

    const hasBeenRun = (hash: string) =>
      dbMigrations.find((dbMigration) => {
        return dbMigration?.hash === hash;
      });

    if (hash && hasBeenRun(hash) === undefined) {
      const sql = await readTextFile(`${dirPath}\\${migration.name}`);

      sqlite.execute(sql, []);
      sqlite.execute(
        /*sql*/ `INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES ($1, $2)`,
        [hash, Date.now()],
      );
    }
  }

  console.info("Migrations complete");

  return Promise.resolve();
}
