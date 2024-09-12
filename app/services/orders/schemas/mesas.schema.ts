import { number, objectAsync, type Input, string } from "valibot";
import type { OrdersSchemaFromServer } from "./orders.schema";

export const mesasSchema = objectAsync({
	id: number(),
	mesa_code: string(),
	floor_id: number("Este campo es obligatorio."),
	empresa_id: number(),
});

export type MesasSchema = Input<typeof mesasSchema> & {
	createdAt?: Date;
	updatedAt?: Date;
};
export type MesasSchemaFromServer = MesasSchema & {
	orders: OrdersSchemaFromServer[];
};
