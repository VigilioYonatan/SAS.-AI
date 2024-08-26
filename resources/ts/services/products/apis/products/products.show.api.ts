import enviroments from "~/config";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { type ProductsSchemaFromServer } from "../../schemas/products.schema";

export function productsShowApi(
	slug: number | string,
): UseQuery<ProductsShowAPI, ProductsShowErrorAPI> {
	return useQuery<ProductsShowAPI, ProductsShowErrorAPI>(
		`/products/${slug}`,
		productShowFetch,
	);
}
export async function productShowFetch(url: string) {
	const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
	const result: ProductsShowAPI = await response.json();
	if (!result.success) throw result;
	return result;
}

export interface ProductsShowAPI {
	success: boolean;
	product: ProductsSchemaFromServer;
}

export interface ProductsShowErrorAPI {
	success: boolean;
	message: string;
}
