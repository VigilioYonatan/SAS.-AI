import { omitAsync, type Input } from "@vigilio/valibot";
import { addressSchema } from "../schemas/address.schema";

export const empresasAddressUpdateDto = omitAsync(addressSchema, [
	"id",
	"empresa_id",
]);
export type EmpresasAddressUpdateDto = Input<typeof empresasAddressUpdateDto>;
