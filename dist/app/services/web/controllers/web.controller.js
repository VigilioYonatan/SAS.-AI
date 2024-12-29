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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
exports.WebController = void 0;
const express_core_1 = require("@vigilio/express-core");
const web_service_1 = require("../services/web.service");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const urls_service_1 = require("@/urls/services/urls.service");
const webEnabled_middleware_1 = require("../middlewares/webEnabled.middleware");
let WebController = class WebController {
    constructor(webService, urlsService) {
        this.webService = webService;
        this.urlsService = urlsService;
    }
    manifest(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = this.webService.manifest(empresa);
            return result;
        });
    }
    proxy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url } = req.query;
            if (!url)
                throw new express_core_1.BadRequestException("Url necesita");
            try {
                const response = yield fetch(url);
                if (!response.ok) {
                    throw new Error("Error al obtener la URL remota");
                }
                res.set("Content-Type", response.headers.get("content-type") || "image/jpeg");
                res.send(Buffer.from(yield response.arrayBuffer()));
            }
            catch (error) {
                res.status(500).send("Error fetching the URL");
            }
        });
    }
    helloworld(res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.send("<h1>Hello World!!!</h1>");
        });
    }
    home(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webService.home(req.empresa, req.user);
            return res.render("web/home", result);
        });
    }
    page404(message, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(404);
            return res.render("web/404", {
                title: "404",
                message: message !== null && message !== void 0 ? message : "No se a encontrado esta página",
            });
        });
    }
    categories(category_slug, res, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webService.categories(category_slug, empresa);
            return res.render("web/shop/categories", result);
        });
    }
    subcategories(category_slug, subcategory_slug, res, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webService.subcategories(category_slug, subcategory_slug, empresa);
            return res.render("web/shop/subcategories", result);
        });
    }
    marcas(brand, res, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webService.marcas(brand, empresa);
            return res.render("web/shop/brands", result);
        });
    }
    orders(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webService.orders();
            return res.render("web/orders", result);
        });
    }
    politica(res, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webService.politica(empresa);
            return res.render("web/politica/privacidad", result);
        });
    }
    terminos(res, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webService.terminos(empresa);
            return res.render("web/politica/terminos", result);
        });
    }
    reclamaciones(res, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webService.reclamaciones(empresa);
            return res.render("web/politica/reclamaciones", result);
        });
    }
    servicio(slug, res, empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webService.servicio(slug, empresa, user);
            return res.render("web/servicio", result);
        });
    }
    product(slug, res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webService.product(slug, req.empresa, req.user);
            if (!result.type_page) {
                return res.render("web/product", result);
            }
            if (result.type_page === "shop_page") {
                return res.render("web/shop", result);
            }
            if (result.type_page === "nosotros_page") {
                return res.render("web/home/about", result);
            }
            if (result.type_page === "servicios_page") {
                return res.render("web/servicios", result);
            }
            if (result.type_page === "contact_page") {
                return res.render("web/home/contact", result);
            }
            return res.render("web/home/others", result);
        });
    }
    link(hash, empresa, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url } = yield this.urlsService.show(empresa, hash);
            if (!url.enabled) {
                res.redirect("/");
                return;
            }
            res.redirect(url.web);
        });
    }
    changeMoney(req, res, money) {
        return __awaiter(this, void 0, void 0, function* () {
            const rutaAnterior = req.get("Referer");
            if (!["DOLARES", "LOCAL"].includes(money)) {
                return res.redirect(rutaAnterior);
            }
            res.cookie("money", money, { httpOnly: false });
            return res.redirect(rutaAnterior);
        });
    }
    zoho(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.send(`<code>query:<br/>${JSON.stringify(req.query)}</code>`);
        });
    }
};
exports.WebController = WebController;
__decorate([
    (0, express_core_1.Get)("/manifest.webmanifest.json"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "manifest", null);
__decorate([
    (0, express_core_1.Get)("/proxy"),
    __param(0, (0, express_core_1.Req)()),
    __param(1, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "proxy", null);
__decorate([
    (0, express_core_1.Get)("/hello-world"),
    __param(0, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "helloworld", null);
__decorate([
    (0, express_core_1.Get)("/", [webEnabled_middleware_1.webEnabledMiddleware]),
    __param(0, (0, express_core_1.Res)()),
    __param(1, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "home", null);
__decorate([
    (0, express_core_1.Get)("/404"),
    __param(0, (0, express_core_1.Query)("message")),
    __param(1, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "page404", null);
__decorate([
    (0, express_core_1.Get)("/shop/:category_slug", [webEnabled_middleware_1.webEnabledMiddleware]),
    __param(0, (0, express_core_1.Params)("category_slug")),
    __param(1, (0, express_core_1.Res)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "categories", null);
__decorate([
    (0, express_core_1.Get)("/shop/:category_slug/:subcategory_slug", [webEnabled_middleware_1.webEnabledMiddleware]),
    __param(0, (0, express_core_1.Params)("category_slug")),
    __param(1, (0, express_core_1.Params)("subcategory_slug")),
    __param(2, (0, express_core_1.Res)()),
    __param(3, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "subcategories", null);
__decorate([
    (0, express_core_1.Get)("/marcas/:brand", [webEnabled_middleware_1.webEnabledMiddleware]),
    __param(0, (0, express_core_1.Params)("brand")),
    __param(1, (0, express_core_1.Res)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "marcas", null);
__decorate([
    (0, express_core_1.Get)("/pedidos"),
    __param(0, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "orders", null);
__decorate([
    (0, express_core_1.Get)("/politica-de-privacidad"),
    __param(0, (0, express_core_1.Res)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "politica", null);
__decorate([
    (0, express_core_1.Get)("/terminos-y-condiciones"),
    __param(0, (0, express_core_1.Res)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "terminos", null);
__decorate([
    (0, express_core_1.Get)("/libro-de-reclamaciones"),
    __param(0, (0, express_core_1.Res)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "reclamaciones", null);
__decorate([
    (0, express_core_1.Get)("/servicio/:slug"),
    __param(0, (0, express_core_1.Params)("slug")),
    __param(1, (0, express_core_1.Res)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __param(3, (0, express_core_1.Req)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, empresas_entity_1.Empresas, Function]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "servicio", null);
__decorate([
    (0, express_core_1.Get)("/:slug"),
    __param(0, (0, express_core_1.Params)("slug")),
    __param(1, (0, express_core_1.Res)()),
    __param(2, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "product", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ hash: (0, valibot_2.string)() })),
    (0, express_core_1.Get)("/sh/:hash"),
    __param(0, (0, express_core_1.Params)("hash")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __param(2, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, empresas_entity_1.Empresas, Object]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "link", null);
__decorate([
    (0, express_core_1.Get)("/change-money/:money"),
    __param(0, (0, express_core_1.Req)()),
    __param(1, (0, express_core_1.Res)()),
    __param(2, (0, express_core_1.Params)("money")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "changeMoney", null);
__decorate([
    (0, express_core_1.Get)("/auth/zoho/callback"),
    __param(0, (0, express_core_1.Req)()),
    __param(1, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebController.prototype, "zoho", null);
exports.WebController = WebController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/"),
    __metadata("design:paramtypes", [web_service_1.WebService,
        urls_service_1.UrlsService])
], WebController);
