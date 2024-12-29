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
exports.NotificationsApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const notifications_api_service_1 = require("../services/notifications.api.service");
const express_core_2 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const users_entity_1 = require("@/users/entities/users.entity");
const permission_auth_guard_1 = require("@/auth/guards/permission-auth.guard");
const users_schema_1 = require("@/users/schemas/users.schema");
let NotificationsApiController = class NotificationsApiController {
    constructor(notificationsApiService) {
        this.notificationsApiService = notificationsApiService;
    }
    count(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const empresa = req.empresa;
            const result = yield this.notificationsApiService.count(empresa, user);
            return result;
        });
    }
    register(body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.notificationsApiService.register(user, body);
            return result;
        });
    }
    clean(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const empresa = req.empresa;
            const result = yield this.notificationsApiService.clean(empresa, user);
            return result;
        });
    }
    show(req, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = req.empresa;
            const result = yield this.notificationsApiService.show(empresa, id);
            return result;
        });
    }
    update(req, body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = req.empresa;
            const result = yield this.notificationsApiService.update(empresa, user, body);
            return result;
        });
    }
};
exports.NotificationsApiController = NotificationsApiController;
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_2.Get)("/count"),
    __param(0, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "count", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(users_schema_1.subscription),
    (0, express_core_1.Post)("/subscribe"),
    __param(0, (0, express_core_2.Body)()),
    __param(1, (0, express_core_1.Req)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, users_entity_1.Users]),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "register", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_2.Get)("/clean"),
    __param(0, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "clean", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:id"),
    __param(0, (0, express_core_1.Req)()),
    __param(1, (0, express_core_2.Params)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "show", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)((0, valibot_2.objectAsync)({ notification_id: (0, valibot_2.number)(), isRead: (0, valibot_2.boolean)() })),
    (0, express_core_2.Put)("/"),
    __param(0, (0, express_core_1.Req)()),
    __param(1, (0, express_core_2.Body)()),
    __param(2, (0, express_core_1.Req)("user")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, users_entity_1.Users]),
    __metadata("design:returntype", Promise)
], NotificationsApiController.prototype, "update", null);
exports.NotificationsApiController = NotificationsApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/notifications"),
    __metadata("design:paramtypes", [notifications_api_service_1.NotificationsApiService])
], NotificationsApiController);
