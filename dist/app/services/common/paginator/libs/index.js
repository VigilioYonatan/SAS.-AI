"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginatorModel = void 0;
exports.sorteByTime = sorteByTime;
const sequelize_1 = require("sequelize");
const dayjs_1 = require("~/libs/dayjs");
exports.paginatorModel = [
    "products",
    "users",
    "brands",
    "categories",
    "orders",
    "orders-local",
    "orders-delivery",
    "notifications",
    "invoices",
    "coupons",
    "contacts",
    "suppliers",
    "posts",
    "orders_user",
    "regions",
    "urls",
    "complaints",
    "finanzas",
    "favorites",
    "subcategories",
    "questions",
    "emails",
];
function sorteByTime(empresa, time) {
    const { startOfToday, endOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, startOfYesterday, endOfYesterday, } = (0, dayjs_1.getTime)(empresa);
    let where = {};
    if (time === "today") {
        where = {
            createdAt: {
                [sequelize_1.Op.between]: [startOfToday, endOfToday],
            },
        };
    }
    if (time === "week") {
        where = {
            createdAt: {
                [sequelize_1.Op.between]: [startOfWeek, endOfWeek],
            },
        };
    }
    if (time === "month") {
        where = {
            createdAt: {
                [sequelize_1.Op.between]: [startOfMonth, endOfMonth],
            },
        };
    }
    if (time === "year") {
        where = {
            createdAt: {
                [sequelize_1.Op.between]: [startOfYear, endOfYear],
            },
        };
    }
    if (time === "yesterday") {
        where = {
            createdAt: {
                [sequelize_1.Op.between]: [startOfYesterday, endOfYesterday],
            },
        };
    }
    return where;
}
