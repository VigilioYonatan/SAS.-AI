import { variantsSchema } from "@/products/schemas/options/variants.schema";
import { omit, type Input } from "@vigilio/valibot";

export const variantsUpdateDto = omit(variantsSchema, [
	"id",
	"product_normal_id",
	"empresa_id",
]);
export type VariantsUpdateDto = Input<typeof variantsUpdateDto>;
