import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";

export function productsDestroyApi() {
	return useMutation<ProductsDestroyAPI, number, ProductsDestroyErrorAPI>(
		"/products",
		async (url, id: number) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}/${id}`, {
				method: "DELETE",
			});
			const result = await response.json();

			if (!result.success) throw result;
			return result;
		},
	);
}

export interface ProductsDestroyErrorAPI {
	success: boolean;
	message: string;
}
export interface ProductsDestroyAPI {
	success: boolean;
	message: string;
}
