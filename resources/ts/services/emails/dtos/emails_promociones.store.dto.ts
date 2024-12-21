import { omitAsync, type Input } from "@vigilio/valibot";
import { emailsPromocionesSchema } from "../schemas/emails_promociones.schema";

export const emailsPromocionesStoreDto = omitAsync(emailsPromocionesSchema, [
	"id",
]);
export type EmailsPromocionesStoreDto = Input<typeof emailsPromocionesStoreDto>;
