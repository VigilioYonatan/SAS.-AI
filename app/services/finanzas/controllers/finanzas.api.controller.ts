import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import {
	Body,
	Controller,
	Delete,
	Get,
	Injectable,
	Params,
	Post,
	Put,
	Query,
	Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { FinanzasApiService } from "../services/finanzas.api.service";
import {
	finanzasStoreDto,
	type FinanzasStoreDto,
} from "../dtos/finanzas.store.dto";
import { Finanzas } from "../entities/finanzas.entity";
import { col, fn, Op, type WhereOptions } from "sequelize";
import { CategoriesFinanzas } from "../entities/categories.entity";

@Injectable()
@Controller("/finanzas")
export class FinanzasApiController {
	constructor(private readonly finanzasApiService: FinanzasApiService) {}

	// @PermissionAdmin()
	@Get("/all")
	async month(
		@Req("empresa") empresa: Empresas,
		@Query("month") month: string,
		@Query("year") year: string,
	) {
		const date = {
			month: month || new Date().getMonth(),
			year: year || new Date().getFullYear(),
		};
		const startDate = new Date(Number(date.year), Number(date.month) - 1, 1); // Restamos 1 al mes porque en JavaScript los meses van de 0 a 11

		const endDate = new Date(Number(date.year), Number(date.month), 0); // Usamos el día 0 del mes siguiente para obtener el último día del mes actual

		const where: WhereOptions = {
			createdAt: {
				[Op.between]: [startDate, endDate],
			},
			empresa_id: empresa.id,
		};
		const [
			ingresos,
			egresos,
			categoriesIngresos,
			resume_ingresos,
			categoriesEgresos,
			resume_egresos,
		] = await Promise.all([
			Finanzas.unscoped().findAll({
				where: {
					tipo_finanza_id: 1,
					...where,
				},
				attributes: ["monto", "presupuesto"],
			}),
			Finanzas.unscoped().findAll({
				where: {
					tipo_finanza_id: 2,
					...where,
				},
				attributes: ["monto", "presupuesto"],
			}),
			CategoriesFinanzas.findAll({
				where: {
					tipo_finanza_id: 1,
					empresa_id: empresa.id,
				},
				raw: true,
			}),
			Finanzas.unscoped().findAll({
				attributes: [
					"category_finanza_id",
					[fn("SUM", col("monto")), "total_monto"],
					[fn("SUM", col("presupuesto")), "total_presupuesto"],
				],
				group: ["category_finanza_id"],
				where: {
					tipo_finanza_id: 1,
					...where,
				},
				raw: true,
			}),
			CategoriesFinanzas.unscoped().findAll({
				where: {
					tipo_finanza_id: 2,
					empresa_id: empresa.id,
				},
				raw: true,
			}),
			Finanzas.unscoped().findAll({
				attributes: [
					"category_finanza_id",
					[fn("SUM", col("monto")), "total_monto"],
					[fn("SUM", col("presupuesto")), "total_presupuesto"],
				],
				group: ["category_finanza_id"],
				where: {
					tipo_finanza_id: 2,
					...where,
				},
				raw: true,
			}),
		]);
		const ingresosTotales = ingresos.reduce((a, b) => a + b.monto, 0);
		const egresosTotales = egresos.reduce((a, b) => a + b.monto, 0);
		const presupuestoIngresos = ingresos.reduce((a, b) => a + b.presupuesto, 0);
		const presupuestoEgresos = egresos.reduce((a, b) => a + b.presupuesto, 0);

		const saldo = ingresosTotales - egresosTotales;

		const resumeIngresos = categoriesIngresos.map((category) => {
			const existCategory = resume_ingresos.find(
				(ingreso) => ingreso.category_finanza_id === category.id,
			)! as unknown as {
				total_presupuesto: string;
				total_monto: string;
			};
			if (existCategory) {
				return {
					id: category.id,
					name: category.value,
					presupuesto: Number(existCategory.total_presupuesto),
					monto: Number(existCategory.total_monto),
				};
			}
			return {
				id: category.id,
				name: category.value,
				presupuesto: 0,
				monto: 0,
			};
		});

		const resumeEgresos = categoriesEgresos.map((category) => {
			const existCategory = resume_egresos.find(
				(egreso) => egreso.category_finanza_id === category.id,
			) as unknown as {
				total_presupuesto: string;
				total_monto: string;
			};
			if (existCategory) {
				return {
					id: category.id,
					name: category.value,
					presupuesto: Number(existCategory.total_presupuesto),
					monto: Number(existCategory.total_monto),
				};
			}
			return {
				id: category.id,
				name: category.value,
				presupuesto: 0,
				monto: 0,
			};
		});

		return {
			success: true,
			data: {
				ingresosTotales,
				egresosTotales,
				resumeIngresos,
				presupuestoIngresos,
				saldo,
				resumeEgresos,
				presupuestoEgresos,
			},
		};
	}

	@PermissionAdmin()
	@Get("/")
	async index(@Req("empresa") empresa: Empresas) {
		const result = await this.finanzasApiService.index(empresa);
		return result;
	}
	@PermissionAdmin()
	@Get("/tipos")
	async tipos(@Req("empresa") empresa: Empresas) {
		const result = await this.finanzasApiService.tipos(empresa);
		return result;
	}

	@PermissionAdmin()
	@Validator(finanzasStoreDto)
	@Post("/")
	async store(
		@Req("empresa") empresa: Empresas,
		@Body() body: FinanzasStoreDto,
	) {
		const result = await this.finanzasApiService.store(empresa, body);
		return result;
	}
	@PermissionAdmin()
	@Validator(finanzasStoreDto)
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Put("/:id")
	async update(
		@Req("empresa") empresa: Empresas,
		@Params("id") id: string,
		@Body() body: FinanzasStoreDto,
	) {
		const result = await this.finanzasApiService.update(empresa, id, body);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Delete("/:id")
	async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
		const result = await this.finanzasApiService.destroy(empresa, id);
		return result;
	}
}
