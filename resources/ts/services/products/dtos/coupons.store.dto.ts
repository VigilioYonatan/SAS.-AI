import { type Input, omit } from "@vigilio/valibot";
import { couponsSchema } from "../schemas/coupons.schema";

export const couponsStoreDto = omit(couponsSchema, ["id"]);

export type CouponsStoreDto = Input<typeof couponsStoreDto>;
