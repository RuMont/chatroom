import { randomUUID } from "crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { client } from "./ClientSchema";
import { room } from "./RoomSchema";
import { sql } from "drizzle-orm";

export const message = sqliteTable("message", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  clientId: text("client_id").references(() => client.id),
  roomId: text("room_id").references(() => room.id),
  timestamp: text("timestamp")
    .notNull()
    .default(sql`(current_timestamp)`),
  content: text("content"),
});
