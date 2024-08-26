import { pick, type Input } from "@vigilio/valibot";
import { usersSchema } from "../schemas/users.schema";

export const usersUpdatePremioDto = pick(usersSchema, ["premios"]);
export type UsersUpdatePremioDto = Input<typeof usersUpdatePremioDto>;
