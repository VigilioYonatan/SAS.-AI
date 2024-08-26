import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";
import type { UsersPasswordDto } from "../dtos/users.password.dto";

export function usersPasswordApi() {
	return useMutation<
		{ success: true; message: string },
		UsersPasswordDto,
		UsersPasswordErrorAPI
	>("/users/change-password", async (url, body: UsersPasswordDto) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			method: "POST",
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

export interface UsersPasswordErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
