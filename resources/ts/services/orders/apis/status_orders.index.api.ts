import { type UseQuery, useQuery } from "@vigilio/preact-fetching";
import type { StatusOrdersSchemaFromServer } from "../schemas/status_orders.schema";

export type StatusOrdersIndexApiMethod = UseQuery<
    StatusOrdersIndexAPI,
    unknown
>;

export function statusOrdersIndexApi(): StatusOrdersIndexApiMethod {
    return useQuery<StatusOrdersIndexAPI, unknown>(
        "/status_orders",
        async (url) => {
            const response = await fetch(`/api${url}`);
            const result = await response.json();
            if (!result.success) throw result;

            return result;
        }
    );
}

export interface StatusOrdersIndexAPI {
    success: boolean;
    data: StatusOrdersSchemaFromServer[];
}
