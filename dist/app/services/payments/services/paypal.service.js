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
exports.PaypalService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const orders_api_service_1 = require("@/orders/services/orders.api.service");
const orders_entity_1 = require("@/orders/entities/orders.entity");
const libs_1 = require("@/orders/libs");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const payments_1 = require("@vigilio/payments");
const libs_2 = require("../libs");
const apis_1 = require("~/libs/apis");
const metodosPago_entity_1 = require("@/empresas/entities/metodosPago.entity");
const libs_3 = require("@/empresas/libs");
const cache_1 = __importDefault(require("@vigilio/express-core/cache"));
const helpers_1 = require("@/cart/libs/helpers");
const cart_entity_1 = require("@/cart/entites/cart.entity");
let PaypalService = class PaypalService {
    constructor(ordersApiService) {
        this.ordersApiService = ordersApiService;
    }
    order(req, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = req.empresa;
            const from = empresa.money.simbolo;
            let value = Number(cache_1.default.get(`money:${from}`));
            const to = empresa.dial_code === libs_3.DIALCODE.españa ? "EUR" : "USD";
            if (!value) {
                const response = yield (0, apis_1.converterMoneyApi)({
                    amount: "1",
                    from,
                    to,
                });
                value = Number.parseFloat(response.result.resultadoNumber);
                cache_1.default.set(`money:${from}`, response.result.resultadoNumber, 60 * 1000 * 60 * 24);
            }
            const metodo = yield metodosPago_entity_1.MetodosPago.findOne({
                where: { empresa_id: empresa.id },
            });
            if (!(metodo === null || metodo === void 0 ? void 0 : metodo.paypal.enabled) ||
                !metodo.paypal.paypal_client_id ||
                !metodo.paypal.paypal_secret_key)
                throw new express_core_2.BadRequestException("No disponible en este momento");
            const total = empresa.enabledClientPayComision
                ? empresa.dial_code === libs_3.DIALCODE.españa
                    ? ((0, helpers_1.subtotal)(body.total, enviroments_config_1.default.VITE_PAYPAL_COMISION_EURO, true) + enviroments_config_1.default.VITE_PAYPAL_TRANSACTION_EURO).toFixed(2)
                    : (0, libs_2.paypalComision)(body.total, value).toFixed(2)
                : (body.total * value).toFixed(2);
            const { createOrder } = (0, payments_1.paypal)({
                client_id: enviroments_config_1.default.NODE_ENV === "production"
                    ? metodo.paypal.paypal_client_id
                    : "AdAUJtqTTHeXqxRvut3TvNlCMSbUfWNoS_Xkq1mXmQaP1jvzUEtvdktdewxGaWXkjkP7N8BzaUu4j4ay",
                secret_key: enviroments_config_1.default.NODE_ENV === "production"
                    ? metodo.paypal.paypal_secret_key
                    : "EEqnW3MIBx9rKvmKmOrmX3SWOvFC3hUVKzdEPBq7HQ78jdigXLun14wEIizoaZcbD13E1xO8NQfdx7Ba",
                sandbox: enviroments_config_1.default.NODE_ENV === "production"
                    ? "https://api-m.paypal.com"
                    : enviroments_config_1.default.PAYPAL_SANDBOX,
            });
            const result = yield createOrder({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: to,
                            value: total,
                        },
                    },
                ],
                application_context: {
                    brand_name: empresa.name_empresa,
                    landing_page: "NO_PREFERENCE",
                    user_action: "PAY_NOW",
                    return_url: `${(0, libs_3.BASE_URL)(empresa)}/paypal/success`,
                    cancel_url: `${(0, libs_3.BASE_URL)(empresa)}/paypal/cancel`,
                },
            });
            if (result.status !== "CREATED")
                throw new express_core_2.BadRequestException("Hubo un problema al realizar esta orden. Intentalo de nuevo más tarde.");
            yield this.ordersApiService.store(Object.assign(Object.assign({}, body), { paypal_token: result.id, status_order_id: libs_1.STATUSORDER.pendiente }), req, "paypal", to === "EUR" ? 1 : value);
            return { success: true, result };
        });
    }
    success(empresa, token, req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const order = yield orders_entity_1.Orders.findOne({
                where: {
                    paypal_token: token,
                    empresa_id: empresa.id,
                },
            });
            if (!order)
                throw new express_core_1.NotFoundException("Orden no encontrado.");
            let result = null;
            try {
                const metodoPago = yield metodosPago_entity_1.MetodosPago.findOne({
                    where: { empresa_id: empresa.id },
                });
                if (!(metodoPago === null || metodoPago === void 0 ? void 0 : metodoPago.paypal.enabled) ||
                    !metodoPago.paypal.paypal_client_id ||
                    !metodoPago.paypal.paypal_secret_key)
                    throw new express_core_2.BadRequestException("No disponible en este momento");
                const { captureOrder } = (0, payments_1.paypal)({
                    client_id: metodoPago.paypal.paypal_client_id,
                    secret_key: metodoPago.paypal.paypal_secret_key,
                    sandbox: enviroments_config_1.default.NODE_ENV === "production"
                        ? "https://api-m.paypal.com"
                        : enviroments_config_1.default.PAYPAL_SANDBOX,
                });
                result = yield captureOrder(token);
                if (!result.status || result.status !== "COMPLETED") {
                    throw new Error((_a = result.details[0].description) !== null && _a !== void 0 ? _a : "No se realizó el pago correctamente.");
                }
            }
            catch (error) {
                if (order.status_order_id !== libs_1.STATUSORDER.pagado) {
                    yield order.update({
                        status_order_id: libs_1.STATUSORDER.problema,
                        paypal_response: error.message,
                        description: error.message,
                    });
                }
                throw new Error(error.message);
            }
            const { order: orderShow } = yield this.ordersApiService.show(empresa, order.order_code);
            yield this.ordersApiService.update({
                order_code: order.order_code,
                ordersUpdateDto: Object.assign(Object.assign({}, orderShow.toJSON()), { status_order_id: libs_1.STATUSORDER.pagado, note: null, send_message: empresa.enabledSendMessage, invoice: Object.assign(Object.assign({}, orderShow.dataValues.invoice.toJSON()), { sendMessage: true, send_sunat: empresa.enabledSendSunat }), paypal_response: result, description: "Pago realizado correctamente" }),
                req,
            });
            if (orderShow.user_id) {
                yield cart_entity_1.Cart.destroy({
                    where: {
                        user_id: orderShow.user_id,
                        empresa_id: empresa.id,
                    },
                });
            }
            return {
                title: "Pago realizado correctamente.",
                order,
                description: "Pago Realizado correctamente",
            };
        });
    }
    failed() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                title: "Pago realizado correctamente.",
                description: "Pago Realizado correctamente",
            };
        });
    }
};
exports.PaypalService = PaypalService;
exports.PaypalService = PaypalService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [orders_api_service_1.OrdersApiService])
], PaypalService);
