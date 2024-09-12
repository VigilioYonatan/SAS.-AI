import { omitAsync, type Input } from "@vigilio/valibot";
import { backgroundSchema } from "../schemas/background.schema";

export const backgroundUpdateDto = omitAsync(backgroundSchema, [
	"id",
	"image",
	"empresa_id",
]);
export type BackgroundUpdateDto = Input<typeof backgroundUpdateDto>;
