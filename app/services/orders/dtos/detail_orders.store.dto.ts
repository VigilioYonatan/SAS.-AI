import { omitAsync, type Input } from "@vigilio/valibot";
import { detailOrdersSchema } from "../schemas/detail_orders.schema";

export const detailOrdersStoreDto = omitAsync(detailOrdersSchema, [
	"id",
	"empresa_id",
]);
export type DetailOrdersStoreDto = Input<typeof detailOrdersStoreDto>;
