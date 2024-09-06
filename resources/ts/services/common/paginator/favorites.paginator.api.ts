import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { useQuery } from "@vigilio/preact-fetching";
import type { UsePaginator } from "@vigilio/preact-paginator";

export function favoritesPaginatorApi(paginator: UsePaginator) {
	const result = useQuery<FavoritesPaginatorAPI, FavoritesPaginatorAPIError>(
		"/paginator/favorites",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(paginator.pagination.value.offset));
			data.append("limit", String(paginator.pagination.value.limit));
			const response = await fetch(`/api${url}?${data}`);
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
	results:
		| ProductsNormalSchemaFromServer[]
		| ProductsRestaurantSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
export interface FavoritesPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
