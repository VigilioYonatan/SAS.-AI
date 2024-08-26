import { omitAsync, type Input } from "@vigilio/valibot";
import { backgroundSchema } from "../schemas/background.schema";

export const backgroundUpdateDto = omitAsync(backgroundSchema, ["id", "image"]);
export type BackgroundUpdateDto = Input<typeof backgroundUpdateDto>;
