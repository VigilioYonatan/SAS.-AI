import enviroments from "~/config";
import { useQuery } from "@vigilio/preact-fetching";
import type { UsersSchemaFromServer } from "../schemas/users.schema";

export function usersIndexApi() {
	return useQuery("/users", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: UsersIndexAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface UsersIndexAPI {
	success: boolean;
	data: UsersSchemaFromServer[];
}
