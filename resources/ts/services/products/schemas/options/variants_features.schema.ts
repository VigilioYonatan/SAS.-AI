import { type Input, number, object } from "@vigilio/valibot";

export const variantsfeaturesSchema = object({
	variant_id: number(),
	feature_id: number(),
	empresa_id: number(),
});
export type VariantsfeaturesSchema = Input<typeof variantsfeaturesSchema>;
