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
exports.CommentsApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const comments_store_dto_1 = require("@/polymorphism/dtos/comments.store.dto");
const comments_update_dto_1 = require("@/polymorphism/dtos/comments.update.dto");
const permission_auth_guard_1 = require("@/auth/guards/permission-auth.guard");
const comments_api_service_1 = require("../services/comments.api.service");
const libs_1 = require("../libs");
const users_entity_1 = require("@/users/entities/users.entity");
let CommentsApiController = class CommentsApiController {
    constructor(commentsApiService) {
        this.commentsApiService = commentsApiService;
    }
    index(commentables_type, commentables_id, query, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsApiService.index(empresa, commentables_type, commentables_id, query);
            return result;
        });
    }
    show(commentables_type, commentables_id, id, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsApiService.show(empresa, commentables_type, commentables_id, id);
            return result;
        });
    }
    store(commentables_type, commentables_id, body, empresa, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsApiService.store(empresa, commentables_type, commentables_id, body, user.id);
            return result;
        });
    }
    update(commentables_type, commentables_id, id, body, user, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsApiService.update(empresa, commentables_type, commentables_id, id, body, user.id);
            return result;
        });
    }
    destroy(commentables_type, commentables_id, id, user, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.commentsApiService.destroy(empresa, commentables_type, commentables_id, id, user.id);
            return result;
        });
    }
};
exports.CommentsApiController = CommentsApiController;
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        commentables_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.commentsEntities.includes(val), "entidad no válida"),
        ]),
        commentables_id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:commentables_type/:commentables_id"),
    __param(0, (0, express_core_2.Params)("commentables_type")),
    __param(1, (0, express_core_2.Params)("commentables_id")),
    __param(2, (0, express_core_2.Query)()),
    __param(3, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Function]),
    __metadata("design:returntype", Promise)
], CommentsApiController.prototype, "index", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        commentables_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.commentsEntities.includes(val), "entidad no válida"),
        ]),
        commentables_id: (0, valibot_2.string)(),
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:commentables_type/:commentables_id/:id"),
    __param(0, (0, express_core_2.Params)("commentables_type")),
    __param(1, (0, express_core_2.Params)("commentables_id")),
    __param(2, (0, express_core_2.Params)("id")),
    __param(3, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Function]),
    __metadata("design:returntype", Promise)
], CommentsApiController.prototype, "show", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        commentables_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.commentsEntities.includes(val), "entidad no válida"),
        ]),
        commentables_id: (0, valibot_2.string)(),
    })),
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(comments_store_dto_1.commentsStoreDto),
    (0, express_core_2.Status)(201),
    (0, express_core_2.Post)("/:commentables_type/:commentables_id"),
    __param(0, (0, express_core_2.Params)("commentables_type")),
    __param(1, (0, express_core_2.Params)("commentables_id")),
    __param(2, (0, express_core_2.Body)()),
    __param(3, (0, express_core_1.Req)("empresa")),
    __param(4, (0, express_core_1.Req)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Function, users_entity_1.Users]),
    __metadata("design:returntype", Promise)
], CommentsApiController.prototype, "store", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(comments_update_dto_1.commentsUpdateDto),
    (0, express_core_2.Status)(201),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        commentables_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.commentsEntities.includes(val), "entidad no válida"),
        ]),
        commentables_id: (0, valibot_2.string)(),
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Put)("/:commentables_type/:commentables_id/:id"),
    __param(0, (0, express_core_2.Params)("commentables_type")),
    __param(1, (0, express_core_2.Params)("commentables_id")),
    __param(2, (0, express_core_2.Params)("id")),
    __param(3, (0, express_core_2.Body)()),
    __param(4, (0, express_core_1.Req)("user")),
    __param(5, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object, users_entity_1.Users, Function]),
    __metadata("design:returntype", Promise)
], CommentsApiController.prototype, "update", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_2.Status)(201),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        commentables_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.commentsEntities.includes(val), "entidad no válida"),
        ]),
        commentables_id: (0, valibot_2.string)(),
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Delete)("/:commentables_type/:commentables_id/:id"),
    __param(0, (0, express_core_2.Params)("commentables_type")),
    __param(1, (0, express_core_2.Params)("commentables_id")),
    __param(2, (0, express_core_2.Params)("id")),
    __param(3, (0, express_core_1.Req)("user")),
    __param(4, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, users_entity_1.Users, Function]),
    __metadata("design:returntype", Promise)
], CommentsApiController.prototype, "destroy", null);
exports.CommentsApiController = CommentsApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/comments"),
    __metadata("design:paramtypes", [comments_api_service_1.CommentsApiService])
], CommentsApiController);
