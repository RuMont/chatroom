import { RoomModel } from "../../models/RoomModel";
import { Prettify } from "../../types/Prettify";

export type UpdateRoomDTO = Prettify<Readonly<RoomModel>>;
