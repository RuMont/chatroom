import { count, eq } from "drizzle-orm";
import db from "../db/Database";
import {
  insertRoomSchema,
  room,
  updateRoomSchema,
} from "../schemas/RoomSchema";
import { CreateRoomDto } from "../dto/CreateRoomDto";
import Container from "../di/container";
import EventService from "./EventService";

export default class RoomService {
  private readonly eventService: EventService;

  constructor() {
    this.eventService = Container.get(EventService);
  }

  async get() {
    return db.select().from(room);
  }

  async getById(id: typeof room.$inferSelect.id) {
    const roomResult = db.select().from(room).where(eq(room.id, id)).get();
    if (!roomResult) return null;
    return roomResult;
  }

  async create(roomDto: CreateRoomDto) {
    const validationSchema = insertRoomSchema.pick({ name: true });
    const newRoom = validationSchema.parse(roomDto);
    const sameNameRooms = await db
      .select({ count: count() })
      .from(room)
      .where(eq(room.name, newRoom.name))
      .get()?.count;
    if (sameNameRooms)
      throw `Another room with name ${newRoom.name} already exists`;
    const createdRoom = await db.insert(room).values(newRoom).returning().get();
    if (!createdRoom) return null;
    this.eventService.fireRoomCreated(createdRoom);
    return createdRoom;
  }

  async update(roomDto: CreateRoomDto) {
    const validationSchema = updateRoomSchema.pick({ id: true, name: true });
    const newRoom = validationSchema.parse(roomDto);
    const updatedRoom = db
      .update(room)
      .set(newRoom)
      .where(eq(room.id, newRoom.id!))
      .returning()
      .get();
    this.eventService.fireRoomUpdated(updatedRoom);
    return updatedRoom;
  }

  async delete(roomId: typeof room.$inferSelect.id) {
    const result = db.delete(room).where(eq(room.id, roomId));
    this.eventService.fireRoomDeleted({
      id: roomId,
      name: "",
    });
    return result;
  }
}
