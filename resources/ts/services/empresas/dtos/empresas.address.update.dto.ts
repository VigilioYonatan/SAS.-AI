import { omitAsync, type Input } from "@vigilio/valibot";
import { addressSchema } from "../schemas/address.schema";

export const EmpresaAddressUpdateDto = omitAsync(addressSchema, [
    "id",
    "empresa_id",
]);
export type EmpresaAddressUpdateDto = Input<typeof EmpresaAddressUpdateDto>;
