import { RoomModel } from "../../models/RoomModel";
import { Prettify } from "../../types/Prettify";

export type CreateRoomDTO = Prettify<Readonly<Omit<RoomModel, "id">>>;
