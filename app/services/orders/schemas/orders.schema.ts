import {
	number,
	objectAsync,
	string,
	type Input,
	nullable,
	minLength,
	maxLength,
	custom,
	minValue,
	boolean,
	object,
	array,
	email,
} from "@vigilio/valibot";
import type { DetailOrdersFromServer } from "./detail_orders.schema";
import type { InvoicesSchema } from "./invoices.schema";
import { filesSchema } from "@/uploads/schemas/uploads.schema";
import { ordersTransferenciaImage } from "../libs";
import type { UsersSchemaFromServer } from "@/users/schemas/users.schema";
import type { ClientSchema } from "@/users/schemas/client.schema";
import type { MesasSchema } from "./mesas.schema";
import type { FloorsSchema } from "./floors.schema";
import type { NotesSchema } from "./notes.schema";
import type { PayMethodsSchema } from "./pay_methods.schema";
import type { GuidesSchema } from "./guides.schema";

export const ordersSchema = objectAsync({
	id: number(),
	order_code: string(),
	address: nullable(string([minLength(10), maxLength(100)])),
	reference: nullable(string([minLength(10), maxLength(100)])),
	email: nullable(string([email()])),
	telephone: nullable(
		string([
			minLength(6),
			custom(
				(value) => /^\d+$/.test(value),
				"Este campo permite solo números.",
			),
		]),
	),
	total: number([minValue(0, "Total no válido.")]),
	description: nullable(string([minLength(3), maxLength(255)])),
	status_order_id: number(),
	pay_method_id: number(),
	pasarela_comision: boolean(),
	mercado_pago_token: nullable(string()),
	paypal_token: nullable(string()),
	stripe_token: nullable(string()),
	paypal_response: nullable(object({})),
	pasarela_response: nullable(object({})),
	transferencia_image: nullable(array(filesSchema(ordersTransferenciaImage))),
	isDelivery: boolean(),
	moneyChange: number(),
	igv: boolean(),
	is_pasarela_client: boolean(),
	city_id: nullable(number()),
	map_marker: nullable(
		object({ lng: number(), lat: number() }, "Coordenadas no válida."),
	),
	empresa_id: number(),
	user_id: nullable(number()),
	client_id: nullable(number()),
	mesa_id: nullable(number()),
	type_pasarela: nullable(string()),
});

export type OrdersSchema = Input<typeof ordersSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
export type OrdersSchemaFromServer = OrdersSchema & {
	details_orders: DetailOrdersFromServer[];
	client: ClientSchema | null;
	invoice: InvoicesSchema;
	user: Pick<
		UsersSchemaFromServer,
		"id" | "username" | "name" | "lastname" | "photo" | "email" | "role_id"
	> | null;
	mesa: MesasSchema & { floor?: FloorsSchema };
	pay_method: PayMethodsSchema;
	note: NotesSchema | null;
	guide: GuidesSchema | null;
	updatedAt: Date;
};
