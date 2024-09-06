import { omitAsync, type Input } from "@vigilio/valibot";
import { addressSchema } from "../schemas/address.schema";

export const informationAddressUpdateDto = omitAsync(addressSchema, [
	"id",
	"information_id",
]);
export type InformationAddressUpdateDto = Input<
	typeof informationAddressUpdateDto
>;
