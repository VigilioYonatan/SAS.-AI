import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { UseTable } from "@vigilio/preact-table";
import type { CouponsIndexSecondaryPaginator } from "@/products/libs/CouponsColums";
import type { CouponsSchemaFromServer } from "@/products/schemas/coupons.schema";

export function couponsPaginatorApi(
	table: UseTable<
		CouponsSchemaFromServer,
		CouponsIndexSecondaryPaginator,
		{ refetch: (clean?: boolean) => void }
	>,
) {
	const result = useQuery<CouponsPaginatorAPI, CouponsPaginatorAPIError>(
		"/paginator/coupons",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(table.pagination.value.offset));
			data.append("limit", String(table.pagination.value.limit));
			data.append("search", String(table.search.value));
			if (!Object.keys(table.sort.value).length) {
				data.append("id", "DESC");
			}
			for (const [key, value] of Object.entries(table.sort.value)) {
				data.append(key, value as string);
			}
			const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			onSuccess(data) {
				table.updateData({
					count: data.count,
					result: data.results,
					methods: {
						refetch: result.refetch,
					},
				});
			},
		},
	);
	return result;
}
export interface CouponsPaginatorAPI {
	success: true;
	results: CouponsSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
export interface CouponsPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
