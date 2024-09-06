import { number, type Input, object, string } from "valibot";
import type { OrdersSchemaFromServer } from "./orders.schema";

export const mesasSchema = object({
	id: number(),
	mesa_code: string(),
	floor_id: number("Este campo es obligatorio."),
	information_id: number(),
});

export type MesasSchema = Input<typeof mesasSchema>;
export type MesasSchemaFromserver = MesasSchema & {
	createdAt: Date;
	updatedAt: Date;
};
export type MesasOrdersSchemaFromServer = MesasSchema & {
	orders: OrdersSchemaFromServer[];
};
