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
exports.ReactionsApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const permission_auth_guard_1 = require("@/auth/guards/permission-auth.guard");
const libs_1 = require("../libs");
const reactions_api_service_1 = require("../services/reactions.api.service");
const reactions_store_dto_1 = require("../dtos/reactions.store.dto");
const reactions_update_dto_1 = require("../dtos/reactions.update.dto");
let ReactionsApiController = class ReactionsApiController {
    constructor(ReactionsApiService) {
        this.ReactionsApiService = ReactionsApiService;
    }
    index(reactionsable_type, reactionsable_id, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ReactionsApiService.index(empresa, reactionsable_type, reactionsable_id);
            return result;
        });
    }
    show(reactionsable_type, reactionsable_id, id, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ReactionsApiService.show(empresa, reactionsable_type, reactionsable_id, id);
            return result;
        });
    }
    store(reactionsable_type, reactionsable_id, body, user, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ReactionsApiService.store(empresa, reactionsable_type, reactionsable_id, body, user.id);
            return result;
        });
    }
    update(reactionsable_type, reactionsable_id, id, body, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ReactionsApiService.update(req.empresa, reactionsable_type, reactionsable_id, id, body, req.user.id);
            return result;
        });
    }
    destroy(reactionsable_type, reactionsable_id, id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ReactionsApiService.destroy(req.empresa, reactionsable_type, reactionsable_id, id, req.user.id);
            return result;
        });
    }
};
exports.ReactionsApiController = ReactionsApiController;
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        reactionsable_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.reactionsEntities.includes(val), "entidad no válida"),
        ]),
        reactionsable_id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:reactionsable_type/:reactionsable_id"),
    __param(0, (0, express_core_2.Params)("reactionsable_type")),
    __param(1, (0, express_core_2.Params)("reactionsable_id")),
    __param(2, (0, express_core_2.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Function]),
    __metadata("design:returntype", Promise)
], ReactionsApiController.prototype, "index", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        reactionsable_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.reactionsEntities.includes(val), "entidad no válida"),
        ]),
        reactionsable_id: (0, valibot_2.string)(),
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:reactionsable_type/:reactionsable_id/:id"),
    __param(0, (0, express_core_2.Params)("reactionsable_type")),
    __param(1, (0, express_core_2.Params)("reactionsable_id")),
    __param(2, (0, express_core_2.Params)("id")),
    __param(3, (0, express_core_2.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Function]),
    __metadata("design:returntype", Promise)
], ReactionsApiController.prototype, "show", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        reactionsable_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.reactionsEntities.includes(val), "entidad no válida"),
        ]),
        reactionsable_id: (0, valibot_2.string)(),
    })),
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(reactions_store_dto_1.reactionsStoreDto),
    (0, express_core_2.Status)(201),
    (0, express_core_2.Post)("/:reactionsable_type/:reactionsable_id"),
    __param(0, (0, express_core_2.Params)("reactionsable_type")),
    __param(1, (0, express_core_2.Params)("reactionsable_id")),
    __param(2, (0, express_core_2.Body)()),
    __param(3, (0, express_core_2.Req)("user")),
    __param(4, (0, express_core_2.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Function, Function]),
    __metadata("design:returntype", Promise)
], ReactionsApiController.prototype, "store", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(reactions_update_dto_1.reactionsUpdateDto),
    (0, express_core_2.Status)(201),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        reactionsable_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.reactionsEntities.includes(val), "entidad no válida"),
        ]),
        reactionsable_id: (0, valibot_2.string)(),
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Put)("/:reactionsable_type/:reactionsable_id/:id"),
    __param(0, (0, express_core_2.Params)("reactionsable_type")),
    __param(1, (0, express_core_2.Params)("reactionsable_id")),
    __param(2, (0, express_core_2.Params)("id")),
    __param(3, (0, express_core_2.Body)()),
    __param(4, (0, express_core_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReactionsApiController.prototype, "update", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_2.Status)(201),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        reactionsable_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.reactionsEntities.includes(val), "entidad no válida"),
        ]),
        reactionsable_id: (0, valibot_2.string)(),
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Delete)("/:reactionsable_type/:reactionsable_id/:id"),
    __param(0, (0, express_core_2.Params)("reactionsable_type")),
    __param(1, (0, express_core_2.Params)("reactionsable_id")),
    __param(2, (0, express_core_2.Params)("id")),
    __param(3, (0, express_core_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], ReactionsApiController.prototype, "destroy", null);
exports.ReactionsApiController = ReactionsApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/reactions"),
    __metadata("design:paramtypes", [reactions_api_service_1.ReactionsApiService])
], ReactionsApiController);
