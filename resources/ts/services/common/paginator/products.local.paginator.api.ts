import { useQuery } from "@vigilio/preact-fetching";
import type { Signal } from "@preact/signals";
import type { UsePaginator } from "@vigilio/preact-paginator";
import type { FiltersKey } from "@/admin/views/Local";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";

export function productsLocalsPaginatorApi(
	paginator: UsePaginator,
	props: Signal<Record<FiltersKey, string | null>>,
	query: [string, string][] | null = null,
) {
	const result = useQuery<
		ProductsLocalsPaginatorAPI,
		ProductsLocalsPaginatorAPIError
	>(
		"/paginator/products",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(paginator.pagination.value.offset));
			data.append("limit", String(paginator.pagination.value.limit));
			data.append("search", String(paginator.search.value));

			if (props.value.category) {
				data.append("categoria", props.value.category);
			}

			if (props.value.min) {
				data.append("min", props.value.min);
			}
			if (props.value.brand) {
				data.append("brand", props.value.brand);
			}
			if (props.value.optionFeature) {
				data.append("optionFeature", props.value.optionFeature);
			}
			if (props.value.estado) {
				data.append("estado", props.value.estado);
			}
			if (props.value.discount) {
				data.append("discount", props.value.discount);
			}
			if (query) {
				for (const [key, value] of query) {
					data.append(key, value);
				}
			}

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
export interface ProductsLocalsPaginatorAPI {
	success: true;
	results:
		| ProductsNormalSchemaFromServer[]
		| ProductsRestaurantSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
export interface ProductsLocalsPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
