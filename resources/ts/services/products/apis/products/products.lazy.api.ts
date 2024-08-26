import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { ProductsSchemaFromServer } from "@/products/schemas/products.schema";
import type { UsePaginator } from "@vigilio/preact-paginator";

export function productsLazyApi(paginator: UsePaginator) {
	const result = useQuery<ProductsLazyAPI, ProductsLazyAPIError>(
		"/paginator/products",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(paginator.pagination.value.offset));
			data.append("limit", String(paginator.pagination.value.limit));
			data.append("search", String(paginator.search.value));

			const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
	return result;
}
export interface ProductsLazyAPI {
	success: true;
	results: ProductsSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
export interface ProductsLazyAPIError {
	success: false;
	message: string;
	params: string;
}
