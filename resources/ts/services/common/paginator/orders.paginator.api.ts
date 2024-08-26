import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { UseTable } from "@vigilio/preact-table";
import type { OrdersSchemaFromServer } from "@/orders/schemas/orders.schema";
import type { TimeTable } from "~/hooks/usePaginatorTimer";

export function ordersPaginatorApi(
	table: UseTable<OrdersSchemaFromServer, "actions">,
	time: TimeTable,
) {
	const result = useQuery<
		OrdersLocalsPaginatorAPI,
		OrdersLocalsPaginatorAPIError
	>(
		"/paginator/orders",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(table.pagination.value.offset));
			data.append("limit", String(table.pagination.value.limit));
			data.append("search", String(table.search.value));
			data.append("time", time);
			if (!Object.keys(table.sort.value).length) {
				data.append("id", "DESC");
			}
			for (const [key, value] of Object.entries(table.sort.value)) {
				data.append(key, value as string);
			}
			const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			onSuccess(data) {
				table.updateData({
					count: data.count,
					methods: { refetch: result.refetch },
					result: data.results,
				});
			},
			refetchOnReconnect: true,
			clean: false,
		},
	);
	return result;
}
export function ordersLocalsPaginatorApi(
	table: UseTable<OrdersSchemaFromServer, "actions">,
	time: TimeTable,
) {
	const result = useQuery<
		OrdersLocalsPaginatorAPI,
		OrdersLocalsPaginatorAPIError
	>(
		"/paginator/orders-local",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(table.pagination.value.offset));
			data.append("limit", String(table.pagination.value.limit));
			data.append("search", String(table.search.value));
			data.append("time", time);
			if (!Object.keys(table.sort.value).length) {
				data.append("id", "DESC");
			}
			for (const [key, value] of Object.entries(table.sort.value)) {
				data.append(key, value as string);
			}
			const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			onSuccess(data) {
				table.updateData({
					methods: { refetch: result.refetch },
					count: data.count,
					result: data.results,
				});
			},
			refetchOnReconnect: true,
			clean: false,
		},
	);
	return result;
}
export function ordersDeliveryPaginatorApi(
	table: UseTable<OrdersSchemaFromServer, "actions">,
	time: TimeTable,
) {
	const result = useQuery<
		OrdersLocalsPaginatorAPI,
		OrdersLocalsPaginatorAPIError
	>(
		"/paginator/orders-delivery",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(table.pagination.value.offset));
			data.append("limit", String(table.pagination.value.limit));
			data.append("search", String(table.search.value));
			data.append("time", time);
			if (!Object.keys(table.sort.value).length) {
				data.append("id", "DESC");
			}
			for (const [key, value] of Object.entries(table.sort.value)) {
				data.append(key, value as string);
			}
			const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			onSuccess(data) {
				table.updateData({
					count: data.count,
					result: data.results,
					methods: { refetch: result.refetch },
				});
			},
			refetchOnReconnect: true,
			clean: false,
		},
	);
	return result;
}
export function ordersUserPaginatorApi(
	table: UseTable<OrdersSchemaFromServer, "actions">,
	time: TimeTable,
) {
	const result = useQuery<
		OrdersLocalsPaginatorAPI,
		OrdersLocalsPaginatorAPIError
	>(
		"/paginator/orders_user",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(table.pagination.value.offset));
			data.append("limit", String(table.pagination.value.limit));
			data.append("search", String(table.search.value));
			data.append("time", time);
			if (!Object.keys(table.sort.value).length) {
				data.append("id", "DESC");
			}
			for (const [key, value] of Object.entries(table.sort.value)) {
				data.append(key, value as string);
			}

			const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			onSuccess(data) {
				table.updateData({
					count: data.count,
					result: data.results,
				});
			},
			refetchOnReconnect: true,
			clean: false,
		},
	);
	return result;
}
interface OrdersLocalsPaginatorAPI {
	success: true;
	results: OrdersSchemaFromServer[];
	count: number;
	next: string | null;
	previous: string | null;
}
interface OrdersLocalsPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
