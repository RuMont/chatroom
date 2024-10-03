import { MessageModel } from "../../models/MessageModel";
import { Prettify } from "../../types/Prettify";

export type CreateMessageDTO = Prettify<Readonly<Omit<MessageModel, "id">>>;
