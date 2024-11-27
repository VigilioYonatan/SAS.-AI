import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export type NotificationsCountApiMethod = UseQuery<
	NotificationsCountAPI,
	unknown
>;

export function notificationsCountApi(): NotificationsCountApiMethod {
	return useQuery<NotificationsCountAPI, unknown>(
		"/notifications/count",
		async (url) => {
			const response = await fetch(`/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{ retry: 1, isCaching: 60 * 1000 },
	);
}

export interface NotificationsCountAPI {
	success: boolean;
	data: number;
}
