import { type UseMutation, useMutation } from "@vigilio/preact-fetching";

export type SubcategoriesDestroyMutation = UseMutation<
	SubcategoriesDestroyAPI,
	number,
	SubcategoriesDestroyErrorAPI
>;
export function subcategoriesDestroyApi(): SubcategoriesDestroyMutation {
	return useMutation("/subcategories", async (url, id: number) => {
		const response = await fetch(`/api${url}/${id}`, {
			method: "DELETE",
		});
		const result = await response.json();

		if (!result.success) throw result;
		return result;
	});
}

export interface SubcategoriesDestroyErrorAPI {
	success: boolean;
	message: string;
}
export interface SubcategoriesDestroyAPI {
	success: boolean;
	message: string;
}
