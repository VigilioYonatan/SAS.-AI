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
exports.FavoritesApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const favorites_api_service_1 = require("../services/favorites.api.service");
const permission_auth_guard_1 = require("@/auth/guards/permission-auth.guard");
let FavoritesApiController = class FavoritesApiController {
    constructor(favoritesApiService) {
        this.favoritesApiService = favoritesApiService;
    }
    index(empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.favoritesApiService.index(empresa, user);
            return result;
        });
    }
    show(empresa, product_id, user, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.favoritesApiService.show(empresa, user, product_id, type === "service");
            return result;
        });
    }
    store(product_id, empresa, user, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.favoritesApiService.store(empresa, user, product_id, type === "service");
            return result;
        });
    }
    destroy(empresa, product_id, user, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.favoritesApiService.destroy(empresa, user, product_id, type === "service");
            return result;
        });
    }
};
exports.FavoritesApiController = FavoritesApiController;
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_1.Get)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Req)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Function]),
    __metadata("design:returntype", Promise)
], FavoritesApiController.prototype, "index", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        product_id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Get)("/:product_id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("product_id")),
    __param(2, (0, express_core_1.Req)("user")),
    __param(3, (0, express_core_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, Function, String]),
    __metadata("design:returntype", Promise)
], FavoritesApiController.prototype, "show", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        product_id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Post)("/:product_id"),
    __param(0, (0, express_core_1.Params)("product_id")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __param(2, (0, express_core_1.Req)("user")),
    __param(3, (0, express_core_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function, Function, String]),
    __metadata("design:returntype", Promise)
], FavoritesApiController.prototype, "store", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        product_id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Delete)("/:product_id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("product_id")),
    __param(2, (0, express_core_1.Req)("user")),
    __param(3, (0, express_core_1.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, Function, String]),
    __metadata("design:returntype", Promise)
], FavoritesApiController.prototype, "destroy", null);
exports.FavoritesApiController = FavoritesApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/favorites"),
    __metadata("design:paramtypes", [favorites_api_service_1.FavoritesApiService])
], FavoritesApiController);
