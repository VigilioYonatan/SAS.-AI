import { useMutation } from "@vigilio/preact-fetching";
import type { UsersUpdateDto } from "../dtos/users.update.dto";
import type { UsersSchemaFromServer } from "../schemas/users.schema";

export function usersUpdateApi(slug: string | number) {
	return useMutation<
		{ success: true; user: UsersSchemaFromServer },
		UsersUpdateDto,
		UsersUpdateErrorAPI
	>(`/users/${slug}`, async (url, body: UsersUpdateDto) => {
		const response = await fetch(`/api${url}`, {
			method: "PUT",
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
			},
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface UsersUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
