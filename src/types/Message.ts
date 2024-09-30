import { Client } from "./Client";

export type Message = {
  id: string;
  clientId: Client['id'];
  timestamp: string;
  content: string;
}