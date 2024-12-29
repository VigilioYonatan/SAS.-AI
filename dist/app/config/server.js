"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.Server = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket = __importStar(require("socket.io"));
const node_http_1 = __importDefault(require("node:http"));
const morgan_1 = __importDefault(require("morgan"));
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const memorystore_1 = __importDefault(require("memorystore"));
const express_core_1 = require("@vigilio/express-core");
const db_config_1 = require("~/config/db.config");
const handler_1 = require("@vigilio/express-core/handler");
const helpers_1 = require("@vigilio/express-core/helpers");
const client_1 = require("@vigilio/express-core/client");
const api_router_1 = require("~/routers/api.router");
const web_router_1 = require("~/routers/web.router");
const auth_router_1 = require("~/routers/auth.router");
const middleware_route_1 = require("~/libs/middleware-route");
const local_strategy_1 = require("@/auth/strategies/local.strategy");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const users_entity_1 = require("@/users/entities/users.entity");
const admin_router_1 = require("~/routers/admin.router");
const websocket_1 = require("~/libs/websocket");
const sockets_router_1 = require("~/routers/sockets.router");
const categories_entity_1 = require("@/products/entities/categories.entity");
const libs_1 = require("@/products/libs");
const helpers_2 = require("@/uploads/libs/helpers");
const helpers_3 = require("@/cart/libs/helpers");
const settings_entity_1 = require("@/empresas/entities/settings.entity");
const _1 = require(".");
const brands_entitiy_1 = require("@/products/entities/brands.entitiy");
const i18nextHttpMiddleware = __importStar(require("i18next-http-middleware"));
const i18next_1 = __importStar(require("../libs/i18next"));
const sequelize_typescript_1 = require("sequelize-typescript");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cors_1 = __importDefault(require("cors"));
const dayjs_1 = require("~/libs/dayjs");
const citas_entities_1 = require("@/citas/entities/citas.entities");
const sequelize_1 = require("sequelize");
const cache_1 = __importDefault(require("@vigilio/express-core/cache"));
const empresas_api_service_1 = require("@/empresas/services/empresas.api.service");
const favorites_entity_1 = require("@/favorites/entities/favorites.entity");
const apis_1 = require("~/libs/apis");
const libs_2 = require("@/empresas/libs");
const questions_entity_1 = require("@/empresas/entities/questions.entity");
const page_entity_1 = require("@/empresas/entities/page.entity");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.middlewares();
    }
    middlewares() {
        return __awaiter(this, void 0, void 0, function* () {
            this.app.set("trust proxy", 1);
            this.app.use((0, cors_1.default)(_1.corsOptions));
            const limiter = (0, express_rate_limit_1.default)({
                windowMs: 1 * 60 * 1000,
                max: 1000,
                message: "Has superado el límite de solicitudes, intenta de nuevo más tarde.",
            });
            this.app.use(limiter);
            this.app.use((0, compression_1.default)());
            this.app.use((0, cookie_parser_1.default)());
            this.app.use(express_1.default.json({ limit: "100mb" }));
            yield (0, db_config_1.connectDB)();
            this.auth();
            this.app.use(express_1.default.static(`${_1.dirMode}/public`));
            this.app.set("view engine", "ejs");
            this.app.set("views", `${_1.dirMode}/resources/views`);
            this.app.use(i18nextHttpMiddleware.handle(i18next_1.default));
            this.app.use(i18next_1.i18nextMiddleware);
            yield (0, empresas_api_service_1.initial)();
            this.app.use((0, client_1.client)());
            this.app.use((req, res, next) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
                const host = req.headers.host;
                let subdomain = null;
                if (host === null || host === void 0 ? void 0 : host.includes(".")) {
                    subdomain = !(host === null || host === void 0 ? void 0 : host.startsWith("www.")) ? `www.${host}` : host;
                    subdomain = subdomain.slice(4);
                    const subdomainSplit = subdomain === null || subdomain === void 0 ? void 0 : subdomain.split(".");
                    if (enviroments_config_1.default.NODE_ENV === "production") {
                        if ((subdomainSplit === null || subdomainSplit === void 0 ? void 0 : subdomainSplit.length) === 3) {
                            subdomain = subdomainSplit[0];
                            if (subdomainSplit[1] === "com") {
                                subdomain = null;
                            }
                            if (enviroments_config_1.default.CLIENT.toLowerCase() ===
                                (subdomain === null || subdomain === void 0 ? void 0 : subdomain.toLowerCase())) {
                                return next();
                            }
                        }
                        else {
                            subdomain = null;
                        }
                    }
                    else {
                        subdomain = subdomainSplit[0];
                    }
                    if (subdomain === "vigilio-services" ||
                        (subdomain === null || subdomain === void 0 ? void 0 : subdomain.includes(".docker")) ||
                        subdomain === "facturacion") {
                        return null;
                    }
                }
                const where = subdomain
                    ? {
                        where: {
                            slug: subdomain,
                        },
                    }
                    : {
                        include: [
                            {
                                model: settings_entity_1.Settings,
                                where: sequelize_typescript_1.Sequelize.where(sequelize_typescript_1.Sequelize.literal(`host->>'host'`), host === null || host === void 0 ? void 0 : host.slice(4)),
                                required: true,
                            },
                        ],
                    };
                if (!subdomain) {
                    const emp = yield empresas_entity_1.Empresas.unscoped().findOne({
                        include: [
                            {
                                model: settings_entity_1.Settings,
                                where: sequelize_typescript_1.Sequelize.where(sequelize_typescript_1.Sequelize.literal(`host->>'host'`), host === null || host === void 0 ? void 0 : host.slice(4)),
                                required: true,
                                attributes: ["host"],
                            },
                        ],
                        attributes: ["id", "slug"],
                    });
                    if (emp) {
                        subdomain = emp.slug;
                    }
                }
                let empresa = JSON.parse(cache_1.default.get(`EMPRESA:${subdomain}`) || "null");
                if (!empresa) {
                    empresa = yield empresas_entity_1.Empresas.findOne(Object.assign(Object.assign({}, where), { attributes: {
                            exclude: [
                                "groupWhatsapp",
                                "credentials",
                                "token",
                            ],
                        } }));
                    empresa = empresa === null || empresa === void 0 ? void 0 : empresa.toJSON();
                    const hours24 = 60 * 1000 * 60 * 24;
                    cache_1.default.set(`EMPRESA:${subdomain}`, JSON.stringify(empresa), hours24);
                }
                if (empresa) {
                    const certificado = req.path.startsWith("/admin") && (empresa === null || empresa === void 0 ? void 0 : empresa.company)
                        ? { certificado: empresa === null || empresa === void 0 ? void 0 : empresa.certificado }
                        : {
                            whatsapp_mode: Object.assign(Object.assign({}, empresa.whatsapp_mode), { password: null }),
                        };
                    let MONEY = { money: "LOCAL", moneyValue: { DOLARES: 1, LOCAL: 1 } };
                    if (empresa === null || empresa === void 0 ? void 0 : empresa.isDolar) {
                        const cookie = (_a = req.cookies.money) !== null && _a !== void 0 ? _a : libs_2.MONEYLOCAL;
                        let DOLARES = JSON.parse((_b = cache_1.default.get(`money:${empresa.slug}`)) !== null && _b !== void 0 ? _b : "null");
                        if (!DOLARES) {
                            const response = yield (0, apis_1.converterMoneyApi)({
                                amount: "1",
                                from: empresa.money.simbolo,
                                to: "USD",
                            });
                            DOLARES = Number.parseFloat(response.result.resultadoNumber);
                            const hours24 = 60 * 1000 * 60 * 24;
                            cache_1.default.set(`money:${empresa.slug}`, JSON.stringify(DOLARES), hours24);
                        }
                        MONEY = Object.assign(Object.assign({}, MONEY), { money: cookie, moneyValue: { DOLARES, LOCAL: 1 } });
                    }
                    let citas = JSON.parse((_c = cache_1.default.get(`${empresa.slug}:citas`)) !== null && _c !== void 0 ? _c : "null");
                    let questionCount = JSON.parse((_d = cache_1.default.get(`${empresa.slug}:questions-count`)) !== null && _d !== void 0 ? _d : "null");
                    if (req.path.includes("admin") && !citas) {
                        const day = (0, dayjs_1.NOW)(empresa);
                        questionCount = yield questions_entity_1.Questions.count({
                            where: {
                                empresa_id: empresa.id,
                                answer: null,
                            },
                        });
                        cache_1.default.set(`${empresa.slug}:questions-count`, JSON.stringify(questionCount));
                        const dias = day.daysInMonth();
                        const cites = yield Promise.all(Array.from({ length: dias }).map((_, i) => __awaiter(this, void 0, void 0, function* () {
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
                            const qty = yield citas_entities_1.Citas.unscoped().count({
                                where: {
                                    empresa_id: empresa.id,
                                    date: {
                                        [sequelize_1.Op.between]: [startOfDay, endOfDay],
                                    },
                                },
                            });
                            return [i + 1, qty];
                        })));
                        citas = cites.reduce((acc, [key, value]) => {
                            acc[key] = value;
                            return acc;
                        }, {});
                        cache_1.default.set(`${empresa.slug}:citas`, JSON.stringify(citas), 1 * 60 * 60 * 1000);
                    }
                    const pages = yield page_entity_1.Page.findAll({
                        where: { empresa_id: empresa.id },
                        attributes: ["id", "title", "description", "icon", "slug"],
                        order: [["id", "ASC"]],
                    });
                    const info = Object.assign(Object.assign(Object.assign({}, empresa), { citas,
                        questionCount, company: {
                            ruc: (_e = empresa.company) === null || _e === void 0 ? void 0 : _e.ruc,
                            razonSocial: (_f = empresa.company) === null || _f === void 0 ? void 0 : _f.razonSocial,
                            nombreComercial: (_g = empresa.company) === null || _g === void 0 ? void 0 : _g.nombreComercial,
                            production: (_h = empresa.company) === null || _h === void 0 ? void 0 : _h.production,
                        }, metodos_pago: Object.assign(Object.assign({}, empresa.metodos_pago), { transferencias: empresa.metodos_pago
                                .transferencias, paypal: {
                                enabled: empresa.metodos_pago
                                    .paypal.enabled,
                            }, mercado_pago: {
                                enabled: empresa.metodos_pago
                                    .mercado_pago.enabled,
                            }, izipay: {
                                enabled: empresa.metodos_pago
                                    .izipay.enabled,
                                izipay_public_key: empresa.metodos_pago.izipay.izipay_public_key,
                            }, stripe: {
                                enabled: empresa.metodos_pago
                                    .stripe.enabled,
                            } }), pages }), certificado);
                    req.empresa = empresa;
                    res.locals.$empresa = info;
                    res.locals.printFileWithDimension =
                        (0, helpers_2.printFileWithDimension)(empresa);
                    res.locals.subtotal = helpers_3.subtotal;
                    res.locals.formatMoney = (number) => (0, helpers_3.formatMoney)(empresa, number, empresa.money.international_simbolo);
                    res.locals.printImagesProduct = (0, libs_1.printImagesProduct)(empresa);
                    res.locals.$money = MONEY;
                    res.locals.$moneyConverter = MONEY.moneyValue[MONEY.money];
                    const user = ((_j = req.user) !== null && _j !== void 0 ? _j : null);
                    res.locals.$user = user;
                    req.money = MONEY;
                    req.moneyConverter =
                        MONEY.moneyValue[MONEY.money];
                    req.user = user;
                    const host = (_k = req.headers.host) === null || _k === void 0 ? void 0 : _k.slice(4);
                    if (!req.path.includes("api")) {
                        const [categories, categoriesService, totalProducts] = yield Promise.all([
                            categories_entity_1.Categories.findAll({
                                where: {
                                    empresa_id: empresa.id,
                                    isService: false,
                                },
                            }),
                            categories_entity_1.Categories.findAll({
                                where: {
                                    empresa_id: empresa.id,
                                    isService: true,
                                },
                            }),
                            (0, libs_1.Product)(empresa, false).count(),
                        ]);
                        const categoriasTotal = yield Promise.all(categories.map((category) => __awaiter(this, void 0, void 0, function* () {
                            const [product, subcategories] = yield Promise.all([
                                (0, libs_1.Product)(empresa, false).findOne({
                                    order: [["createdAt", "DESC"]],
                                    where: {
                                        enabled: true,
                                        category_id: category.id,
                                        empresa_id: empresa.id,
                                    },
                                }),
                                category.$get("subcategories"),
                            ]);
                            return Object.assign(Object.assign({}, category.toJSON()), { productNew: product, subcategories });
                        })));
                        const categoriesServiceTotal = yield Promise.all(categoriesService.map((category) => __awaiter(this, void 0, void 0, function* () {
                            const products = yield category.$get("productsServicios");
                            return Object.assign(Object.assign({}, category.toJSON()), { products });
                        })));
                        if (user) {
                            const [favorites] = yield Promise.all([
                                favorites_entity_1.Favorites.count({
                                    where: {
                                        user_id: user.id,
                                        empresa_id: empresa.id,
                                    },
                                }),
                            ]);
                            user.dataValues.products_favorites_length = favorites;
                        }
                        const brands = yield brands_entitiy_1.Brands.findAll({
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
                        });
                        res.locals.header = {
                            categories: categoriasTotal,
                            categoriesServices: categoriesServiceTotal,
                            brands,
                            totalProducts,
                        };
                    }
                    return next();
                }
                if (enviroments_config_1.default.NODE_ENV !== "production") {
                    return next();
                }
                return res.redirect("https://www.vigilio-services.com");
            }));
            this.routes();
        });
    }
    auth() {
        const memoryStoreClass = (0, memorystore_1.default)(express_session_1.default);
        const closeSession = 24 * 60 * 60 * 1000 * 7;
        this.app.use((0, express_session_1.default)({
            secret: enviroments_config_1.default.SECRET_SESSION_KEY,
            resave: false,
            saveUninitialized: false,
            proxy: enviroments_config_1.default.NODE_ENV === "production",
            cookie: {
                secure: enviroments_config_1.default.NODE_ENV === "production",
                httpOnly: enviroments_config_1.default.NODE_ENV === "production",
                maxAge: closeSession,
            },
            store: new memoryStoreClass({
                checkPeriod: closeSession,
            }),
        }));
        this.app.use(passport_1.default.initialize());
        this.app.use(passport_1.default.session());
        passport_1.default.use((0, local_strategy_1.localStrategy)());
        passport_1.default.serializeUser((user, done) => {
            return done(null, user);
        });
        passport_1.default.deserializeUser((user, done) => __awaiter(this, void 0, void 0, function* () {
            const findUser = yield users_entity_1.Users.findByPk(user.id, {
                attributes: {
                    exclude: ["password"],
                },
            });
            if (!findUser)
                return done({ message: "error authenticated" });
            return done(null, findUser);
        }));
    }
    routes() {
        this.app.use((0, morgan_1.default)("dev"));
        const apiRouter = express_1.default.Router();
        const webRouter = express_1.default.Router();
        const authRouter = express_1.default.Router();
        const adminRouter = express_1.default.Router();
        (0, express_core_1.attachControllers)(webRouter, web_router_1.webRouters);
        (0, express_core_1.attachControllers)(apiRouter, api_router_1.apiRouters);
        (0, express_core_1.attachControllers)(authRouter, auth_router_1.authRouters);
        (0, express_core_1.attachControllers)(adminRouter, admin_router_1.adminRouters);
        express_core_1.Container.provide([
            { provide: express_core_1.ERROR_MIDDLEWARE, useClass: handler_1.ServerErrorMiddleware },
        ]);
        this.app.use("/auth", authRouter);
        this.app.use("/admin", adminRouter);
        this.app.use("/api", apiRouter);
        this.app.use("/", webRouter);
        this.app.use(middleware_route_1.middlewareRoute);
    }
    sockets() {
        const server = new node_http_1.default.Server(this.app);
        server.setTimeout(1800000);
        const io = new socket.Server(server);
        express_core_1.Container.provide([
            { provide: express_core_1.IO_MIDDLEWARE, useClass: websocket_1.GlobalMiddleware },
        ]);
        (0, express_core_1.attachSocketControllers)(io, sockets_router_1.socketsRouters);
        return server;
    }
    listen() {
        const server = this.sockets().listen(enviroments_config_1.default.PORT, () => {
            helpers_1.logger.primary(`Run server in port ${enviroments_config_1.default.PORT}`);
        });
        return server;
    }
}
exports.Server = Server;
