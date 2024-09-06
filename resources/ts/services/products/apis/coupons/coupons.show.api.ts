import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import { CouponsSchemaFromServer } from "@/products/schemas/coupons.schema";

export function couponsShowApi(
	code: number | string,
): UseQuery<CouponsShowAPI, CouponsShowErrorAPI> {
	return useQuery<CouponsShowAPI, CouponsShowErrorAPI>(
		`/coupons/${code}`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface CouponsShowAPI {
	success: boolean;
	coupon: CouponsSchemaFromServer;
}

export interface CouponsShowErrorAPI {
	success: boolean;
	message: string;
}
