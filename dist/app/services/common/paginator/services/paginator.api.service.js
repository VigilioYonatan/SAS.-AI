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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatorApiServices = void 0;
const express_core_1 = require("@vigilio/express-core");
const sequelize_1 = require("sequelize");
const users_entity_1 = require("@/users/entities/users.entity");
const orders_entity_1 = require("@/orders/entities/orders.entity");
const invoices_entity_1 = require("@/orders/entities/invoices.entity");
const coupons_entity_1 = require("@/products/entities/coupons.entity");
const db_config_1 = require("~/config/db.config");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const index_1 = require("../libs/index");
const suppliers_entity_1 = require("@/suppliers/entities/suppliers.entity");
const posts_entity_1 = require("@/posts/entities/posts.entity");
const notes_entity_1 = require("@/orders/entities/notes.entity");
const libs_1 = require("@/orders/libs");
const categories_entity_1 = require("@/products/entities/categories.entity");
const libs_2 = require("@/products/libs");
const products_options_entity_1 = require("@/products/entities/options/products_options.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const urls_entity_1 = require("@/urls/entities/urls.entity");
const brands_entitiy_1 = require("@/products/entities/brands.entitiy");
const regions_entity_1 = require("@/ubigeo/entities/regions.entity");
const regions_empresa_entity_1 = require("@/ubigeo/entities/regions_empresa.entity");
const countries_entity_1 = require("@/ubigeo/entities/countries.entity");
const complaints_entity_1 = require("@/empresas/entities/complaints.entity");
const finanzas_entity_1 = require("@/finanzas/entities/finanzas.entity");
const favorites_entity_1 = require("@/favorites/entities/favorites.entity");
const subcategories_entity_1 = require("@/products/entities/subcategories.entity");
const questions_entity_1 = require("@/empresas/entities/questions.entity");
const emails_entity_1 = require("@/emails/entities/emails.entity");
let PaginatorApiServices = class PaginatorApiServices {
    index(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const _a = props.query, { limit = "20", offset = "0", search = "" } = _a, rest = __rest(_a, ["limit", "offset", "search"]);
            const offsetConverted = Number(offset);
            const limitConverted = Number(limit);
            const empresa = props.req.empresa;
            let data = null;
            const searchLowerCase = `${search.toLowerCase()}%`;
            const user = props.req.user;
            switch (props.model) {
                case "products": {
                    const _b = rest, { categoria = null, min = null, brand = null, optionFeature = null, discount = null, type = null } = _b, prod = __rest(_b, ["categoria", "min", "brand", "optionFeature", "discount", "type"]);
                    let where = {
                        name: {
                            [sequelize_1.Op.iLike]: searchLowerCase,
                        },
                        discount: {
                            [sequelize_1.Op.gte]: discount !== null && discount !== void 0 ? discount : 0,
                        },
                        empresa_id: empresa.id,
                    };
                    let include = [];
                    include = [
                        ...include,
                        {
                            model: categories_entity_1.Categories,
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
                            { model: brands_entitiy_1.Brands, where: brand ? { slug: brand } : {} },
                        ];
                    }
                    const price = "(price - (price * discount) / 100)";
                    const subtotal = empresa.enabled_igv
                        ? `(${price} + (${price} * ${empresa.igv}) / 100)`
                        : `(${price})`;
                    if (min) {
                        where = {
                            [sequelize_1.Op.and]: [
                                db_config_1.sequelize.literal(`${subtotal} >= ${min}`),
                                where,
                            ],
                        };
                    }
                    if ([1, 3].includes(empresa.tipo_empresa.tipo_servicio_id) &&
                        type !== "service") {
                        const productsOptions = {
                            where,
                            order: Object.entries(prod),
                            include,
                            offset: offsetConverted,
                            limit: limitConverted,
                        };
                        if (optionFeature) {
                            data = (yield Promise.all([
                                products_options_entity_1.ProductsOptions.findAll({
                                    where: {
                                        option_id: JSON.parse(optionFeature).option_id,
                                        features: {
                                            [sequelize_1.Op.contains]: [
                                                JSON.parse(optionFeature)
                                                    .feature_id,
                                            ],
                                        },
                                    },
                                    include: [
                                        {
                                            model: products_normal_entity_1.ProductsNormal,
                                            as: "productsNormal",
                                            where,
                                            include,
                                            required: true,
                                        },
                                    ],
                                    order: Object.entries(prod).map((value) => [
                                        {
                                            model: products_normal_entity_1.ProductsNormal,
                                            as: "productsNormal",
                                        },
                                        ...value,
                                    ]),
                                }),
                            ]));
                            data[0] = yield Promise.all(data[0].map((data) => __awaiter(this, void 0, void 0, function* () {
                                return yield (0, libs_2.getProductAll)(empresa, data
                                    .productsNormal, user, false);
                            })));
                            data = [
                                data[0].slice(offsetConverted, offsetConverted + limitConverted),
                                data[0].length,
                            ];
                        }
                        else {
                            data = yield Promise.all([
                                products_normal_entity_1.ProductsNormal.findAll(productsOptions),
                                products_normal_entity_1.ProductsNormal.count({
                                    where,
                                    include,
                                }),
                            ]);
                            data[0] = yield Promise.all(data[0].map((product) => __awaiter(this, void 0, void 0, function* () {
                                return yield (0, libs_2.getProductAll)(empresa, product, user, false);
                            })));
                        }
                    }
                    else {
                        data = yield Promise.all([
                            (0, libs_2.Product)(empresa, type === "service").findAll({
                                offset: offsetConverted,
                                limit: limitConverted,
                                where,
                                order: Object.entries(prod),
                                include,
                            }),
                            (0, libs_2.Product)(empresa, type === "service").count({
                                where,
                                include,
                            }),
                        ]);
                        data[0] = yield Promise.all(data[0].map((product) => __awaiter(this, void 0, void 0, function* () {
                            const producto = yield (0, libs_2.getProductAll)(empresa, product, user, false);
                            return producto;
                        })));
                    }
                    break;
                }
                case "brands":
                    data = yield Promise.all([
                        brands_entitiy_1.Brands.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            where: {
                                empresa_id: empresa.id,
                                name: {
                                    [sequelize_1.Op.iLike]: searchLowerCase,
                                },
                            },
                            order: Object.entries(rest),
                        }),
                        brands_entitiy_1.Brands.count({
                            where: {
                                empresa_id: empresa.id,
                                name: {
                                    [sequelize_1.Op.iLike]: searchLowerCase,
                                },
                            },
                        }),
                    ]);
                    break;
                case "questions":
                    data = yield Promise.all([
                        questions_entity_1.Questions.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            where: {
                                empresa_id: empresa.id,
                                question: {
                                    [sequelize_1.Op.iLike]: searchLowerCase,
                                },
                            },
                            order: Object.entries(rest),
                        }),
                        questions_entity_1.Questions.count({
                            where: {
                                empresa_id: empresa.id,
                                question: {
                                    [sequelize_1.Op.iLike]: searchLowerCase,
                                },
                            },
                        }),
                    ]);
                    break;
                case "categories": {
                    const _c = rest, { type } = _c, cat = __rest(_c, ["type"]);
                    data = yield Promise.all([
                        categories_entity_1.Categories.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            where: {
                                empresa_id: empresa.id,
                                name: {
                                    [sequelize_1.Op.iLike]: searchLowerCase,
                                },
                                isService: type === "service",
                            },
                            order: Object.entries(cat),
                        }),
                        categories_entity_1.Categories.count({
                            where: {
                                empresa_id: empresa.id,
                                name: {
                                    [sequelize_1.Op.iLike]: searchLowerCase,
                                },
                                isService: type === "service",
                            },
                        }),
                    ]);
                    break;
                }
                case "subcategories":
                    data = yield Promise.all([
                        subcategories_entity_1.Subcategories.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(rest),
                            where: {
                                empresa_id: empresa.id,
                            },
                        }),
                        subcategories_entity_1.Subcategories.count({
                            where: {
                                empresa_id: empresa.id,
                            },
                        }),
                    ]);
                    break;
                case "users":
                    {
                        if (!user ||
                            !user.enabled ||
                            ![1, 2].includes(user.role_id))
                            throw new express_core_1.UnauthorizedException("No permiso para esta acción");
                        const { role_id } = rest, userrest = __rest(rest, ["role_id"]);
                        let where = {
                            username: {
                                [sequelize_1.Op.iLike]: searchLowerCase,
                            },
                            empresa_id: empresa.id,
                        };
                        if (role_id) {
                            where = Object.assign(Object.assign({}, where), { role_id });
                        }
                        data = yield Promise.all([
                            users_entity_1.Users.findAll({
                                offset: offsetConverted,
                                limit: limitConverted,
                                where,
                                order: Object.entries(userrest),
                            }),
                            users_entity_1.Users.count({
                                where,
                            }),
                        ]);
                    }
                    break;
                case "orders": {
                    if (!user || !user.enabled || ![1, 2].includes(user.role_id))
                        throw new express_core_1.UnauthorizedException("No permiso para esta acción");
                    const _d = rest, { time } = _d, orders = __rest(_d, ["time"]);
                    data = yield Promise.all([
                        orders_entity_1.Orders.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(orders),
                            where: Object.assign(Object.assign({}, (0, index_1.sorteByTime)(empresa, time)), { empresa_id: empresa.id }),
                        }),
                        orders_entity_1.Orders.count({
                            where: Object.assign(Object.assign({}, (0, index_1.sorteByTime)(empresa, time)), { empresa_id: empresa.id }),
                        }),
                    ]);
                    data[0] = yield Promise.all(data[0].map((ord) => __awaiter(this, void 0, void 0, function* () {
                        const order = yield (0, libs_1.getOrder)(empresa, ord, false);
                        return order;
                    })));
                    break;
                }
                case "emails": {
                    if (!user || !user.enabled || ![1].includes(user.role_id))
                        throw new express_core_1.UnauthorizedException("No authorizado");
                    data = yield Promise.all([
                        emails_entity_1.Emails.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(rest),
                        }),
                        emails_entity_1.Emails.count({}),
                    ]);
                    break;
                }
                case "orders-local": {
                    if (!user || !user.enabled || ![1, 2, 3].includes(user.role_id))
                        throw new express_core_1.UnauthorizedException("No permiso para esta acción");
                    const _e = rest, { time } = _e, orders = __rest(_e, ["time"]);
                    data = yield Promise.all([
                        orders_entity_1.Orders.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(orders),
                            where: Object.assign({ isDelivery: false, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, time)),
                        }),
                        orders_entity_1.Orders.count({
                            where: Object.assign({ isDelivery: false, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, time)),
                        }),
                    ]);
                    data[0] = yield Promise.all(data[0].map((ord) => __awaiter(this, void 0, void 0, function* () {
                        const order = yield (0, libs_1.getOrder)(empresa, ord, false);
                        return order;
                    })));
                    break;
                }
                case "orders-delivery": {
                    if (!user || !user.enabled || ![1, 2, 3].includes(user.role_id))
                        throw new express_core_1.UnauthorizedException("No permiso para esta acción");
                    const _f = rest, { time } = _f, orders = __rest(_f, ["time"]);
                    data = yield Promise.all([
                        orders_entity_1.Orders.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(orders),
                            where: Object.assign({ isDelivery: true, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, time)),
                        }),
                        orders_entity_1.Orders.count({
                            where: Object.assign({ isDelivery: true, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, time)),
                        }),
                    ]);
                    data[0] = yield Promise.all(data[0].map((ord) => __awaiter(this, void 0, void 0, function* () {
                        const order = yield (0, libs_1.getOrder)(empresa, ord, false);
                        return order;
                    })));
                    break;
                }
                case "orders_user": {
                    if (!user || !user.enabled)
                        throw new express_core_1.UnauthorizedException("No permiso para esta acción");
                    const _g = rest, { time } = _g, orders = __rest(_g, ["time"]);
                    data = yield Promise.all([
                        orders_entity_1.Orders.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(orders),
                            where: Object.assign({ user_id: user.id, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, time)),
                        }),
                        orders_entity_1.Orders.count({
                            where: Object.assign({ user_id: user.id, empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, time)),
                        }),
                    ]);
                    data[0] = yield Promise.all(data[0].map((ord) => __awaiter(this, void 0, void 0, function* () {
                        const order = yield (0, libs_1.getOrder)(empresa, ord, false);
                        return order;
                    })));
                    break;
                }
                case "invoices": {
                    if (!user || !user.enabled || ![1].includes(user.role_id))
                        throw new express_core_1.UnauthorizedException("No permiso para esta acción");
                    const _h = rest, { kind_invoice_code, time } = _h, invoices = __rest(_h, ["kind_invoice_code", "time"]);
                    data = yield Promise.all(kind_invoice_code === "01" || kind_invoice_code === "03"
                        ? [
                            orders_entity_1.Orders.findAll({
                                offset: offsetConverted,
                                limit: limitConverted,
                                include: [
                                    Object.assign({ model: invoices_entity_1.Invoices, where: {
                                            kind_invoice_code: kind_invoice_code !== null && kind_invoice_code !== void 0 ? kind_invoice_code : "01",
                                        } }, (0, index_1.sorteByTime)(empresa, time)),
                                ],
                                order: Object.entries(invoices),
                                where: {
                                    empresa_id: empresa.id,
                                },
                            }),
                            orders_entity_1.Orders.count({
                                include: [
                                    Object.assign({ model: invoices_entity_1.Invoices, where: {
                                            kind_invoice_code: kind_invoice_code !== null && kind_invoice_code !== void 0 ? kind_invoice_code : "01",
                                        } }, (0, index_1.sorteByTime)(empresa, time)),
                                ],
                                where: {
                                    empresa_id: empresa.id,
                                },
                            }),
                        ]
                        : [
                            orders_entity_1.Orders.findAll({
                                offset: offsetConverted,
                                limit: limitConverted,
                                include: [
                                    Object.assign({ model: notes_entity_1.Notes, where: {
                                            kind_invoice_code: kind_invoice_code !== null && kind_invoice_code !== void 0 ? kind_invoice_code : "07",
                                        } }, (0, index_1.sorteByTime)(empresa, time)),
                                ],
                                order: Object.entries(invoices),
                                where: {
                                    empresa_id: empresa.id,
                                },
                            }),
                            orders_entity_1.Orders.count({
                                include: [
                                    Object.assign({ model: notes_entity_1.Notes, where: {
                                            kind_invoice_code: kind_invoice_code !== null && kind_invoice_code !== void 0 ? kind_invoice_code : "07",
                                        } }, (0, index_1.sorteByTime)(empresa, time)),
                                ],
                                where: {
                                    empresa_id: empresa.id,
                                },
                            }),
                        ]);
                    data[0] = yield Promise.all(data[0].map((order) => __awaiter(this, void 0, void 0, function* () {
                        const ord = yield (0, libs_1.getOrder)(empresa, order, false);
                        return ord;
                    })));
                    break;
                }
                case "coupons": {
                    if (!user || !user.enabled || ![1].includes(user.role_id))
                        throw new express_core_1.UnauthorizedException("No permiso para esta acción");
                    const _j = rest, { kind_invoice_code, time } = _j, coupons = __rest(_j, ["kind_invoice_code", "time"]);
                    data = yield Promise.all([
                        coupons_entity_1.Coupons.findAll({
                            order: Object.entries(coupons),
                            where: {
                                coupon: Object.assign({ [sequelize_1.Op.iLike]: searchLowerCase }, (0, index_1.sorteByTime)(empresa, time)),
                                empresa_id: empresa.id,
                            },
                        }),
                        coupons_entity_1.Coupons.count({
                            where: {
                                coupon: Object.assign({ [sequelize_1.Op.iLike]: searchLowerCase }, (0, index_1.sorteByTime)(empresa, time)),
                                empresa_id: empresa.id,
                            },
                        }),
                    ]);
                    break;
                }
                case "notifications": {
                    if (!user || !user.enabled)
                        throw new express_core_1.UnauthorizedException("No permiso para esta acción");
                    const notifications = yield user.$get("notificationsusers", {
                        offset: offsetConverted,
                        limit: limitConverted,
                        order: [["createdAt", "DESC"]],
                    });
                    data = [notifications, notifications.length];
                    break;
                }
                case "contacts": {
                    if (!user || !user.enabled || ![1].includes(user.role_id))
                        throw new express_core_1.UnauthorizedException("No authorizado");
                    const { isFavorite } = rest;
                    const emp = yield empresas_entity_1.Empresas.findByPk(empresa.id, {
                        attributes: ["contacts"],
                    });
                    if (!emp)
                        throw new express_core_1.BadRequestException("Hubo un problema");
                    const findByNameContacts = emp.contacts.filter((contact) => {
                        var _a, _b;
                        return ((_a = contact.name) !== null && _a !== void 0 ? _a : "")
                            .toLowerCase()
                            .startsWith(search.toLowerCase()) ||
                            ((_b = contact.telephone.toLowerCase()) !== null && _b !== void 0 ? _b : "")
                                .toLowerCase()
                                .includes(search.toLowerCase());
                    });
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
                            if (a.isFavorite === b.isFavorite) {
                                return 0;
                            }
                            if (a.isFavorite) {
                                return -1;
                            }
                            return 1;
                        })
                            .slice(offsetConverted, offsetConverted + limitConverted),
                        findByNameContacts.length,
                    ];
                    break;
                }
                case "suppliers": {
                    if (!user || !user.enabled || ![1].includes(user.role_id))
                        throw new express_core_1.UnauthorizedException("No authorizado");
                    data = yield Promise.all([
                        suppliers_entity_1.Suppliers.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(rest),
                            where: {
                                ruc: {
                                    [sequelize_1.Op.iLike]: searchLowerCase,
                                },
                                empresa_id: empresa.id,
                            },
                        }),
                        suppliers_entity_1.Suppliers.count({
                            where: {
                                ruc: {
                                    [sequelize_1.Op.iLike]: searchLowerCase,
                                },
                                empresa_id: empresa.id,
                            },
                        }),
                    ]);
                    break;
                }
                case "complaints": {
                    data = yield Promise.all([
                        complaints_entity_1.Complaints.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(rest),
                            where: {
                                empresa_id: empresa.id,
                            },
                        }),
                        complaints_entity_1.Complaints.count({
                            where: {
                                empresa_id: empresa.id,
                            },
                        }),
                    ]);
                    break;
                }
                case "posts": {
                    if (!user || !user.enabled || ![1].includes(user.role_id))
                        throw new express_core_1.UnauthorizedException("No authorizado");
                    data = yield Promise.all([
                        posts_entity_1.Posts.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(rest),
                            where: {
                                empresa_id: empresa.id,
                            },
                        }),
                        posts_entity_1.Posts.count({
                            where: {
                                empresa_id: empresa.id,
                            },
                        }),
                    ]);
                    break;
                }
                case "regions": {
                    data = yield Promise.all([
                        regions_entity_1.Regions.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(rest),
                            include: [
                                {
                                    model: countries_entity_1.Countries,
                                    where: {
                                        code: empresa.dial_code,
                                    },
                                    required: true,
                                    attributes: ["code"],
                                },
                            ],
                        }),
                        regions_entity_1.Regions.count({
                            include: [
                                {
                                    model: countries_entity_1.Countries,
                                    where: {
                                        code: empresa.dial_code,
                                    },
                                    required: true,
                                },
                            ],
                        }),
                    ]);
                    data[0] = yield Promise.all(data[0].map((data) => __awaiter(this, void 0, void 0, function* () {
                        const regionsEmpresa = yield regions_empresa_entity_1.RegionsEmpresa.findOne({
                            where: {
                                empresa_id: empresa.id,
                                region_id: data.id,
                            },
                        });
                        return Object.assign(Object.assign({}, data.toJSON()), { priceShipping: regionsEmpresa === null || regionsEmpresa === void 0 ? void 0 : regionsEmpresa.priceShipping, enabled: regionsEmpresa === null || regionsEmpresa === void 0 ? void 0 : regionsEmpresa.enabled, days: regionsEmpresa === null || regionsEmpresa === void 0 ? void 0 : regionsEmpresa.days });
                    })));
                    break;
                }
                case "urls": {
                    if (!user)
                        throw new express_core_1.UnauthorizedException("No authorizado");
                    data = yield Promise.all([
                        urls_entity_1.Urls.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(rest),
                            where: {
                                empresa_id: empresa.id,
                            },
                        }),
                        urls_entity_1.Urls.count({
                            where: {
                                empresa_id: empresa.id,
                            },
                        }),
                    ]);
                    break;
                }
                case "finanzas": {
                    if (!user || user.role_id !== 1)
                        throw new express_core_1.UnauthorizedException("No authorizado");
                    const _k = rest, { time } = _k, finanzas = __rest(_k, ["time"]);
                    data = yield Promise.all([
                        finanzas_entity_1.Finanzas.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(finanzas),
                            where: Object.assign({ empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, time)),
                        }),
                        finanzas_entity_1.Finanzas.count({
                            where: Object.assign({ empresa_id: empresa.id }, (0, index_1.sorteByTime)(empresa, time)),
                        }),
                    ]);
                    break;
                }
                case "favorites": {
                    if (!user)
                        throw new express_core_1.UnauthorizedException("No authorizado");
                    data = yield Promise.all([
                        favorites_entity_1.Favorites.findAll({
                            offset: offsetConverted,
                            limit: limitConverted,
                            order: Object.entries(rest),
                            where: { user_id: user.id },
                        }),
                        favorites_entity_1.Favorites.count({ where: { user_id: user.id } }),
                    ]);
                    data[0] = yield Promise.all(data[0].map((favorite) => __awaiter(this, void 0, void 0, function* () {
                        const product = yield (0, libs_2.Product)(empresa, !!favorite.product_servicio_id).findByPk(favorite[(0, libs_2.productEntityId)(empresa, !!favorite.product_servicio_id)]);
                        if (!product)
                            throw new express_core_1.NotFoundException("no found product");
                        return yield (0, libs_2.getProductAll)(empresa, product, user, false);
                    })));
                    break;
                }
                default:
                    throw new express_core_1.InternalServerErrorException("Comunicarse con el desarrollador");
            }
            const next = `/api/paginator/${props.model}?offset=${offsetConverted + limitConverted}&limit=${limitConverted}`;
            const offsetTotal = offsetConverted - limitConverted;
            const back = `/api/paginator/${props.model}?offset=${offsetTotal}&limit=${limitConverted}`;
            return {
                success: true,
                count: data[1],
                next,
                previous: offsetTotal >= 0 ? back : null,
                results: data[0],
            };
        });
    }
};
exports.PaginatorApiServices = PaginatorApiServices;
exports.PaginatorApiServices = PaginatorApiServices = __decorate([
    (0, express_core_1.Injectable)()
], PaginatorApiServices);
