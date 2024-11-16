import { omitAsync, type Input } from "@vigilio/valibot";
import { settingsSchema } from "../schemas/settings.schema";

export const settingsUpdateDto = omitAsync(settingsSchema, [
    "id",
    "empresa_id",
    "host",
]);
export type SettingsUpdateDto = Input<typeof settingsUpdateDto>;
