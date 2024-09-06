import {
	type Input,
	number,
	string,
	minLength,
	toTrimmed,
	maxLength,
	nullable,
	minValue,
	array,
	boolean,
	object,
} from "@vigilio/valibot";

export const variantsSchema = object({
	id: number(),
	sku: nullable(string([toTrimmed(), minLength(3), maxLength(45)])),
	stock: nullable(number([minValue(0, "Minimo 0 cantidades.")])),
	ilimit: boolean(),
	images: array(number()),
	product_normal_id: nullable(number()),
	information_id: number(),
});
export type VariantsSchema = Input<typeof variantsSchema>;
export type VariantSchemaFromServer = VariantsSchema & {
	totalSold: number;
	features: { option_id: number; feature_id: number }[];
};
