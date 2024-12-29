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
exports.UbigeoApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const ubigeo_api_service_1 = require("../services/ubigeo.api.service");
const valibot_1 = require("@vigilio/valibot");
const valibot_2 = require("@vigilio/express-core/valibot");
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
const regions_update_dto_1 = require("../dtos/regions.update.dto");
let UbigeoApiController = class UbigeoApiController {
    constructor(ubigeoApiService) {
        this.ubigeoApiService = ubigeoApiService;
    }
    regions(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ubigeoApiService.regions(empresa);
            return result;
        });
    }
    regionsShow(id, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ubigeoApiService.regionsShow(empresa, id);
            return result;
        });
    }
    regionsUpdate(empresa, body, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ubigeoApiService.regionsUpdate(empresa, id, body);
            return result;
        });
    }
    cities(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ubigeoApiService.cities(empresa);
            return result;
        });
    }
};
exports.UbigeoApiController = UbigeoApiController;
__decorate([
    (0, express_core_2.Get)("/regions"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], UbigeoApiController.prototype, "regions", null);
__decorate([
    (0, valibot_2.Pipe)((0, valibot_1.objectAsync)({ id: (0, valibot_1.string)() })),
    (0, express_core_2.Get)("/regions/:id"),
    __param(0, (0, express_core_1.Params)("id")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], UbigeoApiController.prototype, "regionsShow", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_2.Validator)(regions_update_dto_1.regionsUpdateDto),
    (0, valibot_2.Pipe)((0, valibot_1.objectAsync)({ id: (0, valibot_1.string)() })),
    (0, express_core_1.Put)("/regions/:id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Body)()),
    __param(2, (0, express_core_1.Params)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object, String]),
    __metadata("design:returntype", Promise)
], UbigeoApiController.prototype, "regionsUpdate", null);
__decorate([
    (0, express_core_2.Get)("/cities"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], UbigeoApiController.prototype, "cities", null);
exports.UbigeoApiController = UbigeoApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/ubigeo"),
    __metadata("design:paramtypes", [ubigeo_api_service_1.UbigeoApiService])
], UbigeoApiController);
