import enviroments from "~/config";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";

export function productCouponApi(): UseMutation<
	ProductCouponAPI,
	{ product_id: number; coupon: string },
	ProductCouponErrorAPI
> {
	return useMutation("/products", async (url, body) => {
		const response = await fetch(
			`${enviroments.VITE_URL}/api${url}/${body.product_id}/coupon/${body.coupon}`,
		);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface ProductCouponAPI {
	success: boolean;
	discount: number;
}

export interface ProductCouponErrorAPI {
	success: boolean;
	message: string;
}
