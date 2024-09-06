import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { useQuery } from "@vigilio/preact-fetching";

export function productsIndexApi() {
	return useQuery<ProductsIndexAPI, unknown>("/products", async (url) => {
		const response = await fetch(`/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface ProductsIndexAPI {
	success: boolean;
	data: ProductsNormalSchemaFromServer[] | ProductsRestaurantSchemaFromServer[];
}
