import { UsersSchema } from "@/users/schemas/users.schema";
import { useQuery, type UseQuery } from "@vigilio/preact-fetching";
import type { FilesSchema } from "~/libs/upload";

export function ordersEarningsDateApi(
	year: number,
	month: number,
): UseQuery<OrdersEarningsDateApi, { success: false; message: string }> {
	return useQuery(`/orders/earning/${year}/${month}`, async (url) => {
		const response = await fetch(`/api${url}`);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface OrdersEarningsDateApi {
	success: true;
	results: {
		orders: {
			ganancias: number;
			ordersTotal: number;
			ordersTotalPay: number;
			ordersTotalError: number;
			orderDelivery: number;
			orderLocal: number;
			mostUser: {
				user_id: number;
				order_count: string;
			}[];
		};
		topThreeProductIds: {
			id: number;
			name: string;
			image: FilesSchema[];
		}[];
		ratingArray: {
			value: number;
			time: string;
		}[];
		usersMostOrders: {
			cantidad: number;
			user: Pick<UsersSchema, "id" | "photo" | "username" | "slug">;
		}[];
	};
}
