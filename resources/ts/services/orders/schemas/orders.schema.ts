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
	boolean,
	array,
	email,
} from "@vigilio/valibot";
import type { StatusOrdersSchema } from "./status_orders.schema";
import type { PayMethodsSchema } from "./pay_methods.schema";
import type { DetailOrdersSchemaFromServer } from "./detail_orders.schema";
import type { InvoicesSchema } from "./invoices.schema";
import type { NotesSchema } from "./notes.schema";
import type { GuidesSchema } from "./guides.schema";
import { filesSchema } from "~/libs/upload";
import { CitiesSchemaFromServer } from "@/ubigeo/schemas/cities.schema";
import { ClientsSchema } from "@/users/schemas/client.schema";
import { MesasSchema } from "./mesas.schema";
import { FloorsSchema } from "./floors.schema";
export const ordersSchema = object({
	id: number(),
	order_code: string(),
	email: nullable(string([email()])),
	address: nullable(string([minLength(10), maxLength(100)])),
	reference: nullable(string([minLength(10), maxLength(100)])),
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
	mercado_pago_token: nullable(string()),
	pasarela_comision: boolean(),
	paypal_token: nullable(string()),
	paypal_response: nullable(object({})),
	pasarela_response: nullable(object({})),
	transferencia_image: nullable(array(filesSchema())),
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
});

export type OrdersSchema = Input<typeof ordersSchema>;
export type OrdersSchemaFromServer = Input<typeof ordersSchema> & {
	user: Pick<UsersSchema, "id" | "username" | "name" | "lastname" | "photo">;
	client: ClientsSchema;
	status_order: StatusOrdersSchema;
	pay_method: PayMethodsSchema;
	createdAt: Date;
	details_orders: DetailOrdersSchemaFromServer[];
	invoice: InvoicesSchema | null;
	guide: GuidesSchema | null;
	note: NotesSchema | null;
	updatedAt: Date;
	city: CitiesSchemaFromServer;
	mesa: (MesasSchema & { floor?: FloorsSchema }) | null;
};
