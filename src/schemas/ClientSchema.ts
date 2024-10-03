import { randomUUID } from "crypto";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { room } from "./RoomSchema";

export const client = sqliteTable("client", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text("name").notNull(),
  roomId: text("joined_room_id").references(() => room.id),
});

export const insertClientSchema = createInsertSchema(client);
export const updateClientSchema = createInsertSchema(client, {
  id: z.string().uuid(),
  roomId: z.string().uuid().optional(),
}).required();
