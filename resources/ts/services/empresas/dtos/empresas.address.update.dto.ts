import { omit, type Input } from "@vigilio/valibot";
import { addressSchema } from "../schemas/address.schema";

export const empresaAddressUpdateDto = omit(addressSchema, [
	"id",
	"empresa_id",
]);
export type EmpresaAddressUpdateDto = Input<typeof empresaAddressUpdateDto>;
