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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmpresasApiService = exports.openAis = void 0;
exports.initial = initial;
const express_core_1 = require("@vigilio/express-core");
const empresas_entity_1 = require("../entities/empresas.entity");
const express_core_2 = require("@vigilio/express-core");
const address_entity_1 = require("../entities/address.entity");
const helpers_1 = require("@/uploads/libs/helpers");
const node_fs_1 = __importDefault(require("node:fs"));
const metodosPago_entity_1 = require("../entities/metodosPago.entity");
const users_api_service_1 = require("@/users/services/users.api.service");
const helpers_2 = require("@vigilio/express-core/helpers");
const openai_1 = __importDefault(require("openai"));
const regions_entity_1 = require("@/ubigeo/entities/regions.entity");
const regions_empresa_entity_1 = require("@/ubigeo/entities/regions_empresa.entity");
const countries_entity_1 = require("@/ubigeo/entities/countries.entity");
const background_api_service_1 = require("./background.api.service");
const libs_1 = require("../libs");
const mesas_seeder_1 = require("../seeders/mesas.seeder");
const floors_entity_1 = require("@/orders/entities/floors.entity");
const helpers_3 = require("~/libs/helpers");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const settings_entity_1 = require("../entities/settings.entity");
const dayjs_1 = require("~/libs/dayjs");
const ai_1 = require("@/bot/libs/ai");
const backup_api_service_1 = require("./backup.api.service");
const node_ssh_1 = require("node-ssh");
const subdominio_1 = require("../libs/subdominio");
const tipo_entity_1 = require("@/finanzas/entities/tipo.entity");
const finanzas_seeder_1 = require("@/finanzas/seeders/finanzas.seeder");
const categories_entity_1 = require("@/finanzas/entities/categories.entity");
const cache_1 = __importDefault(require("@vigilio/express-core/cache"));
const grid_banner_entity_1 = require("../entities/grid_banner.entity");
const users_entity_1 = require("@/users/entities/users.entity");
const users_seeder_1 = require("@/users/seeders/users.seeder");
const file_entity_1 = require("../entities/file.entity");
const background_entity_1 = require("../entities/background.entity");
const categories_entity_2 = require("@/products/entities/categories.entity");
const subcategories_entity_1 = require("@/products/entities/subcategories.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
const libs_2 = require("@/products/libs");
const brands_entitiy_1 = require("@/products/entities/brands.entitiy");
const products_api_service_1 = require("@/products/services/products.api.service");
const products_servicio_entity_1 = require("@/products/entities/products_servicio.entity");
const page_entity_1 = require("../entities/page.entity");
const grid_banner_page_entity_1 = require("../entities/grid_banner_page.entity");
const pages_api_service_1 = require("./pages.api.service");
exports.openAis = {};
function initial() {
    return __awaiter(this, void 0, void 0, function* () {
        const empresas = yield empresas_entity_1.Empresas.findAll({
            attributes: ["slug", "credentials", "payments", "telegram_token", "id"],
        });
        for (const empresa of empresas) {
            const openAiClient = new openai_1.default.OpenAI({
                apiKey: empresa.credentials.open_ai,
            });
            if (empresa.telegram_token) {
                yield (0, ai_1.initializeBot)(empresa, empresa.telegram_token);
            }
            const bg_color_header = yield settings_entity_1.Settings.findOrCreate({
                where: { empresa_id: empresa.id },
                defaults: { bg_color_header: "transparent" },
            });
            const products_limit = yield settings_entity_1.Settings.findOrCreate({
                where: { empresa_id: empresa.id },
                defaults: { products_limit: 10 },
            });
            const products_limit_offer = yield settings_entity_1.Settings.findOrCreate({
                where: { empresa_id: empresa.id },
                defaults: { products_limit_offer: 4 },
            });
            const enabled_zoho_mail = yield empresas_entity_1.Empresas.findOrCreate({
                where: { id: empresa.id },
                defaults: { enabled_zoho_mail: false },
            });
            if (!bg_color_header[1] && !bg_color_header[0].bg_color_header) {
                yield bg_color_header[0].update({ bg_color_header: "transparent" });
            }
            if (!enabled_zoho_mail[1] && !enabled_zoho_mail[0].enabled_zoho_mail) {
                yield enabled_zoho_mail[0].update({
                    enabled_zoho_mail: false,
                });
            }
            if (!products_limit[1] && !products_limit[0].products_limit) {
                yield products_limit[0].update({
                    products_limit: 5,
                });
            }
            if (!products_limit_offer[1] &&
                !products_limit_offer[0].products_limit_offer) {
                yield products_limit[0].update({
                    products_limit_offer: 4,
                });
            }
            exports.openAis = Object.assign(Object.assign({}, exports.openAis), { [empresa.slug]: openAiClient });
        }
    });
}
let EmpresasApiService = class EmpresasApiService {
    constructor(UsersApiService, backgroundApiService, productsApiService, pagesApiService) {
        this.UsersApiService = UsersApiService;
        this.backgroundApiService = backgroundApiService;
        this.productsApiService = productsApiService;
        this.pagesApiService = pagesApiService;
    }
    payment(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const iaTokens = JSON.parse((_a = cache_1.default.get(`IA_TOKENS:${slug}`)) !== null && _a !== void 0 ? _a : "null");
            if (iaTokens) {
                yield empresas_entity_1.Empresas.update(iaTokens, { where: { slug } });
                cache_1.default.delete(`IA_TOKENS:${slug}`);
            }
            const data = yield empresas_entity_1.Empresas.findOne({
                where: { slug },
                attributes: [
                    "payments",
                    "slug",
                    "id",
                    "credentials",
                    "enabled_zoho_mail",
                ],
            });
            if (!data)
                throw new express_core_2.NotFoundException(`no se encontró ${slug}`);
            return {
                success: true,
                data,
            };
        });
    }
    settings(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empresa } = yield this.show(slug);
            const data = yield settings_entity_1.Settings.findOne({
                where: {
                    empresa_id: empresa.id,
                },
            });
            if (!data)
                throw new express_core_2.NotFoundException("no se encontró settings");
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                data,
            };
        });
    }
    settingsTemplate(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data: setting } = yield this.settings(slug);
            const { empresa } = yield this.show(slug);
            const gridBanners = yield grid_banner_entity_1.GridBanner.findAll({
                where: {
                    empresa_id: empresa.id,
                },
                order: [["id", "ASC"]],
            });
            const pages = yield page_entity_1.Page.findAll({
                where: {
                    empresa_id: empresa.id,
                },
                include: [grid_banner_page_entity_1.GridBannerPage],
            });
            let files = yield file_entity_1.FileSchema.findAll({
                where: { empresa_id: empresa.id },
            });
            files = files.map((f) => {
                var _a;
                const file = f.file
                    ? (_a = f.file) === null || _a === void 0 ? void 0 : _a.map((file) => {
                        return Object.assign(Object.assign({}, file), { file: `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/${file.file}` });
                    })
                    : null;
                return Object.assign(Object.assign({}, f.toJSON()), { file });
            });
            let backgrounds = yield background_entity_1.Background.findAll({
                where: { empresa_id: empresa.id },
            });
            backgrounds = backgrounds.map((f) => {
                var _a;
                const image = f.image
                    ? (_a = f.image) === null || _a === void 0 ? void 0 : _a.map((file) => {
                        return Object.assign(Object.assign({}, file), { file: `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/${file.file}` });
                    })
                    : null;
                return Object.assign(Object.assign({}, f.toJSON()), { image });
            });
            let categories = yield categories_entity_2.Categories.findAll({
                where: { empresa_id: empresa.id },
                limit: 2,
            });
            let brands = yield brands_entitiy_1.Brands.findAll({
                where: { empresa_id: empresa.id },
            });
            brands = (yield Promise.all(brands.map((brand) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const image = brand.image
                    ? (_a = brand.image) === null || _a === void 0 ? void 0 : _a.map((file) => {
                        return Object.assign(Object.assign({}, file), { file: `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/${file.file}` });
                    })
                    : null;
                return Object.assign(Object.assign({}, brand.toJSON()), { image });
            }))));
            categories = yield Promise.all(categories.map((category) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const image = category.image
                    ? category.image.map((file) => {
                        return Object.assign(Object.assign({}, file), { file: `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/${file.file}` });
                    })
                    : null;
                const wallpaper = (_a = category.wallpaper) === null || _a === void 0 ? void 0 : _a.map((file) => {
                    return Object.assign(Object.assign({}, file), { file: `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/${file.file}` });
                });
                let subcategories = (yield category.$get("subcategories"));
                subcategories = subcategories.map((sub) => {
                    const image = sub.image
                        ? sub.image.map((file) => {
                            return Object.assign(Object.assign({}, file), { file: `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/${file.file}` });
                        })
                        : null;
                    return Object.assign(Object.assign({}, sub.toJSON()), { image,
                        wallpaper });
                });
                let productsNormals = (yield category.$get("productsNormals"));
                productsNormals = (yield Promise.all(productsNormals.map((prod) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    const product = yield (0, libs_2.getProductAll)(empresa, prod, null, false);
                    const images = prod.images
                        ? (_a = prod.images) === null || _a === void 0 ? void 0 : _a.map((file) => {
                            return Object.assign(Object.assign({}, file), { file: `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/${file.file}` });
                        })
                        : null;
                    return Object.assign(Object.assign({}, prod.toJSON()), { images, options: product.dataValues.options.map((opt) => ({
                            option_id: opt.id,
                            features: opt.features.map((feat) => feat.id),
                        })) });
                }))));
                let productsRestaurants = (yield category.$get("productsRestaurants"));
                productsRestaurants = productsRestaurants.map((prod) => {
                    var _a;
                    const images = prod.images
                        ? (_a = prod.images) === null || _a === void 0 ? void 0 : _a.map((file) => {
                            return Object.assign(Object.assign({}, file), { file: `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/${file.file}` });
                        })
                        : null;
                    return Object.assign(Object.assign({}, prod.toJSON()), { images });
                });
                let productsServicios = (yield category.$get("productsServicios"));
                productsServicios = productsServicios.map((prod) => {
                    const images = prod.images
                        ? prod.images.map((file) => {
                            return Object.assign(Object.assign({}, file), { file: `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/${file.file}` });
                        })
                        : null;
                    return Object.assign(Object.assign({}, prod.toJSON()), { images });
                });
                return Object.assign(Object.assign({}, category.toJSON()), { image: category.image ? image : null, wallpaper: category.wallpaper ? wallpaper : null, subcategories,
                    productsNormals,
                    productsRestaurants,
                    productsServicios });
            })));
            const settingsBackground = Object.assign(Object.assign({}, setting.toJSON()), { background_auth: setting.background_auth
                    ? setting.background_auth.map((file) => {
                        return Object.assign(Object.assign({}, file), { file: `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/${file.file}` });
                    })
                    : null });
            return {
                success: true,
                data: {
                    setting: settingsBackground,
                    gridBanners: gridBanners,
                    files,
                    pages,
                    backgrounds,
                    categories,
                    brands,
                },
            };
        });
    }
    updateSettings(slug, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empresa } = yield this.show(slug);
            const data = yield settings_entity_1.Settings.findOne({
                where: {
                    empresa_id: empresa.id,
                },
            });
            yield data.update(body);
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                message: "Editado correctamente",
            };
        });
    }
    paymentUpdate(slug, paymentDto) {
        return __awaiter(this, void 0, void 0, function* () {
            if (paymentDto.secure !== "dokixd123@")
                throw new express_core_2.BadRequestException("Error");
            const { data } = yield this.payment(slug);
            const { token, secure, enabled_zoho_mail } = paymentDto, rest = __rest(paymentDto, ["token", "secure", "enabled_zoho_mail"]);
            yield data.update({
                payments: rest,
                credentials: Object.assign(Object.assign({}, data.credentials), { open_ai: paymentDto.token }),
                enabled_zoho_mail,
            });
            cache_1.default.delete(`EMPRESA:${slug}`);
            return {
                success: true,
                data,
            };
        });
    }
    show(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            let empresa = null;
            if (!Number.isNaN(Number(slug))) {
                empresa = yield empresas_entity_1.Empresas.findByPk(Number(slug), {
                    attributes: {
                        exclude: ["company", "groupWhatsapp"],
                    },
                });
            }
            else {
                empresa = yield empresas_entity_1.Empresas.findOne({
                    where: {
                        slug,
                    },
                    attributes: {
                        exclude: ["company", "groupWhatsapp"],
                    },
                });
            }
            if (!empresa) {
                throw new express_core_2.NotFoundException(`No se encontró un informacion con ${slug}`);
            }
            return {
                success: true,
                empresa,
            };
        });
    }
    store(body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            let empresa = null;
            try {
                const { password, fullname } = body, rest = __rest(body, ["password", "fullname"]);
                const existingEmpresa = yield empresas_entity_1.Empresas.findOne({
                    where: { slug: body.slug },
                });
                if (existingEmpresa) {
                    throw new Error("El slug ya está en uso");
                }
                empresa = new empresas_entity_1.Empresas(Object.assign(Object.assign({}, rest), { enabled_booster: false, enabledBot: true, enabledBotWeb: true, enabledClientPayComision: false, enabled_igv: true, enabledSound: true, isOpen: true, enabledAnimation: false, enabled_catalogo: true, enable_sell_country: false, token: `${body.slug}-${(0, helpers_2.generateId)().slice(4, 12)}`, whatsapp_mode: {
                        type: "FREE",
                        ip: null,
                        password: null,
                        memory: null,
                        cpu: null,
                    }, enable_map_marker: false, enabled_address: true, photo: [
                        {
                            file: `https://www.${body.slug}.vigilio-services.com/images/settings/others/restaurant.jpg`,
                            dimension: 800,
                        },
                    ], icon: null, logo_pwa: null }));
                yield empresa.save();
                const dirEmpresa = `${(0, helpers_1.pathUploads)()}/${empresa.slug}`;
                if (!node_fs_1.default.existsSync((0, helpers_1.pathUploads)())) {
                    node_fs_1.default.mkdirSync((0, helpers_1.pathUploads)());
                    console.log("Creado directorio correctamente");
                }
                if (!node_fs_1.default.existsSync(dirEmpresa)) {
                    node_fs_1.default.mkdirSync(dirEmpresa);
                    console.log("Creado directorio correctamente");
                }
                for (const entity of helpers_1.uploadsEntities) {
                    const dir = `${dirEmpresa}/images`;
                    const dirEntity = `${dir}/${entity}`;
                    if (!node_fs_1.default.existsSync(dir)) {
                        node_fs_1.default.mkdirSync(dir);
                        console.log("Creado directorio correctamente");
                    }
                    if (!node_fs_1.default.existsSync(dirEntity)) {
                        node_fs_1.default.mkdirSync(dirEntity);
                        console.log("Creado directorio correctamente");
                    }
                }
                if (body.servicio_id === 2) {
                    yield Promise.all(mesas_seeder_1.mesasSeeder.map((floor) => __awaiter(this, void 0, void 0, function* () {
                        const newFloor = yield floors_entity_1.Floors.create({
                            name: floor.name,
                            empresa_id: empresa.id,
                        });
                        yield Promise.all(floor.mesas.map((mesa) => __awaiter(this, void 0, void 0, function* () {
                            yield newFloor.$create("mesa", {
                                mesa_code: mesa.mesa_code,
                                empresa_id: empresa.id,
                            });
                        })));
                    })));
                }
                if (body.backgrounds) {
                    yield Promise.all(body.backgrounds.map((background) => __awaiter(this, void 0, void 0, function* () {
                        const { empresa_id, id } = background, rest = __rest(background, ["empresa_id", "id"]);
                        const image = yield Promise.all(background.image.map((f) => __awaiter(this, void 0, void 0, function* () {
                            const file = f.file.substring(f.file.indexOf("/images"));
                            const dirEmpresa = `${(0, helpers_1.pathUploads)()}/${empresa.slug}`;
                            const dirEntity = `${dirEmpresa}${file}`;
                            yield (0, helpers_3.downloadAndSaveFile)(f.file, dirEntity);
                            return Object.assign(Object.assign({}, f), { file });
                        })));
                        yield this.backgroundApiService.store(empresa, Object.assign(Object.assign({}, rest), { image }));
                    })));
                }
                else {
                    yield this.backgroundApiService.store(empresa, {
                        image: [
                            {
                                file: `${(0, libs_1.BASE_URL)(empresa)}/images/settings/others/slider.jpg`,
                                dimension: 1000,
                            },
                        ],
                        html: null,
                    });
                }
                const transferencias = {};
                for (const banco of empresa.bancos) {
                    transferencias[banco.key] = {
                        titular: body.isTemplate ? "TEST-VIGILIO-SERVICES" : null,
                        dolares: body.isTemplate ? "TEST-VIGILIO-SERVICES" : null,
                        [empresa.money.simbolo]: body.isTemplate
                            ? "TEST-VIGILIO-SERVICES"
                            : null,
                    };
                }
                const am8 = "09:00";
                const pm8 = "18:00";
                if (body.setting.background_auth) {
                    const imag = yield Promise.all(body.setting.background_auth.map((f) => __awaiter(this, void 0, void 0, function* () {
                        const file = f.file.substring(f.file.indexOf("/images"));
                        const dirEmpresa = `${(0, helpers_1.pathUploads)()}/${empresa.slug}`;
                        const dirEntity = `${dirEmpresa}${file}`;
                        yield (0, helpers_3.downloadAndSaveFile)(f.file, dirEntity);
                        return Object.assign(Object.assign({}, f), { file });
                    })));
                }
                yield Promise.all([
                    empresa.$create("metodos_pago", {
                        transferencias,
                        enable_efectivo: true,
                        mercado_pago: {
                            token: body.isTemplate ? "test-key" : null,
                            enabled: body.isTemplate,
                        },
                        qrYape: null,
                        qrPlin: null,
                        paypal: {
                            enabled: body.isTemplate,
                            paypal_client_id: body.isTemplate ? "test-key" : null,
                            paypal_secret_key: body.isTemplate ? "test-key" : null,
                        },
                        izipay: {
                            enabled: body.isTemplate,
                            izipay_client_id: body.isTemplate ? "test-key" : null,
                            izipay_client_secret: body.isTemplate
                                ? "test-key"
                                : null,
                            izipay_hash_key: body.isTemplate ? "test-key" : null,
                            izipay_public_key: body.isTemplate ? "test-key" : null,
                            izipay_url: body.isTemplate ? "test-key" : null,
                        },
                        stripe: {
                            enabled: body.isTemplate,
                            stripe_client_secret: body.isTemplate
                                ? "test-key"
                                : null,
                            stripe_secret_key: body.isTemplate ? "test-key" : null,
                        },
                    }),
                    empresa.$create("address", {
                        city_id: 1,
                        urbanizacion: "",
                        direccion: "",
                        codLocal: "0000",
                    }),
                    empresa.$create("setting", Object.assign(Object.assign({}, body.setting), { host: {
                            enabled: false,
                            host: null,
                            nameserver_one: null,
                            nameserver_two: null,
                            time: null,
                        } })),
                    yield empresa.$create("citasSetting", {
                        max_days: 14,
                        max_minutes: 60,
                        sendQuestionChunk: false,
                        enabled: true,
                        isNextDay: true,
                        maxCitas: 1,
                        sendAlert: 5,
                        maxCitasForHour: 1,
                        questions: [
                            {
                                question: "¿Cual es tu nombre completo?",
                                options: [],
                            },
                            {
                                question: "¿En que plataforma te gustaría la Cita?",
                                options: ["Microsoft Teams", "Discord", "Zoom"],
                            },
                        ],
                        custom: null,
                        horario: [
                            {
                                id: 1,
                                day: "Lunes",
                                openTime: am8,
                                closeTime: pm8,
                                enabled: true,
                            },
                            {
                                id: 2,
                                day: "Martes",
                                openTime: am8,
                                closeTime: pm8,
                                enabled: true,
                            },
                            {
                                id: 3,
                                day: "Miercoles",
                                openTime: am8,
                                closeTime: pm8,
                                enabled: true,
                            },
                            {
                                id: 4,
                                day: "Jueves",
                                openTime: am8,
                                closeTime: pm8,
                                enabled: true,
                            },
                            {
                                id: 5,
                                day: "Viernes",
                                openTime: am8,
                                closeTime: pm8,
                                enabled: true,
                            },
                            {
                                id: 6,
                                day: "Sabado",
                                openTime: am8,
                                closeTime: pm8,
                                enabled: true,
                            },
                            {
                                id: 0,
                                day: "Domingo",
                                openTime: am8,
                                closeTime: pm8,
                                enabled: false,
                            },
                        ],
                    }),
                ]);
                let gridBannersMap = null;
                if ((_a = body.gridBanners) === null || _a === void 0 ? void 0 : _a.length) {
                    gridBannersMap = yield Promise.all(body.gridBanners.map((grid) => __awaiter(this, void 0, void 0, function* () {
                        const { id } = grid, rest = __rest(grid, ["id"]);
                        const g = yield grid_banner_entity_1.GridBanner.create(Object.assign(Object.assign({}, rest), { empresa_id: empresa.id }));
                        return Object.assign(Object.assign({}, g.toJSON()), { id_test: id });
                    })));
                }
                else {
                    yield grid_banner_entity_1.GridBanner.bulkCreate([
                        {
                            html: "",
                            enabled: false,
                            empresa_id: empresa.id,
                            title: null,
                        },
                        {
                            html: "",
                            enabled: false,
                            title: null,
                            empresa_id: empresa.id,
                        },
                        {
                            html: "",
                            enabled: false,
                            title: null,
                            empresa_id: empresa.id,
                        },
                        {
                            html: "",
                            title: null,
                            enabled: false,
                            empresa_id: empresa.id,
                        },
                        {
                            html: "",
                            title: null,
                            enabled: false,
                            empresa_id: empresa.id,
                        },
                    ]);
                }
                if ((_b = body.pages) === null || _b === void 0 ? void 0 : _b.length) {
                    yield Promise.all(body.pages.map((page) => __awaiter(this, void 0, void 0, function* () {
                        const { grid_banner_pages, id } = page, resto = __rest(page, ["grid_banner_pages", "id"]);
                        const newpage = yield page_entity_1.Page.create(Object.assign(Object.assign({}, resto), { empresa_id: empresa.id }));
                        yield Promise.all(page.grid_banner_pages.map((grid) => __awaiter(this, void 0, void 0, function* () {
                            const { grid_banner_id } = grid, rest = __rest(grid, ["grid_banner_id"]);
                            const findBannerTest = gridBannersMap === null || gridBannersMap === void 0 ? void 0 : gridBannersMap.find((grid) => grid.id_test === grid_banner_id);
                            const gridBanner = findBannerTest
                                ? yield grid_banner_entity_1.GridBanner.findByPk(findBannerTest.id)
                                : null;
                            yield grid_banner_page_entity_1.GridBannerPage.create(Object.assign(Object.assign({}, rest), { page_id: newpage.id, empresa_id: empresa.id, grid_banner_id: gridBanner
                                    ? findBannerTest.id
                                    : null }));
                        })));
                    })));
                }
                else {
                    yield Promise.all([
                        this.pagesApiService.store(empresa, {
                            title: "Nosotros",
                            description: `Bienvenidos a ${empresa.name_empresa}`,
                            slug: "nosotros",
                            empresa_id: empresa.id,
                            icon: "<i class='fas fa-users'></i>",
                        }),
                        this.pagesApiService.store(empresa, {
                            title: "Shop",
                            description: `Bienvenidos a ${empresa.name_empresa}`,
                            slug: "shop",
                            empresa_id: empresa.id,
                            icon: "<i class='fas fa-store'></i>",
                        }),
                        this.pagesApiService.store(empresa, {
                            title: "Servicios",
                            description: `En ${empresa.name_empresa}, ofrecemos una amplia variedad de productos de alta calidad a precios inmejorables, encontrarás todo lo que necesitas en un solo lugar. Disfruta de envíos rápidos, devoluciones fáciles y un servicio al cliente excepcional. ¡Explora nuestras ofertas diarias y descubre la diferencia de comprar en Tienda XYZ!`,
                            slug: "servicios",
                            empresa_id: empresa.id,
                            icon: "<i class='fas fa-building'></i>",
                        }),
                        this.pagesApiService.store(empresa, {
                            title: "Contacto",
                            description: `En ${empresa.name_empresa}, ofrecemos una amplia variedad de productos de alta calidad a precios inmejorables, encontrarás todo lo que necesitas en un solo lugar. Disfruta de envíos rápidos, devoluciones fáciles y un servicio al cliente excepcional. ¡Explora nuestras ofertas diarias y descubre la diferencia de comprar en Tienda XYZ!`,
                            slug: "contacto",
                            empresa_id: empresa.id,
                            icon: "<i class='fas fa-envelope-open'></i>",
                        }),
                    ]);
                }
                if (body.isTemplate) {
                    yield users_entity_1.Users.bulkCreate(users_seeder_1.usersSeeder.map((user) => (Object.assign(Object.assign({}, user), { empresa_id: empresa.id }))));
                    yield empresa.update({
                        telephoneFirst: "990317888",
                        telephoneReclamos: "99045238",
                        telephoneThird: "9903145843",
                        facebook: "https://www.facebook.com/",
                        tiktok: "https://www.tiktok.com/",
                        instagram: "https://www.instagram.com/",
                        twitter: "https://www.twitter.com/",
                        youtube: "https://www.youtube.com/",
                    });
                }
                yield Promise.all(body.files.map((f) => __awaiter(this, void 0, void 0, function* () {
                    const { id } = f, rest = __rest(f, ["id"]);
                    const file = yield Promise.all(f.file.map((f) => __awaiter(this, void 0, void 0, function* () {
                        const file = f.file.substring(f.file.indexOf("/images"));
                        const dirEmpresa = `${(0, helpers_1.pathUploads)()}/${empresa.slug}`;
                        const dirEntity = `${dirEmpresa}${file}`;
                        yield (0, helpers_3.downloadAndSaveFile)(f.file, dirEntity);
                        return Object.assign(Object.assign({}, f), { file });
                    })));
                    yield file_entity_1.FileSchema.create(Object.assign(Object.assign({}, rest), { empresa_id: empresa.id, file }));
                })));
                let brands = [];
                if (body.brands) {
                    brands = (yield Promise.all(body.brands.map((brand) => __awaiter(this, void 0, void 0, function* () {
                        const { id, empresa_id } = brand, rest = __rest(brand, ["id", "empresa_id"]);
                        const br = yield brands_entitiy_1.Brands.create(Object.assign(Object.assign({}, rest), { empresa_id: empresa.id }));
                        let image = null;
                        if (brand.image) {
                            image = yield Promise.all(brand.image.map((f) => __awaiter(this, void 0, void 0, function* () {
                                const file = f.file.substring(f.file.indexOf("/images"));
                                const dirEmpresa = `${(0, helpers_1.pathUploads)()}/${empresa.slug}`;
                                const dirEntity = `${dirEmpresa}${file}`;
                                yield (0, helpers_3.downloadAndSaveFile)(f.file, dirEntity);
                                return Object.assign(Object.assign({}, f), { file });
                            })));
                        }
                        return Object.assign(Object.assign({}, br), { id_test: brand.id, image });
                    }))));
                }
                if (body.categories) {
                    yield Promise.all(body.categories.map((category) => __awaiter(this, void 0, void 0, function* () {
                        const { id, productsNormals, productsRestaurants, productsServicios, subcategories, empresa_id } = category, rest = __rest(category, ["id", "productsNormals", "productsRestaurants", "productsServicios", "subcategories", "empresa_id"]);
                        const categoria = yield categories_entity_2.Categories.create(Object.assign(Object.assign({}, rest), { empresa_id: empresa.id }));
                        const subcategorias = yield Promise.all(subcategories.map((sub) => __awaiter(this, void 0, void 0, function* () {
                            const { empresa_id, id } = sub, rest = __rest(sub, ["empresa_id", "id"]);
                            let image = null;
                            if (sub.image) {
                                image = yield Promise.all(sub.image.map((f) => __awaiter(this, void 0, void 0, function* () {
                                    const file = f.file.substring(f.file.indexOf("/images"));
                                    const dirEmpresa = `${(0, helpers_1.pathUploads)()}/${empresa.slug}`;
                                    const dirEntity = `${dirEmpresa}${file}`;
                                    yield (0, helpers_3.downloadAndSaveFile)(f.file, dirEntity);
                                    return Object.assign(Object.assign({}, f), { file });
                                })));
                            }
                            const subcategoria = yield subcategories_entity_1.Subcategories.create(Object.assign(Object.assign({}, rest), { empresa_id: empresa.id, category_id: categoria.id, image }));
                            return Object.assign(Object.assign({}, subcategoria.toJSON()), { id_test: id });
                        })));
                        yield Promise.all(productsNormals.map((prod) => __awaiter(this, void 0, void 0, function* () {
                            const subcategory_id = subcategorias.find((sub) => sub.id_test === prod.subcategory_id);
                            const brand_id = brands.find((br) => br.id_test === prod.brand_id);
                            const { images } = prod, rest = __rest(prod, ["images"]);
                            let result = null;
                            if (images) {
                                result = yield Promise.all(images.map((f) => __awaiter(this, void 0, void 0, function* () {
                                    const file = f.file.substring(f.file.indexOf("/images"));
                                    const dirEmpresa = `${(0, helpers_1.pathUploads)()}/${empresa.slug}`;
                                    const dirEntity = `${dirEmpresa}${file}`;
                                    yield (0, helpers_3.downloadAndSaveFile)(f.file, dirEntity);
                                    return Object.assign(Object.assign({}, f), { file });
                                })));
                            }
                            yield this.productsApiService.store(Object.assign(Object.assign({}, empresa.toJSON()), { tipo_empresa: {
                                    tipo_servicio_id: body.servicio_id,
                                } }), Object.assign(Object.assign({}, rest), { category_id: categoria.id, empresa_id: empresa.id, subcategory_id: subcategory_id
                                    ? subcategory_id.id
                                    : null, brand_id: brand_id ? brand_id.id : null, images: result }), true, false);
                        })));
                        yield Promise.all(productsRestaurants.map((prod) => __awaiter(this, void 0, void 0, function* () {
                            const { id } = prod, rest = __rest(prod, ["id"]);
                            let images = null;
                            if (prod.images) {
                                images = yield Promise.all(prod.images.map((f) => __awaiter(this, void 0, void 0, function* () {
                                    const file = f.file.substring(f.file.indexOf("/images"));
                                    const dirEmpresa = `${(0, helpers_1.pathUploads)()}/${empresa.slug}`;
                                    const dirEntity = `${dirEmpresa}${file}`;
                                    yield (0, helpers_3.downloadAndSaveFile)(f.file, dirEntity);
                                    return Object.assign(Object.assign({}, f), { file });
                                })));
                            }
                            yield products_restaurant_entity_1.ProductsRestaurant.create(Object.assign(Object.assign({}, rest), { category_id: categoria.id, empresa_id: empresa.id, images }));
                        })));
                        yield Promise.all(productsServicios.map((prod) => __awaiter(this, void 0, void 0, function* () {
                            const { id } = prod, rest = __rest(prod, ["id"]);
                            let images = null;
                            if (prod.images) {
                                images = yield Promise.all(prod.images.map((f) => __awaiter(this, void 0, void 0, function* () {
                                    const file = f.file.substring(f.file.indexOf("/images"));
                                    const dirEmpresa = `${(0, helpers_1.pathUploads)()}/${empresa.slug}`;
                                    const dirEntity = `${dirEmpresa}${file}`;
                                    yield (0, helpers_3.downloadAndSaveFile)(f.file, dirEntity);
                                    return Object.assign(Object.assign({}, f), { file });
                                })));
                            }
                            yield products_servicio_entity_1.ProductsServicio.create(Object.assign(Object.assign({}, rest), { category_id: categoria.id, empresa_id: empresa.id, images }));
                        })));
                    })));
                }
                const username = `${fullname}${Math.random()
                    .toString(32)
                    .slice(3, 4)}`;
                const name = fullname.split(" ");
                yield this.UsersApiService.store(empresa, {
                    name: name[0],
                    lastname: (_c = name[1]) !== null && _c !== void 0 ? _c : "",
                    email: null,
                    password,
                    telephone: empresa.telephoneFirst,
                    username,
                    enabled: true,
                    address: null,
                    birthday: new Date(),
                    slug: (0, helpers_2.slug)(username),
                    role_id: 1,
                    empresa_id: empresa.id,
                    speciality: null,
                    buys: [],
                    identification_number: null,
                    reference: null,
                    city_id: null,
                });
                const openAiClient = new openai_1.default.OpenAI({
                    apiKey: empresa.credentials.open_ai,
                });
                exports.openAis = Object.assign(Object.assign({}, exports.openAis), { [empresa.slug]: openAiClient });
                const regions = yield regions_entity_1.Regions.findAll({
                    include: [
                        {
                            model: countries_entity_1.Countries,
                            where: {
                                code: empresa.dial_code,
                            },
                            required: true,
                        },
                    ],
                });
                yield Promise.all(regions.map((region) => __awaiter(this, void 0, void 0, function* () {
                    yield regions_empresa_entity_1.RegionsEmpresa.create({
                        region_id: region.id,
                        empresa_id: empresa.id,
                        days: 3,
                        enabled: true,
                        priceShipping: 0,
                    });
                })));
                yield Promise.all(finanzas_seeder_1.finanzasSeeder.map((tipo) => __awaiter(this, void 0, void 0, function* () {
                    const tipoFinanza = yield tipo_entity_1.TipoFinanza.create({
                        name: tipo.name,
                        empresa_id: empresa.id,
                    });
                    yield Promise.all(tipo.categories.map((cat) => __awaiter(this, void 0, void 0, function* () {
                        yield categories_entity_1.CategoriesFinanzas.create({
                            value: cat.value,
                            icon: cat.icon,
                            tipo_finanza_id: tipoFinanza.id,
                            empresa_id: empresa.id,
                        });
                    })));
                })));
                if (enviroments_config_1.default.NODE_ENV === "production" && body.isWhatsappFree) {
                    yield (0, helpers_3.terminal)(`docker volume create ${empresa.slug} && docker run -d --name ${empresa.slug} -e PORT=5000 -e NODE_ENV=${enviroments_config_1.default.NODE_ENV} -e SESSION_NAME=${empresa.slug} -e VITE_TOKEN_VIGILIO_SERVICES=${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES} --restart always --memory="2000m" --memory-swap="2000m" --cpus="2" -p ${empresa.port}:5000 -v ${empresa.slug}:/app/data ${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP}`);
                }
                cache_1.default.delete("CACHE_HOST");
                return {
                    success: true,
                    message: "Nuevo información agregado correctamente.",
                };
            }
            catch (error) {
                console.log(error.message);
                if (empresa) {
                    empresa.destroy();
                }
                throw new express_core_1.InternalServerErrorException("Error al agregar empresa");
            }
        });
    }
    whatsapp_mode(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${enviroments_config_1.default.VITE_VIGILIO_WEB}/api/empresas/whatsapp/${empresa.slug}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                    "access-token": enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES,
                },
            });
            const result = yield response.json();
            if (!result.success)
                throw new express_core_2.BadRequestException(result.message);
            if (body.whatsapp_mode.type === "FREE") {
                const result = yield (0, backup_api_service_1.vpsShowApi)();
                yield (0, helpers_3.terminal)(`docker volume create ${empresa.slug} && docker run -d --name ${empresa.slug} -e PORT=5000 -e NODE_ENV=${enviroments_config_1.default.NODE_ENV} -e SESSION_NAME=${empresa.slug} -e VITE_TOKEN_VIGILIO_SERVICES=${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES} --restart always --memory="${result.vps.whatsapp_ram || "1000"}m" --memory-swap="${result.vps.whatsapp_ram || "1000"}m" --cpus="${result.vps.whatsapp_cpu_max || "1"}" -p ${empresa.port}:5000 -v ${empresa.slug}:/app/data ${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP}`);
            }
            if (body.whatsapp_mode.type === "VPS") {
                const ssh = new node_ssh_1.NodeSSH();
                try {
                    yield ssh.connect({
                        host: body.whatsapp_mode.ip,
                        username: "root",
                        password: body.whatsapp_mode.password,
                    });
                    console.log("Conectado correctamente a vps");
                    const commands = `
                    # Asegúrate de que dpkg no esté interrumpido
                    dpkg --configure -a || true;
        
                    # Configurar debconf para la instalación de GRUB
                    echo 'grub-pc grub-pc/bootdev select /dev/sda' | debconf-set-selections;
                    echo 'grub-pc grub-pc/install_devices multiselect /dev/sda' | debconf-set-selections;
        
                    # Actualizar el sistema
                    apt update -y;
                    apt upgrade -y;
        
                    # Instalar dependencias necesarias
                    apt-get install -y git nginx sudo nano curl;
                    apt install -y apt-transport-https ca-certificates software-properties-common;
        
                    # Agregar la clave GPG de Docker
                    curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -;
        
                    # Agregar el repositorio de Docker
                    echo "deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list;
        
                    # Instalar Docker
                    apt update -y;
                    apt install -y docker-ce;
        
                    # Verificar si existe un contenedor y eliminarlo
                    if sudo docker ps -a -q --filter "name=${empresa.slug}"; then \
                        sudo docker stop ${empresa.slug} || true; \
                        sudo docker rm ${empresa.slug} || true; \
                        sudo docker volume rm ${empresa.slug} || true; \
                    fi; 
        
                    # Borrar imagen si existe
                    if sudo docker images -q "${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP}"; then \
                        sudo docker rmi "${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP}" || true; \
                    fi; 
        
                    # Crear un volumen para el contenedor
                    sudo docker volume create ${empresa.slug}; 
        
                    # Ejecutar el contenedor
                    sudo docker run -d --name ${empresa.slug} \
                        -e PORT=5000 \
                        -e NODE_ENV=production \
                        -e SESSION_NAME=${empresa.slug} \
                        -e VITE_TOKEN_VIGILIO_SERVICES=${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES} \
                        --restart always \
                        --memory="${Number(body.whatsapp_mode.memory) - 0.2}g" \
                        --memory-swap="${Number(body.whatsapp_mode.memory) - 0.2}g" \
                        --cpus="${Number(body.whatsapp_mode.cpu) - 0.2}" \
                        -p ${empresa.port}:5000 \
                        -v ${empresa.slug}:/app/data \
                        ${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP}
                `;
                    const result = yield ssh.execCommand(commands);
                    console.log(`STDOUT: ${result.stdout}`);
                    console.error(`STDERR: ${result.stderr}`);
                }
                catch (error) {
                    console.error("Error al conectar o ejecutar los comandos:", error);
                    throw new express_core_2.BadRequestException(`error ${error.message}`);
                }
                finally {
                    ssh.dispose();
                }
            }
            yield empresas_entity_1.Empresas.update(body, {
                where: {
                    slug: empresa.slug,
                },
            });
            yield empresas_entity_1.Empresas.update({
                timeWhatsapp: (0, dayjs_1.NOW)(empresa).add(3, "minute").format(),
            }, {
                where: {
                    slug: empresa.slug,
                },
            });
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                message: "whatsapp mode cambiado correctamente",
            };
        });
    }
    private(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.findOne({
                where: { slug },
                attributes: {
                    exclude: ["groupWhatsapp"],
                },
            });
            if (!empresa) {
                throw new express_core_2.NotFoundException(`No se encontró un informacion`);
            }
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                empresa,
            };
        });
    }
    metodos_pago(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empresa } = yield this.show(slug);
            const metodo = yield metodosPago_entity_1.MetodosPago.findOne({
                where: {
                    empresa_id: empresa.id,
                },
            });
            if (!metodo)
                throw new express_core_2.BadRequestException("No se encontró metodo de pago");
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                metodo,
            };
        });
    }
    metodospago(slug, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { metodo } = yield this.metodos_pago(slug);
            const data = Object.entries(body.transferencias).map((body) => Object.values(body[1]).filter((val) => val));
            body.transferencias =
                data[0].length || data[1].length || data[2].length
                    ? body.transferencias
                    : null;
            yield metodo.update(body);
            return {
                success: true,
                message: "Editado correctamente",
            };
        });
    }
    update(emp, empresasUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empresa } = yield this.show(emp.slug);
            try {
                if (empresasUpdateDto.telegram_token &&
                    empresasUpdateDto.telegram_token !== empresa.telegram_token &&
                    empresa.payments.mensual.enabled &&
                    (0, dayjs_1.restarDays)(empresa, (0, dayjs_1.NOW)(empresa).format(), empresa.payments.mensual.date) > 0) {
                    yield (0, ai_1.initializeBot)(empresa, empresasUpdateDto.telegram_token);
                }
                cache_1.default.delete(`EMPRESA:${empresa.slug}`);
                yield empresa.update(empresasUpdateDto);
                return {
                    success: true,
                    empresa,
                };
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException(error.message);
            }
        });
    }
    whatsappConfigUpdate(slug, whatsappconfig) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.findOne({
                where: { slug },
                attributes: ["id", "whatsappconfig", "slug"],
            });
            if (!empresa)
                throw new express_core_2.NotFoundException("Error empresas.");
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            yield empresa.update({ whatsappconfig });
            return {
                success: true,
                message: "Se actualizó correctamente los mensajes de whatsapp",
            };
        });
    }
    company(emp, companyStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empresa } = yield this.show(emp.slug);
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            yield empresa.update({
                company: companyStoreDto,
            });
            return {
                success: true,
                empresa,
            };
        });
    }
    inteligenceArtificial(slug, empresasIAUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug },
                attributes: ["inteligenceArtificial", "id"],
            });
            if (!empresa)
                throw new express_core_2.BadRequestException("No informacion");
            yield empresa.update({
                inteligenceArtificial: empresasIAUpdateDto.inteligenceArtificial,
            });
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                message: "Se modificó correctamente el prompt de tu inteligencia Artificial.",
            };
        });
    }
    all(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug },
                attributes: ["id", "contacts", "groupWhatsapp"],
            });
            if (!empresa)
                throw new express_core_2.NotFoundException("Error empresas.");
            return { success: true, data: empresa.contacts };
        });
    }
    favorites(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug },
                attributes: ["id", "contacts", "groupWhatsapp"],
            });
            if (!empresa)
                throw new express_core_2.NotFoundException("Error empresas.");
            const favorites = empresa.contacts.filter((empresa) => empresa.isFavorite);
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return { success: true, favorites };
        });
    }
    address(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const address = yield address_entity_1.Address.findOne({
                where: { empresa_id: empresa.id },
            });
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            yield address.update(body);
            return {
                success: true,
                message: "Direccion Editado Correctamente",
            };
        });
    }
    contacts(slug, telephone, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug },
                attributes: ["id", "contacts", "groupWhatsapp"],
            });
            if (!empresa)
                throw new express_core_2.NotFoundException("Error empresas.");
            if (!empresa.contacts || !empresa.contacts.length)
                throw new express_core_2.BadRequestException("No hay contactos");
            const newChanges = empresa.contacts.map((contacto) => {
                if (contacto.telephone === telephone) {
                    return Object.assign(Object.assign({}, contacto), body);
                }
                return contacto;
            });
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            yield empresa.update({
                contacts: newChanges,
            });
            return {
                success: true,
                message: "Se realizo correctamente los cambios",
            };
        });
    }
    searchContact(slug, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug },
                attributes: ["id", "contacts", "groupWhatsapp"],
            });
            if (!empresa)
                throw new express_core_2.NotFoundException("Error empresas.");
            const findByNameContacts = empresa.contacts
                .filter((contact) => {
                var _a, _b;
                return ((_b = (_a = contact.telephone) !== null && _a !== void 0 ? _a : contact.name) !== null && _b !== void 0 ? _b : "")
                    .toLowerCase()
                    .startsWith(name.toLowerCase());
            })
                .slice(0, 10);
            return {
                success: true,
                data: findByNameContacts,
            };
        });
    }
    contactStore(slug, contactsSchema) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug },
                attributes: ["id", "contacts", "groupWhatsapp", "dial_code"],
            });
            if (!empresa)
                throw new express_core_2.NotFoundException("Error empresas.");
            const existNumero = empresa.contacts.find((cont) => cont.telephone.includes(contactsSchema.telephone));
            if (existNumero)
                throw new express_core_2.BadRequestException("Este numero ya existe en tu contacto", {
                    body: "telephone",
                });
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            yield empresa.update({
                contacts: [
                    ...empresa.contacts,
                    Object.assign(Object.assign({}, contactsSchema), { telephone: `${empresa.dial_code}${contactsSchema.telephone}@c.us` }),
                ],
            });
            return {
                success: true,
                message: "Se agregó nuevo contacto correctamente",
            };
        });
    }
    contactDestroy(slug, telephone) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug },
                attributes: ["id", "contacts", "groupWhatsapp"],
            });
            if (!empresa)
                throw new express_core_2.NotFoundException("Error empresas.");
            const existNumero = empresa.contacts.find((cont) => cont.telephone.includes(telephone));
            if (!existNumero)
                throw new express_core_2.BadRequestException("Este numero no existe");
            const filtered = empresa.contacts.filter((num) => num.telephone !== telephone);
            yield empresa.update({
                contacts: filtered,
            });
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                message: "Se agregó nuevo contacto correctamente",
            };
        });
    }
    scheduleUpdate(emp, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empresa } = yield this.show(emp.slug);
            yield empresa.update({ schedule: body.schedule });
            return {
                success: true,
                message: "Se edito horario de atención correctamente",
            };
        });
    }
    dominio(slug, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empresa } = yield this.show(slug);
            const response = yield fetch(`${enviroments_config_1.default.VITE_VIGILIO_WEB}/api/empresas/domain/${empresa.slug}`, {
                method: "POST",
                body: JSON.stringify({ dominio: body.host }),
                headers: {
                    "Content-Type": "application/json",
                    "access-token": enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES,
                },
            });
            const result = yield response.json();
            if (!result.success) {
                if (result.body) {
                    throw new express_core_2.BadRequestException(result.message, { body: "host" });
                }
                throw new express_core_1.InternalServerErrorException(result.message);
            }
            const setting = yield settings_entity_1.Settings.findOne({
                where: {
                    empresa_id: empresa.id,
                },
            });
            const time = (0, dayjs_1.NOW)(empresa).add(4, "minute");
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            yield (setting === null || setting === void 0 ? void 0 : setting.update({
                host: {
                    host: body.host,
                    nameserver_one: result.name_servers[0],
                    nameserver_two: result.name_servers[1],
                    time,
                    enabled: false,
                },
            }));
            cache_1.default.delete("CACHE_HOST");
            return {
                success: true,
                host: {
                    host: body.host,
                    nameserver_one: result.name_servers[0],
                    nameserver_two: result.name_servers[1],
                    time,
                },
            };
        });
    }
    name_servers(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empresa } = yield this.show(slug);
            yield (0, helpers_3.terminal)(`rm -rf /etc/nginx/sites-available/${empresa.setting.host.host}  || true`, true);
            yield (0, helpers_3.terminal)(`rm -rf /etc/nginx/sites-enabled/${empresa.setting.host.host} || true`, true);
            yield (0, helpers_3.terminal)(`certbot delete --cert-name www.${empresa.setting.host.host} --non-interactive --quiet || true`, true);
            const setting = yield settings_entity_1.Settings.findOne({
                where: {
                    empresa_id: empresa.id,
                },
            });
            yield (0, subdominio_1.onNginx)({
                port: Number(enviroments_config_1.default.PORT),
                sub_domain: "",
                domain: empresa.setting.host.host,
            });
            yield (setting === null || setting === void 0 ? void 0 : setting.update({
                host: Object.assign(Object.assign({}, setting.toJSON().host), { enabled: true }),
            }));
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            cache_1.default.delete("CACHE_HOST");
            return {
                success: true,
                url: empresa.setting.host.host,
            };
        });
    }
    deleteDominio(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const { empresa } = yield this.show(slug);
            yield (0, helpers_3.terminal)(`rm -rf /etc/nginx/sites-available/${empresa.setting.host.host}  || true`, true);
            yield (0, helpers_3.terminal)(`rm -rf /etc/nginx/sites-enabled/${empresa.setting.host.host} || true`, true);
            yield (0, helpers_3.terminal)(`certbot delete --cert-name www.${empresa.setting.host.host} --non-interactive --quiet || true`, true);
            const setting = yield settings_entity_1.Settings.findOne({
                where: {
                    empresa_id: empresa.id,
                },
            });
            const time = (0, dayjs_1.NOW)(empresa).add(4, "minute");
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            cache_1.default.delete("CACHE_HOST");
            yield (setting === null || setting === void 0 ? void 0 : setting.update({
                host: {
                    host: null,
                    nameserver_one: null,
                    nameserver_two: null,
                    enabled: false,
                    time,
                },
            }));
            const response = yield fetch(`${enviroments_config_1.default.VITE_VIGILIO_WEB}/api/empresas/domain/${slug}`, { method: "DELETE" });
            const result = yield response.json();
            if (!response.ok)
                throw new express_core_1.InternalServerErrorException(result.message);
            return {
                success: true,
                message: "Eliminado correctamente.",
            };
        });
    }
    whatsappGroupIndex(slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug },
                attributes: ["contacts", "groupWhatsapp", "id"],
            });
            if (!empresa)
                return;
            return { success: true, data: empresa.groupWhatsapp };
        });
    }
    whatsappGroupShow(slug, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug },
                attributes: ["contacts", "groupWhatsapp", "id"],
            });
            if (!empresa)
                throw new express_core_2.BadRequestException("No informacion");
            const group = empresa.groupWhatsapp.find((group) => group.name === name);
            if (!group)
                throw new express_core_2.BadRequestException("No se encontró ese grupo");
            const getEmpresas = empresa.contacts
                .map((contact) => group.members.includes(contact.telephone) ? contact : null)
                .filter((contact) => contact);
            return { success: true, group: Object.assign(Object.assign({}, group), { members: getEmpresas }) };
        });
    }
    whatsappGroupStore(slug, body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const empresa = yield empresas_entity_1.Empresas.findOne({
                where: { slug },
                attributes: ["contacts", "groupWhatsapp", "id", "slug"],
            });
            if (!empresa)
                throw new express_core_2.BadRequestException("No informacion");
            const findGroup = (_a = empresa.groupWhatsapp) === null || _a === void 0 ? void 0 : _a.find((group) => group.name === body.name);
            if (findGroup)
                throw new express_core_2.BadRequestException(`Ya existe grupo con el nombre ${body.name}`, { body: "name" });
            const groupWhatsapp = [...(empresa.groupWhatsapp || []), body];
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            yield empresa.update({ groupWhatsapp });
            return {
                success: true,
                message: "Se agregó nuevo grupo whatsapp",
            };
        });
    }
    whatsappGroupUpdate(slug, body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const empresa = yield empresas_entity_1.Empresas.findOne({
                where: { slug },
                attributes: ["contacts", "groupWhatsapp", "id", "slug"],
            });
            if (!empresa)
                throw new express_core_2.BadRequestException("No informacion");
            const findGroup = (_a = empresa.groupWhatsapp) === null || _a === void 0 ? void 0 : _a.find((group) => group.name === body.name);
            if (!findGroup)
                throw new express_core_2.BadRequestException(`No existe este grupo ${body.name}`);
            const groupWhatsapp = empresa.groupWhatsapp.map((group) => group.name === body.name
                ? { name: body.name, members: body.members }
                : group);
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            yield empresa.update({ groupWhatsapp });
            return {
                success: true,
                message: "Se edito los miembros de whatsapp whatsapp",
            };
        });
    }
    deleteContact(empresas) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug: empresas.slug },
                attributes: ["id", "contacts", "groupWhatsapp"],
            });
            if (!empresa)
                throw new express_core_2.NotFoundException("Error empresas.");
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            yield empresa.update({ contacts: [], groupWhatsapp: [] });
            return {
                success: true,
                message: "Formateado Correctamente",
            };
        });
    }
    whatsappGroupDestroy(slug, group) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug },
                attributes: ["id", "contacts", "groupWhatsapp"],
            });
            if (!empresa)
                throw new express_core_2.NotFoundException("Error empresas.");
            const groupWhatsapp = empresa.groupWhatsapp.filter((gro) => gro.name !== group);
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            yield empresa.update({ groupWhatsapp });
            return {
                success: true,
                message: "Se eliminó grupo de whatsapp correctamente",
            };
        });
    }
    whatsappGroupTelephoneDestroy(slug, name, telephone) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug },
                attributes: ["contacts", "groupWhatsapp", "id", "slug"],
            });
            if (!empresa)
                throw new express_core_2.BadRequestException("No informacion");
            const group = empresa.groupWhatsapp.find((group) => group.name === name);
            if (!group)
                throw new express_core_2.BadRequestException("No se encontró ese grupo");
            const filterGroup = group.members.filter((member) => member !== telephone);
            const groupWhatsapp = empresa.groupWhatsapp.map((group) => {
                if (group.name === name) {
                    return Object.assign(Object.assign({}, group), { members: filterGroup });
                }
                return group;
            });
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            yield empresa.update({ groupWhatsapp });
            return {
                success: true,
                message: `Se eliminó telephone del grupo ${name}  correctamente`,
            };
        });
    }
    destroy(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { empresa } = yield this.show(id);
                const dir = `${(0, helpers_1.pathUploads)()}/${empresa.slug}`;
                if (node_fs_1.default.existsSync(dir)) {
                    node_fs_1.default.rmdirSync(dir, { recursive: true });
                }
                cache_1.default.delete(`EMPRESA:${empresa.slug}`);
                yield empresa.destroy({ force: true });
                yield (0, helpers_3.terminal)(`docker container stop ${empresa.slug} || true`);
                yield (0, helpers_3.terminal)(`docker container rm -f ${empresa.slug} || true`);
                yield (0, helpers_3.terminal)(`docker volume  rm  ${empresa.slug} || true`);
                if (exports.openAis[empresa.slug]) {
                    delete exports.openAis[empresa.slug];
                }
                return { success: true, message: "Eliminado correctamente" };
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException("Error al eliminar");
            }
        });
    }
};
exports.EmpresasApiService = EmpresasApiService;
exports.EmpresasApiService = EmpresasApiService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [users_api_service_1.UsersApiService,
        background_api_service_1.BackgroundApiService,
        products_api_service_1.ProductsApiService,
        pages_api_service_1.PagesApiService])
], EmpresasApiService);
