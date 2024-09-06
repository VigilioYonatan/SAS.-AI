import { type Input, omit } from "@vigilio/valibot";
import { couponsSchema } from "../schemas/coupons.schema";

export const couponsUpdateDto = omit(couponsSchema, ["id", "empresa_id"]);

export type CouponsUpdateDto = Input<typeof couponsUpdateDto>;
