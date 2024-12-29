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
exports.AdminApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const admin_api_service_1 = require("../services/admin.api.service");
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const permission_auth_guard_1 = require("@/auth/guards/permission-auth.guard");
let AdminApiController = class AdminApiController {
    constructor(adminApiService) {
        this.adminApiService = adminApiService;
    }
    dashboard(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.adminApiService.dashboard(empresa);
            return result;
        });
    }
    earning(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.adminApiService.earning(empresa);
            return result;
        });
    }
    orders(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.adminApiService.orders(empresa);
            return result;
        });
    }
    deliverys(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.adminApiService.deliverys(empresa);
            return result;
        });
    }
    facturationSystem(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.adminApiService.facturationSystem(empresa);
            return result;
        });
    }
};
exports.AdminApiController = AdminApiController;
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_2.Get)("/dashboard"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], AdminApiController.prototype, "dashboard", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_2.Get)("/earning"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], AdminApiController.prototype, "earning", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_2.Get)("/orders"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], AdminApiController.prototype, "orders", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_2.Get)("/deliverys"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], AdminApiController.prototype, "deliverys", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_2.Get)("/facturation_system"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], AdminApiController.prototype, "facturationSystem", null);
exports.AdminApiController = AdminApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/admin"),
    __metadata("design:paramtypes", [admin_api_service_1.AdminApiService])
], AdminApiController);
