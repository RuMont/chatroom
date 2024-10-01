import { client } from "../schemas/ClientSchema";
import { message } from "../schemas/MessageSchema";
import { room } from "../schemas/RoomSchema";

type Room = typeof room.$inferSelect;
type Message = typeof message.$inferSelect;
type Client = typeof client.$inferSelect;

export type RTState = Map<
  Room["id"],
  { name: Room["name"]; messages: Message[]; participants: Client[] }
>;
