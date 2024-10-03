import { ClientModel } from "../../models/ClientModel";
import { Prettify } from "../../types/Prettify";

export type CreateClientDTO = Prettify<Readonly<Omit<ClientModel, "id">>>;
