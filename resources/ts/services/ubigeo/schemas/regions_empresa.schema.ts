import { boolean, number, object, type Input } from "@vigilio/valibot";

export const regionsEmpresaSchema = object({
	region_id: number(),
	information_id: number(),
	priceShipping: number(),
	enabled: boolean(),
	days: number(),
});
export type RegionsEmpresaSchema = Input<typeof regionsEmpresaSchema>;
