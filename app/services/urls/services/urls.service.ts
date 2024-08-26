import { Injectable } from "@vigilio/express-core";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import type { UrlsStoreDto } from "../dtos/urls.store.dto";
import { Urls } from "../entities/urls.entity";
import type { UrlsUpdateDto } from "../dtos/urls.update.dto";
import { Op } from "sequelize";

@Injectable()
export class UrlsService {
	async index() {
		const data = await Urls.findAll();
		return {
			success: true,
			data,
		};
	}
	async show(hash: string) {
		let url = null;
		if (!Number.isNaN(Number(hash))) {
			url = await Urls.findByPk(Number(hash));
		} else {
			url = await Urls.findOne({
				where: {
					hash,
				},
			});
		}
		if (!url) {
			throw new NotFoundException(`No se encontró un url con ${hash}`);
		}

		return {
			success: true,
			url,
		};
	}

	async store(urlsStoreDto: UrlsStoreDto) {
		const url = new Urls(urlsStoreDto);
		await url.save();
		return {
			success: true,
			url,
		};
	}

	async update(id: string, urlUpdateDto: UrlsUpdateDto) {
		const { url } = await this.show(id);
		const [byWeb, byHash] = await Promise.all([
			Urls.findOne({
				where: {
					web: urlUpdateDto.web,
					id: { [Op.not]: url.id },
				},
				raw: true,
			}),
			Urls.findOne({
				where: {
					hash: urlUpdateDto.hash,
					id: { [Op.not]: url.id },
				},
				raw: true,
			}),
		]);
		if (byWeb) {
			throw new BadRequestException(
				`Este url  con el nombre: ${urlUpdateDto.web} ya existe`,
				{ body: "web" },
			);
		}
		if (byHash) {
			throw new BadRequestException(
				`Esta url con el hash: ${urlUpdateDto.hash} ya existe`,
				{ body: "hash" },
			);
		}
		await url.update(urlUpdateDto);
		return {
			success: true,
			url,
		};
	}
	async destroy(id: string) {
		const { url } = await this.show(id);
		await url.destroy();
		return {
			success: true,
			message: "Url eliminado correctamente",
		};
	}
}
