import { type Input, pick } from "@vigilio/valibot";
import { clientsSchema } from "../schemas/client.schema";

export const clientsUpdateDto = pick(clientsSchema, ["enabled"]);

export type ClientsUpdateDto = Input<typeof clientsUpdateDto>;
