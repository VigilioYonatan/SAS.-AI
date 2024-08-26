import enviroments from "~/config";

export async function notificationsRegisterApi(
	subscription: PushSubscription | undefined,
) {
	const response = await fetch(
		`${enviroments.VITE_URL}/api/notifications/subscribe`,
		{
			method: "POST",
			body: JSON.stringify(subscription),
			headers: {
				"content-type": "application/json",
			},
		},
	);
	const result: NotificationsRegisterAPI = await response.json();
	if (!result.success) throw result;
	return result;
}

export interface NotificationsRegisterAPI {
	success: boolean;
	id: number;
}

export interface NotificationsRegisterErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
