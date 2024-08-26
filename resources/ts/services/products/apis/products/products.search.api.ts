import type {
	ProductsPaginatorAPI,
	ProductsPaginatorAPIError,
} from "@/common/paginator/products.paginator.api";
import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function productsSearchApi(search: string) {
	return useQuery<ProductsPaginatorAPI, ProductsPaginatorAPIError>(
		"/paginator/products",
		async (url) => {
			const data = new URLSearchParams();
			data.append("limit", String("8"));
			data.append("search", String(search));
			const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			skipFetching: true,
		},
	);
}
