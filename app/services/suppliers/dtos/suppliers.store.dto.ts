import {
	getOutput,
	getPipeIssues,
	omitAsync,
	type Input,
} from "@vigilio/valibot";
import {
	suppliersSchema,
	type SuppliersSchema,
} from "../schemas/suppliers.schema";
import { Suppliers } from "../entities/suppliers.entity";

export const suppliersStoreDto = omitAsync(
	suppliersSchema,
	["id", "supplier_code"],
	[
		async (input) => {
			const [byRuc, byRazonSocial] = await Promise.all([
				Suppliers.findOne({
					where: {
						ruc: input.ruc,
					},
					raw: true,
				}),
				Suppliers.findOne({
					where: {
						razon_social: input.razon_social,
					},
					raw: true,
				}),
			]);

			if (byRuc) {
				return getPipeIssues(
					"ruc" as keyof SuppliersSchema,
					`Ya existe un proveedor con el ruc: ${input.ruc}`,
					input,
				);
			}
			if (byRazonSocial) {
				return getPipeIssues(
					"razon_social" as keyof SuppliersSchema,
					`Ya existe un proveedor con razon social: ${input.razon_social}`,
					input,
				);
			}

			return getOutput(input);
		},
	],
);
export type SuppliersStoreDto = Input<typeof suppliersStoreDto>;
