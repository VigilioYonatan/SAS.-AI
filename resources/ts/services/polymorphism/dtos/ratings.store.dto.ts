import { pick, type Input } from "@vigilio/valibot";
import { ratingsSchema } from "../schemas/ratings.schema";

export const ratingsStoreDto = pick(ratingsSchema, ["rating"]);
export type RatingsStoreDto = Input<typeof ratingsStoreDto>;
