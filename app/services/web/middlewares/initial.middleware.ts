import { formatMoney, subtotal } from "@/cart/libs/helpers";
import { Citas } from "@/citas/entities/citas.entities";
import { Crud } from "@/empresas/entities/crud.entity";
import { MetodosPago } from "@/empresas/entities/metodosPago.entity";
import { Page } from "@/empresas/entities/page.entity";
import { Questions } from "@/empresas/entities/questions.entity";
import { Money, MONEYLOCAL } from "@/empresas/libs";
import { Favorites } from "@/favorites/entities/favorites.entity";
import { Brands } from "@/products/entities/brands.entitiy";
import { Categories } from "@/products/entities/categories.entity";
import { printImagesProduct, Product } from "@/products/libs";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { Users } from "@/users/entities/users.entity";
import { NextFunction } from "@vigilio/express-core";
import cache from "@vigilio/express-core/cache";
import { Request, Response } from "express";
import { Op, Sequelize } from "sequelize";
import { sequelize } from "~/config/db.config";
import { RequestVigilio } from "~/config/types";
import { converterMoneyApi } from "~/libs/apis";
import { NOW } from "~/libs/dayjs";
import { getTables } from "~/libs/helpers";

export async function initialMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
) {
    const empresa = (req as RequestVigilio).empresa;
    if (!req.originalUrl.includes("/admin")) {
        const [categories, categoriesService, totalProducts, brands] =
            await Promise.all([
                empresa.setting.isEccomerce
                    ? Categories.findAll({
                          where: {
                              empresa_id: empresa.id,
                              isService: false,
                          },
                      })
                    : [],

                Categories.findAll({
                    where: {
                        empresa_id: empresa.id,
                        isService: true,
                    },
                }),
                empresa.setting.isEccomerce
                    ? Product(empresa, false).count()
                    : 0,
                empresa.setting.isEccomerce
                    ? Brands.findAll({
                          where: {
                              empresa_id: empresa.id,
                          },
                          attributes: [
                              "id",
                              "name",
                              "image",
                              "empresa_id",
                              "slug",
                          ],
                      })
                    : [],
            ]);
        const categoriasTotal = await Promise.all(
            categories.map(async (category) => {
                // productnormal
                const [product, subcategories] = await Promise.all([
                    Product(empresa, false).findOne({
                        order: [["createdAt", "DESC"]],
                        where: {
                            enabled: true,
                            category_id: category.id,
                            empresa_id: empresa.id,
                        },
                    }),
                    category.$get("subcategories"),
                ]);
                return {
                    ...category.toJSON(),
                    productNew: product,
                    subcategories,
                };
            })
        );
        const categoriesServiceTotal = await Promise.all(
            categoriesService.map(async (category) => {
                // productsServicios
                const products = await category.$get("productsServicios", {
                    attributes: [
                        "id",
                        "name",
                        [
                            Sequelize.fn(
                                "LEFT",
                                Sequelize.col("description"),
                                300
                            ),
                            "description",
                        ],
                        "product_code",
                        "url",
                        "days",
                        "showHorario",
                        "characteristics",
                        "price",
                        "discount",
                        "enabled",
                        "images",
                        "slug",
                        "category_id",
                    ],
                });
                return {
                    ...category.toJSON(),
                    products,
                };
            })
        );

        res.locals.header = {
            categories: categoriasTotal,
            categoriesServices: categoriesServiceTotal,
            brands,
            totalProducts,
        };
    }
    let citas = JSON.parse(cache.get(`${empresa.slug}:citas`) ?? "null");
    let questionCount: number | null = JSON.parse(
        cache.get(`${empresa.slug}:questions-count`) ?? "null"
    );

    let tableObjects: unknown[] = JSON.parse(
        cache.get(`${empresa.slug}:TABLE`) || "null"
    );

    if (req.originalUrl.includes("/admin")) {
        if (!tableObjects) {
            // tablas
            const [tables] = await getTables();

            const tableobj = [];

            for (const table of tables as { table_name: string }[]) {
                const [columns] = await sequelize.query(
                    `SELECT column_name, data_type, is_nullable  FROM information_schema.columns WHERE table_schema = 'public' AND table_name = :tableName;`,
                    { replacements: { tableName: table.table_name } }
                );
                tableobj.push({
                    name: table.table_name,
                    data: (
                        columns as {
                            column_name: string;
                            data_type: string;
                            is_nullable: string;
                        }[]
                    ).map((col) => ({
                        name: col.column_name,
                        type: col.data_type,
                        is_nullable: col.is_nullable === "YES",
                    })),
                });
            }
            tableObjects = tableobj;
            cache.set(`${empresa.slug}:TABLE`, JSON.stringify(tableobj));
        }

        // citas
        const day = NOW(empresa);
        if (!questionCount) {
            questionCount = await Questions.count({
                where: {
                    empresa_id: empresa.id,
                    answer: null,
                },
            });

            cache.set(
                `${empresa.slug}:questions-count`,
                JSON.stringify(questionCount)
            );
        }

        const dias = day.daysInMonth();

        if (!citas) {
            const cites = await Promise.all(
                Array.from({ length: dias }).map(async (_, i) => {
                    const startOfDay = day
                        .date(i + 1)
                        .startOf("day")
                        .utc()
                        .format();
                    const endOfDay = day
                        .date(i + 1)
                        .endOf("day")
                        .utc()
                        .format();
                    const qty = await Citas.unscoped().count({
                        where: {
                            empresa_id: empresa.id,
                            date: {
                                [Op.between]: [startOfDay, endOfDay],
                            },
                        },
                    });
                    return [i + 1, qty];
                })
            );
            citas = cites.reduce((acc, [key, value]) => {
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (acc as any)[key] = value;
                return acc;
            }, {});
            cache.set(
                `${empresa.slug}:citas`,
                JSON.stringify(citas),
                1 * 60 * 60 * 1000
            );
        }
    }
    const certificado =
        req.originalUrl.startsWith("/admin") && empresa?.company
            ? { certificado: empresa?.certificado }
            : {
                  certificado: null,
              };
    const [pages, cruds] = await Promise.all([
        Page.findAll({
            where: { empresa_id: empresa.id }, // biometria
            attributes: [
                "id",
                "title",
                "description",
                "icon",
                "slug",
                "queries",
                "isDinamic",
                "enabledHeaderPage",
            ],
            order: [["id", "ASC"]],
        }),
        Crud.findAll({
            where: {
                empresa_id: empresa.id,
            },
            attributes: ["id", "name", "slug", "icon"],
        }),
    ]);

    const info = {
        ...empresa,
        citas,
        questionCount,
        whatsapp_mode: req.originalUrl.startsWith("/admin")
            ? empresa.whatsapp_mode
            : [],
        company: {
            ruc: empresa.company?.ruc,
            razonSocial: empresa.company?.razonSocial,
            nombreComercial: empresa.company?.nombreComercial,
            production: empresa.company?.production,
        },
        metodos_pago: {
            ...(empresa.metodos_pago as MetodosPago),
            transferencias: (empresa.metodos_pago as MetodosPago)
                .transferencias,
            paypal: {
                enabled: (empresa.metodos_pago as MetodosPago).paypal.enabled,
            },
            mercado_pago: {
                enabled: (empresa.metodos_pago as MetodosPago).mercado_pago
                    .enabled,
            },
            izipay: {
                enabled: (empresa.metodos_pago as MetodosPago).izipay.enabled,
                izipay_public_key: (empresa.metodos_pago as MetodosPago).izipay
                    .izipay_public_key,
            },
            stripe: {
                enabled: (empresa.metodos_pago as MetodosPago).stripe.enabled,
            },
        },
        pages,
        cruds,
        tableObjects,
        contacts: [],
        ...certificado,
    };
    let MONEY: {
        money: Money;
        moneyValue: Record<Money, number>;
    } = { money: "LOCAL", moneyValue: { DOLARES: 1, LOCAL: 1 } };
    if (!empresa?.isDolar) {
        const cookie = req.cookies.money ?? MONEYLOCAL;
        let DOLARES = JSON.parse(cache.get(`money:${empresa.slug}`) ?? "null");
        if (!DOLARES) {
            const response = await converterMoneyApi({
                amount: "1",
                from: empresa.money.simbolo,
                to: "USD",
            });

            DOLARES = Number.parseFloat(response.result.resultadoNumber);
            const hours24 = 60 * 1000 * 60 * 24;
            cache.set(
                `money:${empresa.slug}`,
                JSON.stringify(DOLARES),
                hours24
            ); // cada dia se actualizará el cambio de dolar
        }

        MONEY = {
            ...MONEY,
            money: cookie,
            moneyValue: { DOLARES, LOCAL: 1 },
        };
    }
    res.locals.$empresa = info;

    res.locals.printFileWithDimension = printFileWithDimension(empresa);
    res.locals.subtotal = subtotal;
    res.locals.formatMoney = (number: number) =>
        formatMoney(
            empresa,
            number,
            empresa.money.international_simbolo as Money
        );
    res.locals.printImagesProduct = printImagesProduct(empresa);
    res.locals.$money = MONEY;
    res.locals.$moneyConverter = MONEY.moneyValue[MONEY.money];
    // aca
    // si no existe req.user que sea nulo
    const user = (req.user ?? null) as Users;

    res.locals.$user = user;
    (req as RequestVigilio).money = MONEY;
    (req as RequestVigilio).moneyConverter = MONEY.moneyValue[MONEY.money];
    (req as RequestVigilio).user = user;

    const host = req.headers.host?.slice(4);
    if (user) {
        const [favorites] = await Promise.all([
            Favorites.count({
                where: {
                    user_id: user.id,
                    empresa_id: empresa.id,
                },
            }),
        ]);
        user.dataValues.products_favorites_length = favorites;
    }
    next();
}
