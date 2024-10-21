import { useMutation } from "@vigilio/preact-fetching";
import type { OrdersStoreDto } from "@/orders/dtos/orders.store.dto";

export function izipayPaymentApi() {
    return useMutation<IzipayAPI, OrdersStoreDto, IzipayErrorAPI>(
        "/izipay/order",
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                body: JSON.stringify(body),
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface IzipayAPI {
    success: boolean;
    token: string;
}

export interface IzipayErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
import type { OrdersSchema } from "@/orders/schemas/orders.schema";

export function stripeOrderApi() {
    return useMutation<StripeAPI, OrdersStoreDto, IzipayErrorAPI>(
        "/stripe/order",
        async (url, body) => {
            const response = await fetch(`/api${url}`, {
                body: JSON.stringify(body),
                method: "POST",
                headers: {
                    "content-type": "application/json",
                },
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface StripeAPI {
    success: boolean;
    order: OrdersSchema;
    url: string;
}

export interface StripeErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
