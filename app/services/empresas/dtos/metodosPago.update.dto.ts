import { omitAsync, type Input } from "@vigilio/valibot";
import { metodosPagoSchema } from "../schemas/metodosPago.schema";

export const metodosPagoUpdateDto = omitAsync(metodosPagoSchema, [
	"empresa_id",
	"qrPlin",
	"qrYape",
]);
export type MetodosPagoUpdateDto = Input<typeof metodosPagoUpdateDto>;
