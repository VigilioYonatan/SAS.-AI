import { type Input, object, string } from "@vigilio/valibot";
import type { DepartmentsSchemaFromServer } from "./departments.schema";

export const provincesSchema = object({
	ubigeo: string(),
	name: string(),
	department_id: string(),
});

export type ProvincesSchema = Input<typeof provincesSchema>;
export type ProvincesSchemaFromServer = ProvincesSchema & {
	department: DepartmentsSchemaFromServer;
};
