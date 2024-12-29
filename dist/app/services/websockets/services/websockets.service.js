"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketsService = void 0;
const express_core_1 = require("@vigilio/express-core");
const users_entity_1 = require("@/users/entities/users.entity");
const notifications_api_service_1 = require("@/notificactions/services/notifications.api.service");
const notifications_user_entity_1 = require("@/notificactions/entities/notifications_user.entity");
const webpush_1 = __importDefault(require("@/notificactions/libs/webpush"));
const helpers_1 = require("~/libs/helpers");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const helpers_2 = require("@/uploads/libs/helpers");
const libs_1 = require("@/empresas/libs");
const helpers_3 = require("@/cart/libs/helpers");
const orders_entity_1 = require("@/orders/entities/orders.entity");
const mesas_entity_1 = require("@/orders/entities/mesas.entity");
const floors_entity_1 = require("@/orders/entities/floors.entity");
const status_orders_entity_1 = require("@/orders/entities/status_orders.entity");
const libs_2 = require("@/orders/libs");
const libs_3 = require("@/users/libs");
const sequelize_1 = require("sequelize");
const products_api_service_1 = require("@/products/services/products.api.service");
const subcomments_api_service_1 = require("@/polymorphism/services/subcomments.api.service");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const ai_1 = require("@/bot/libs/ai");
const libs_4 = require("@/bot/libs");
const empresas_api_service_1 = require("@/empresas/services/empresas.api.service");
const websockets_controller_1 = require("../controllers/websockets.controller");
const subcomments_entity_1 = require("@/polymorphism/entities/subcomments.entity");
const tipo_empresa_entity_1 = require("@/empresas/entities/tipo_empresa.entity");
const cache_1 = __importDefault(require("@vigilio/express-core/cache"));
let WebsocketsService = class WebsocketsService {
    constructor(notificationsApiService, productsApiService, subcommentsApiService) {
        this.notificationsApiService = notificationsApiService;
        this.productsApiService = productsApiService;
        this.subcommentsApiService = subcommentsApiService;
    }
    index(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (token === "null")
                return null;
            const user = yield users_entity_1.Users.unscoped().findByPk(token, {
                attributes: ["id", "username", "role_id", "isOnline", "empresa_id"],
                include: [
                    {
                        model: empresas_entity_1.Empresas.unscoped(),
                        attributes: ["name_empresa", "slug", "id"],
                    },
                ],
            });
            return user;
        });
    }
    authRegister(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const emp = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug: empresa },
                attributes: ["id", "logo", "money", "slug"],
            });
            if (!emp)
                return;
            const content = `Nuevo usuario registrado <b>${body.username}</b>`;
            const payload = {
                title: "Nuevo usuario registrado",
                message: (0, helpers_1.removeTextHTML)(content),
                url: `${(0, libs_1.BASE_URL)(emp)}/admin/usuarios/${body.slug}`,
                logo: emp.logo
                    ? (0, helpers_2.printFileWithDimension)(emp)(emp.logo, 100)[0]
                    : "",
                tag: "nuevo-usuario",
            };
            const notification = yield this.notificationsApiService.store({
                type: "register",
                url: `/admin/usuarios/${body.slug}`,
                content,
                user_id: body.user_id,
                empresa_id: emp.id,
            });
            const userPermises = yield users_entity_1.Users.findAll({
                where: {
                    role_id: libs_3.ROLES.admin,
                    empresa_id: emp.id,
                },
            });
            yield Promise.all(userPermises.map((user) => __awaiter(this, void 0, void 0, function* () {
                const noti = new notifications_user_entity_1.NotificationsUser({
                    user_id: user.id,
                    notification_id: notification.notification.id,
                    isRead: false,
                    empresa_id: emp.id,
                });
                yield noti.save();
            })));
            return Object.assign(Object.assign({}, notification), { users_permission: userPermises.map((user) => user.id) });
        });
    }
    orderStore(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const emp = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug: empresa },
                attributes: ["id", "logo", "money", "slug"],
            });
            if (!emp)
                return;
            const content = `Se registró una nueva orden registrado <b>${(0, helpers_3.formatMoney)(emp, body.total, emp.money.money)}</b>`;
            const payload = {
                title: `Nueva orden registrada ${body.order_code}`,
                message: (0, helpers_1.removeTextHTML)(content),
                url: `${(0, libs_1.BASE_URL)(emp)}/admin/orders/${body.order_code}`,
                logo: emp.logo
                    ? (0, helpers_2.printFileWithDimension)(emp)(emp.logo, 100)[0]
                    : "",
                tag: "nueva-orden",
            };
            const notification = yield this.notificationsApiService.store({
                type: "order",
                url: `/admin/orders/${body.order_code}`,
                content,
                empresa_id: emp.id,
                user_id: (_a = body.user_id) !== null && _a !== void 0 ? _a : null,
            });
            const userPermises = yield users_entity_1.Users.unscoped().findAll({
                where: {
                    empresa_id: emp.id,
                    [sequelize_1.Op.not]: {
                        role_id: libs_3.ROLES.user,
                    },
                },
                attributes: [
                    "role_id",
                    "id",
                    "enabledNotification",
                    "subscription",
                ],
            });
            yield Promise.all(userPermises.map((user) => __awaiter(this, void 0, void 0, function* () {
                const noti = new notifications_user_entity_1.NotificationsUser({
                    user_id: user.id,
                    notification_id: notification.notification.id,
                    empresa_id: emp.id,
                    isRead: false,
                });
                yield noti.save();
                if (user.subscription && user.enabledNotification) {
                    yield webpush_1.default.sendNotification(user.subscription, JSON.stringify(payload));
                }
            })));
            return Object.assign(Object.assign({}, notification), { users_permission: userPermises.map((user) => user.id) });
        });
    }
    commentStore(empresa, token, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const emp = yield empresas_entity_1.Empresas.findOne({
                where: { slug: empresa },
                attributes: [
                    "id",
                    "logo",
                    "money",
                    "slug",
                    "enabled_commentario_ia",
                ],
            });
            if (!emp)
                return;
            const user = yield this.index(token);
            if (user) {
                const { product } = yield this.productsApiService.show(emp, String(body.product_id), body.isService, true, null, false);
                const content = `Se agregó un nuevo comentario en el producto <b>${product.name}</b>`;
                const userPermises = yield users_entity_1.Users.unscoped().findAll({
                    where: {
                        role_id: libs_3.ROLES.admin,
                        id: {
                            [sequelize_1.Op.not]: user.id,
                        },
                        empresa_id: emp.id,
                    },
                    attributes: [
                        "role_id",
                        "id",
                        "enabledNotification",
                        "subscription",
                    ],
                });
                const notification = yield this.notificationsApiService.store({
                    type: "comment",
                    url: body.isService
                        ? `/servicio/${product.slug}?comment=${body.comment_id}`
                        : `/${product.slug}?comment=${body.comment_id}`,
                    content,
                    user_id: body.user_id,
                    empresa_id: emp.id,
                });
                yield Promise.all(userPermises.map((user) => __awaiter(this, void 0, void 0, function* () {
                    const noti = new notifications_user_entity_1.NotificationsUser({
                        user_id: user.id,
                        notification_id: notification.notification.id,
                        isRead: emp.enabled_commentario_ia,
                        empresa_id: emp.id,
                    });
                    yield noti.save();
                })));
                if (emp.enabled_commentario_ia) {
                    const type = product instanceof products_normal_entity_1.ProductsNormal
                        ? "ProductsNormals"
                        : product instanceof products_restaurant_entity_1.ProductsRestaurant
                            ? "ProductsRestaurants"
                            : "ProductsServicios";
                    const whatsapp = yield (0, ai_1.isWhatsappTelegramIA)(emp.slug);
                    if (!whatsapp)
                        return;
                    const message = yield (0, libs_4.questionGPT)(whatsapp, body.content, "agradecimiento, elogio o satisfacción");
                    let userBot = yield users_entity_1.Users.findOne({
                        where: { isBot: true, empresa_id: emp.id },
                    });
                    if (!userBot) {
                        userBot = yield users_entity_1.Users.findOne({
                            where: { empresa_id: emp.id, role_id: libs_3.ROLES.admin },
                        });
                    }
                    let content = null;
                    if (message) {
                        content = yield (0, libs_4.chatgpt)(whatsapp, `'${body.content}', Solo agradece. muy corto y usa emojis.`);
                    }
                    else {
                        const contenido = `${product.name} <- estamos en ese producto/servicio, No vendas solo responde la pregunta y ingoralo: .\n${body.content}`;
                        const prompt = yield (0, libs_4.promptReplace)(whatsapp, contenido, whatsapp.empresa);
                        const completion = yield empresas_api_service_1.openAis[emp.slug].chat.completions.create({
                            model: whatsapp.clientVigilio
                                ? whatsapp.clientVigilio.information.modelai
                                : "gpt-4o-mini",
                            max_tokens: 255,
                            messages: [
                                {
                                    role: "user",
                                    content: `${prompt} . ${(0, websockets_controller_1.HTMLPROMPT)(whatsapp.empresa)} `,
                                },
                                {
                                    role: "assistant",
                                    content: "Entendido, Empezemos.",
                                },
                                {
                                    role: "user",
                                    content: contenido,
                                },
                            ],
                        });
                        const completionText = completion.choices[0].message.content;
                        const [removeNote] = yield (0, ai_1.featuresIA)(emp, completionText, false);
                        content = removeNote;
                    }
                    yield this.subcommentsApiService.store(whatsapp.empresa, type, String(body.product_id), String(body.comment_id), { content: content }, userBot.id);
                    const contentido = `Se respondió un comentario en el producto <b>${product.name}</b>`;
                    const notification = yield this.notificationsApiService.store({
                        type: "comment",
                        url: body.isService
                            ? `/servicio/${product.slug}?comment=${body.comment_id}`
                            : `/${product.slug}?comment=${body.comment_id}`,
                        content: contentido,
                        user_id: userBot.id,
                        empresa_id: emp.id,
                    });
                    const noti = new notifications_user_entity_1.NotificationsUser({
                        user_id: user.id,
                        notification_id: notification.notification.id,
                        isRead: false,
                        empresa_id: emp.id,
                    });
                    yield noti.save();
                    return Object.assign(Object.assign({}, notification), { users_permission: [body.user_id] });
                }
                return Object.assign(Object.assign({}, notification), { users_permission: userPermises.map((user) => user.id) });
            }
        });
    }
    subcommentStore(empresa, token, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const emp = yield empresas_entity_1.Empresas.findOne({
                where: { slug: empresa },
                attributes: [
                    "id",
                    "logo",
                    "money",
                    "slug",
                    "enabled_commentario_ia",
                ],
            });
            if (!emp)
                return;
            const user = yield this.index(token);
            if (!user)
                return;
            const { product } = yield this.productsApiService.show(emp, String(body.product_id), body.isService, true, null, false);
            const content = `Se respondió un comentario en el producto <b>${product.name}</b>`;
            const notification = yield this.notificationsApiService.store({
                type: "comment",
                url: body.isService
                    ? `/servicio/${product.slug}?comment=${body.comment_id}`
                    : `/${product.slug}?comment=${body.comment_id}`,
                content,
                user_id: body.user_id,
                empresa_id: emp.id,
            });
            const userPermises = yield users_entity_1.Users.unscoped().findAll({
                where: {
                    id: body.receptores,
                    empresa_id: emp.id,
                },
                attributes: [
                    "role_id",
                    "id",
                    "enabledNotification",
                    "subscription",
                ],
            });
            const noti = userPermises.map((user) => ({
                user_id: user.id,
                notification_id: notification.notification.id,
                isRead: false,
                empresa_id: emp.id,
            }));
            yield notifications_user_entity_1.NotificationsUser.bulkCreate(noti);
            if (emp.enabled_commentario_ia) {
                const type = product instanceof products_normal_entity_1.ProductsNormal
                    ? "ProductsNormals"
                    : product instanceof products_restaurant_entity_1.ProductsRestaurant
                        ? "ProductsRestaurants"
                        : "ProductsServicios";
                const whatsapp = yield (0, ai_1.isWhatsappTelegramIA)(emp.slug);
                const subcomentarios = yield subcomments_entity_1.Subcomments.findAll({
                    where: {
                        comment_id: String(body.comment_id),
                        subcommentsable_id: String(body.product_id),
                        subcommentsable_type: type,
                        empresa_id: emp.id,
                    },
                });
                if (!whatsapp)
                    return;
                const message = yield (0, libs_4.questionGPT)(whatsapp, body.content, "agradecimiento, elogio o satisfacción");
                let userBot = yield users_entity_1.Users.findOne({
                    where: { isBot: true, empresa_id: emp.id },
                });
                if (!userBot) {
                    userBot = yield users_entity_1.Users.findOne({
                        where: { empresa_id: emp.id, role_id: libs_3.ROLES.admin },
                    });
                }
                let content = null;
                if (message) {
                    content = yield (0, libs_4.chatgpt)(whatsapp, `'${body.content}', Solo agradece. muy corto y usa emojis.`);
                }
                else {
                    const contenido = `${product.name} <- estamos en ese producto/servicio y Ignora: .\n${body.content}`;
                    const prompt = yield (0, libs_4.promptReplace)(whatsapp, contenido, whatsapp.empresa);
                    const messages = subcomentarios.map((sub) => {
                        return {
                            role: sub.id !== userBot.id ? "user" : "assistant",
                            content: `${sub.content}. 'en html y no mkdown'`,
                        };
                    });
                    const completion = yield empresas_api_service_1.openAis[emp.slug].chat.completions.create({
                        model: whatsapp.clientVigilio
                            ? whatsapp.clientVigilio.information.modelai
                            : "gpt-4o-mini",
                        max_tokens: 255,
                        messages: [
                            {
                                role: "user",
                                content: `${prompt} . ${(0, websockets_controller_1.HTMLPROMPT)(whatsapp.empresa)}`,
                            },
                            {
                                role: "assistant",
                                content: "Entendido, Empezemos.",
                            },
                            ...messages.slice(-(whatsapp.empresa.inteligenceArtificial.memory - 1)),
                            {
                                role: "user",
                                content: contenido,
                            },
                        ],
                    });
                    const completionText = completion.choices[0].message.content;
                    const [removeNote] = yield (0, ai_1.featuresIA)(emp, completionText, false);
                    content = removeNote;
                }
                yield this.subcommentsApiService.store(whatsapp.empresa, type, String(body.product_id), String(body.comment_id), { content: content }, userBot.id);
                const contentido = `Se respondió un comentario en el producto <b>${product.name}</b>`;
                const notification = yield this.notificationsApiService.store({
                    type: "comment",
                    url: body.isService
                        ? `/servicio/${product.slug}?comment=${body.comment_id}`
                        : `/${product.slug}?comment=${body.comment_id}`,
                    content: contentido,
                    user_id: userBot.id,
                    empresa_id: emp.id,
                });
                const users_permission = [
                    body.user_id,
                    ...userPermises.map((user) => user.id),
                ].filter((val) => val !== userBot.id);
                yield notifications_user_entity_1.NotificationsUser.bulkCreate(users_permission.map((id) => ({
                    user_id: id,
                    notification_id: notification.notification.id,
                    isRead: false,
                    empresa_id: emp.id,
                })));
                return Object.assign(Object.assign({}, notification), { users_permission });
            }
            return Object.assign(Object.assign({}, notification), { users_permission: userPermises.map((user) => user.id) });
        });
    }
    floorsMesas(empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!user)
                return null;
            let isEmpresaRestaurant = JSON.parse(cache_1.default.get(`isRestaurant:${empresa}`) || "null");
            if (!isEmpresaRestaurant) {
                const empresas = yield empresas_entity_1.Empresas.unscoped().findOne({
                    where: { slug: empresa },
                    include: [tipo_empresa_entity_1.TipoEmpresa.unscoped()],
                });
                isEmpresaRestaurant = empresas;
                cache_1.default.set(`isRestaurant:${empresa}`, JSON.stringify(empresas));
            }
            if ((isEmpresaRestaurant === null || isEmpresaRestaurant === void 0 ? void 0 : isEmpresaRestaurant.tipo_empresa.tipo_servicio_id) !== 2)
                return null;
            if (![libs_3.ROLES.trabajador, libs_3.ROLES.admin].includes(user.role_id))
                return null;
            const floors = yield floors_entity_1.Floors.findAll({
                include: [
                    {
                        model: mesas_entity_1.Mesas,
                        include: [
                            {
                                model: orders_entity_1.Orders,
                                include: [
                                    {
                                        model: status_orders_entity_1.StatusOrders,
                                        where: {
                                            id: [
                                                libs_2.STATUSORDER.confirmado,
                                                libs_2.STATUSORDER.preparado,
                                            ],
                                        },
                                    },
                                ],
                                attributes: [
                                    "id",
                                    "order_code",
                                    "status_order_id",
                                ],
                            },
                        ],
                        order: [["createdAt", "ASC"]],
                    },
                    {
                        model: empresas_entity_1.Empresas.unscoped(),
                        where: {
                            slug: empresa,
                        },
                        attributes: ["slug"],
                        required: true,
                    },
                ],
            });
            return { success: true, floors };
        });
    }
};
exports.WebsocketsService = WebsocketsService;
exports.WebsocketsService = WebsocketsService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [notifications_api_service_1.NotificationsApiService,
        products_api_service_1.ProductsApiService,
        subcomments_api_service_1.SubcommentsApiService])
], WebsocketsService);
