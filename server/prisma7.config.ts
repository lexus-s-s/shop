import "dotenv/config";
import { defineConfig } from "@prisma/prisma7/config";

const url = process.env["DATABASE_URL"];
if (!url) throw new Error("DATABASE_URL не задан в .env");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url,
  },
});