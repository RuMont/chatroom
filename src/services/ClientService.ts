import { eq } from "drizzle-orm";
import db from "../db/Database";
import {
  client,
  insertClientSchema,
  updateClientSchema,
} from "../schemas/ClientSchema";
import Container from "../di/container";
import EventService from "./EventService";
import { ClientModel } from "../models/ClientModel";
import { CreateClientDTO } from "../dtos/client/CreateClientDTO";
import { UpdateClientDTO } from "../dtos/client/UpdateClientDTO";

export default class ClientService {
  private readonly eventService: EventService;

  constructor() {
    this.eventService = Container.get(EventService);
  }

  async get() {
    return db.select().from(client);
  }

  async getById(id: ClientModel["id"]) {
    const clientResult = (
      await db.select().from(client).where(eq(client.id, id))
    ).at(0);
    if (!clientResult) return null;
    return clientResult;
  }

  async getFromRoom(roomId: NonNullable<ClientModel["roomId"]>) {
    return db.select().from(client).where(eq(client.roomId, roomId));
  }

  async create(clientDto: CreateClientDTO) {
    const validationSchema = insertClientSchema.pick({ name: true });
    const newClient = validationSchema.parse(clientDto);
    return db.insert(client).values(newClient).returning();
  }

  async update(clientDto: UpdateClientDTO) {
    const validationSchema = updateClientSchema.pick({
      id: true,
      name: true,
      roomId: true,
    });
    const newClient = validationSchema.parse(clientDto);
    const oldClient = db
      .select()
      .from(client)
      .where(eq(client.id, newClient.id!))
      .get();

    if (!oldClient) return null;

    db.update(client)
      .set(newClient)
      .where(eq(client.id, newClient.id!))
      .returning()
      .get();

    if (newClient.roomId !== null && newClient.roomId !== undefined) {
      if (oldClient.roomId !== newClient.roomId) {
        this.eventService.fireClientConnected(newClient.roomId, newClient);
      }
      if (oldClient.name !== newClient.name) {
        this.eventService.fireClientUpdated(newClient.roomId, newClient);
      }
    } else {
      if (oldClient.roomId) {
        this.eventService.fireClientDisconnected(oldClient.roomId, newClient);
      }
    }

    return newClient;
  }

  async delete(clientId: ClientModel["id"]) {
    const deletingClient = db
      .select()
      .from(client)
      .where(eq(client.id, clientId))
      .get();
    const result = db.delete(client).where(eq(client.id, clientId));

    if (deletingClient?.roomId) {
      this.eventService.fireClientDisconnected(
        deletingClient.roomId,
        deletingClient
      );
    }

    return result;
  }
}
