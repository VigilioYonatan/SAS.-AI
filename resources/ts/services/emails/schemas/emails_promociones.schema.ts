import { email, number, object, string, type Input } from "@vigilio/valibot";

export const emailsPromocionesSchema = object({
	id: number(),
	email: string([email()]),
});
export type EmailsPromocionesSchema = Input<typeof emailsPromocionesSchema>;
