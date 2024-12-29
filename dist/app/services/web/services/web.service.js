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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebService = void 0;
const express_core_1 = require("@vigilio/express-core");
const libs_1 = require("@/products/libs");
const web_api_service_1 = require("./web.api.service");
let WebService = class WebService {
    constructor(webApiService) {
        this.webApiService = webApiService;
    }
    manifest(empresa) {
        const icons = empresa.logo_pwa
            ? empresa.logo_pwa.map((pwa) => ({
                src: `/empresas/${empresa.slug}/${pwa.file}`,
                sizes: `${pwa.dimension}x${pwa.dimension}`,
                type: "image/webp",
            }))
            : [
                {
                    src: "/images/settings/others/logo.webp",
                    sizes: "96x96",
                    type: "image/webp",
                },
                {
                    src: "/images/settings/others/logo.webp",
                    sizes: "384x384",
                    type: "image/webp",
                },
                {
                    src: "/images/settings/others/logo.webp",
                    sizes: "512x512",
                    type: "image/webp",
                },
            ];
        return {
            name: empresa.name_empresa,
            short_name: empresa.name_empresa,
            start_url: "/",
            display: "standalone",
            background_color: "#fff",
            lang: empresa.dial_code === "55" ? "pt" : "es",
            scope: "/dist/",
            description: !empresa.about
                ? `Bienvenido a ${empresa.name_empresa}`
                : empresa.about.slice(0, 100),
            theme_color: empresa.setting.bg_color,
            icons,
            form_factor: "wide",
        };
    }
    home(empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.home(empresa, user);
            return result;
        });
    }
    about(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.about(empresa);
            return result;
        });
    }
    shop(empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.shop(empresa, user);
            return result;
        });
    }
    servicio(slug, empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.servicio(slug, empresa, user);
            return result;
        });
    }
    servicios(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.servicios(empresa);
            return result;
        });
    }
    product(slug, empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.product(slug, empresa, user);
            return result;
        });
    }
    categories(category_slug, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.categories(category_slug, empresa);
            return result;
        });
    }
    subcategories(category_slug, subcategory_slug, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.subcategories(category_slug, subcategory_slug, empresa, true);
            return result;
        });
    }
    marcas(brands, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.marcas(brands, empresa);
            return result;
        });
    }
    admin() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                success: true,
            };
        });
    }
    orders() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                title: "Pedidos",
                description: "Nuestras pedidos.",
            };
        });
    }
    politica(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                title: "Politica y privacidad",
                description: `En ${empresa.name_empresa}, nos comprometemos a proteger tu privacidad. Recopilamos información personal, de pago y de uso para procesar pedidos, mejorar nuestro servicio y comunicarnos contigo. Protegemos tus datos mediante medidas de seguridad avanzadas. Para más detalles, visita nuestra Política de Privacidad.`,
            };
        });
    }
    terminos(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                title: "Terminos y condiciones",
                description: `Lee los Términos y Condiciones de ${empresa.name_empresa} para conocer los términos de uso de nuestro sitio web y servicios. Descubre nuestras políticas de compra, envío, devoluciones, y responsabilidades del usuario. Al usar nuestro sitio, aceptas cumplir con estos términos.`,
            };
        });
    }
    reclamaciones(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                title: "Libro de reclamaciones",
                description: `En ${empresa.name_empresa}, valoramos a nuestros clientes y nos comprometemos a resolver cualquier problema. Consulta nuestra página de Reclamaciones para conocer el proceso de presentación de quejas y cómo gestionamos las reclamaciones. Tu satisfacción es nuestra prioridad.`,
            };
        });
    }
    fetchProductArrays(empresa, products, users) {
        return __awaiter(this, void 0, void 0, function* () {
            const arraysLengths = products.map((arr) => arr.length);
            const allProducts = products.flat();
            const allProductsMapped = yield fetchProducts(empresa, allProducts);
            function splitResults(allResults, arraysLengths) {
                let index = 0;
                return arraysLengths.map((length) => {
                    const result = allResults.slice(index, index + length);
                    index += length;
                    return result;
                });
            }
            function fetchProducts(empresa, products) {
                return __awaiter(this, void 0, void 0, function* () {
                    return yield Promise.all(products.map((product) => (0, libs_1.getProductAll)(empresa, product, users, false)));
                });
            }
            return splitResults(allProductsMapped, arraysLengths);
        });
    }
};
exports.WebService = WebService;
exports.WebService = WebService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [web_api_service_1.WebApiService])
], WebService);
