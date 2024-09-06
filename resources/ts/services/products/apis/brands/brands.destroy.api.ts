import { type UseMutation, useMutation } from "@vigilio/preact-fetching";

export type BrandsDestroyMutation = UseMutation<
	BrandsDestroyAPI,
	number,
	BrandsDestroyErrorAPI
>;
export function brandsDestroyApi(): BrandsDestroyMutation {
	return useMutation("/brands", async (url, id: number) => {
		const response = await fetch(`/api${url}/${id}`, {
			method: "DELETE",
		});
		const result = await response.json();

		if (!result.success) throw result;
		return result;
	});
}

export interface BrandsDestroyErrorAPI {
	success: boolean;
	message: string;
}
export interface BrandsDestroyAPI {
	success: boolean;
	message: string;
}
