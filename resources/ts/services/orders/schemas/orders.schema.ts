import type { UsersSchema } from "@/users/schemas/users.schema";
import {
    number,
    string,
    type Input,
    nullable,
    object,
    minLength,
    custom,
    maxLength,
    minValue,
    startsWith,
    boolean,
    array,
} from "@vigilio/valibot";
import type { StatusOrdersSchema } from "./status_orders.schema";
import type { PayMethodsSchema } from "./pay_methods.schema";
import type { DetailOrdersSchemaFromServer } from "./detail_orders.schema";
import type { InvoicesSchema } from "./invoices.schema";
import type { NotesSchema } from "./notes.schema";
import type { GuidesSchema } from "./guides.schema";
import { filesSchema } from "~/libs/upload";
import type { DistrictsSchemaFromServer } from "@/ubigeo/schemas/districts.schema";
export const ordersSchema = object({
    id: number(),
    order_code: string(),
    address: nullable(string([minLength(10), maxLength(100)])),
    telephone: nullable(
        string([
            minLength(9),
            maxLength(9),
            custom(
                (value) => /^[0-9]+$/.test(value),
                "Este campo permite solo números."
            ),
            startsWith("9", "El numero debe empesar con 9."),
        ])
    ),
    total: number([minValue(0, "Total no válido.")]),
    description: nullable(string([minLength(3), maxLength(255)])),
    status_order_id: number(),
    pay_method_id: number(),
    pasarela_comision: boolean(),
    paypal_token: nullable(string()),
    paypal_response: nullable(object({})),
    pasarela_response: nullable(object({})),
    transferencia_image: nullable(array(filesSchema())),
    isDelivery: boolean(),
    moneyChange: number(),
    igv: boolean(),
    is_pasarela_client: boolean(),
    district_id: nullable(string()),
    map_marker: nullable(
        object({ lng: number(), lat: number() }, "Coordenadas no válida.")
    ),
    information_id: number(),
    user_id: nullable(number()),
    client_id: nullable(number()),
});

export type OrdersSchema = Input<typeof ordersSchema>;
export type OrdersSchemaFromServer = Input<typeof ordersSchema> & {
    user: Pick<UsersSchema, "id" | "username" | "name" | "lastname" | "photo">;
    client: ClientSchema;
    status_order: StatusOrdersSchema;
    pay_method: PayMethodsSchema;
    createdAt: Date;
    details_orders: DetailOrdersSchemaFromServer[];
    invoice: InvoicesSchema | null;
    guide: GuidesSchema | null;
    note: NotesSchema | null;
    updatedAt: Date;
    district: DistrictsSchemaFromServer;
};
