import { BadRequestException, Injectable } from "@vigilio/express-core";
import { NotFoundException } from "@vigilio/express-core";
import { Banner } from "../entities/banner.entity";
import type { Empresas } from "../entities/empresas.entity";
import type { BannerStoreDto } from "../dtos/banner.store.dto";
import type { BannerUpdateDto } from "../dtos/banner.update.dto";
import { Op } from "sequelize";

@Injectable()
export class BannerApiService {
	async index(empresa: Empresas) {
		const data = await Banner.findAll({
			where: {
				empresa_id: empresa.id,
			},
		});
		return {
			success: true,
			data,
		};
	}

	async show(empresa: Empresas, id: number) {
		const banner = await Banner.findOne({
			where: { id, empresa_id: empresa.id },
		});
		if (!banner) {
			throw new NotFoundException(`No se encontró un banner con el id ${id}`);
		}
		return {
			success: true,
			banner,
		};
	}

	async store(empresa: Empresas, body: BannerStoreDto) {
		const exist = await Banner.findOne({
			where: {
				empresa_id: empresa.id,
				grid_banner_id: body.grid_banner_id,
				order: body.order,
			},
		});
		if (exist) throw new BadRequestException("Ya hay banner en ese orden");
		const banner = new Banner({ ...body, empresa_id: empresa.id });
		await banner.save();
		return {
			success: true,
			banner,
		};
	}
	async update(empresa: Empresas, id: number, body: BannerUpdateDto) {
		const { banner } = await this.show(empresa, id);
		const bannerFind = await Banner.findOne({
			where: {
				empresa_id: empresa.id,
				order: body.order,
				id: { [Op.not]: id },
			},
		});
		if (bannerFind) {
			await bannerFind.update({ order: banner.order });
			await banner.update({ ...body });
		} else {
			await banner.update({ ...body });
		}
		return {
			success: true,
			banner,
		};
	}

	async destroy(empresa: Empresas, id: number) {
		const { banner } = await this.show(empresa, id);
		// const banner = await Banner.findByPk(id);
		await banner.destroy();
		return {
			success: true,
			message: "banner eliminado",
		};
	}
}
