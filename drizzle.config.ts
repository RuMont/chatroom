import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: "sqlite",
  schema: "src/schemas/+(*Schema).ts",
  out: 'src/db/drizzle',
  dbCredentials: {
    url: 'src/db/database.db'
  },
  verbose: true,
  strict: true
})