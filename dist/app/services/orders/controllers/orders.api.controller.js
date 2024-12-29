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
exports.OrdersApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const orders_api_service_1 = require("../services/orders.api.service");
const express_core_2 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const orders_store_dto_1 = require("../dtos/orders.store.dto");
const orders_update_dto_1 = require("../dtos/orders.update.dto");
const valibot_2 = require("@vigilio/valibot");
const permission_auth_guard_1 = require("@/auth/guards/permission-auth.guard");
let OrdersApiController = class OrdersApiController {
    constructor(ordersApiService) {
        this.ordersApiService = ordersApiService;
    }
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ordersApiService.index(empresa);
            return result;
        });
    }
    earningMonth(year, month, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ordersApiService.earningMonth(empresa, year, month);
            return result;
        });
    }
    show(order_code, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ordersApiService.show(empresa, order_code);
            return result;
        });
    }
    pdf(order_code, empresa, res, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ordersApiService.pdf(order_code, type, empresa);
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", `attachment; filename=${result.file}`);
            res.send(result.pdfBuffer);
        });
    }
    store(body, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ordersApiService.store(body, req);
            return result;
        });
    }
    html(order_code, empresa, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ordersApiService.html(order_code, type, empresa);
            return result;
        });
    }
    update(order_code, body, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.ordersApiService.update({
                order_code,
                ordersUpdateDto: body,
                req,
            });
            return result;
        });
    }
};
exports.OrdersApiController = OrdersApiController;
__decorate([
    (0, express_core_2.Get)("/"),
    __param(0, (0, express_core_2.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], OrdersApiController.prototype, "index", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        year: (0, valibot_2.string)(),
        month: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/earning/:year/:month"),
    __param(0, (0, express_core_2.Params)("year")),
    __param(1, (0, express_core_2.Params)("month")),
    __param(2, (0, express_core_2.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Function]),
    __metadata("design:returntype", Promise)
], OrdersApiController.prototype, "earningMonth", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        order_code: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:order_code"),
    __param(0, (0, express_core_2.Params)("order_code")),
    __param(1, (0, express_core_2.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], OrdersApiController.prototype, "show", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        order_code: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:order_code/pdf"),
    __param(0, (0, express_core_2.Params)("order_code")),
    __param(1, (0, express_core_2.Req)("empresa")),
    __param(2, (0, express_core_2.Res)()),
    __param(3, (0, express_core_2.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function, Object, String]),
    __metadata("design:returntype", Promise)
], OrdersApiController.prototype, "pdf", null);
__decorate([
    (0, valibot_1.Validator)(orders_store_dto_1.ordersStoreDto),
    (0, express_core_2.Status)(201),
    (0, express_core_2.Post)("/"),
    __param(0, (0, express_core_2.Body)()),
    __param(1, (0, express_core_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersApiController.prototype, "store", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        order_code: (0, valibot_2.string)(),
    })),
    (0, express_core_2.Get)("/:order_code/html"),
    __param(0, (0, express_core_2.Params)("order_code")),
    __param(1, (0, express_core_2.Req)("empresa")),
    __param(2, (0, express_core_2.Query)("type")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function, String]),
    __metadata("design:returntype", Promise)
], OrdersApiController.prototype, "html", null);
__decorate([
    (0, permission_auth_guard_1.PermissionAuth)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        order_code: (0, valibot_2.string)(),
    })),
    (0, valibot_1.Validator)(orders_update_dto_1.ordersUpdateDto),
    (0, express_core_2.Status)(201),
    (0, express_core_2.Put)("/:order_code"),
    __param(0, (0, express_core_2.Params)("order_code")),
    __param(1, (0, express_core_2.Body)()),
    __param(2, (0, express_core_2.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], OrdersApiController.prototype, "update", null);
exports.OrdersApiController = OrdersApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/orders"),
    __metadata("design:paramtypes", [orders_api_service_1.OrdersApiService])
], OrdersApiController);
