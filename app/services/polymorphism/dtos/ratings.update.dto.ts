import { pickAsync, type Input } from "@vigilio/valibot";
import { ratingsSchema } from "../schemas/ratings.schema";

export const ratingsUpdateDto = pickAsync(ratingsSchema, ["rating"]);
export type RatingsUpdateDto = Input<typeof ratingsUpdateDto>;
