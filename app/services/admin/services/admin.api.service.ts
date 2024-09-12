import { Empresas } from "@/empresas/entities/empresas.entity";
import { Orders } from "@/orders/entities/orders.entity";
import { Users } from "@/users/entities/users.entity";
import { Injectable } from "@vigilio/express-core";
import { Op, Sequelize } from "sequelize";
import { Invoices } from "@/orders/entities/invoices.entity";
import { getTime } from "~/libs/dayjs";
import { sorteByTime } from "../../common/paginator/libs/index";
import { Notes } from "@/orders/entities/notes.entity";
import { STATUSORDER, usersMostOrders } from "@/orders/libs";
import { Categories } from "@/products/entities/categories.entity";
import { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";

@Injectable()
export class AdminApiService {
	async dashboard(empresa: Empresas) {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const Products: any =
			empresa.tipo_empresa.tipo_servicio_id === 2
				? ProductsRestaurant
				: ProductsNormal;
		const [
			countUsers,
			countProducts,
			countCategories,
			gananciasMensual,
			usersLimit30,
			ratingYear,
			usersMostOrder,
		] = await Promise.all([
			Users.count({
				where: {
					empresa_id: empresa.id,
				},
			}),
			Products.count({
				where: {
					empresa_id: empresa.id,
				},
			}),
			Categories.count({
				where: {
					empresa_id: empresa.id,
				},
			}),
			Orders.unscoped().findOne({
				attributes: [[Sequelize.fn("SUM", Sequelize.col("total")), "total"]],
				where: {
					status_order_id: STATUSORDER.entregado,
					empresa_id: empresa.id,
					//  solo de este mes
					...sorteByTime("month"),
				},
			}),
			Users.findAll({
				limit: 10,
				attributes: ["id", "username", "slug", "email", "photo"],
				where: {
					empresa_id: empresa.id,
				},
			}),
			Orders.unscoped().findAll({
				attributes: [
					[Sequelize.fn("SUM", Sequelize.col("total")), "total"],
					[Sequelize.fn("DATE", Sequelize.col("createdAt")), "time"],
				],
				where: {
					status_order_id: STATUSORDER.entregado,
					empresa_id: empresa.id,
					// este año
					...sorteByTime("year"),
				},
				group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
			}),
			usersMostOrders(empresa, sorteByTime("month")),
		]);
		const ratingYearArray = ratingYear.map((res) => ({
			value: res.get("total"),
			time: res.get("time"),
		}));

		return {
			success: true,
			results: {
				counts: {
					users: countUsers,
					products: countProducts,
					categories: countCategories,
					gananciasMensual: gananciasMensual?.total,
				},
				usersLimit30,
				ratingYearArray,
				usersMostOrders: usersMostOrder,
			},
		};
	}

	async earning(empresa: Empresas) {
		const { currentYear } = getTime();
		// obtenemos el año desde que la web se subio
		const yearsEmpresa = new Date(empresa.dateRelease).getFullYear();

		const years: number[] = [];
		for (let year = yearsEmpresa; year <= currentYear; year++) {
			years.push(year);
		}
		async function getTable(year: number) {
			const totalForMothYear = await Orders.unscoped().findAll({
				attributes: [
					[Sequelize.fn("SUM", Sequelize.col("total")), "total"],
					[
						Sequelize.fn(
							"EXTRACT",
							Sequelize.literal('MONTH FROM "createdAt"'),
						),
						"month",
					],
				],
				where: {
					createdAt: {
						[Op.between]: [
							new Date(`${year}-01-01`),
							new Date(`${year}-12-31`),
						],
					},
					status_order_id: STATUSORDER.entregado,
					empresa_id: empresa.id,
				},
				group: Sequelize.fn(
					"EXTRACT",
					Sequelize.literal('MONTH FROM "createdAt"'),
				),
			});
			const months = [
				"Enero",
				"Febrero",
				"Marzo",
				"Abril",
				"Mayo",
				"Junio",
				"Julio",
				"Agosto",
				"Septiembre",
				"Octubre",
				"Noviembre",
				"Diciembre",
			];
			const formattedResults = months.map((month, i) => {
				const result = totalForMothYear.find(
					(x) => Number(x.dataValues.month) === i + 1,
				);

				return {
					total: result ? result.dataValues.total : "0",
					month,
					monthNumber: i,
				};
			});

			return formattedResults;
		}

		const [
			gananciasMensual,
			gananciasAnual,
			gananciasDiario,
			gananciasPrimerDay,
			gananciasAyer,
		] = await Promise.all([
			Orders.unscoped().findOne({
				attributes: [[Sequelize.fn("SUM", Sequelize.col("total")), "total"]],
				where: {
					//  solo pagados correctamente
					status_order_id: STATUSORDER.entregado,
					empresa_id: empresa.id,
					//  solo de este mes
					...sorteByTime("month"),
				},
			}),
			Orders.unscoped().findOne({
				attributes: [[Sequelize.fn("SUM", Sequelize.col("total")), "total"]],
				where: {
					//  solo pagados correctamente
					status_order_id: STATUSORDER.entregado,
					empresa_id: empresa.id,
					...sorteByTime("year"),
				},
			}),
			Orders.unscoped().findOne({
				attributes: [[Sequelize.fn("SUM", Sequelize.col("total")), "total"]],
				where: {
					//  solo  pagados correctamente
					status_order_id: STATUSORDER.entregado,
					empresa_id: empresa.id,
					//  solo de este dia
					...sorteByTime("today"),
				},
			}),
			Orders.unscoped().findOne({
				attributes: [[Sequelize.fn("SUM", Sequelize.col("total")), "total"]],
				where: {
					status_order_id: STATUSORDER.entregado,
					empresa_id: empresa.id,
				},
			}),
			Orders.unscoped().findOne({
				attributes: [[Sequelize.fn("SUM", Sequelize.col("total")), "total"]],
				where: {
					status_order_id: STATUSORDER.entregado,
					empresa_id: empresa.id,
					//  solo de este mes
					...sorteByTime("yesterday"),
				},
			}),
		]);
		const getYearMonthAmount = await Promise.all(
			years.map(async (year) => {
				const result = await getTable(year);
				return {
					year,
					result,
				};
			}),
		);

		return {
			success: true,
			results: {
				gananciasMensual,
				getYearMonthAmount,
				gananciasAnual,
				gananciasDiario,
				gananciasPrimerDay,
				gananciasAyer,
			},
		};
	}
	async deliverys(empresa: Empresas) {
		const [deliverys, confirmado, pagados, problema] = await Promise.all([
			Orders.count({
				where: {
					isDelivery: true,
					// hoy
					...sorteByTime("today"),
				},
			}),
			Orders.count({
				where: {
					isDelivery: true,
					// hoy
					...sorteByTime("today"),
					status_order_id: STATUSORDER.confirmado,
					empresa_id: empresa.id,
				},
			}),
			Orders.count({
				where: {
					isDelivery: true,
					// hoy
					...sorteByTime("today"),
					status_order_id: STATUSORDER.entregado,
					empresa_id: empresa.id,
				},
			}),
			Orders.count({
				where: {
					isDelivery: true,
					// hoy
					...sorteByTime("today"),
					status_order_id: STATUSORDER.problema,
					empresa_id: empresa.id,
				},
			}),
		]);
		return {
			success: true,
			count: { deliverys, confirmado, pagados, problema },
		};
	}
	async orders(empresa: Empresas) {
		const [orders, confirmado, pagados, problema] = await Promise.all([
			Orders.count({
				where: {
					// hoy
					...sorteByTime("today"),
					isDelivery: false,
					empresa_id: empresa.id,
				},
			}),
			Orders.count({
				where: {
					// hoy
					...sorteByTime("today"),
					status_order_id: STATUSORDER.confirmado,
					isDelivery: false,
					empresa_id: empresa.id,
				},
			}),
			Orders.count({
				where: {
					// hoy
					...sorteByTime("today"),
					status_order_id: STATUSORDER.entregado,
					isDelivery: false,
					empresa_id: empresa.id,
				},
			}),
			Orders.count({
				where: {
					// hoy
					...sorteByTime("today"),
					status_order_id: STATUSORDER.problema,
					isDelivery: false,
					empresa_id: empresa.id,
				},
			}),
		]);
		return {
			success: true,
			count: { orders, confirmado, pagados, problema },
		};
	}
	async facturationSystem(empresa: Empresas) {
		const [facturas, boletas, notaCredito, notaDebito] = await Promise.all([
			Invoices.count({
				where: {
					kind_invoice_code: "01", //facturas
					// hoy
					...sorteByTime("year"),
					empresa_id: empresa.id,
				},
			}),
			Invoices.count({
				where: {
					kind_invoice_code: "03", //boletas
					...sorteByTime("year"),
					empresa_id: empresa.id,
				},
			}),
			Notes.count({
				where: {
					kind_invoice_code: "07", //notas de credito
					...sorteByTime("year"),
					empresa_id: empresa.id,
				},
			}),
			Notes.count({
				where: {
					kind_invoice_code: "08", //notas de credito
					...sorteByTime("year"),
					empresa_id: empresa.id,
				},
			}),
		]);
		return {
			success: true,
			count: { facturas, boletas, notaCredito, notaDebito },
		};
	}
}
