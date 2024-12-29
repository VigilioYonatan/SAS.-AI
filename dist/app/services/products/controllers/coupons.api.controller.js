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
exports.CouponsApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const coupons_api_service_1 = require("../services/coupons.api.service");
const coupons_update_dto_1 = require("../dtos/coupons.update.dto");
const coupons_store_dto_1 = require("../dtos/coupons.store.dto");
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
let CouponsApiController = class CouponsApiController {
    constructor(couponsApiService) {
        this.couponsApiService = couponsApiService;
    }
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.couponsApiService.index(empresa);
            return result;
        });
    }
    show(empresa, coupon) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.couponsApiService.show(empresa, coupon);
            return result;
        });
    }
    store(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.couponsApiService.store(empresa, body);
            return result;
        });
    }
    update(empresa, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.couponsApiService.update(empresa, id, body);
            return result;
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.couponsApiService.destroy(empresa, id);
            return result;
        });
    }
};
exports.CouponsApiController = CouponsApiController;
__decorate([
    (0, express_core_1.Get)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], CouponsApiController.prototype, "index", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        coupon: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Get)("/:coupon"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("coupon")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String]),
    __metadata("design:returntype", Promise)
], CouponsApiController.prototype, "show", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(coupons_store_dto_1.couponsStoreDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Post)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], CouponsApiController.prototype, "store", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, valibot_1.Validator)(coupons_update_dto_1.couponsUpdateDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/:id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("id")),
    __param(2, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, Object]),
    __metadata("design:returntype", Promise)
], CouponsApiController.prototype, "update", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Delete)("/:id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String]),
    __metadata("design:returntype", Promise)
], CouponsApiController.prototype, "destroy", null);
exports.CouponsApiController = CouponsApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/coupons"),
    __metadata("design:paramtypes", [coupons_api_service_1.CouponsApiService])
], CouponsApiController);
