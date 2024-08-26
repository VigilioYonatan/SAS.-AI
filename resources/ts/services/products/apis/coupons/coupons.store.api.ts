import { useMutation } from "@vigilio/preact-fetching";
import { type CouponsSchemaFromServer } from "../../schemas/coupons.schema";
import type { CouponsStoreDto } from "../../dtos/coupons.store.dto";
import enviroments from "~/config";

export function couponsStoreApi() {
	return useMutation<CouponsStoreAPI, CouponsStoreDto, CouponsStoreErrorAPI>(
		"/coupons",
		async (url, body) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
				body: JSON.stringify(body),
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
			});
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface CouponsStoreAPI {
	success: boolean;
	coupon: CouponsSchemaFromServer;
}

export interface CouponsStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
