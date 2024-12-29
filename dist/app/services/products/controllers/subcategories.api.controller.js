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
exports.SubcategoriesApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const subcategories_store_dto_1 = require("../dtos/subcategories.store.dto");
const subcategories_api_service_1 = require("../services/subcategories.api.service");
const subcategories_update_dto_1 = require("../dtos/subcategories.update.dto");
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
let SubcategoriesApiController = class SubcategoriesApiController {
    constructor(subcategoriesApiService) {
        this.subcategoriesApiService = subcategoriesApiService;
    }
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.subcategoriesApiService.index(empresa);
            return result;
        });
    }
    show(slug, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.subcategoriesApiService.show(empresa, slug);
            return result;
        });
    }
    store(body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.subcategoriesApiService.store(empresa, body);
            return result;
        });
    }
    update(id, body, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.subcategoriesApiService.update(empresa, id, body);
            return result;
        });
    }
    destroy(id, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.subcategoriesApiService.destroy(empresa, id);
            return result;
        });
    }
};
exports.SubcategoriesApiController = SubcategoriesApiController;
__decorate([
    (0, express_core_2.Get)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], SubcategoriesApiController.prototype, "index", null);
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
], SubcategoriesApiController.prototype, "show", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(subcategories_store_dto_1.subcategoriesStoreDto),
    (0, express_core_2.Status)(201),
    (0, express_core_2.Post)("/"),
    __param(0, (0, express_core_2.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], SubcategoriesApiController.prototype, "store", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, valibot_1.Validator)(subcategories_update_dto_1.subcategoriesUpdateDto),
    (0, express_core_2.Status)(200),
    (0, express_core_2.Put)("/:id"),
    __param(0, (0, express_core_2.Params)("id")),
    __param(1, (0, express_core_2.Body)()),
    __param(2, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Function]),
    __metadata("design:returntype", Promise)
], SubcategoriesApiController.prototype, "update", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Status)(201),
    (0, express_core_2.Delete)("/:id"),
    __param(0, (0, express_core_2.Params)("id")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], SubcategoriesApiController.prototype, "destroy", null);
exports.SubcategoriesApiController = SubcategoriesApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/subcategories"),
    __metadata("design:paramtypes", [subcategories_api_service_1.SubCategoriesApiService])
], SubcategoriesApiController);
