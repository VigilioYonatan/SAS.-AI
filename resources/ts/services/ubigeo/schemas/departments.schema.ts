import {
	type Input,
	object,
	string,
	number,
	boolean,
	minValue,
} from "@vigilio/valibot";

// https://github.com/ernestorivero/Ubigeo-Peru/
export const departmentsSchema = object({
	ubigeo: string(),
	name: string(),
	enabled: boolean(),
	priceShipping: number([minValue(0)]),
	days: number(),
});

export type DepartmentsSchema = Input<typeof departmentsSchema>;
export type DepartmentsSchemaFromServer = DepartmentsSchema;
