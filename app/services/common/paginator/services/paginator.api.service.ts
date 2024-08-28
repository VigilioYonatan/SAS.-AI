import {
    BadRequestException,
    InternalServerErrorException,
    UnauthorizedException,
    Injectable,
} from "@vigilio/express-core";
import { type PaginatorModel, type TimeTable } from "../libs";
import {
    Op,
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
import { InformationEntity } from "@/information/entities/information.entity";
import { sorteByTime } from "../libs/index";
import { Suppliers } from "@/suppliers/entities/suppliers.entity";
import { Posts } from "@/posts/entities/posts.entity";
import { Notes } from "@/orders/entities/notes.entity";
import { getOrder } from "@/orders/libs";
import type { Request } from "express";
import type { RequestVigilio } from "~/config/types";
import { Categories } from "@/products/entities/categories.entity";
import { getProductAll, productEntity } from "@/products/libs";
import { ProductsOptions } from "@/products/entities/options/products_options.entity";
import { ProductsNormal } from "@/products/entities/products_normal.entity";
import { Urls } from "@/urls/entities/urls.entity";
import { Brands } from "@/products/entities/brands.entitiy";
import { Regions } from "@/ubigeo/entities/regions.entity";

@Injectable()
export class PaginatorApiServices {
    async index(props: {
        model: PaginatorModel;
        query: {
            offset: string;
            limit: string;
            search: string;
        } & Record<string, string>;
        req: Request;
    }) {
        const {
            limit = "20",
            offset = "0",
            search = "",
            ...rest
        } = props.query;
        const offsetConverted = Number(offset);
        const limitConverted = Number(limit);
        const information = (props.req as RequestVigilio).information!;
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
                    estado = null,
                    discount = null,
                    ...prod
                } = rest as {
                    categoria: string | null;
                    min: string;
                    brand: string | null;
                    optionFeature: string | null;
                    estado: string | null;
                    discount: string | null;
                };
                let where: WhereOptions = {
                    name: {
                        [Op.iLike]: searchLowerCase,
                    },
                    discount: {
                        [Op.gte]: discount ?? 0,
                    },
                    information_id: information.id,
                };
                if (estado && information.tipo_empresa) {
                    where = { ...where, isNew: estado === "nuevo" };
                }

                const include: Includeable[] = [
                    {
                        include: [
                            {
                                model: Categories,
                                where: categoria
                                    ? {
                                          slug: categoria,
                                      }
                                    : {},
                            },
                        ],
                    },
                    { where: brand ? { slug: brand } : {} },
                ];
                const price = "(price - (price * discount) / 100)";
                const subtotal = information.enabled_igv
                    ? `(${price} + (${price} * ${information.igv}) / 100)`
                    : `(${price})`;

                if (min) {
                    where = {
                        [Op.and]: [
                            sequelize.literal(`${subtotal} >= ${min}`),
                            where,
                        ],
                    };
                }

                if (information.type_empresa_id === 1) {
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
                                        as: "product",
                                        where, // Condiciones adicionales para el modelo Products
                                        include, // Otros modelos que deseas incluir en la consulta
                                        required: true, // Asegura que solo se devuelvan resultados con Product asociado
                                    },
                                ],
                                order: Object.entries(prod).map((value) => [
                                    { model: ProductsNormal, as: "product" },
                                    ...value,
                                ]) as Order,
                            }),

                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        ])) as any;
                        data[0] = await Promise.all(
                            data[0].map(
                                async (data: ProductsOptions) =>
                                    await getProductAll(
                                        information as InformationEntity,
                                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                        (data as any).product as ProductsNormal
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
                        data[0] = (await Promise.all(
                            data[0].map(async (product) => {
                                return await getProductAll(
                                    information as InformationEntity,
                                    product
                                );
                            })
                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        )) as any;
                    }
                } else {
                    const Product = productEntity(
                        information.tipo_empresa.tipo_servicio_id
                    );
                    data = await Promise.all([
                        Product.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            where,
                            order: Object.entries(prod),
                            include,
                        }),
                        Product.count({
                            where,
                            include,
                        }),
                    ]);
                    data[0] = await Promise.all(
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        data[0].map(async (product: any) => {
                            return await getProductAll(
                                information as InformationEntity,
                                product
                            );
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
                            information_id: information.id,
                            name: {
                                [Op.iLike]: searchLowerCase,
                            },
                        },
                        order: Object.entries(rest),
                    }),
                    Brands.count({
                        where: {
                            information_id: information.id,
                            name: {
                                [Op.iLike]: searchLowerCase,
                            },
                        },
                    }),
                ]);
                break;

            case "categories":
                data = await Promise.all([
                    Categories.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        where: {
                            information_id: information.id,
                            name: {
                                [Op.iLike]: searchLowerCase,
                            },
                        },
                        order: Object.entries(rest),
                    }),
                    Categories.count({
                        where: {
                            information_id: information.id,
                            name: {
                                [Op.iLike]: searchLowerCase,
                            },
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
                        information_id: information.id,
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
                            ...sorteByTime(time),
                            information_id: information.id,
                        },
                    }),
                    Orders.count({
                        where: {
                            ...sorteByTime(time),
                            information_id: information.id,
                        },
                    }),
                ]);
                data[0] = await Promise.all(
                    data[0].map(async (ord) => {
                        const order = await getOrder(
                            information as InformationEntity,
                            ord,
                            false
                        );
                        return order;
                    })
                );

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
                            information_id: information.id,
                            ...sorteByTime(time),
                        },
                    }),
                    Orders.count({
                        where: {
                            isDelivery: false,
                            information_id: information.id,
                            ...sorteByTime(time),
                        },
                    }),
                ]);
                data[0] = await Promise.all(
                    data[0].map(async (ord) => {
                        const order = await getOrder(
                            information as InformationEntity,
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
                            information_id: information.id,
                            ...sorteByTime(time),
                        },
                    }),
                    Orders.count({
                        where: {
                            isDelivery: true,
                            information_id: information.id,
                            ...sorteByTime(time),
                        },
                    }),
                ]);
                data[0] = await Promise.all(
                    data[0].map(async (ord) => {
                        const order = await getOrder(
                            information as InformationEntity,
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
                            information_id: information.id,
                            ...sorteByTime(time),
                        },
                    }),
                    Orders.count({
                        where: {
                            user_id: user.id,
                            information_id: information.id,
                            ...sorteByTime(time),
                        },
                    }),
                ]);
                data[0] = await Promise.all(
                    data[0].map(async (ord) => {
                        const order = await getOrder(
                            information as InformationEntity,
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
                                          ...sorteByTime(time),
                                      },
                                  ],
                                  order: Object.entries(invoices),
                                  where: {
                                      information_id: information.id,
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
                                          ...sorteByTime(time),
                                      },
                                  ],
                                  where: {
                                      information_id: information.id,
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
                                          ...sorteByTime(time),
                                      },
                                  ],
                                  order: Object.entries(invoices),
                                  where: {
                                      information_id: information.id,
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
                                          ...sorteByTime(time),
                                      },
                                  ],
                                  where: {
                                      information_id: information.id,
                                  },
                              }),
                          ]
                );
                data[0] = await Promise.all(
                    data[0].map(async (order) => {
                        const ord = await getOrder(
                            information as InformationEntity,
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
                                ...sorteByTime(time),
                            },
                            information_id: information.id,
                        },
                    }),
                    Coupons.count({
                        where: {
                            coupon: {
                                [Op.iLike]: searchLowerCase,
                                ...sorteByTime(time),
                            },
                            information_id: information.id,
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
                const information = await InformationEntity.findByPk(1)!;
                if (!information)
                    throw new BadRequestException("Hubo un problema");
                const findByNameContacts = information.contacts.filter(
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
                        },
                    }),
                    Suppliers.count({
                        where: {
                            ruc: {
                                [Op.iLike]: searchLowerCase,
                            },
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
                    }),
                    Posts.count({}),
                ]);
                break;
            }

            case "regions": {
                data = await Promise.all([
                    Regions.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(rest),
                    }),
                    Regions.count({}),
                ]);
                break;
            }
            case "urls": {
                if (!user) throw new UnauthorizedException("No authorizado");
                data = await Promise.all([
                    Urls.findAll({
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: Object.entries(rest),
                    }),
                    Urls.count({}),
                ]);
                break;
            }

            default:
                throw new InternalServerErrorException(
                    "Comunicarse con el desarrollador"
                );
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
