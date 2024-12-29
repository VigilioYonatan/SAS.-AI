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
exports.ProductsApiController = void 0;
const products_api_service_1 = require("../services/products.api.service");
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
const products_normal_dto_1 = require("../dtos/products_normal.dto");
const products_restaurant_dto_1 = require("../dtos/products_restaurant.dto");
const products_servicio_dto_1 = require("../dtos/products_servicio.dto");
const variants_update_dto_1 = require("../dtos/options/variants.update.dto");
let ProductsApiController = class ProductsApiController {
    constructor(productsApiService) {
        this.productsApiService = productsApiService;
    }
    index(empresa, token, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.index(empresa, token, type === "service");
            return result;
        });
    }
    show(slug, empresa, type, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.show(empresa, slug, type === "service", true, user, false);
            return result;
        });
    }
    variant(empresa, slug, variant_id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.variant(empresa, slug, variant_id, type === "service");
            return result;
        });
    }
    variantUpdate(empresa, slug, variant_id, body, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.variantUpdate(empresa, slug, variant_id, body, type === "service");
            return result;
        });
    }
    varianDelete(empresa, slug, variant_id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.varianDelete(empresa, slug, variant_id, type === "service");
            return result;
        });
    }
    coupon(slug, coupon, empresa, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.coupon(slug, coupon, empresa, type === "service");
            return result;
        });
    }
    storeNormal(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.store(empresa, body, true, false);
            return result;
        });
    }
    storeRestaurant(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.store(empresa, body, false, false);
            return result;
        });
    }
    storeServicio(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.store(empresa, body, false, true);
            return result;
        });
    }
    updateNormal(id, body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.update(empresa, id, body, true, false);
            return result;
        });
    }
    updateRestaurant(id, body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.update(empresa, id, body, false, false);
            return result;
        });
    }
    updateServicio(id, body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.update(empresa, id, body, false, true);
            return result;
        });
    }
    destroy(id, empresa, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.productsApiService.destroy(empresa, id, type === "service");
            return result;
        });
    }
};
exports.ProductsApiController = ProductsApiController;
__decorate([
    (0, express_core_1.Get)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Query)("token")),
    __param(2, (0, express_core_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, String]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "index", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        slug: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Get)("/:slug"),
    __param(0, (0, express_core_1.Params)("slug")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __param(2, (0, express_core_1.Query)("type")),
    __param(3, (0, express_core_1.Req)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function, String, Function]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "show", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        slug: (0, valibot_2.string)(),
        variant_id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Get)("/:slug/variants/:variant_id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("slug")),
    __param(2, (0, express_core_1.Params)("variant_id")),
    __param(3, (0, express_core_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "variant", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(variants_update_dto_1.variantsUpdateDto),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        slug: (0, valibot_2.string)(),
        variant_id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Put)("/:slug/variants/:variant_id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("slug")),
    __param(2, (0, express_core_1.Params)("variant_id")),
    __param(3, (0, express_core_1.Body)()),
    __param(4, (0, express_core_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, String, Object, String]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "variantUpdate", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        slug: (0, valibot_2.string)(),
        variant_id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Delete)("/:slug/variants/:variant_id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("slug")),
    __param(2, (0, express_core_1.Params)("variant_id")),
    __param(3, (0, express_core_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, String, String]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "varianDelete", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        slug: (0, valibot_2.string)(),
        coupon: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Get)("/:slug/coupon/:coupon"),
    __param(0, (0, express_core_1.Params)("slug")),
    __param(1, (0, express_core_1.Params)("coupon")),
    __param(2, (0, express_core_1.Req)("empresa")),
    __param(3, (0, express_core_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Function, String]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "coupon", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(products_normal_dto_1.productsNormalStoreDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Post)("/normal"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "storeNormal", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(products_restaurant_dto_1.productsRestaurantStoreDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Post)("/restaurant"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "storeRestaurant", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(products_servicio_dto_1.productsServicioStoreDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Post)("/servicio"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "storeServicio", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, valibot_1.Validator)(products_normal_dto_1.productsNormalUpdateDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/:id/normal"),
    __param(0, (0, express_core_1.Params)("id")),
    __param(1, (0, express_core_1.Body)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "updateNormal", null);
__decorate([
    (0, valibot_1.Validator)(products_restaurant_dto_1.productsRestaurantUpdateDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/:id/restaurant"),
    __param(0, (0, express_core_1.Params)("id")),
    __param(1, (0, express_core_1.Body)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "updateRestaurant", null);
__decorate([
    (0, valibot_1.Validator)(products_servicio_dto_1.productsServicioUpdateDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/:id/servicio"),
    __param(0, (0, express_core_1.Params)("id")),
    __param(1, (0, express_core_1.Body)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "updateServicio", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Delete)("/:id"),
    __param(0, (0, express_core_1.Params)("id")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __param(2, (0, express_core_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function, String]),
    __metadata("design:returntype", Promise)
], ProductsApiController.prototype, "destroy", null);
exports.ProductsApiController = ProductsApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/products"),
    __metadata("design:paramtypes", [products_api_service_1.ProductsApiService])
], ProductsApiController);
