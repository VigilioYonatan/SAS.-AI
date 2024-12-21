import { Injectable } from "@vigilio/express-core";
import type { EmailsPromocionesStoreDto } from "../dtos/emails_promociones.store.dto";
import { EmailsPromociones } from "../entities/emails_offers.entity";

@Injectable()
export class EmailsPromocionesApiService {
	async store(emailsPromocionesStoreDto: EmailsPromocionesStoreDto) {
		const newEmailPromociones = new EmailsPromociones(
			emailsPromocionesStoreDto,
		);
		await newEmailPromociones.save();
		return {
			success: true,
			message:
				"Felicidades, Recibirás nuestras promociones en tu buzon de correo.",
		};
	}
}
