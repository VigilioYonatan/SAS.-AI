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
exports.SubcommentsApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const permission_auth_guard_1 = require("@/auth/guards/permission-auth.guard");
const libs_1 = require("../libs");
const subcomments_api_service_1 = require("../services/subcomments.api.service");
const subcomments_store_dto_1 = require("../dtos/subcomments.store.dto");
const subcomments_update_dto_1 = require("../dtos/subcomments.update.dto");
let SubcommentsApiController = class SubcommentsApiController {
    constructor(subcommentsApiService) {
        this.subcommentsApiService = subcommentsApiService;
    }
    index(commentables_type, commentables_id, subcommentables_id, query, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.subcommentsApiService.index(empresa, commentables_type, commentables_id, subcommentables_id, query);
            return result;
        });
    }
    show(commentables_type, commentables_id, subcommentables_id, id, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.subcommentsApiService.show(empresa, commentables_type, commentables_id, subcommentables_id, id);
            return result;
        });
    }
    store(commentables_type, commentables_id, subcommentables_id, body, req, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.subcommentsApiService.store(empresa, commentables_type, commentables_id, subcommentables_id, body, req.user.id);
            return result;
        });
    }
    update(commentables_type, commentables_id, subcommentables_id, id, body, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.subcommentsApiService.update(req.empresa, commentables_type, commentables_id, subcommentables_id, id, body, req.user.id);
            return result;
        });
    }
    destroy(commentables_type, commentables_id, subcommentables_id, id, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.subcommentsApiService.destroy(req.empresa, commentables_type, commentables_id, subcommentables_id, id, req.user.id);
            return result;
        });
    }
};
exports.SubcommentsApiController = SubcommentsApiController;
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        commentables_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.commentsEntities.includes(val), "entidad no válida"),
        ]),
        commentables_id: (0, valibot_2.string)(),
        subcommentables_id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:commentables_type/:commentables_id/subcomments/:subcommentables_id"),
    __param(0, (0, express_core_2.Params)("commentables_type")),
    __param(1, (0, express_core_2.Params)("commentables_id")),
    __param(2, (0, express_core_2.Params)("subcommentables_id")),
    __param(3, (0, express_core_2.Query)()),
    __param(4, (0, express_core_2.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Function]),
    __metadata("design:returntype", Promise)
], SubcommentsApiController.prototype, "index", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        commentables_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.commentsEntities.includes(val), "entidad no válida"),
        ]),
        commentables_id: (0, valibot_2.string)(),
        subcommentables_id: (0, valibot_2.string)(),
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:commentables_type/:commentables_id/subcomments/:subcommentables_id/:id"),
    __param(0, (0, express_core_2.Params)("commentables_type")),
    __param(1, (0, express_core_2.Params)("commentables_id")),
    __param(2, (0, express_core_2.Params)("subcommentables_id")),
    __param(3, (0, express_core_2.Params)("id")),
    __param(4, (0, express_core_2.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Function]),
    __metadata("design:returntype", Promise)
], SubcommentsApiController.prototype, "show", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        commentables_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.commentsEntities.includes(val), "entidad no válida"),
        ]),
        commentables_id: (0, valibot_2.string)(),
        subcommentables_id: (0, valibot_2.string)(),
    })),
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(subcomments_store_dto_1.subcommentsStoreDto),
    (0, express_core_2.Status)(201),
    (0, express_core_2.Post)("/:commentables_type/:commentables_id/subcomments/:subcommentables_id"),
    __param(0, (0, express_core_2.Params)("commentables_type")),
    __param(1, (0, express_core_2.Params)("commentables_id")),
    __param(2, (0, express_core_2.Params)("subcommentables_id")),
    __param(3, (0, express_core_2.Body)()),
    __param(4, (0, express_core_2.Req)()),
    __param(5, (0, express_core_2.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, Object, Function]),
    __metadata("design:returntype", Promise)
], SubcommentsApiController.prototype, "store", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(subcomments_update_dto_1.subcommentsUpdateDto),
    (0, express_core_2.Status)(201),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        commentables_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.commentsEntities.includes(val), "entidad no válida"),
        ]),
        commentables_id: (0, valibot_2.string)(),
        subcommentables_id: (0, valibot_2.string)(),
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Put)("/:commentables_type/:commentables_id/subcomments/:subcommentables_id/:id"),
    __param(0, (0, express_core_2.Params)("commentables_type")),
    __param(1, (0, express_core_2.Params)("commentables_id")),
    __param(2, (0, express_core_2.Params)("subcommentables_id")),
    __param(3, (0, express_core_2.Params)("id")),
    __param(4, (0, express_core_2.Body)()),
    __param(5, (0, express_core_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object, Object]),
    __metadata("design:returntype", Promise)
], SubcommentsApiController.prototype, "update", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_2.Status)(201),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        commentables_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.commentsEntities.includes(val), "entidad no válida"),
        ]),
        commentables_id: (0, valibot_2.string)(),
        subcommentables_id: (0, valibot_2.string)(),
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Delete)("/:commentables_type/:commentables_id/subcomments/:subcommentables_id/:id"),
    __param(0, (0, express_core_2.Params)("commentables_type")),
    __param(1, (0, express_core_2.Params)("commentables_id")),
    __param(2, (0, express_core_2.Params)("subcommentables_id")),
    __param(3, (0, express_core_2.Params)("id")),
    __param(4, (0, express_core_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, Object]),
    __metadata("design:returntype", Promise)
], SubcommentsApiController.prototype, "destroy", null);
exports.SubcommentsApiController = SubcommentsApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/comments"),
    __metadata("design:paramtypes", [subcomments_api_service_1.SubcommentsApiService])
], SubcommentsApiController);
