import { ClientModel } from "../../models/ClientModel";
import { Prettify } from "../../types/Prettify";

export type UpdateClientDTO = Prettify<Readonly<ClientModel>>;
