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
exports.CitasApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const citas_api_service_1 = require("../services/citas.api.service");
const citas_update_dto_1 = require("../dtos/citas.update.dto");
const citas_store_dto_1 = require("../dtos/citas.store.dto");
const citas_settings_schema_1 = require("../schemas/citas_settings.schema");
const permission_adminworker_guard_1 = require("@/auth/guards/permission-adminworker.guard");
let CitasApiController = class CitasApiController {
    constructor(citasApiService) {
        this.citasApiService = citasApiService;
    }
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.citasApiService.index(empresa);
            return result;
        });
    }
    day(empresa, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.citasApiService.day(empresa, time);
            return result;
        });
    }
    show(empresa, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.citasApiService.show(empresa, slug);
            return result;
        });
    }
    month(empresa, year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.citasApiService.month(empresa, year, month);
            return result;
        });
    }
    store(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.citasApiService.store(empresa, body);
            return result;
        });
    }
    settingUpdate(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.citasApiService.settingUpdate(empresa, body);
            return result;
        });
    }
    update(empresa, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.citasApiService.update(empresa, id, body);
            return result;
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.citasApiService.destroy(empresa, id);
            return result;
        });
    }
};
exports.CitasApiController = CitasApiController;
__decorate([
    (0, permission_adminworker_guard_1.PermissionAdminWorker)(),
    (0, express_core_1.Get)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], CitasApiController.prototype, "index", null);
__decorate([
    (0, permission_adminworker_guard_1.PermissionAdminWorker)(),
    (0, express_core_1.Get)("/day"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Query)("time")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String]),
    __metadata("design:returntype", Promise)
], CitasApiController.prototype, "day", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        slug: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Get)("/:slug"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("slug")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String]),
    __metadata("design:returntype", Promise)
], CitasApiController.prototype, "show", null);
__decorate([
    (0, permission_adminworker_guard_1.PermissionAdminWorker)(),
    (0, express_core_1.Get)("/:year/:month"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("year")),
    __param(2, (0, express_core_1.Params)("month")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, String]),
    __metadata("design:returntype", Promise)
], CitasApiController.prototype, "month", null);
__decorate([
    (0, permission_adminworker_guard_1.PermissionAdminWorker)(),
    (0, valibot_1.Validator)(citas_store_dto_1.citasStoreDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Post)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], CitasApiController.prototype, "store", null);
__decorate([
    (0, permission_adminworker_guard_1.PermissionAdminWorker)(),
    (0, express_core_1.Status)(201),
    (0, valibot_1.Validator)((0, valibot_2.omitAsync)(citas_settings_schema_1.citasSettingSchema, ["id", "empresa_id"])),
    (0, express_core_1.Put)("/setting"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], CitasApiController.prototype, "settingUpdate", null);
__decorate([
    (0, permission_adminworker_guard_1.PermissionAdminWorker)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, valibot_1.Validator)(citas_update_dto_1.citasUpdateDto),
    (0, express_core_1.Status)(200),
    (0, express_core_1.Put)("/:id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("id")),
    __param(2, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, Object]),
    __metadata("design:returntype", Promise)
], CitasApiController.prototype, "update", null);
__decorate([
    (0, permission_adminworker_guard_1.PermissionAdminWorker)(),
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
], CitasApiController.prototype, "destroy", null);
exports.CitasApiController = CitasApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/citas"),
    __metadata("design:paramtypes", [citas_api_service_1.CitasApiService])
], CitasApiController);
