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
exports.PaymentApiService = void 0;
const metodosPago_entity_1 = require("@/empresas/entities/metodosPago.entity");
const libs_1 = require("@/empresas/libs");
const orders_api_service_1 = require("@/orders/services/orders.api.service");
const express_core_1 = require("@vigilio/express-core");
const mercadopago_1 = require("mercadopago");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const libs_2 = require("../libs");
const libs_3 = require("@/orders/libs");
const orders_entity_1 = require("@/orders/entities/orders.entity");
const cart_entity_1 = require("@/cart/entites/cart.entity");
let PaymentApiService = class PaymentApiService {
    constructor(ordersApiService) {
        this.ordersApiService = ordersApiService;
    }
    order(req, orderStore) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = req.empresa;
            const metodosPago = yield metodosPago_entity_1.MetodosPago.findOne({
                where: { empresa_id: empresa.id },
            });
            if (!(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.mercado_pago.enabled) ||
                !(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.mercado_pago.token))
                throw new express_core_1.BadRequestException("No disponible");
            const client = new mercadopago_1.MercadoPagoConfig({
                accessToken: enviroments_config_1.default.NODE_ENV === "production"
                    ? metodosPago.mercado_pago.token
                    : "APP_USR-292981138862703-092822-84632d11bca71d4ca5683f29034b2412-1591003666",
                options: {
                    timeout: 5000,
                },
            });
            const payment = new mercadopago_1.Preference(client);
            const typePasarela = "mercado_pago";
            try {
                const { order } = yield this.ordersApiService.store(orderStore, req, typePasarela, 1, { pasarela_comision: empresa.enabledClientPayComision });
                const total = empresa.enabledClientPayComision
                    ? (order.total +
                        (0, libs_2.pasarelaComision)(empresa, order.total, typePasarela)).toFixed(2)
                    : order.total.toFixed(2);
                const result = yield payment.create({
                    body: {
                        items: [
                            {
                                id: order.order_code,
                                title: `${empresa.name_empresa} - Pedido ${order.order_code}`,
                                unit_price: Number(total),
                                quantity: 1,
                            },
                        ],
                        back_urls: {
                            success: `${(0, libs_1.BASE_URL)(empresa)}/payment/success`,
                            failure: `${(0, libs_1.BASE_URL)(empresa)}/payment/failure`,
                            pending: `${(0, libs_1.BASE_URL)(empresa)}/payment/pending`,
                        },
                        notification_url: `${(0, libs_1.BASE_URL)(empresa)}/payment/webhook`,
                    },
                });
                yield order.update({ mercado_pago_token: result.id });
                return { success: true, result };
            }
            catch (error) {
                throw new express_core_1.BadRequestException(`Error al procesar el pago, ${error.message}`);
            }
        });
    }
    webhook(req, id, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === "payment") {
                const empresa = req.empresa;
                const metodosPago = yield metodosPago_entity_1.MetodosPago.findOne({
                    where: { empresa_id: empresa.id },
                });
                if (!(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.mercado_pago.enabled) ||
                    !(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.mercado_pago.token))
                    throw new express_core_1.BadRequestException("No disponible");
                try {
                    const payment = new mercadopago_1.Payment({
                        accessToken: enviroments_config_1.default.NODE_ENV === "production"
                            ? metodosPago.mercado_pago.token
                            : "APP_USR-292981138862703-092822-84632d11bca71d4ca5683f29034b2412-1591003666",
                    });
                    const pago = yield payment.get({ id });
                    const code = pago.additional_info.items[0].id;
                    const { order } = yield this.ordersApiService.show(empresa, code);
                    let ord = order;
                    if (pago.status === "approved") {
                        const { order: o } = yield this.ordersApiService.update({
                            order_code: order.order_code,
                            ordersUpdateDto: Object.assign(Object.assign({}, order.toJSON()), { status_order_id: libs_3.STATUSORDER.pagado, note: null, send_message: empresa.enabledSendMessage, invoice: Object.assign(Object.assign({}, order.dataValues.invoice.toJSON()), { sendMessage: true, send_sunat: empresa.enabledSendSunat }), paypal_response: pago, description: "Pago realizado correctamente" }),
                            req,
                        });
                        ord = o;
                        if (o.user_id) {
                            yield cart_entity_1.Cart.destroy({
                                where: {
                                    user_id: o.user_id,
                                    empresa_id: empresa.id,
                                },
                            });
                        }
                    }
                    yield this.ordersApiService.update({
                        order_code: order.order_code,
                        ordersUpdateDto: Object.assign(Object.assign({}, ord.toJSON()), { paypal_response: pago }),
                        req,
                    });
                }
                catch (error) {
                    throw new express_core_1.InternalServerErrorException("Error de capturar pago");
                }
            }
        });
    }
    success(empresa, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield orders_entity_1.Orders.findOne({
                where: {
                    empresa_id: empresa.id,
                    mercado_pago_token: token,
                },
            });
            if (!order)
                throw new express_core_1.BadRequestException("No order found");
            return {
                title: `${order.order_code} Se realizo el pago correctamente`,
                description: "Se realizo el pago correctamente",
                order,
            };
        });
    }
    failed(req, preference_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield orders_entity_1.Orders.findOne({
                    where: {
                        empresa_id: req.empresa.id,
                        mercado_pago_token: preference_id,
                    },
                });
                if (!order)
                    throw new express_core_1.BadRequestException("No order found");
                const description = "No se realizado el pago correctamente.";
                yield this.ordersApiService.update({
                    order_code: order.order_code,
                    ordersUpdateDto: Object.assign(Object.assign({}, order.toJSON()), { status_order_id: libs_3.STATUSORDER.problema, note: null, invoice: null, send_message: false, description }),
                    req,
                });
                return {
                    order: order.order_code,
                    description,
                };
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException("Error ");
            }
        });
    }
};
exports.PaymentApiService = PaymentApiService;
exports.PaymentApiService = PaymentApiService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [orders_api_service_1.OrdersApiService])
], PaymentApiService);
