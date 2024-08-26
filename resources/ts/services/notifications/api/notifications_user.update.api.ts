import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";

export function notificationsUpdateApi() {
	return useMutation<
		NotificationsUpdateAPI,
		{ notification_id: number; isRead: boolean },
		NotificationsUpdateErrorAPI
	>("/notifications", async (url, body) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			method: "PUT",
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
			},
		});
		const result: NotificationsUpdateAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface NotificationsUpdateAPI {
	success: boolean;
	message: string;
}

export interface NotificationsUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
