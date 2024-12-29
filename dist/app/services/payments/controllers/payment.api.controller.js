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
exports.PaymentApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const payment_api_service_1 = require("../services/payment.api.service");
const orders_store_dto_1 = require("@/orders/dtos/orders.store.dto");
const valibot_1 = require("@vigilio/express-core/valibot");
let PaymentApiController = class PaymentApiController {
    constructor(paymentApiService) {
        this.paymentApiService = paymentApiService;
    }
    order(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.paymentApiService.order(req, body);
            return result;
        });
    }
    success(req, query, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = req.empresa;
            const { preference_id } = query;
            if (!preference_id)
                return res.redirect("/");
            try {
                const result = yield this.paymentApiService.success(empresa, preference_id);
                return res.render("web/payment/mercado_pago/success", result);
            }
            catch (error) {
                return res.redirect(`/payment/failure?message=${error.message}`);
            }
        });
    }
    webhook(query, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = query.id;
            const type = query.topic;
            yield this.paymentApiService.webhook(req, id, type);
        });
    }
    cancel(empresa, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render("web/payment/mercado_pago/cancel", {
                empresa,
                title: "Este pago ha sido cancelado.",
                description: "Este pago ha sido cancelado.",
            });
        });
    }
    failed(req, res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const { preference_id } = query;
            if (!preference_id)
                throw new express_core_1.BadRequestException("unauthorized");
            const result = yield this.paymentApiService.failed(req, preference_id);
            return res.render("web/payment/mercado_pago/failed", Object.assign({ title: "Pago no realizado correctamente" }, result));
        });
    }
};
exports.PaymentApiController = PaymentApiController;
__decorate([
    (0, valibot_1.Validator)(orders_store_dto_1.ordersStoreDto),
    (0, express_core_1.Post)("/api/order"),
    __param(0, (0, express_core_1.Req)()),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentApiController.prototype, "order", null);
__decorate([
    (0, express_core_1.Get)("/success"),
    __param(0, (0, express_core_1.Req)()),
    __param(1, (0, express_core_1.Query)()),
    __param(2, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentApiController.prototype, "success", null);
__decorate([
    (0, express_core_1.Post)("/webhook"),
    __param(0, (0, express_core_1.Query)()),
    __param(1, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentApiController.prototype, "webhook", null);
__decorate([
    (0, express_core_1.Get)("/cancel"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], PaymentApiController.prototype, "cancel", null);
__decorate([
    (0, express_core_1.Get)("/failure"),
    __param(0, (0, express_core_1.Req)()),
    __param(1, (0, express_core_1.Res)()),
    __param(2, (0, express_core_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], PaymentApiController.prototype, "failed", null);
exports.PaymentApiController = PaymentApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/payment"),
    __metadata("design:paramtypes", [payment_api_service_1.PaymentApiService])
], PaymentApiController);
