import { Crud } from "@/empresas/entities/crud.entity";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { Page } from "@/empresas/entities/page.entity";
import { InternalServerErrorException } from "@vigilio/express-core";
import { Op, QueryTypes, type WhereOptions } from "sequelize";
import { sequelize } from "~/config/db.config";
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
    | "finanzas"
    | "questions"
    | "emails";

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
    "questions",
    "emails",
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

export async function joins(crud: Crud, empresa: Empresas) {
    const [data] = await Promise.all(
        crud.data
            .filter((d) => d.type === "FOREIGNKEY")
            .map(async (d) => {
                const c = await Crud.findOne({
                    where: {
                        name: d.options.references,
                        empresa_id: empresa.id,
                    },
                });
                const attributes = [
                    ...(c || { data: [] }).data.filter(
                        (data) => data.type !== "TEXT"
                    ),
                    { name: "id" },
                    { name: "createdAt" },
                    { name: "updatedAt" },
                ].map(
                    (c) =>
                        `"${d.options.references}"."${c.name}" AS "${d.options.references}:${c.name}"`
                );
                return [
                    attributes,
                    `INNER JOIN "${d.options.references}" ON "${crud.name}"."${d.name}" = "${d.options.references}"."id"`,
                ];
            })
    );

    return data || ["", ""];
}
export function relation(data: object[]) {
    const final = data.map((result) => {
        const groupedResult = {};

        for (const key of Object.keys(result)) {
            const value = result[key as keyof typeof result];

            if (key.includes(":")) {
                const [mainKey, subKey] = key.split(":");

                if (!groupedResult[mainKey as keyof typeof groupedResult]) {
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    (groupedResult as any)[
                        mainKey as keyof typeof groupedResult
                    ] = {};
                }

                groupedResult[mainKey as keyof typeof groupedResult][subKey] =
                    value;
            } else {
                groupedResult[key as keyof typeof groupedResult] = value;
            }
        }

        return groupedResult;
    });
    return final;
}
export async function getQueries(
    empresa: Empresas,
    page: Page,
    data?: Record<string, unknown>
) {
    try {
        const regex = /:{{(.*?)}}/g;
        const q = await page.queries.reduce(async (accPromise, query) => {
            let q = query.query;
            const keys = {};

            if (data) {
                const nuevoTexto = query.query.replace(regex, (_, p1) => {
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    (keys as any)[p1] = data[p1]; // Crear el objeto con el texto extraído
                    return `:${p1}`; // Reemplazar el texto por ":jaja" o ":otro"
                });
                q = nuevoTexto;
            }

            const acc = await accPromise; // Espera el acumulador actual (promesa resuelta)
            const result = await sequelize.query(q, {
                replacements: { empresa_id: empresa.id, ...keys },
                type: QueryTypes.SELECT,
            });

            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (acc as any)[query.key as keyof typeof acc] =
                relation(result) ?? null; // Añade la clave y el valor procesado al objeto acumulado
            return acc;
        }, Promise.resolve({}));
        return q;
    } catch (error) {
        throw new InternalServerErrorException((error as Error).message);
    }
}
