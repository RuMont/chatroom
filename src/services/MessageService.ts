import { MessageModel } from "../models/MessageModel";

export default class MessageService {
  async get() {}

  async getFromRoom(roomId: MessageModel["roomId"]) {}

  async getFromClient(clientId: MessageModel["clientId"]) {}

  async create() {}

  async delete(messageId: MessageModel["id"]) {}
}
