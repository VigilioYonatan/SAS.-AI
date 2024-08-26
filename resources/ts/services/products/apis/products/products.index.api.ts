import enviroments from "~/config";
import { useQuery } from "@vigilio/preact-fetching";
import { type ProductsSchemaFromServer } from "../../schemas/products.schema";

export function productsIndexApi() {
	return useQuery<ProductsIndexAPI, unknown>("/products", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface ProductsIndexAPI {
	success: boolean;
	data: ProductsSchemaFromServer[];
}
