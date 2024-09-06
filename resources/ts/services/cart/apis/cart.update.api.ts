import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import type { CartUpdateDto } from "../dtos/cart.update.dto";

export function cartUpdateApi(): UseMutation<
	CartUpdateAPI,
	CartUpdateDto,
	CartUpdateErrorAPI
> {
	return useMutation("/cart", async (url, body) => {
		const query = new URLSearchParams();
		if (body.variant_id) {
			query.append("variant_id", String(body.variant_id));
		}
		const response = await fetch(
			`/api${url}/${
				body.product_normal_id ??
				body.product_restaurant_id ??
				body.product_servicio_id
			}?${query}`,
			{
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-type": "application/json",
				},
			},
		);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
export interface CartUpdateErrorAPI {
	body: keyof CartUpdateDto;
	message: string;
	success: false;
}

export interface CartUpdateAPI {
	success: boolean;
	category: CartUpdateDto;
}
