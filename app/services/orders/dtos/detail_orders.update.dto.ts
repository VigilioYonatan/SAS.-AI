import { omitAsync, type Input } from "@vigilio/valibot";
import { detailOrdersSchema } from "../schemas/detail_orders.schema";

export const detailOrdersUpdateDto = omitAsync(detailOrdersSchema, [
	"id",
	"information_id",
]);
export type DetailOrdersUpdateDto = Input<typeof detailOrdersUpdateDto>;
