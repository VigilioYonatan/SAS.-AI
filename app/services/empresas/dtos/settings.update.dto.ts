import { omitAsync, type Input } from "@vigilio/valibot";
import { settingsSchema } from "../schemas/settings.schema";

export const settingsUpdateDto = omitAsync(settingsSchema, [
	"id",
	"empresa_id",
	"host",
	"background_auth",
]);
export type SettingsUpdateDto = Input<typeof settingsUpdateDto>;
