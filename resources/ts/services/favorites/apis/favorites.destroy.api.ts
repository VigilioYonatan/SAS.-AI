import { useMutation } from "@vigilio/preact-fetching";

export function favoritesDestroyApi(product_id: number) {
	return useMutation<FavoritesDestroyAPI, unknown, FavoritesDestroyErrorAPI>(
		`/favorites/${product_id}`,
		async (url) => {
			const response = await fetch(`/api${url}`, {
				method: "DELETE",
			});
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface FavoritesDestroyAPI {
	success: boolean;
	message: string;
}

export interface FavoritesDestroyErrorAPI {
	success: boolean;
	message: string;
}
