import { Injectable } from "@vigilio/express-core";
import type { GuidesStoreDto } from "../dtos/guides.store.dto";
import { Guides } from "../entities/guides.entity";
import { NotFoundException } from "@vigilio/express-core";
import type { GuidesUpdateDto } from "../dtos/guides.update.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
export class GuidesApiService {
	async latestCorrelativo(empresa: Empresas, kind_guide_code: string) {
		const latestNote = await Guides.findOne({
			order: [["createdAt", "DESC"]],
			where: {
				kind_guide_code,
				empresa_id: empresa.id,
			},
		});
		let correlativo = null;
		if (latestNote) {
			const ultimoNumero = Number.parseInt(latestNote.correlativo);
			correlativo = `${String(ultimoNumero + 1).padStart(6, "0")}`;
		} else {
			correlativo = "000001";
		}
		return { success: true, correlativo };
	}

	async show(empresa: Empresas, serie_correlative: string) {
		let invoice = null;
		if (!Number.isNaN(Number(serie_correlative))) {
			invoice = await Guides.findByPk(serie_correlative);
		} else {
			const [serie, correlativo] = serie_correlative.split("-");
			invoice = await Guides.findOne({
				where: {
					serie,
					correlativo,
					empresa_id: empresa.id,
				},
			});
		}

		if (!invoice) {
			throw new NotFoundException(
				`No se encontró una nota de credito o debito con ${serie_correlative}`,
			);
		}

		return {
			success: true,
			invoice,
		};
	}
	async store(body: GuidesStoreDto) {
		const invoice = new Guides(body);
		await invoice.save();
		return {
			success: true,
			invoice,
		};
	}
	async update(
		empresa: Empresas,
		serie_correlative: string,
		body: GuidesUpdateDto,
	) {
		const { invoice } = await this.show(empresa, serie_correlative);
		await invoice.update(body);
		return {
			success: true,
			invoice,
		};
	}
}
