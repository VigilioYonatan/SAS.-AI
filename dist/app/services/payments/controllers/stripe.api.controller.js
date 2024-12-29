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
exports.StripeApiServiceApiController = void 0;
const valibot_1 = require("@vigilio/express-core/valibot");
const orders_store_dto_1 = require("@/orders/dtos/orders.store.dto");
const express_core_1 = require("@vigilio/express-core");
let StripeApiServiceApiController = class StripeApiServiceApiController {
    constructor(stripeApiService) {
        this.stripeApiService = stripeApiService;
    }
    StripeApiService(body, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.stripeApiService.order(body, req);
            return result;
        });
    }
};
exports.StripeApiServiceApiController = StripeApiServiceApiController;
__decorate([
    (0, valibot_1.Validator)(orders_store_dto_1.ordersStoreDto),
    (0, express_core_1.Post)("/order"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StripeApiServiceApiController.prototype, "StripeApiService", null);
exports.StripeApiServiceApiController = StripeApiServiceApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/StripeApiService"),
    __metadata("design:paramtypes", [Function])
], StripeApiServiceApiController);
