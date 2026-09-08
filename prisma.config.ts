import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

// Load .env.local first if present, then fall back to .env
dotenv.config({ path: ".env.local" });
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined in environment variables or .env/.env.local file");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: databaseUrl,
  },
});
