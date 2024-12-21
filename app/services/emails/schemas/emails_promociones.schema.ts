import { email, number, object, string, type Input } from "@vigilio/valibot";

export const emailsPromocionesSchema = object({
    id: number(),
    email: string([email()]),
    empresa_id: number(),
});
export type EmailsPromocionesSchema = Input<typeof emailsPromocionesSchema>;
