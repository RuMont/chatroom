import { MessageModel } from "../../models/MessageModel";
import { Prettify } from "../../types/Prettify";

export type UpdateMessageDTO = Prettify<Readonly<MessageModel>>;
