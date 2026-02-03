import { defineConfig } from "@prisma/sdk";

export default defineConfig({
  datasource: {
    // This is the connection string for your database
    url: process.env.DATABASE_URL,
    provider: "postgresql",
  },
  generator: {
    provider: "prisma-client-js",
    output: "./prisma/generated", // Output path for the Prisma client
  },
});