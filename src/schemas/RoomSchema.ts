import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { randomUUID } from "crypto";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const room = sqliteTable(
  "room",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    name: text("name").notNull(),
  },
  (room) => ({
    nameIdx: uniqueIndex("nameIdx").on(room.name),
  })
);

export const insertRoomSchema = createInsertSchema(room);
export const updateRoomSchema = createInsertSchema(room, {
  id: z.string().uuid(),
}).required();
