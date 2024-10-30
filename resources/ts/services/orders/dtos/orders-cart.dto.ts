import {
    custom,
    maxLength,
    merge,
    minLength,
    object,
    string,
    type Input,
} from "@vigilio/valibot";
import { ordersStoreDto } from "./orders.store.dto";

export const ordersCartStoreDto = merge([
    ordersStoreDto,
    object({
        telephone: string([
            minLength(6),
            custom(
                (value) => /^\d+$/.test(value),
                "Este campo permite solo números."
            ),
        ]),
        address: string([minLength(10), maxLength(100)]),
        reference: string([minLength(10), maxLength(100)]),
    }),
]);
export type OrdersCartStoreDto = Input<typeof ordersCartStoreDto>;
