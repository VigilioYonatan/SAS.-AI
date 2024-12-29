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
exports.UsersApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const users_api_service_1 = require("../services/users.api.service");
const express_core_2 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const users_store_dto_1 = require("../dtos/users.store.dto");
const users_update_dto_1 = require("../dtos/users.update.dto");
const valibot_2 = require("@vigilio/valibot");
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
const permission_auth_guard_1 = require("@/auth/guards/permission-auth.guard");
const users_profile_dto_1 = require("../dtos/users.profile.dto");
const users_password_dto_1 = require("../dtos/users.password.dto");
let UsersApiController = class UsersApiController {
    constructor(usersApiService) {
        this.usersApiService = usersApiService;
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersApiService.index();
            return result;
        });
    }
    show(slug, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersApiService.show(empresa, slug);
            return result;
        });
    }
    store(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersApiService.store(empresa, body);
            return result;
        });
    }
    profile(empresa, body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersApiService.profile(empresa, body, user);
            return result;
        });
    }
    changePassword(empresa, body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersApiService.changePassword(empresa, body, user);
            return result;
        });
    }
    update(empresa, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersApiService.update(empresa, id, body);
            return result;
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.usersApiService.destroy(empresa, id);
            return result;
        });
    }
};
exports.UsersApiController = UsersApiController;
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_2.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersApiController.prototype, "index", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        slug: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:slug"),
    __param(0, (0, express_core_2.Params)("slug")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], UsersApiController.prototype, "show", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(users_store_dto_1.usersStoreDto),
    (0, express_core_2.Status)(201),
    (0, express_core_2.Post)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], UsersApiController.prototype, "store", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(users_profile_dto_1.usersProfileDto),
    (0, express_core_2.Status)(200),
    (0, express_core_2.Put)("/profile"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_2.Body)()),
    __param(2, (0, express_core_1.Req)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object, Function]),
    __metadata("design:returntype", Promise)
], UsersApiController.prototype, "profile", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(users_password_dto_1.usersPasswordDto),
    (0, express_core_2.Status)(201),
    (0, express_core_2.Post)("/change-password"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_2.Body)()),
    __param(2, (0, express_core_1.Req)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object, Function]),
    __metadata("design:returntype", Promise)
], UsersApiController.prototype, "changePassword", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, valibot_1.Validator)(users_update_dto_1.usersUpdateDto),
    (0, express_core_2.Status)(200),
    (0, express_core_2.Put)("/:id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_2.Params)("id")),
    __param(2, (0, express_core_2.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, Object]),
    __metadata("design:returntype", Promise)
], UsersApiController.prototype, "update", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Status)(201),
    (0, express_core_2.Delete)("/:id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_2.Params)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String]),
    __metadata("design:returntype", Promise)
], UsersApiController.prototype, "destroy", null);
exports.UsersApiController = UsersApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/users"),
    __metadata("design:paramtypes", [users_api_service_1.UsersApiService])
], UsersApiController);
