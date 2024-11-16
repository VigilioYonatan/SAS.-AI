import type { Empresas } from "@/empresas/entities/empresas.entity";
import { Op, type WhereOptions } from "sequelize";
import { getTime } from "~/libs/dayjs";
export type PaginatorModel =
    | "users"
    | "products"
    | "categories"
    | "subcategories"
    | "brands"
    | "orders"
    | "orders-local"
    | "orders-delivery"
    | "orders_user"
    | "notifications"
    | "invoices"
    | "coupons"
    | "contacts"
    | "suppliers"
    | "favorites"
    | "posts"
    | "regions"
    | "urls"
    | "complaints"
    | "finanzas";

export const paginatorModel: PaginatorModel[] = [
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
];
export type TimeTable =
    | "all"
    | "year"
    | "month"
    | "week"
    | "today"
    | "yesterday";

/* Filtrar por hoy,este mes,semanal,anual, todo */
export function sorteByTime(empresa: Empresas, time: TimeTable) {
    const {
        startOfToday,
        endOfToday,
        startOfWeek,
        endOfWeek,
        startOfMonth,
        endOfMonth,
        startOfYear,
        endOfYear,
        startOfYesterday,
        endOfYesterday,
    } = getTime(empresa);
    let where: WhereOptions = {};

    if (time === "today") {
        where = {
            createdAt: {
                [Op.between]: [startOfToday, endOfToday],
            },
        };
    }
    if (time === "week") {
        where = {
            createdAt: {
                [Op.between]: [startOfWeek, endOfWeek],
            },
        };
    }
    if (time === "month") {
        where = {
            createdAt: {
                [Op.between]: [startOfMonth, endOfMonth],
            },
        };
    }
    if (time === "year") {
        where = {
            createdAt: {
                [Op.between]: [startOfYear, endOfYear],
            },
        };
    }
    if (time === "yesterday") {
        where = {
            createdAt: {
                [Op.between]: [startOfYesterday, endOfYesterday],
            },
        };
    }
    return where;
}
