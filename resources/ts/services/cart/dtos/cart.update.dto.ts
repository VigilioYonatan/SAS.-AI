import { omit, type Input } from "@vigilio/valibot";
import { cartSchema } from "../schemas";

export const cartUpdateDto = omit(cartSchema, ["user_id"]);
export type CartUpdateDto = Input<typeof cartUpdateDto>;
