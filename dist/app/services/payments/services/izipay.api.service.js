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
exports.IzipayApiService = void 0;
const orders_api_service_1 = require("@/orders/services/orders.api.service");
const libs_1 = require("@/orders/libs");
const enc_hex_1 = __importDefault(require("crypto-js/enc-hex"));
const hmac_sha256_1 = __importDefault(require("crypto-js/hmac-sha256"));
const express_core_1 = require("@vigilio/express-core");
const metodosPago_entity_1 = require("@/empresas/entities/metodosPago.entity");
const libs_2 = require("../libs");
let IzipayApiService = class IzipayApiService {
    constructor(ordersApiService) {
        this.ordersApiService = ordersApiService;
    }
    izipay(body, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = req.empresa;
            const metodosPago = yield metodosPago_entity_1.MetodosPago.findOne({
                where: {
                    empresa_id: empresa.id,
                },
            });
            if (!(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.izipay.izipay_client_id) ||
                !(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.izipay.izipay_client_secret) ||
                !(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.izipay.izipay_hash_key) ||
                !(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.izipay.izipay_public_key)) {
                throw new express_core_1.BadRequestException("Error izipay es requerido");
            }
            try {
                const currency = "PEN";
                const { order: orderStore } = yield this.ordersApiService.store(body, req, "izipay", 1, {
                    pasarela_comision: empresa.enabledClientPayComision,
                });
                const amount = empresa.enabledClientPayComision
                    ? orderStore.total +
                        (0, libs_2.pasarelaComision)(empresa, orderStore.total, "izipay")
                    : orderStore.total;
                const auth = btoa(`${metodosPago.izipay.izipay_client_id}:${metodosPago.izipay.izipay_client_secret}`);
                const customer = body.email ? { email: body.email } : {};
                const response = yield fetch("https://api.micuentaweb.pe/api-payment/V4/Charge/CreatePayment", {
                    method: "POST",
                    body: JSON.stringify(Object.assign({ amount: Number.parseInt(amount.toFixed(2)) * 100, currency: currency, orderId: orderStore.order_code }, customer)),
                    headers: {
                        Authorization: `Basic ${auth}`,
                        "Content-Type": "application/json",
                    },
                });
                const resultIzipay = yield response.json();
                if (resultIzipay.status !== "SUCCESS")
                    throw new express_core_1.BadRequestException(resultIzipay.answer.errorMessage);
                const token = resultIzipay.answer.formToken;
                return {
                    success: true,
                    token,
                };
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException("Error de server");
            }
        });
    }
    izipayValidate(body, empresa, req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const clientAnswer = body.clientAnswer;
                if (!clientAnswer) {
                    throw new express_core_1.BadRequestException("Invalid response format");
                }
                if (body.hashAlgorithm !== "sha256_hmac") {
                    throw new express_core_1.BadRequestException("Invalid hash algorithm");
                }
                const metodosPago = yield metodosPago_entity_1.MetodosPago.findOne({
                    where: { empresa_id: empresa.id },
                });
                if (!(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.izipay.izipay_client_id) ||
                    !(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.izipay.izipay_client_secret) ||
                    !(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.izipay.izipay_hash_key) ||
                    !(metodosPago === null || metodosPago === void 0 ? void 0 : metodosPago.izipay.izipay_public_key)) {
                    throw new express_core_1.BadRequestException("Error izipay es requerido");
                }
                if (!metodosPago.izipay.enabled) {
                    throw new express_core_1.BadRequestException("Error izipay is not available");
                }
                const answer = JSON.parse(body.rawClientAnswer);
                const answerHash = enc_hex_1.default.stringify((0, hmac_sha256_1.default)(JSON.stringify(answer), metodosPago.izipay.izipay_hash_key));
                if (answerHash !== body.hash)
                    throw new express_core_1.BadRequestException("Invalid hash");
                const orderCode = clientAnswer.orderDetails.orderId;
                const { order } = yield this.ordersApiService.show(empresa, orderCode);
                if (clientAnswer.orderStatus !== "PAID") {
                    const message = "Hubo un error al pagar";
                    yield this.onError(order, message);
                    yield this.ordersApiService.update({
                        order_code: order.order_code,
                        ordersUpdateDto: Object.assign(Object.assign({}, order.toJSON()), { pasarela_response: body }),
                        req,
                    });
                    throw new express_core_1.BadRequestException(message);
                }
                yield this.ordersApiService.update({
                    order_code: order.order_code,
                    ordersUpdateDto: Object.assign(Object.assign({}, order.toJSON()), { description: "Se realizó el pago.", status_order_id: libs_1.STATUSORDER.pagado, note: null, send_message: order.telephone, invoice: Object.assign(Object.assign({}, order.dataValues.invoice.toJSON()), { sendMessage: order.telephone, send_sunat: empresa.enabledSendSunat }), pasarela_response: body }),
                    req,
                });
                return {
                    success: true,
                    order,
                };
            }
            catch (error) {
                throw new express_core_1.InternalServerErrorException("Error de server");
            }
        });
    }
    onError(orderStore, message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (orderStore.status_order_id !== libs_1.STATUSORDER.pagado) {
                yield Promise.all([
                    orderStore.update({
                        status_order_id: libs_1.STATUSORDER.problema,
                        description: message,
                    }),
                ]);
            }
            throw new express_core_1.BadRequestException(message);
        });
    }
};
exports.IzipayApiService = IzipayApiService;
exports.IzipayApiService = IzipayApiService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [orders_api_service_1.OrdersApiService])
], IzipayApiService);
