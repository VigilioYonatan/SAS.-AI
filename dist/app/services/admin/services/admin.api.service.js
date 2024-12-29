"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminApiService = void 0;
const orders_entity_1 = require("@/orders/entities/orders.entity");
const users_entity_1 = require("@/users/entities/users.entity");
const express_core_1 = require("@vigilio/express-core");
const sequelize_1 = require("sequelize");
const invoices_entity_1 = require("@/orders/entities/invoices.entity");
const dayjs_1 = require("~/libs/dayjs");
const index_1 = require("../../common/paginator/libs/index");
const notes_entity_1 = require("@/orders/entities/notes.entity");
const libs_1 = require("@/orders/libs");
const categories_entity_1 = require("@/products/entities/categories.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
let AdminApiService = class AdminApiService {
    dashboard(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const Products = empresa.tipo_empresa.tipo_servicio_id === 2
                ? products_restaurant_entity_1.ProductsRestaurant
                : products_normal_entity_1.ProductsNormal;
            const [countUsers, countProducts, countCategories, gananciasMensual, usersLimit30, ratingYear, usersMostOrder,] = yield Promise.all([
                users_entity_1.Users.count({
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
                Products.count({
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
                categories_entity_1.Categories.count({
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
                orders_entity_1.Orders.unscoped().findOne({
                    attributes: [[sequelize_1.Sequelize.fn("SUM", sequelize_1.Sequelize.col("total")), "total"]],
                    where: Object.assign({ status_order_id: libs_1.STATUSORDER.entregado, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, "month")),
                }),
                users_entity_1.Users.findAll({
                    limit: 10,
                    attributes: ["id", "username", "slug", "email", "photo"],
                    where: {
                        empresa_id: empresa.id,
                    },
                }),
                orders_entity_1.Orders.unscoped().findAll({
                    attributes: [
                        [sequelize_1.Sequelize.fn("SUM", sequelize_1.Sequelize.col("total")), "total"],
                        [sequelize_1.Sequelize.fn("DATE", sequelize_1.Sequelize.col("createdAt")), "time"],
                    ],
                    where: Object.assign({ status_order_id: libs_1.STATUSORDER.entregado, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, "year")),
                    group: [sequelize_1.Sequelize.fn("DATE", sequelize_1.Sequelize.col("createdAt"))],
                }),
                (0, libs_1.usersMostOrders)(empresa, (0, index_1.sorteByTime)(empresa, "month")),
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
                        gananciasMensual: gananciasMensual === null || gananciasMensual === void 0 ? void 0 : gananciasMensual.total,
                    },
                    usersLimit30,
                    ratingYearArray,
                    usersMostOrders: usersMostOrder,
                },
            };
        });
    }
    earning(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const { currentYear } = (0, dayjs_1.getTime)(empresa);
            const yearsEmpresa = new Date(empresa.dateRelease).getFullYear();
            const years = [];
            for (let year = yearsEmpresa; year <= currentYear; year++) {
                years.push(year);
            }
            function getTable(year) {
                return __awaiter(this, void 0, void 0, function* () {
                    const totalForMothYear = yield orders_entity_1.Orders.unscoped().findAll({
                        attributes: [
                            [sequelize_1.Sequelize.fn("SUM", sequelize_1.Sequelize.col("total")), "total"],
                            [
                                sequelize_1.Sequelize.fn("EXTRACT", sequelize_1.Sequelize.literal('MONTH FROM "createdAt"')),
                                "month",
                            ],
                        ],
                        where: {
                            createdAt: {
                                [sequelize_1.Op.between]: [
                                    new Date(`${year}-01-01`),
                                    new Date(`${year}-12-31`),
                                ],
                            },
                            status_order_id: libs_1.STATUSORDER.entregado,
                            empresa_id: empresa.id,
                        },
                        group: sequelize_1.Sequelize.fn("EXTRACT", sequelize_1.Sequelize.literal('MONTH FROM "createdAt"')),
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
                        const result = totalForMothYear.find((x) => Number(x.dataValues.month) === i + 1);
                        return {
                            total: result ? result.dataValues.total : "0",
                            month,
                            monthNumber: i,
                        };
                    });
                    return formattedResults;
                });
            }
            const [gananciasMensual, gananciasAnual, gananciasDiario, gananciasPrimerDay, gananciasAyer,] = yield Promise.all([
                orders_entity_1.Orders.unscoped().findOne({
                    attributes: [[sequelize_1.Sequelize.fn("SUM", sequelize_1.Sequelize.col("total")), "total"]],
                    where: Object.assign({ status_order_id: libs_1.STATUSORDER.entregado, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, "month")),
                }),
                orders_entity_1.Orders.unscoped().findOne({
                    attributes: [[sequelize_1.Sequelize.fn("SUM", sequelize_1.Sequelize.col("total")), "total"]],
                    where: Object.assign({ status_order_id: libs_1.STATUSORDER.entregado, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, "year")),
                }),
                orders_entity_1.Orders.unscoped().findOne({
                    attributes: [[sequelize_1.Sequelize.fn("SUM", sequelize_1.Sequelize.col("total")), "total"]],
                    where: Object.assign({ status_order_id: libs_1.STATUSORDER.entregado, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, "today")),
                }),
                orders_entity_1.Orders.unscoped().findOne({
                    attributes: [[sequelize_1.Sequelize.fn("SUM", sequelize_1.Sequelize.col("total")), "total"]],
                    where: {
                        status_order_id: libs_1.STATUSORDER.entregado,
                        empresa_id: empresa.id,
                    },
                }),
                orders_entity_1.Orders.unscoped().findOne({
                    attributes: [[sequelize_1.Sequelize.fn("SUM", sequelize_1.Sequelize.col("total")), "total"]],
                    where: Object.assign({ status_order_id: libs_1.STATUSORDER.entregado, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, "yesterday")),
                }),
            ]);
            const getYearMonthAmount = yield Promise.all(years.map((year) => __awaiter(this, void 0, void 0, function* () {
                const result = yield getTable(year);
                return {
                    year,
                    result,
                };
            })));
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
        });
    }
    deliverys(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const [deliverys, confirmado, pagados, problema] = yield Promise.all([
                orders_entity_1.Orders.count({
                    where: Object.assign({ isDelivery: true }, (0, index_1.sorteByTime)(empresa, "today")),
                }),
                orders_entity_1.Orders.count({
                    where: Object.assign(Object.assign({ isDelivery: true }, (0, index_1.sorteByTime)(empresa, "today")), { status_order_id: libs_1.STATUSORDER.confirmado, empresa_id: empresa.id }),
                }),
                orders_entity_1.Orders.count({
                    where: Object.assign(Object.assign({ isDelivery: true }, (0, index_1.sorteByTime)(empresa, "today")), { status_order_id: libs_1.STATUSORDER.entregado, empresa_id: empresa.id }),
                }),
                orders_entity_1.Orders.count({
                    where: Object.assign(Object.assign({ isDelivery: true }, (0, index_1.sorteByTime)(empresa, "today")), { status_order_id: libs_1.STATUSORDER.problema, empresa_id: empresa.id }),
                }),
            ]);
            return {
                success: true,
                count: { deliverys, confirmado, pagados, problema },
            };
        });
    }
    orders(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const [orders, confirmado, pagados, problema] = yield Promise.all([
                orders_entity_1.Orders.count({
                    where: Object.assign(Object.assign({}, (0, index_1.sorteByTime)(empresa, "today")), { isDelivery: false, empresa_id: empresa.id }),
                }),
                orders_entity_1.Orders.count({
                    where: Object.assign(Object.assign({}, (0, index_1.sorteByTime)(empresa, "today")), { status_order_id: libs_1.STATUSORDER.confirmado, isDelivery: false, empresa_id: empresa.id }),
                }),
                orders_entity_1.Orders.count({
                    where: Object.assign(Object.assign({}, (0, index_1.sorteByTime)(empresa, "today")), { status_order_id: libs_1.STATUSORDER.entregado, isDelivery: false, empresa_id: empresa.id }),
                }),
                orders_entity_1.Orders.count({
                    where: Object.assign(Object.assign({}, (0, index_1.sorteByTime)(empresa, "today")), { status_order_id: libs_1.STATUSORDER.problema, isDelivery: false, empresa_id: empresa.id }),
                }),
            ]);
            return {
                success: true,
                count: { orders, confirmado, pagados, problema },
            };
        });
    }
    facturationSystem(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const [facturas, boletas, notaCredito, notaDebito] = yield Promise.all([
                invoices_entity_1.Invoices.count({
                    where: Object.assign(Object.assign({ kind_invoice_code: "01" }, (0, index_1.sorteByTime)(empresa, "year")), { empresa_id: empresa.id }),
                }),
                invoices_entity_1.Invoices.count({
                    where: Object.assign(Object.assign({ kind_invoice_code: "03" }, (0, index_1.sorteByTime)(empresa, "year")), { empresa_id: empresa.id }),
                }),
                notes_entity_1.Notes.count({
                    where: Object.assign(Object.assign({ kind_invoice_code: "07" }, (0, index_1.sorteByTime)(empresa, "year")), { empresa_id: empresa.id }),
                }),
                notes_entity_1.Notes.count({
                    where: Object.assign(Object.assign({ kind_invoice_code: "08" }, (0, index_1.sorteByTime)(empresa, "year")), { empresa_id: empresa.id }),
                }),
            ]);
            return {
                success: true,
                count: { facturas, boletas, notaCredito, notaDebito },
            };
        });
    }
};
exports.AdminApiService = AdminApiService;
exports.AdminApiService = AdminApiService = __decorate([
    (0, express_core_1.Injectable)()
], AdminApiService);
