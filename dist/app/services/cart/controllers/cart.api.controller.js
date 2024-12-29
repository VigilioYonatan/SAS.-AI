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
exports.CartApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const cart_store_dto_1 = require("../dtos/cart.store.dto");
const valibot_2 = require("@vigilio/valibot");
const cart_update_dto_1 = require("../dtos/cart.update.dto");
const cart_api_service_1 = require("../services/cart.api.service");
const permission_auth_guard_1 = require("@/auth/guards/permission-auth.guard");
let CartApiController = class CartApiController {
    constructor(cartApiService) {
        this.cartApiService = cartApiService;
    }
    index(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.cartApiService.index(req.empresa, req.user);
            return result;
        });
    }
    show(product_id, variant_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.cartApiService.show(req.empresa, req.user.id, variant_id, product_id);
            return result;
        });
    }
    store(body, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.cartApiService.store(req.empresa, req.user.id, body, false);
            return result;
        });
    }
    update(product_id, variant_id, body, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.cartApiService.update(req.empresa, req.user.id, body, product_id, variant_id, false);
            return result;
        });
    }
    destroy(product_id, variant_id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.cartApiService.destroy(req.empresa, req.user.id, product_id, variant_id);
            return result;
        });
    }
};
exports.CartApiController = CartApiController;
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_1.Get)("/"),
    __param(0, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CartApiController.prototype, "index", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        product_id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Get)("/:product_id"),
    __param(0, (0, express_core_1.Params)("product_id")),
    __param(1, (0, express_core_1.Query)("variant_id")),
    __param(2, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CartApiController.prototype, "show", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(cart_store_dto_1.cartStoreDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Post)("/"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], CartApiController.prototype, "store", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        product_id: (0, valibot_2.string)(),
    })),
    (0, valibot_1.Validator)(cart_update_dto_1.cartUpdateDto),
    (0, express_core_1.Put)("/:product_id"),
    __param(0, (0, express_core_1.Params)("product_id")),
    __param(1, (0, express_core_1.Query)("variant_id")),
    __param(2, (0, express_core_1.Body)()),
    __param(3, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], CartApiController.prototype, "update", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        product_id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Delete)("/:product_id"),
    __param(0, (0, express_core_1.Params)("product_id")),
    __param(1, (0, express_core_1.Query)("variant_id")),
    __param(2, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], CartApiController.prototype, "destroy", null);
exports.CartApiController = CartApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/cart"),
    __metadata("design:paramtypes", [cart_api_service_1.CartApiService])
], CartApiController);
