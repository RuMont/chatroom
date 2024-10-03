import { eq } from "drizzle-orm";
import Container from "../di/container";
import { MessageModel } from "../models/MessageModel";
import { insertMessageSchema, message } from "../schemas/MessageSchema";
import EventService from "./EventService";
import db from "../db/Database";
import { CreateMessageDTO } from "../dtos/message/CreateMessageDTO";

export default class MessageService {
  private readonly eventService: EventService;

  constructor() {
    this.eventService = Container.get(EventService);
  }

  async get() {
    return db.select().from(message);
  }

  async getFromRoom(roomId: MessageModel["roomId"]) {
    return db.select().from(message).where(eq(message.roomId, roomId));
  }

  async getFromClient(clientId: MessageModel["clientId"]) {
    return db.select().from(message).where(eq(message.clientId, clientId));
  }

  async create(messageDto: CreateMessageDTO) {
    const validationSchema = insertMessageSchema.pick({
      roomId: true,
      clientId: true,
      timestamp: true,
      content: true,
    });
    const newMessage = validationSchema.parse(messageDto);
    const result = db.insert(message).values(newMessage).returning().get();
    if (result) {
      this.eventService.fireMessageCreated(result);
    }
    return;
  }

  async delete(messageId: MessageModel["id"]) {
    return db.delete(message).where(eq(message.id, messageId));
  }
}
