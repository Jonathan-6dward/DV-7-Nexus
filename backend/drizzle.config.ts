import { defineConfig } from "drizzle-kit";
export default defineConfig({
  schema: process.env.DB_PROVIDER === 'sqlite' ? "./drizzle/schema-sqlite.ts" : "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: process.env.DB_PROVIDER === 'sqlite' ? 'sqlite' : 'mysql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});