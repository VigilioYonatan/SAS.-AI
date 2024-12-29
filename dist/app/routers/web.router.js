"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webRouters = void 0;
const web_controller_1 = require("@/web/controllers/web.controller");
const cart_controller_1 = require("@/cart/controllers/cart.controller");
const payment_api_controller_1 = require("@/payments/controllers/payment.api.controller");
const paypal_controller_1 = require("@/payments/controllers/paypal.controller");
exports.webRouters = [
    cart_controller_1.CartController,
    web_controller_1.WebController,
    payment_api_controller_1.PaymentApiController,
    paypal_controller_1.PaypalController,
];
