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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeApiService = void 0;
const orders_api_service_1 = require("@/orders/services/orders.api.service");
const express_core_1 = require("@vigilio/express-core");
const metodosPago_entity_1 = require("@/empresas/entities/metodosPago.entity");
const stripe_1 = __importDefault(require("stripe"));
let StripeApiService = class StripeApiService {
    constructor(ordersApiService) {
        this.ordersApiService = ordersApiService;
    }
    order(body, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = req.empresa;
            const metodosPago = yield metodosPago_entity_1.MetodosPago.findOne({
                where: {
                    empresa_id: empresa.id,
                },
            });
            if (!(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.stripe.stripe_client_secret) ||
                !(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.stripe.stripe_secret_key)) {
                throw new express_core_1.BadRequestException("Error stripe es requerido");
            }
            try {
                const { order: orderStore } = yield this.ordersApiService.store(body, req, "stripe", 1, {
                    pasarela_comision: true,
                });
                const stripe = new stripe_1.default(metodosPago.stripe.stripe_secret_key);
                const paymentIntent = yield stripe.checkout.sessions.create({
                    line_items: [
                        {
                            price_data: {
                                product_data: {
                                    name: orderStore.order_code,
                                    description: `Pedido ${orderStore.order_code} - ${empresa.name_empresa}`,
                                },
                                currency: "eur",
                                unit_amount: Number.parseInt(orderStore.total.toFixed(2)) *
                                    100,
                            },
                            quantity: 1,
                        },
                    ],
                    mode: "payment",
                });
                return {
                    success: true,
                    order: orderStore,
                    url: paymentIntent.url,
                };
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException("Error de server");
            }
        });
    }
};
exports.StripeApiService = StripeApiService;
exports.StripeApiService = StripeApiService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [orders_api_service_1.OrdersApiService])
], StripeApiService);
