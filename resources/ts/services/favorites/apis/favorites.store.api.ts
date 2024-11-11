import { useMutation } from "@vigilio/preact-fetching";

export function favoritesStoreApi(product_id: number, type: boolean) {
	return useMutation<FavoritesStoreAPI, unknown, FavoritesStoreErrorAPI>(
		`/favorites/${product_id}${type ? "?type=service" : ""}`,
		async (url) => {
			const response = await fetch(`/api${url}`, {
				method: "POST",
			});
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface FavoritesStoreAPI {
	success: boolean;
	message: string;
}

export interface FavoritesStoreErrorAPI {
	success: boolean;
	message: string;
}
