import { useMutation } from "@vigilio/preact-fetching";
import { type CouponsUpdateDto } from "../../dtos/coupons.update.dto";
import { type CouponsSchemaFromServer } from "../../schemas/coupons.schema";

export function couponsUpdateApi(id: number) {
    return useMutation<
        CouponsUpdateAPI,
        CouponsUpdateDto,
        CouponsUpdateErrorAPI
    >(`/coupons/${id}`, async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
                "content-type": "application/json",
            },
        });
        const result = await response.json();
        if (!result.success) throw result;
        return result;
    });
}

export interface CouponsUpdateAPI {
    success: boolean;
    coupon: CouponsSchemaFromServer;
}
export interface CouponsUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
