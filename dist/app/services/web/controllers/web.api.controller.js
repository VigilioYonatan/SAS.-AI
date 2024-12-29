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
exports.WebApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const webEnabled_middleware_1 = require("../middlewares/webEnabled.middleware");
const web_api_service_1 = require("../services/web.api.service");
let WebApiController = class WebApiController {
    constructor(webApiService) {
        this.webApiService = webApiService;
    }
    home(res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.home(req.empresa, req.user);
            return res.render("web/home", result);
        });
    }
    categories(category_slug, res, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.categories(category_slug, empresa);
            return res.render("web/shop/categories", result);
        });
    }
    marcas(brand, res, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.marcas(brand, empresa);
            return res.render("web/shop/brands", result);
        });
    }
    product(slug, res, empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.webApiService.product(slug, empresa, user);
            return res.render("web/product", result);
        });
    }
};
exports.WebApiController = WebApiController;
__decorate([
    (0, express_core_1.Get)("/", [webEnabled_middleware_1.webEnabledMiddleware]),
    __param(0, (0, express_core_1.Res)()),
    __param(1, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WebApiController.prototype, "home", null);
__decorate([
    (0, express_core_1.Get)("/shop/:category_slug", [webEnabled_middleware_1.webEnabledMiddleware]),
    __param(0, (0, express_core_1.Params)("category_slug")),
    __param(1, (0, express_core_1.Res)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], WebApiController.prototype, "categories", null);
__decorate([
    (0, express_core_1.Get)("/marcas/:brand", [webEnabled_middleware_1.webEnabledMiddleware]),
    __param(0, (0, express_core_1.Params)("brand")),
    __param(1, (0, express_core_1.Res)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], WebApiController.prototype, "marcas", null);
__decorate([
    (0, express_core_1.Get)("/:slug"),
    __param(0, (0, express_core_1.Params)("slug")),
    __param(1, (0, express_core_1.Res)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __param(3, (0, express_core_1.Req)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, empresas_entity_1.Empresas, Function]),
    __metadata("design:returntype", Promise)
], WebApiController.prototype, "product", null);
exports.WebApiController = WebApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/web"),
    __metadata("design:paramtypes", [web_api_service_1.WebApiService])
], WebApiController);
