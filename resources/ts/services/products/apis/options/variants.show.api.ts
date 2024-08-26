import enviroments from "~/config";
import { useQuery } from "@vigilio/preact-fetching";
import type { VariantSchemaFromServer } from "@/products/schemas/options/variants.schema";

export function variantsShowApi(product_id: number, variant_id: number) {
	return useQuery<VariantsOptionValuesAPI, VariantsOptionValuesErrorAPI>(
		`/products/${product_id}/variants/${variant_id}`,
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result: VariantsOptionValuesAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface VariantsOptionValuesAPI {
	success: boolean;
	variant: VariantSchemaFromServer;
}
export interface VariantsOptionValuesErrorAPI {
	success: boolean;
	message: string;
}
