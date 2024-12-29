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
exports.UrlsController = void 0;
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const urls_store_dto_1 = require("../dtos/urls.store.dto");
const urls_service_1 = require("../services/urls.service");
const urls_update_dto_1 = require("../dtos/urls.update.dto");
const permission_auth_guard_1 = require("@/auth/guards/permission-auth.guard");
let UrlsController = class UrlsController {
    constructor(urlsService) {
        this.urlsService = urlsService;
    }
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.urlsService.index(empresa);
            return result;
        });
    }
    show(id, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.urlsService.show(empresa, id);
            return result;
        });
    }
    store(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.urlsService.store(body);
            return result;
        });
    }
    update(id, body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.urlsService.update(empresa, id, body);
            return result;
        });
    }
    destroy(id, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.urlsService.destroy(empresa, id);
            return result;
        });
    }
};
exports.UrlsController = UrlsController;
__decorate([
    (0, express_core_1.Get)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], UrlsController.prototype, "index", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Get)("/:id"),
    __param(0, (0, express_core_1.Params)("id")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], UrlsController.prototype, "show", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(urls_store_dto_1.urlsStoreDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Post)("/"),
    __param(0, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UrlsController.prototype, "store", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, valibot_1.Validator)(urls_update_dto_1.urlsUpdateDto),
    (0, express_core_1.Status)(200),
    (0, express_core_1.Put)("/:id"),
    __param(0, (0, express_core_1.Params)("id")),
    __param(1, (0, express_core_1.Body)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function]),
    __metadata("design:returntype", Promise)
], UrlsController.prototype, "update", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Delete)("/:id"),
    __param(0, (0, express_core_1.Params)("id")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], UrlsController.prototype, "destroy", null);
exports.UrlsController = UrlsController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/urls"),
    __metadata("design:paramtypes", [urls_service_1.UrlsService])
], UrlsController);
