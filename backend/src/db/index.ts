import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema"; // Schema fayling qayerda bo'lsa, o'sha manzilni yoz

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL topilmadi! .env faylni tekshir.");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

