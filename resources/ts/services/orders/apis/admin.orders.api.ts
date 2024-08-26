import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function adminOrdersApi() {
	return useQuery<AdminOrdersAPI, unknown>("/admin/orders", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

interface AdminOrdersAPI {
	success: true;
	count: {
		orders: number;
		confirmado: number;
		pagados: number;
		problema: number;
	};
}
