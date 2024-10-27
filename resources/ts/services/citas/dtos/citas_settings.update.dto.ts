import { omitAsync, type Input } from "@vigilio/valibot";
import { citasSettingSchema } from "../schemas/citas_settings.schema";

export const citasSettingsUpdateDto = omitAsync(citasSettingSchema, ["id", "empresa_id"]);
export type CitasSettingsUpdateDto = Input<typeof citasSettingsUpdateDto>;
