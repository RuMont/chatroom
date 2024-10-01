import { client } from "../schemas/ClientSchema";
import { message } from "../schemas/MessageSchema";
import { room } from "../schemas/RoomSchema";

export default class MessageService {
  async get() {}

  async getFromRoom(roomId: typeof room.$inferSelect.id) {}

  async getFromClient(clientId: typeof client.$inferSelect.id) {}

  async create() {}

  async delete(messageId: typeof message.$inferSelect.id) {}
}
