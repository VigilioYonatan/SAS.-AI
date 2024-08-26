import { type UseMutation, useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { CartUpdateDto } from "../dtos/cart.update.dto";

export function cartUpdateApi(): UseMutation<
	CartUpdateAPI,
	CartUpdateDto & { product_id: number },
	CartUpdateErrorAPI
> {
	return useMutation("/cart", async (url, body) => {
		const response = await fetch(
			`${enviroments.VITE_URL}/api${url}/${body.product_id}/variants/${body.variant_id}`,
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
