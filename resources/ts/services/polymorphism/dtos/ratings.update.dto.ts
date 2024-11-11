import { pick, type Input } from "@vigilio/valibot";
import { ratingsSchema } from "../schemas/ratings.schema";

export const ratingsUpdateDto = pick(ratingsSchema, ["rating"]);
export type RatingsUpdateDto = Input<typeof ratingsUpdateDto>;
