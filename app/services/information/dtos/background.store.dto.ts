import { omitAsync, type Input } from "@vigilio/valibot";
import { backgroundSchema } from "../schemas/background.schema";

export const backgroundStoreDto = omitAsync(backgroundSchema, [
	"id",
	"information_id",
]);
export type BackgroundStoreDto = Input<typeof backgroundStoreDto>;
