import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";

export function notificationsCleanApi() {
	return useMutation<
		NotificationsCleanAPI,
		unknown,
		NotificationsCleanErrorAPI
	>("/notifications/clean", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: NotificationsCleanAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface NotificationsCleanAPI {
	success: boolean;
	message: string;
}

export interface NotificationsCleanErrorAPI {
	success: boolean;
	message: string;
}
