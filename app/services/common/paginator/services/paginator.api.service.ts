import {
    BadRequestException,
    InternalServerErrorException,
    UnauthorizedException,
    Injectable,
    NotFoundException,
} from "@vigilio/express-core";
import { joins, relation, type PaginatorModel, type TimeTable } from "../libs";
import {
    Op,
    QueryTypes,
    type FindOptions,
    type Includeable,
    type Order,
    type WhereOptions,
} from "sequelize";
import { Users } from "@/users/entities/users.entity";
import { Orders } from "@/orders/entities/orders.entity";
import { Invoices } from "@/orders/entities/invoices.entity";
import { Coupons } from "@/products/entities/coupons.entity";
import { sequelize } from "~/config/db.config";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { sorteByTime } from "../libs/index";
import { Suppliers } from "@/suppliers/entities/suppliers.entity";
import { Posts } from "@/posts/entities/posts.entity";
import { Notes } from "@/orders/entities/notes.entity";
import { getOrder } from "@/orders/libs";
import type { Request } from "express";
import type { RequestVigilio } from "~/config/types";
import { Categories } from "@/products/entities/categories.entity";
import { getProductAll, Product, productEntityId } from "@/products/libs";
import { ProductsOptions } from "@/products/entities/options/products_options.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { Urls } from "@/urls/entities/urls.entity";
import { Brands } from "@/products/entities/brands.entitiy";
import { Regions } from "@/ubigeo/entities/regions.entity";
import { RegionsEmpresa } from "@/ubigeo/entities/regions_empresa.entity";
import { Countries } from "@/ubigeo/entities/countries.entity";
import { Complaints } from "@/empresas/entities/complaints.entity";
import { Finanzas } from "@/finanzas/entities/finanzas.entity";
import { Favorites } from "@/favorites/entities/favorites.entity";
import { Subcategories } from "@/products/entities/subcategories.entity";
import { Questions } from "@/empresas/entities/questions.entity";
import { Emails } from "@/emails/entities/emails.entity";
import { Crud } from "@/empresas/entities/crud.entity";

@Injectable()
export class PaginatorApiServices {
    async index(
        props: {
            model: PaginatorModel;
            query: {
                offset: string;
                limit: string;
                search: string;
            } & Record<string, string>;
            req: Request;
        },
        query?: string
    ) {
        const {
            limit = "20",
            offset = "0",
            search = "",
            ...rest
        } = props.query;
        const offsetConverted = Number(offset);
        const limitConverted = Number(limit);
        const empresa = (props.req as RequestVigilio).empresa!;
        let data = null;

        const searchLowerCase = `${search.toLowerCase()}%`;
        const user = props.req.user as Users;

        switch (props.model) {
            case "products": {
                const {
                    categoria = null,
                    min = null,
                    brand = null,
                    optionFeature = null,
                    discount = null,
                    type = null,
                    ...prod
                } = rest as {
                    categoria: string | null;
                    min: string;
                    brand: string | null;
                    optionFeature: string | null;
                    discount: string | null;
                    type: string | null;
                };

                let where: WhereOptions = {
                    name: {
                        [Op.iLike]: searchLowerCase,
                    },
                    discount: {
                        [Op.gte]: discount ?? 0,
                    },
                    empresa_id: empresa.id,
                };

                let include: Includeable[] = [];

                include = [
                    ...include,
                    {
                        model: Categories,
                        where: categoria
                            ? {
                                  slug: categoria,
                              }
                            : {},
                    },
                ];
                if (brand) {
                    include = [
                        ...include,
                        { model: Brands, where: brand ? { slug: brand } : {} },
                    ];
                }
                const price = "(price - (price * discount) / 100)";
                const subtotal = empresa.enabled_igv
                    ? `(${price} + (${price} * ${empresa.igv}) / 100)`
                    : `(${price})`;

                if (min) {
                    where = {
                        [Op.and]: [
                            sequelize.literal(`${subtotal} >= ${min}`),
                            where,
                        ],
                    };
                }

                if (
                    [1, 3].includes(empresa.tipo_empresa.tipo_servicio_id) &&
                    type !== "service"
                ) {
                    const productsOptions: FindOptions = {
                        where,
                        order: Object.entries(prod),
                        include,
                        offset: offsetConverted,
                        limit: limitConverted,
                    };

                    if (optionFeature) {
                        data = (await Promise.all([
                            ProductsOptions.findAll({
                                where: {
                                    option_id:
                                        JSON.parse(optionFeature).option_id,
                                    features: {
                                        [Op.contains]: [
                                            JSON.parse(optionFeature)
                                                .feature_id,
                                        ],
                                    },
                                },
                                include: [
                                    {
                                        model: ProductsNormal,
                                        as: "productsNormal",
                                        where, // Condiciones adicionales para el modelo Products
                                        include, // Otros modelos que deseas incluir en la consulta
                                        required: true, // Asegura que solo se devuelvan resultados con Product asociado
                                    },
                                ],
                                order: Object.entries(prod).map((value) => [
                                    {
                                        model: ProductsNormal,
                                        as: "productsNormal",
                                    },
                                    ...value,
                                ]) as Order,
                            }),

                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        ])) as any;
                        data[0] = await Promise.all(
                            data[0].map(
                                async (data: ProductsOptions) =>
                                    await getProductAll(
                                        empresa as Empresas,
                                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                        (data as any)
                                            .productsNormal as ProductsNormal,
                                        user,
                                        false
                                    )
                            )
                        );
                        data = [
                            data[0].slice(
                                offsetConverted,
                                offsetConverted + limitConverted
                            ),
                            data[0].length,
                        ];
                    } else {
                        data = await Promise.all([
                            ProductsNormal.findAll(productsOptions),
                            ProductsNormal.count({
                                where,
                                include,
                            }),
                        ]);

                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        (data as any)[0] = await Promise.all(
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                            data[0].map(async (product: any) => {
                                return await getProductAll(
                                    empresa as Empresas,
                                    product,
                                    user,
                                    false
                                );
                            })
                        );
                    }
                } else {
                    data = await Promise.all([
                        Product(empresa, type === "service").findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            where,
                            order: Object.entries(prod),
                            include,
                        }),
                        Product(empresa, type === "service").count({
                            where,
                            include,
                        }),
                    ]);
                    data[0] = await Promise.all(
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        data[0].map(async (product: any) => {
                            const producto = await getProductAll(
                                empresa as Empresas,
                                product,
                                user,
                                false
                            );

                            return producto;
                        })
                    );
                }

                break;
            }
            case "brands":
                data = await Promise.all([
                    Brands.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        where: {
                            empresa_id: empresa.id,
                            name: {
                                [Op.iLike]: searchLowerCase,
                            },
                        },
                        order: Object.entries(rest),
                    }),
                    Brands.count({
                        where: {
                            empresa_id: empresa.id,
                            name: {
                                [Op.iLike]: searchLowerCase,
                            },
                        },
                    }),
                ]);
                break;
            case "questions":
                data = await Promise.all([
                    Questions.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        where: {
                            empresa_id: empresa.id,
                            question: {
                                [Op.iLike]: searchLowerCase,
                            },
                        },
                        order: Object.entries(rest),
                    }),
                    Questions.count({
                        where: {
                            empresa_id: empresa.id,
                            question: {
                                [Op.iLike]: searchLowerCase,
                            },
                        },
                    }),
                ]);
                break;

            case "categories": {
                const { type, ...cat } = rest as { type: string };
                data = await Promise.all([
                    Categories.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        where: {
                            empresa_id: empresa.id,
                            name: {
                                [Op.iLike]: searchLowerCase,
                            },
                            isService: type === "service",
                        },
                        order: Object.entries(cat),
                    }),
                    Categories.count({
                        where: {
                            empresa_id: empresa.id,
                            name: {
                                [Op.iLike]: searchLowerCase,
                            },
                            isService: type === "service",
                        },
                    }),
                ]);
                break;
            }
            case "subcategories":
                data = await Promise.all([
                    Subcategories.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(rest),
                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                    Subcategories.count({
                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                ]);
                break;
            case "users":
                {
                    if (
                        !user ||
                        !user.enabled ||
                        ![1, 2].includes(user.role_id)
                    )
                        throw new UnauthorizedException(
                            "No permiso para esta acción"
                        );
                    const { role_id, ...userrest } = rest;
                    let where: WhereOptions = {
                        username: {
                            [Op.iLike]: searchLowerCase,
                        },
                        empresa_id: empresa.id,
                    };
                    if (role_id) {
                        where = { ...where, role_id };
                    }
                    data = await Promise.all([
                        Users.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            where,
                            order: Object.entries(userrest),
                        }),
                        Users.count({
                            where,
                        }),
                    ]);
                }

                break;

            case "orders": {
                if (!user || !user.enabled || ![1, 2].includes(user.role_id))
                    throw new UnauthorizedException(
                        "No permiso para esta acción"
                    );
                const { time, ...orders } = rest as { time: TimeTable };
                data = await Promise.all([
                    Orders.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(orders),
                        where: {
                            ...sorteByTime(empresa, time),
                            empresa_id: empresa.id,
                        },
                    }),
                    Orders.count({
                        where: {
                            ...sorteByTime(empresa, time),
                            empresa_id: empresa.id,
                        },
                    }),
                ]);

                data[0] = await Promise.all(
                    data[0].map(async (ord) => {
                        const order = await getOrder(
                            empresa as Empresas,
                            ord,
                            false
                        );
                        return order;
                    })
                );

                break;
            }
            case "emails": {
                if (!user || !user.enabled || ![1].includes(user.role_id))
                    throw new UnauthorizedException("No authorizado");
                data = await Promise.all([
                    Emails.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(rest),
                    }),
                    Emails.count({}),
                ]);
                break;
            }
            case "orders-local": {
                if (!user || !user.enabled || ![1, 2, 3].includes(user.role_id))
                    throw new UnauthorizedException(
                        "No permiso para esta acción"
                    );
                const { time, ...orders } = rest as { time: TimeTable };
                data = await Promise.all([
                    Orders.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(orders),
                        where: {
                            isDelivery: false,
                            empresa_id: empresa.id,
                            ...sorteByTime(empresa, time),
                        },
                    }),
                    Orders.count({
                        where: {
                            isDelivery: false,
                            empresa_id: empresa.id,
                            ...sorteByTime(empresa, time),
                        },
                    }),
                ]);
                data[0] = await Promise.all(
                    data[0].map(async (ord) => {
                        const order = await getOrder(
                            empresa as Empresas,
                            ord,
                            false
                        );
                        return order;
                    })
                );
                break;
            }
            case "orders-delivery": {
                if (!user || !user.enabled || ![1, 2, 3].includes(user.role_id))
                    throw new UnauthorizedException(
                        "No permiso para esta acción"
                    );
                const { time, ...orders } = rest as { time: TimeTable };
                data = await Promise.all([
                    Orders.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(orders),
                        where: {
                            isDelivery: true,
                            empresa_id: empresa.id,
                            ...sorteByTime(empresa, time),
                        },
                    }),
                    Orders.count({
                        where: {
                            isDelivery: true,
                            empresa_id: empresa.id,
                            ...sorteByTime(empresa, time),
                        },
                    }),
                ]);

                data[0] = await Promise.all(
                    data[0].map(async (ord) => {
                        const order = await getOrder(
                            empresa as Empresas,
                            ord,
                            false
                        );
                        return order;
                    })
                );

                break;
            }
            case "orders_user": {
                if (!user || !user.enabled)
                    throw new UnauthorizedException(
                        "No permiso para esta acción"
                    );
                const { time, ...orders } = rest as { time: TimeTable };
                data = await Promise.all([
                    Orders.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(orders),
                        where: {
                            user_id: user.id,
                            empresa_id: empresa.id,
                            ...sorteByTime(empresa, time),
                        },
                    }),
                    Orders.count({
                        where: {
                            user_id: user.id,
                            empresa_id: empresa.id,
                            ...sorteByTime(empresa, time),
                        },
                    }),
                ]);
                data[0] = await Promise.all(
                    data[0].map(async (ord) => {
                        const order = await getOrder(
                            empresa as Empresas,
                            ord,
                            false
                        );
                        return order;
                    })
                );
                break;
            }
            case "invoices": {
                if (!user || !user.enabled || ![1].includes(user.role_id))
                    throw new UnauthorizedException(
                        "No permiso para esta acción"
                    );
                const { kind_invoice_code, time, ...invoices } = rest as {
                    kind_invoice_code: string; // is required kind_invoice_code
                    time: TimeTable;
                };
                data = await Promise.all(
                    kind_invoice_code === "01" || kind_invoice_code === "03"
                        ? [
                              Orders.findAll({
                                  offset: offsetConverted,
                                  limit: limitConverted,
                                  include: [
                                      {
                                          model: Invoices,
                                          where: {
                                              kind_invoice_code:
                                                  kind_invoice_code ?? "01", //facturas
                                          },
                                          ...sorteByTime(empresa, time),
                                      },
                                  ],
                                  order: Object.entries(invoices),
                                  where: {
                                      empresa_id: empresa.id,
                                  },
                              }),
                              Orders.count({
                                  include: [
                                      {
                                          model: Invoices,
                                          where: {
                                              kind_invoice_code:
                                                  kind_invoice_code ?? "01", //facturas
                                          },
                                          ...sorteByTime(empresa, time),
                                      },
                                  ],
                                  where: {
                                      empresa_id: empresa.id,
                                  },
                              }),
                          ]
                        : [
                              Orders.findAll({
                                  offset: offsetConverted,
                                  limit: limitConverted,
                                  include: [
                                      {
                                          model: Notes,
                                          where: {
                                              kind_invoice_code:
                                                  kind_invoice_code ?? "07", //nota
                                          },
                                          ...sorteByTime(empresa, time),
                                      },
                                  ],
                                  order: Object.entries(invoices),
                                  where: {
                                      empresa_id: empresa.id,
                                  },
                              }),
                              Orders.count({
                                  include: [
                                      {
                                          model: Notes,
                                          where: {
                                              kind_invoice_code:
                                                  kind_invoice_code ?? "07", //nota
                                          },
                                          ...sorteByTime(empresa, time),
                                      },
                                  ],
                                  where: {
                                      empresa_id: empresa.id,
                                  },
                              }),
                          ]
                );
                data[0] = await Promise.all(
                    data[0].map(async (order) => {
                        const ord = await getOrder(
                            empresa as Empresas,
                            order,
                            false
                        );
                        return ord;
                    })
                );
                break;
            }
            case "coupons": {
                if (!user || !user.enabled || ![1].includes(user.role_id))
                    throw new UnauthorizedException(
                        "No permiso para esta acción"
                    );
                const { kind_invoice_code, time, ...coupons } = rest as {
                    kind_invoice_code: string; // is required kind_invoice_code
                    time: TimeTable;
                };
                data = await Promise.all([
                    Coupons.findAll({
                        order: Object.entries(coupons),
                        where: {
                            coupon: {
                                [Op.iLike]: searchLowerCase,
                                ...sorteByTime(empresa, time),
                            },
                            empresa_id: empresa.id,
                        },
                    }),
                    Coupons.count({
                        where: {
                            coupon: {
                                [Op.iLike]: searchLowerCase,
                                ...sorteByTime(empresa, time),
                            },
                            empresa_id: empresa.id,
                        },
                    }),
                ]);
                break;
            }
            case "notifications": {
                if (!user || !user.enabled)
                    throw new UnauthorizedException(
                        "No permiso para esta acción"
                    );
                const notifications = await user.$get("notificationsusers", {
                    offset: offsetConverted,
                    limit: limitConverted,
                    order: [["createdAt", "DESC"]],
                });
                data = [notifications, notifications.length];

                break;
            }
            case "contacts": {
                if (!user || !user.enabled || ![1].includes(user.role_id))
                    throw new UnauthorizedException("No authorizado");
                const { isFavorite } = rest as {
                    isFavorite: string; // is required kind_invoice_code
                };
                const emp = await Empresas.findByPk(empresa.id, {
                    attributes: ["contacts"],
                })!;
                if (!emp) throw new BadRequestException("Hubo un problema");
                const findByNameContacts = emp.contacts.filter(
                    (contact) =>
                        (contact.name ?? "")
                            .toLowerCase()
                            .startsWith(search.toLowerCase()) ||
                        (contact.telephone.toLowerCase() ?? "")
                            .toLowerCase()
                            .includes(search.toLowerCase())
                );
                data = [
                    findByNameContacts
                        .sort((a, b) => {
                            if (isFavorite === "ASC") {
                                if (a.isFavorite === b.isFavorite) {
                                    return 0;
                                }
                                if (a.isFavorite) {
                                    return 1;
                                }
                                return -1;
                            }
                            // ASC
                            if (a.isFavorite === b.isFavorite) {
                                return 0;
                            }
                            if (a.isFavorite) {
                                return -1;
                            }
                            return 1;
                        })
                        .slice(
                            offsetConverted,
                            offsetConverted + limitConverted
                        ),
                    findByNameContacts.length,
                ];

                break;
            }

            case "suppliers": {
                if (!user || !user.enabled || ![1].includes(user.role_id))
                    throw new UnauthorizedException("No authorizado");
                data = await Promise.all([
                    Suppliers.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(rest),
                        where: {
                            ruc: {
                                [Op.iLike]: searchLowerCase,
                            },
                            empresa_id: empresa.id,
                        },
                    }),
                    Suppliers.count({
                        where: {
                            ruc: {
                                [Op.iLike]: searchLowerCase,
                            },
                            empresa_id: empresa.id,
                        },
                    }),
                ]);
                break;
            }
            case "complaints": {
                data = await Promise.all([
                    Complaints.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(rest),
                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                    Complaints.count({
                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                ]);

                break;
            }
            case "posts": {
                if (!user || !user.enabled || ![1].includes(user.role_id))
                    throw new UnauthorizedException("No authorizado");
                data = await Promise.all([
                    Posts.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(rest),
                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                    Posts.count({
                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                ]);
                break;
            }

            case "regions": {
                data = await Promise.all([
                    Regions.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(rest),
                        include: [
                            {
                                model: Countries,
                                where: {
                                    code: empresa.dial_code,
                                },
                                required: true,
                                attributes: ["code"],
                            },
                        ],
                    }),
                    Regions.count({
                        include: [
                            {
                                model: Countries,
                                where: {
                                    code: empresa.dial_code,
                                },
                                required: true,
                            },
                        ],
                    }),
                ]);
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (data as any)[0] = await Promise.all(
                    data[0].map(async (data) => {
                        const regionsEmpresa = await RegionsEmpresa.findOne({
                            where: {
                                empresa_id: empresa.id,
                                region_id: data.id,
                            },
                        });
                        return {
                            ...data.toJSON(),
                            priceShipping: regionsEmpresa?.priceShipping,
                            enabled: regionsEmpresa?.enabled,
                            days: regionsEmpresa?.days,
                        };
                    })
                );
                break;
            }
            case "urls": {
                if (!user) throw new UnauthorizedException("No authorizado");
                data = await Promise.all([
                    Urls.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(rest),

                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                    Urls.count({
                        where: {
                            empresa_id: empresa.id,
                        },
                    }),
                ]);
                break;
            }

            case "finanzas": {
                if (!user || user.role_id !== 1)
                    throw new UnauthorizedException("No authorizado");
                const { time, ...finanzas } = rest as {
                    time: TimeTable;
                };

                data = await Promise.all([
                    Finanzas.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(finanzas),
                        where: {
                            empresa_id: empresa.id,
                            ...sorteByTime(empresa, time),
                        },
                    }),
                    Finanzas.count({
                        where: {
                            empresa_id: empresa.id,
                            ...sorteByTime(empresa, time),
                        },
                    }),
                ]);
                break;
            }
            case "favorites": {
                if (!user) throw new UnauthorizedException("No authorizado");
                data = await Promise.all([
                    Favorites.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(rest),
                        where: { user_id: user.id },
                    }),
                    Favorites.count({ where: { user_id: user.id } }),
                ]);

                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (data as any[])[0] = await Promise.all(
                    data[0].map(async (favorite) => {
                        const product = await Product(
                            empresa,
                            !!favorite.product_servicio_id
                        ).findByPk(
                            favorite[
                                productEntityId(
                                    empresa,
                                    !!favorite.product_servicio_id
                                ) as keyof typeof favorite
                            ]
                        );
                        if (!product)
                            throw new NotFoundException("no found product");
                        return await getProductAll(
                            empresa,
                            product,
                            user,
                            false
                        );
                    })
                );
                break;
            }

            default: {
                const crud = await Crud.findOne({
                    where: {
                        name: props.model,
                        empresa_id: empresa.id,
                    },
                });
                if (crud) {
                    const { page, offset, limit, ...prod } = rest as {
                        page: string | null;
                        offset: string;
                        limit: string | null;
                    };

                    const [attributes, join] = await joins(crud, empresa);
                    const result = Object.entries(prod).reduce(
                        (acc, [key, value]) => {
                            if (
                                (value as string).toUpperCase() === "ASC" ||
                                (value as string).toUpperCase() === "DESC"
                            ) {
                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                (acc as any).sorted[key] = value;
                            } else {
                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                (acc as any).rest[key] = value;
                            }
                            return acc;
                        },
                        { sorted: {}, rest: {} } // Objetos separados
                    );
                    const orders = Object.entries(result.sorted).map(
                        ([key, value]) =>
                            `"${props.model}"."${key}" ${(
                                value as string
                            ).toUpperCase()}`
                    );

                    const wheres = Object.entries(result.rest).map(
                        ([key, value]) =>
                            `AND "${props.model}"."${key}" = '${(
                                value as string
                            ).toUpperCase()}'`
                    );
                    try {
                        data = await Promise.all([
                            sequelize.query(
                                query
                                    ? `${query} ${
                                          search?.length
                                              ? `AND "${crud.name}"."name" ILIKE '${searchLowerCase}'`
                                              : ""
                                      } ${wheres.length ? wheres.join(" ") : ""}
                                 ${
                                     orders.length
                                         ? `ORDER BY ${orders.join(", ")}`
                                         : ""
                                 } 
                                OFFSET :offset LIMIT :limit`
                                    : `SELECT  "${crud.name}".* ${
                                          attributes?.length
                                              ? `, ${attributes}`
                                              : ""
                                      } FROM "${crud.name}" ${join}
                                WHERE "${
                                    crud.name
                                }"."empresa_id" = :empresa_id ${
                                          search?.length
                                              ? `AND "${crud.name}"."name" ILIKE '${searchLowerCase}'`
                                              : ""
                                      } ${wheres.length ? wheres.join(" ") : ""}
                                 ${
                                     orders.length
                                         ? `ORDER BY ${orders.join(", ")}`
                                         : ""
                                 } 
                                OFFSET :offset LIMIT :limit`,
                                {
                                    replacements: {
                                        empresa_id: empresa.id,
                                        offset: offsetConverted,
                                        limit: limitConverted,
                                    },
                                    type: QueryTypes.SELECT,
                                }
                            ),
                            sequelize.query(
                                `SELECT COUNT(*) FROM "${crud.name}" 
                                WHERE "${
                                    crud.name
                                }"."empresa_id" = :empresa_id ${
                                    search?.length
                                        ? `AND "${crud.name}"."name" ILIKE '${searchLowerCase}'`
                                        : ""
                                } ${wheres.length ? wheres.join(" ") : ""}`,
                                {
                                    replacements: {
                                        empresa_id: empresa.id,
                                    },
                                    type: QueryTypes.SELECT,
                                }
                            ),
                        ]);
                    } catch (error) {
                        throw new BadRequestException(
                            `error ${(error as Error).message}`
                        );
                    }

                    data = [
                        relation(data[0]),
                        Number((data[1][0] as { count: string }).count || "0"),
                    ];
                } else {
                    throw new InternalServerErrorException(
                        "Comunicarse con el desarrollador "
                    );
                }
            }
        }
        const next = `/api/paginator/${props.model}?offset=${
            offsetConverted + limitConverted
        }&limit=${limitConverted}`;
        const offsetTotal = offsetConverted - limitConverted;
        const back = `/api/paginator/${props.model}?offset=${offsetTotal}&limit=${limitConverted}`;

        return {
            success: true,
            count: data[1],
            next,
            previous: offsetTotal >= 0 ? back : null,
            results: data[0],
        };
    }
}
