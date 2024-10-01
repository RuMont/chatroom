import { randomUUID } from "crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { client } from "./ClientSchema";
import { room } from "./RoomSchema";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const message = sqliteTable("message", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  clientId: text("client_id")
    .references(() => client.id)
    .notNull(),
  roomId: text("room_id")
    .references(() => room.id)
    .notNull(),
  timestamp: text("timestamp")
    .default(sql`(current_timestamp)`)
    .notNull(),
  content: text("content").notNull(),
});

export const insertMessageSchema = createInsertSchema(message);
export const updateMessageSchema = createInsertSchema(message, {
  id: z.string().uuid(),
}).required();
