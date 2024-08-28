import { pickAsync, type Input } from "@vigilio/valibot";
import { regionsSchema } from "../schemas/regions.schema";
export const departmentsUpdateDto = pickAsync(regionsSchema, ["priceShipping"]);
export type DepartmentsUpdateDto = Input<typeof departmentsUpdateDto>;
