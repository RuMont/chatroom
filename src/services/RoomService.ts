import { count, eq } from "drizzle-orm";
import db from "../db/Database";
import {
  insertRoomSchema,
  room,
  updateRoomSchema,
} from "../schemas/RoomSchema";
import { Room } from "../types/Room";
import { message } from "../schemas/MessageSchema";
import { CreateRoomDto } from "../dto/CreateRoomDto";

export default class RoomService {
  async get() {
    return await db.select().from(room);
  }

  async getById(id: Room["id"]) {
    const roomResult = (await db.select().from(room).where(eq(room.id, id))).at(
      0
    );
    if (!roomResult) return null;
    const messages = await db
      .select()
      .from(message)
      .where(eq(message.roomId, id));
    return {
      ...roomResult,
      messages,
    };
  }

  async create(roomDto: CreateRoomDto) {
    const validateSchema = insertRoomSchema.pick({ name: true });
    const newRoom = validateSchema.parse(roomDto);
    const sameNameRooms = await db
      .select({ count: count() })
      .from(room)
      .where(eq(room.name, newRoom.name))
      .get()?.count;
    if (sameNameRooms)
      throw `Another room with name ${newRoom.name} already exists`;
    return await db.insert(room).values(newRoom).returning();
  }

  async update(roomDto: CreateRoomDto) {
    const validateSchema = updateRoomSchema.pick({ id: true, name: true });
    const newRoom = validateSchema.parse(roomDto);
    return (
      await db
        .update(room)
        .set(newRoom)
        .where(eq(room.id, newRoom.id!))
        .returning()
    ).at(0);
  }
}
