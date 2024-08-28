import {  omitAsync, type Input } from "@vigilio/valibot";
import { metodosPagoSchema } from "../schemas/metodosPago.schema";

export const metodosPagoUpdatedDto = omitAsync(metodosPagoSchema, [
    "information_id",
    "qrPlin",
    "qrYape",
]);
export type MetodosPagoUpdateDto = Input<typeof metodosPagoUpdatedDto>