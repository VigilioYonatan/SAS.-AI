import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { UsePaginator } from "@vigilio/preact-paginator";
import type { ProductsSchemaFromServer } from "@/products/schemas/products.schema";

export function favoritesPaginatorApi(paginator: UsePaginator) {
	const result = useQuery<FavoritesPaginatorAPI, FavoritesPaginatorAPIError>(
		"/paginator/favorites",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(paginator.pagination.value.offset));
			data.append("limit", String(paginator.pagination.value.limit));
			const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			onSuccess(data) {
				paginator.updateData({
					total: data.count,
				});
			},
		},
	);
	return result;
}
export interface FavoritesPaginatorAPI {
	success: true;
	results: ProductsSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
export interface FavoritesPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
