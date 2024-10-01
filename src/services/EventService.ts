import { Request, Response } from "express";
import { client, updateClientSchema } from "../schemas/ClientSchema";
import { message } from "../schemas/MessageSchema";
import { room } from "../schemas/RoomSchema";
import { Prettify } from "../types/Prettify";
import { RTState } from "../types/RealTimeState";
import Container from "../di/container";
import RoomService from "./RoomService";
import ClientService from "./ClientService";
import { AppEvent } from "../types/AppEvent";

export default class EventService {
  state: Prettify<RTState> = new Map();
  clients: (typeof client.$inferSelect & { connection: Response })[] = [];

  public async subscribe(
    connectedClient: typeof client.$inferSelect,
    req: Request,
    res: Response
  ) {
    // restore state when the first user subscribes
    await this.restoreStateIfEmpty();
    await this.validateClient(connectedClient);
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Cache-Control", "no-cache");
    this.registerClient(connectedClient, res);
    this.watchConnection(connectedClient, req, res);
  }

  public unsubscribe(
    res: Response,
    reason: string | null = null,
    code: number
  ) {
    if (reason) res.status(code);
    res.write(
      `data: ${JSON.stringify({
        message: reason,
      })}\n\n`
    );
    res.end();
  }

  // #region events start

  public fireRoomCreated(createdRoom: typeof room.$inferSelect) {
    this.state.set(createdRoom.id, {
      name: createdRoom.name,
      messages: [],
      participants: [],
    });
    this.notifyAll({ "[Room Created]": createdRoom });
  }

  public fireRoomUpdated(updatedRoom: typeof room.$inferSelect) {
    this.state.set(updatedRoom.id, {
      ...this.state.get(updatedRoom.id)!,
      name: updatedRoom.name,
    });
    this.notifyAll({ "[Room Updated]": updatedRoom });
  }

  public fireRoomDeleted(deletedRoom: typeof room.$inferSelect) {
    this.state.delete(deletedRoom.id);
    this.notifyAll({ "[Room Deleted]": deletedRoom });
  }

  public fireMessageCreated(
    roomId: typeof room.$inferSelect.id,
    createdMessage: typeof message.$inferSelect
  ) {
    const room = this.state.get(roomId);
    room?.messages.push(createdMessage);
    this.notifyRoomParticipants(roomId, {
      "[Message Created]": createdMessage,
    });
  }

  public fireMessageDeleted(
    roomId: typeof room.$inferSelect.id,
    deletedMessage: typeof message.$inferSelect
  ) {
    const room = this.state.get(roomId);
    room?.messages.filter((msg) => msg.id !== deletedMessage.id);
    this.notifyRoomParticipants(roomId, {
      "[Message Deleted]": deletedMessage,
    });
  }

  public fireClientConnected(
    roomId: typeof room.$inferSelect.id,
    connectedClient: typeof client.$inferSelect
  ) {
    const room = this.state.get(roomId);
    room?.participants.push(connectedClient);
    this.notifyRoomParticipants(roomId, {
      "[Client Connected]": connectedClient,
    });
  }

  public fireClientUpdated(
    roomId: typeof room.$inferSelect.id,
    updatedClient: typeof client.$inferSelect
  ) {
    const room = this.state.get(roomId);
    room?.participants.filter((p) => p.id === updatedClient.id);
    room?.participants.push(updatedClient);
    this.notifyRoomParticipants(roomId, {
      "[Client Updated]": updatedClient,
    });
  }

  public fireClientDisconnected(
    roomId: typeof room.$inferSelect.id,
    disconnectedClient: typeof client.$inferSelect
  ) {
    const room = this.state.get(roomId);
    room?.participants.filter((cl) => cl.id === disconnectedClient.id);
    this.notifyRoomParticipants(roomId, {
      "[Client Disconnected]": { ...disconnectedClient, roomId },
    });
  }

  // #region events finish

  private notifyAll<T>(event: AppEvent<T>) {
    this.clients.forEach((client) => {
      client.connection.write(`data: ${JSON.stringify(event)}\n\n`);
    });
  }

  private notifyRoomParticipants<T>(
    roomId: typeof room.$inferSelect.id,
    event: AppEvent<T>
  ) {
    const participants = this.state.get(roomId)?.participants;
    if (!participants || participants.length === 0) return;
    const connections = this.clients
      .filter((client) => participants.map((p) => p.id).includes(client.id))
      .map((client) => client.connection);
    connections.forEach((conn) =>
      conn.write(`data: ${JSON.stringify(event)}\n\n`)
    );
  }

  private async restoreStateIfEmpty() {
    if (this.state.size !== 0) return;
    const rooms = await Container.get(RoomService).get();
    rooms.forEach((room) =>
      this.state.set(room.id, {
        messages: [],
        name: room.name,
        participants: [],
      })
    );
    console.log({
      "Restored state": this.state,
    });
    // fetch participants
    // fetch messages
  }

  private async validateClient(connectedClient: typeof client.$inferSelect) {
    updateClientSchema
      .pick({
        id: true,
        name: true,
        roomId: true,
      })
      .parse(connectedClient);

    const clientService = Container.get(ClientService);
    const result = await clientService.getById(connectedClient.id);
    if (!result) throw "unauthorized";
  }

  private registerClient(
    connectingClient: typeof client.$inferSelect,
    res: Response
  ) {
    this.clients.push({
      ...connectingClient,
      connection: res,
    });
    console.log(`${connectingClient.name} connected`);
  }

  private watchConnection(
    connectingClient: typeof client.$inferSelect,
    req: Request,
    res: Response
  ) {
    req.on("close", () => {
      return () => {
        this.clients = this.clients.filter(
          (client) => client.id !== connectingClient.id
        );
        console.log(`${connectingClient.name} disconnected`);
      };
    });
    res.write("");
  }
}
