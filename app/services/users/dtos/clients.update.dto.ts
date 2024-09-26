import { type Input, pickAsync } from "@vigilio/valibot";
import { clientsSchema } from "../schemas/client.schema";

export const clientsUpdateDto = pickAsync(clientsSchema, ["enabled"]);
export type ClientsUpdateDto = Input<typeof clientsUpdateDto>;
