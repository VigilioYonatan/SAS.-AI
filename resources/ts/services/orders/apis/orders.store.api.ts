import type { OrdersStoreDto } from "../dtos/orders.store.dto";
import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { OrdersSchema } from "../schemas/orders.schema";
import { uploadApi } from "~/libs/upload";

const ordersUploadTransferencia = "/uploads/orders/transferencia_image";

export function ordersStoreApi() {
	return useMutation<OrdersStoreAPI, OrdersStoreDto, OrdersStoreErrorAPI>(
		"/orders",
		async (url, body) => {
			let transferencia_image = null;
			if (body.transferencia_image) {
				const files = await uploadApi(
					`${enviroments.VITE_URL}/api${ordersUploadTransferencia}`,
					{ file: body.transferencia_image },
				);
				transferencia_image = files.files;
			}
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
				body: JSON.stringify({ ...body, transferencia_image }),
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
			});
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface OrdersStoreAPI {
	success: boolean;
	order: OrdersSchema;
}

export interface OrdersStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
