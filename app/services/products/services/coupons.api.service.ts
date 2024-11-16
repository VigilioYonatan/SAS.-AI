import { Injectable } from "@vigilio/express-core";
import { Coupons } from "../entities/coupons.entity";
import { BadRequestException, NotFoundException } from "@vigilio/express-core";
import { Op } from "sequelize";
import type { CouponsUpdateDto } from "../dtos/coupons.update.dto";
import type { CouponsStoreDto } from "../dtos/coupons.store.dto";
import { CategoriesApiService } from "./categories.api.service";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import dayjs from "dayjs";

@Injectable()
export class CouponsApiService {
	constructor(private readonly categoriesApiService: CategoriesApiService) {}
	async index(empresa: Empresas) {
		const data = await Coupons.findAll({
			where: {
				empresa_id: empresa.id,
			},
		});
		return {
			success: true,
			data,
		};
	}

	async show(empresa: Empresas, cupon: string) {
		let coupon = null;
		if (!Number.isNaN(Number(cupon))) {
			coupon = await Coupons.findOne({
				where: {
					id: cupon,
					empresa_id: empresa.id,
				},
			});
		} else {
			coupon = await Coupons.findOne({
				where: {
					coupon: cupon,
					empresa_id: empresa.id,
				},
			});
		}
		if (!coupon) {
			throw new NotFoundException(`No se encontró un cupón con ${cupon}`);
		}
		const couponMapped = await Promise.all(
			coupon.categories.map(async (coupon) => {
				const { category } = await this.categoriesApiService.show(
					empresa,
					String(coupon),
				);
				return {
					id: category.id,
					name: category.name,
				};
			}),
		);
		coupon.dataValues.category = couponMapped;
		return {
			success: true,
			coupon,
		};
	}

	async store(empresa: Empresas, couponsStoreDto: CouponsStoreDto) {
		//
		// const date = dayjs
		//     .tz(couponsStoreDto.date, "Europe/Madrid")
		//     .utc()
		//     .format(); // tengo que guarlarle como utc?
		const date = dayjs.tz(couponsStoreDto.date, empresa.tz).utc().format();
		const coupon = new Coupons({
			...couponsStoreDto,
			empresa_id: empresa.id,
			date,
		});
		await coupon.save();
		return {
			success: true,
			coupon,
		};
	}

	async update(
		empresa: Empresas,
		id: string,
		couponsUpdateDto: CouponsUpdateDto,
	) {
		const { coupon } = await this.show(empresa, id);
		const [byCoupon] = await Promise.all([
			Coupons.findOne({
				where: {
					coupon: couponsUpdateDto.coupon,
					id: { [Op.not]: id },
					empresa_id: empresa.id,
				},
				raw: true,
			}),
		]);
		if (byCoupon) {
			throw new BadRequestException(
				`Ya existe el cúpon: ${couponsUpdateDto.coupon}`,
				{ body: "coupon" as keyof CouponsUpdateDto },
			);
		}
		const date = dayjs.tz(couponsUpdateDto.date, empresa.tz).utc().format();

		await coupon.update({ ...couponsUpdateDto, date });
		return {
			success: true,
			coupon,
		};
	}

	async destroy(empresa: Empresas, id: string) {
		const { coupon } = await this.show(empresa, id);
		await coupon.destroy();
		return {
			success: true,
			message: `El coupon con el id: ${id} fue eliminado`,
		};
	}
}
