import type { NotificationsSchemaFromServer } from "@/notifications/schemas/notifications.schema";
import { useQuery, type UseQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export type NotificationsPaginatorApi = UseQuery<
	NotificationsPaginatorAPI,
	NotificationsPaginatorAPIError
>;
export function notificationsPaginatorApi(props: {
	limit: number;
	offset: number;
}) {
	const result = useQuery<
		NotificationsPaginatorAPI,
		NotificationsPaginatorAPIError
	>("/paginator/notifications", async (url) => {
		const data = new URLSearchParams();
		data.append("offset", String(props.offset));
		data.append("limit", String(props.limit));
		const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
	return result;
}
interface NotificationsPaginatorAPI {
	success: true;
	results: NotificationsSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
interface NotificationsPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
