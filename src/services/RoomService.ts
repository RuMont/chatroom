import { count, eq } from "drizzle-orm";
import db from "../db/Database";
import {
  insertRoomSchema,
  room,
  updateRoomSchema,
} from "../schemas/RoomSchema";
import Container from "../di/container";
import EventService from "./EventService";
import { CreateRoomDTO } from "../dtos/room/CreateRoomDTO";
import { UpdateRoomDTO } from "../dtos/room/UpdateRoomDTO";
import { RoomModel } from "../models/RoomModel";

export default class RoomService {
  private readonly eventService: EventService;

  constructor() {
    this.eventService = Container.get(EventService);
  }

  async get() {
    return db.select().from(room);
  }

  async getById(id: RoomModel["id"]) {
    const roomResult = db.select().from(room).where(eq(room.id, id)).get();
    if (!roomResult) return null;
    return roomResult;
  }

  async create(roomDto: CreateRoomDTO) {
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

  async update(roomDto: UpdateRoomDTO) {
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

  async delete(roomId: RoomModel["id"]) {
    const result = db.delete(room).where(eq(room.id, roomId));
    this.eventService.fireRoomDeleted({
      id: roomId,
      name: "",
    });
    return result;
  }
}
