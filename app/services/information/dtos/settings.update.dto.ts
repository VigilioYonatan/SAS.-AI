import { omitAsync, type Input } from "@vigilio/valibot";
import { settingsSchema } from "../schemas/settings.schema";

export const settingsUpdateDto = omitAsync(settingsSchema, [
	"id",
	"information_id",
	"icon",
	"photo",
]);
export type SettingsUpdateDto = Input<typeof settingsUpdateDto>;
