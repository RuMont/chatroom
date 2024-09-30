import { Client } from "./Client";
import { Message } from "./Message";

export type Room = {
  id: string;
  name: string;
  subscribedClients: Client['id'][];
  messages: Message[];
};
