import { omit, type Input } from "@vigilio/valibot";
import { cartSchema } from "../schemas";

export const cartStoreDto = omit(cartSchema, ["user_id"]);
export type CartStoreDto = Input<typeof cartStoreDto>;
