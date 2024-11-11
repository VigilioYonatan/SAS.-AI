import { pickAsync, type Input } from "@vigilio/valibot";
import { ratingsSchema } from "../schemas/ratings.schema";

export const ratingsStoreDto = pickAsync(ratingsSchema, ["rating"]);
export type RatingsStoreDto = Input<typeof ratingsStoreDto>;
