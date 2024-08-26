import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function adminFacturationSystemApi() {
	return useQuery<AdminFacturationSystemAPI, unknown>(
		"/admin/facturation_system",
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface AdminFacturationSystemAPI {
	success: boolean;
	count: {
		facturas: number;
		boletas: number;
		notaCredito: number;
		notaDebito: number;
	};
}
