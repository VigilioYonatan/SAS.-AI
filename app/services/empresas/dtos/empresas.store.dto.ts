import {
	getOutput,
	getPipeIssues,
	mergeAsync,
	number,
	object,
	omitAsync,
	string,
	type Input,
} from "@vigilio/valibot";
import { empresasSchema } from "../schemas/empresas.schema";
import { Empresas } from "../entities/empresas.entity";

export const empresasStoreDto = mergeAsync([
	omitAsync(
		empresasSchema,
		[
			"id",
			"token",
			"certificado",
			"logo",
			"logo_pwa",
			"enabledSound",
			"enabledClientPayComision",
			"enabled_igv",
			"enabledSound",
			"isOpen",
			"enabledAnimation",
			"enabled_catalogo",
			"enable_sell_country",
			"header_cart",
		],
		[
			async (input) => {
				const [slug] = await Promise.all([
					Empresas.findOne({
						where: {
							slug: input.slug,
						},
					}),
				]);

				if (slug) {
					return getPipeIssues("slug", `ya existe ${input.slug}`, input);
				}
				return getOutput(input);
			},
		],
	),
	object({
		fullname: string(),
		password: string(),
		servicio_id: number(),
	}),
]);

export type EmpresasStoreDto = Input<typeof empresasStoreDto>;
