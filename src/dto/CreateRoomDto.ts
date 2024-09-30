import { room } from "../schemas/RoomSchema";

export type CreateRoomDto = typeof room.$inferInsert;