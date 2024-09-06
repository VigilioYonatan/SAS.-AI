import {
	type UseQuery,
	useQuery,
	type OptionsQuery,
} from "@vigilio/preact-fetching";
import type { UsersSchemaFromServer } from "../schemas/users.schema";

export function usersShowApi(
	id: number | string,
	option?: OptionsQuery<UsersShowAPI, UsersShowErrorAPI>,
): UseQuery<UsersShowAPI, UsersShowErrorAPI> {
	return useQuery(
		`/users/${id}`,
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result: UsersShowAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
		option,
	);
}

export interface UsersShowAPI {
	success: boolean;
	user: UsersSchemaFromServer;
}

export interface UsersShowErrorAPI {
	success: boolean;
	message: string;
}
