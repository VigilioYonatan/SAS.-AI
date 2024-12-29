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
exports.SettingsApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
const settings_api_service_1 = require("../services/settings.api.service");
const settings_update_dto_1 = require("../dtos/settings.update.dto");
let SettingsApiController = class SettingsApiController {
    constructor(settingsApiService) {
        this.settingsApiService = settingsApiService;
    }
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.settingsApiService.index(empresa);
            return result;
        });
    }
    update(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.settingsApiService.update(empresa, body);
            return result;
        });
    }
};
exports.SettingsApiController = SettingsApiController;
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Get)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], SettingsApiController.prototype, "index", null);
__decorate([
    (0, valibot_1.Validator)(settings_update_dto_1.settingsUpdateDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], SettingsApiController.prototype, "update", null);
exports.SettingsApiController = SettingsApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/settings"),
    __metadata("design:paramtypes", [settings_api_service_1.SettingsApiService])
], SettingsApiController);
