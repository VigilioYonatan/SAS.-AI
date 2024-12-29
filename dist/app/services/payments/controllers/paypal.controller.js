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
exports.PaypalController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const paypal_service_1 = require("../services/paypal.service");
const valibot_1 = require("@vigilio/express-core/valibot");
const orders_store_dto_1 = require("@/orders/dtos/orders.store.dto");
let PaypalController = class PaypalController {
    constructor(paypalService) {
        this.paypalService = paypalService;
    }
    order(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.paypalService.order(req, body);
            return result;
        });
    }
    success(empresa, token, res, req) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token)
                return res.redirect("/");
            try {
                const result = yield this.paypalService.success(empresa, token, req);
                return res.render("web/payment/paypal/success", result);
            }
            catch (error) {
                return res.redirect(`/paypal/failed?message=${error.message}`);
            }
        });
    }
    cancel(empresa, res) {
        return __awaiter(this, void 0, void 0, function* () {
            return res.render("web/payment/paypal/cancel", {
                empresa,
                title: "Cancelado",
                description: "Pago Cancelado.",
            });
        });
    }
    failed(empresa, res, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message)
                return res.redirect("/");
            return res.render("web/payment/paypal/failed", {
                title: "Pago no realizado correctamente",
                message,
                empresa,
            });
        });
    }
};
exports.PaypalController = PaypalController;
__decorate([
    (0, valibot_1.Validator)(orders_store_dto_1.ordersStoreDto),
    (0, express_core_1.Post)("/api/order"),
    __param(0, (0, express_core_1.Req)()),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PaypalController.prototype, "order", null);
__decorate([
    (0, express_core_1.Get)("/success"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Query)("token")),
    __param(2, (0, express_core_1.Res)()),
    __param(3, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaypalController.prototype, "success", null);
__decorate([
    (0, express_core_1.Get)("/cancel"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], PaypalController.prototype, "cancel", null);
__decorate([
    (0, express_core_1.Get)("/failed"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Res)()),
    __param(2, (0, express_core_1.Query)("message")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object, String]),
    __metadata("design:returntype", Promise)
], PaypalController.prototype, "failed", null);
exports.PaypalController = PaypalController = __decorate([
    (0, express_core_2.Injectable)(),
    (0, express_core_1.Controller)("/paypal"),
    __metadata("design:paramtypes", [paypal_service_1.PaypalService])
], PaypalController);
