import {
	getOutput,
	getPipeIssues,
	omitAsync,
	type Input,
} from "@vigilio/valibot";
import {
	emailsPromocionesSchema,
	type EmailsPromocionesSchema,
} from "../schemas/emails_promociones.schema";
import { Emails } from "../entities/emails.entity";
import { EmailsPromociones } from "../entities/emails_offers.entity";

export const emailsPromocionesStoreDto = omitAsync(
	emailsPromocionesSchema,
	["id"],
	[
		async (input) => {
			const [byEmail, byEmail2] = await Promise.all([
				Emails.findOne({
					where: {
						email: input.email,
					},
					raw: true,
				}),
				EmailsPromociones.findOne({
					where: {
						email: input.email,
					},
					raw: true,
				}),
			]);

			if (byEmail || byEmail2) {
				return getPipeIssues(
					"email" as keyof EmailsPromocionesSchema,
					"Ya estas unido a nuestras promociones",
					input,
				);
			}

			return getOutput(input);
		},
	],
);
export type EmailsPromocionesStoreDto = Input<typeof emailsPromocionesStoreDto>;
