import { omitAsync, type Input } from "@vigilio/valibot";
import { suppliersSchema } from "../schemas/suppliers.schema";

export const suppliersUpdateDto = omitAsync(suppliersSchema, [
	"id",
	"supplier_code",
	"logo",
	"razon_social",
	"ruc",
	"information_id",
]);
export type SuppliersUpdateDto = Input<typeof suppliersUpdateDto>;
