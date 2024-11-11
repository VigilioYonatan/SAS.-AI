import {
    custom,
    email,
    maxLength,
    minLength,
    object,
    string,
    type Input,
} from "@vigilio/valibot";
import { ordersStoreDto } from "./orders.store.dto";

export const ordersCartStoreDto = object({
    ...ordersStoreDto.entries,
    telephone: string([
        minLength(6),
        custom(
            (value) => /^\d+$/.test(value),
            "Este campo permite solo números."
        ),
    ]),
    address: string([minLength(10), maxLength(100)]),
    email: string([email()]),
    reference: string([minLength(10), maxLength(100)]),
});
// pick(authRegisterDto, ["password", "repeat_password"]) as const,

export type OrdersCartStoreDto = Input<typeof ordersCartStoreDto>;
