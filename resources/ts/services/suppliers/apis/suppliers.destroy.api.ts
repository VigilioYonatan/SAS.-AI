import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";

export function suppliersDestroyApi() {
	return useMutation<SuppliersDestroyAPI, number, SuppliersDestroyErrorAPI>(
		"/suppliers",
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

export interface SuppliersDestroyErrorAPI {
	success: boolean;
	message: string;
}
export interface SuppliersDestroyAPI {
	success: boolean;
	message: string;
}
