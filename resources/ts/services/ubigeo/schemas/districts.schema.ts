import { type Input, object, string } from "@vigilio/valibot";
import type { ProvincesSchemaFromServer } from "./provinces.schema";

export const districtsSchema = object({
	ubigeo: string(),
	name: string(),
	province_id: string(),
	department_id: string(),
});

export type DistrictsSchema = Input<typeof districtsSchema>;
export type DistrictsSchemaFromServer = DistrictsSchema & {
	province: ProvincesSchemaFromServer;
};
