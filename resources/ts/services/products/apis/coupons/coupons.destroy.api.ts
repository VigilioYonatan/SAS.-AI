import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";

export function couponsDestroyApi() {
	return useMutation<CouponsDestroyAPI, number, CouponsDestroyErrorAPI>(
		"/coupons",
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

export interface CouponsDestroyErrorAPI {
	success: boolean;
	message: string;
}
export interface CouponsDestroyAPI {
	success: boolean;
	message: string;
}
