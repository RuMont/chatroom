import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';

const sqlite = new Database('src/db/database.db');
const db = drizzle(sqlite);

export default db;
