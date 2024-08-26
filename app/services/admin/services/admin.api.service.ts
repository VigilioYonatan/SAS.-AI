import { InformationEntity } from "@/information/entities/information.entity";
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
import { productEntity } from "@/products/libs";

@Injectable()
export class AdminApiService {
    async dashboard(information: InformationEntity) {
        const Products = productEntity(
            information.tipo_empresa.tipo_servicio_id
        );
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
                    information_id: information.id,
                },
            }),
            Products.count({
                where: {
                    information_id: information.id,
                },
            }),
            Categories.count({
                where: {
                    information_id: information.id,
                },
            }),
            Orders.unscoped().findOne({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                ],
                where: {
                    status_order_id: STATUSORDER.entregado,
                    information_id: information.id,
                    //  solo de este mes
                    ...sorteByTime("month"),
                },
            }),
            Users.findAll({
                limit: 10,
                attributes: ["id", "username", "slug", "email", "photo"],
                where: {
                    information_id: information.id,
                },
            }),
            Orders.unscoped().findAll({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                    [Sequelize.fn("DATE", Sequelize.col("createdAt")), "time"],
                ],
                where: {
                    status_order_id: STATUSORDER.entregado,
                    information_id: information.id,
                    // este año
                    ...sorteByTime("year"),
                },
                group: [Sequelize.fn("DATE", Sequelize.col("createdAt"))],
            }),
            usersMostOrders(information, sorteByTime("month")),
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

    async earning(information: InformationEntity) {
        const { currentYear } = getTime();
        // obtenemos el año desde que la web se subio
        const yearsInformation = new Date(
            information.dateRelease
        ).getFullYear();

        const years: number[] = [];
        for (let year = yearsInformation; year <= currentYear; year++) {
            years.push(year);
        }
        async function getTable(year: number) {
            const totalForMothYear = await Orders.unscoped().findAll({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                    [
                        Sequelize.fn(
                            "EXTRACT",
                            Sequelize.literal('MONTH FROM "createdAt"')
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
                    information_id: information.id,
                },
                group: Sequelize.fn(
                    "EXTRACT",
                    Sequelize.literal('MONTH FROM "createdAt"')
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
                    (x) => Number(x.dataValues.month) === i + 1
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
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                ],
                where: {
                    //  solo pagados correctamente
                    status_order_id: STATUSORDER.entregado,
                    information_id: information.id,
                    //  solo de este mes
                    ...sorteByTime("month"),
                },
            }),
            Orders.unscoped().findOne({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                ],
                where: {
                    //  solo pagados correctamente
                    status_order_id: STATUSORDER.entregado,
                    information_id: information.id,
                    ...sorteByTime("year"),
                },
            }),
            Orders.unscoped().findOne({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                ],
                where: {
                    //  solo  pagados correctamente
                    status_order_id: STATUSORDER.entregado,
                    information_id: information.id,
                    //  solo de este dia
                    ...sorteByTime("today"),
                },
            }),
            Orders.unscoped().findOne({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                ],
                where: {
                    status_order_id: STATUSORDER.entregado,
                    information_id: information.id,
                },
            }),
            Orders.unscoped().findOne({
                attributes: [
                    [Sequelize.fn("SUM", Sequelize.col("total")), "total"],
                ],
                where: {
                    status_order_id: STATUSORDER.entregado,
                    information_id: information.id,
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
            })
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
    async deliverys(information: InformationEntity) {
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
                    information_id: information.id,
                },
            }),
            Orders.count({
                where: {
                    isDelivery: true,
                    // hoy
                    ...sorteByTime("today"),
                    status_order_id: STATUSORDER.entregado,
                    information_id: information.id,
                },
            }),
            Orders.count({
                where: {
                    isDelivery: true,
                    // hoy
                    ...sorteByTime("today"),
                    status_order_id: STATUSORDER.problema,
                    information_id: information.id,
                },
            }),
        ]);
        return {
            success: true,
            count: { deliverys, confirmado, pagados, problema },
        };
    }
    async orders(information: InformationEntity) {
        const [orders, confirmado, pagados, problema] = await Promise.all([
            Orders.count({
                where: {
                    // hoy
                    ...sorteByTime("today"),
                    isDelivery: false,
                    information_id: information.id,
                },
            }),
            Orders.count({
                where: {
                    // hoy
                    ...sorteByTime("today"),
                    status_order_id: STATUSORDER.confirmado,
                    isDelivery: false,
                    information_id: information.id,
                },
            }),
            Orders.count({
                where: {
                    // hoy
                    ...sorteByTime("today"),
                    status_order_id: STATUSORDER.entregado,
                    isDelivery: false,
                    information_id: information.id,
                },
            }),
            Orders.count({
                where: {
                    // hoy
                    ...sorteByTime("today"),
                    status_order_id: STATUSORDER.problema,
                    isDelivery: false,
                    information_id: information.id,
                },
            }),
        ]);
        return {
            success: true,
            count: { orders, confirmado, pagados, problema },
        };
    }
    async facturationSystem(information: InformationEntity) {
        const [facturas, boletas, notaCredito, notaDebito] = await Promise.all([
            Invoices.count({
                where: {
                    kind_invoice_code: "01", //facturas
                    // hoy
                    ...sorteByTime("year"),
                    information_id: information.id,
                },
            }),
            Invoices.count({
                where: {
                    kind_invoice_code: "03", //boletas
                    ...sorteByTime("year"),
                    information_id: information.id,
                },
            }),
            Notes.count({
                where: {
                    kind_invoice_code: "07", //notas de credito
                    ...sorteByTime("year"),
                    information_id: information.id,
                },
            }),
            Notes.count({
                where: {
                    kind_invoice_code: "08", //notas de credito
                    ...sorteByTime("year"),
                    information_id: information.id,
                },
            }),
        ]);
        return {
            success: true,
            count: { facturas, boletas, notaCredito, notaDebito },
        };
    }
}
