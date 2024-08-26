import { pick, type Input } from "@vigilio/valibot";
import { departmentsSchema } from "../schemas/departments.schema";
export const departmentsUpdateDto = pick(departmentsSchema, [
	"priceShipping",
	"enabled",
]);
export type DepartmentsUpdateDto = Input<typeof departmentsUpdateDto>;
