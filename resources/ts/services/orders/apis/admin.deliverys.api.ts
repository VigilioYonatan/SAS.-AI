import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function adminDeliverysApi() {
	return useQuery<AdminDeliverysAPI, unknown>(
		"/admin/deliverys",
		async (url) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}
interface AdminDeliverysAPI {
	success: true;
	count: {
		deliverys: number;
		confirmado: number;
		pagados: number;
		problema: number;
	};
}
