import { type Input, omit } from "@vigilio/valibot";
import { couponsSchema } from "../schemas/coupons.schema";

export const couponsUpdateDto = omit(couponsSchema, ["id"]);

export type CouponsUpdateDto = Input<typeof couponsUpdateDto>;
