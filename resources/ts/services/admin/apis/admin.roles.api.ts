import { useQuery } from "@vigilio/preact-fetching";

export function adminRolesApi() {
	return useQuery<AdminRolesAPI, unknown>("/admin/roles", async (url) => {
		const response = await fetch(`/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface AdminRolesAPI {
	success: boolean;
	results: {
		id: number;
		name: string;
		icon: string;
		total: number;
	}[];
}
