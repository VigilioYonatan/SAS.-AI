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
exports.RatingApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const permission_auth_guard_1 = require("@/auth/guards/permission-auth.guard");
const ratings_api_service_1 = require("../services/ratings.api.service");
const libs_1 = require("../libs");
const ratings_store_dto_1 = require("../dtos/ratings.store.dto");
const ratings_update_dto_1 = require("../dtos/ratings.update.dto");
let RatingApiController = class RatingApiController {
    constructor(ratingApiService) {
        this.ratingApiService = ratingApiService;
    }
    index(ratingsable_type, ratingsable_id, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ratingApiService.index(empresa, ratingsable_type, ratingsable_id);
            return result;
        });
    }
    show(ratingsable_type, ratingsable_id, user, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ratingApiService.show(empresa, ratingsable_type, ratingsable_id, user.id);
            return result;
        });
    }
    store(ratingsable_type, ratingsable_id, body, user, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ratingApiService.store(empresa, ratingsable_type, ratingsable_id, body, user.id);
            return result;
        });
    }
    update(ratingsable_type, ratingsable_id, body, user, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ratingApiService.update(empresa, ratingsable_type, ratingsable_id, body, user.id);
            return result;
        });
    }
    destroy(ratingsable_type, ratingsable_id, user, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ratingApiService.destroy(empresa, ratingsable_type, ratingsable_id, user.id);
            return result;
        });
    }
};
exports.RatingApiController = RatingApiController;
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        ratingsable_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.ratingsEntities.includes(val), "entidad no válida"),
        ]),
        ratingsable_id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:ratingsable_type/:ratingsable_id"),
    __param(0, (0, express_core_2.Params)("ratingsable_type")),
    __param(1, (0, express_core_2.Params)("ratingsable_id")),
    __param(2, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Function]),
    __metadata("design:returntype", Promise)
], RatingApiController.prototype, "index", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        ratingsable_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.ratingsEntities.includes(val), "entidad no válida"),
        ]),
        ratingsable_id: (0, valibot_2.string)(),
    })),
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_2.Get)("/:ratingsable_type/:ratingsable_id"),
    __param(0, (0, express_core_2.Params)("ratingsable_type")),
    __param(1, (0, express_core_2.Params)("ratingsable_id")),
    __param(2, (0, express_core_1.Req)("user")),
    __param(3, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Function, Function]),
    __metadata("design:returntype", Promise)
], RatingApiController.prototype, "show", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        ratingsable_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.ratingsEntities.includes(val), "entidad no válida"),
        ]),
        ratingsable_id: (0, valibot_2.string)(),
    })),
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(ratings_store_dto_1.ratingsStoreDto),
    (0, express_core_2.Status)(201),
    (0, express_core_2.Post)("/:ratingsable_type/:ratingsable_id"),
    __param(0, (0, express_core_2.Params)("ratingsable_type")),
    __param(1, (0, express_core_2.Params)("ratingsable_id")),
    __param(2, (0, express_core_2.Body)()),
    __param(3, (0, express_core_1.Req)("user")),
    __param(4, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Function, Function]),
    __metadata("design:returntype", Promise)
], RatingApiController.prototype, "store", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Validator)(ratings_update_dto_1.ratingsUpdateDto),
    (0, express_core_2.Status)(201),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        ratingsable_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.ratingsEntities.includes(val), "entidad no válida"),
        ]),
        ratingsable_id: (0, valibot_2.string)(),
    })),
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_2.Put)("/:ratingsable_type/:ratingsable_id"),
    __param(0, (0, express_core_2.Params)("ratingsable_type")),
    __param(1, (0, express_core_2.Params)("ratingsable_id")),
    __param(2, (0, express_core_2.Body)()),
    __param(3, (0, express_core_1.Req)("user")),
    __param(4, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object, Function, Function]),
    __metadata("design:returntype", Promise)
], RatingApiController.prototype, "update", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, express_core_2.Status)(201),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        ratingsable_type: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.ratingsEntities.includes(val), "entidad no válida"),
        ]),
        ratingsable_id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Delete)("/:ratingsable_type/:ratingsable_id"),
    __param(0, (0, express_core_2.Params)("ratingsable_type")),
    __param(1, (0, express_core_2.Params)("ratingsable_id")),
    __param(2, (0, express_core_1.Req)("user")),
    __param(3, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Function, Function]),
    __metadata("design:returntype", Promise)
], RatingApiController.prototype, "destroy", null);
exports.RatingApiController = RatingApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/ratings"),
    __metadata("design:paramtypes", [ratings_api_service_1.RatingsApiService])
], RatingApiController);
