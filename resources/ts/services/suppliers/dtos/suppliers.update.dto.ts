import { omit, pick, type Input } from "@vigilio/valibot";
import { suppliersSchema } from "../schemas/suppliers.schema";
import { suppliersStoreDto } from "./suppliers.store.dto";

export const suppliersUpdateDto = omit(suppliersSchema, [
	"id",
	"supplier_code",
	"logo",
	"razon_social",
	"ruc",
	"empresa_id",
]);
export const suppliersLogoUpdateDto = pick(suppliersStoreDto, ["logo"]);

export type SuppliersUpdateDto = Input<typeof suppliersUpdateDto>;
export type SuppliersLogoUpdateDto = Input<typeof suppliersLogoUpdateDto>;
