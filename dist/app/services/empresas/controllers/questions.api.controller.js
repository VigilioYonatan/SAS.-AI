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
exports.QuestionsApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("valibot");
const questions_store_dto_1 = require("../dtos/questions.store.dto");
const valibot_3 = require("@vigilio/valibot");
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
const questions_api_service_1 = require("../services/questions.api.service");
const questions_update_dto_1 = require("../dtos/questions.update.dto");
let QuestionsApiController = class QuestionsApiController {
    constructor(questionsApiService) {
        this.questionsApiService = questionsApiService;
    }
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.questionsApiService.index(empresa);
            return result;
        });
    }
    show(id, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.questionsApiService.show(empresa, id);
            return result;
        });
    }
    store(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.questionsApiService.store(empresa, body);
            return result;
        });
    }
    update(body, empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.questionsApiService.update(empresa, id, body);
            return result;
        });
    }
    destroy(id, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.questionsApiService.destroy(empresa, id);
            return result;
        });
    }
};
exports.QuestionsApiController = QuestionsApiController;
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Get)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], QuestionsApiController.prototype, "index", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Get)("/:id"),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_3.string)(),
    })),
    __param(0, (0, express_core_1.Params)("id")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Function]),
    __metadata("design:returntype", Promise)
], QuestionsApiController.prototype, "show", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(questions_store_dto_1.questionsStoreDto),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Post)("/"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], QuestionsApiController.prototype, "store", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(questions_update_dto_1.questionsUpdateDto),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_3.string)(),
    })),
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Status)(201),
    (0, express_core_1.Put)("/:id"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __param(2, (0, express_core_1.Params)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function, Number]),
    __metadata("design:returntype", Promise)
], QuestionsApiController.prototype, "update", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_3.string)(),
    })),
    (0, express_core_1.Delete)("/:id"),
    __param(0, (0, express_core_1.Params)("id")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Function]),
    __metadata("design:returntype", Promise)
], QuestionsApiController.prototype, "destroy", null);
exports.QuestionsApiController = QuestionsApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/questions"),
    __metadata("design:paramtypes", [questions_api_service_1.QuestionsApiService])
], QuestionsApiController);
