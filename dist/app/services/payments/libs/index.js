"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pasarelaComision = pasarelaComision;
exports.paypalComision = paypalComision;
const helpers_1 = require("@/cart/libs/helpers");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
function pasarelaComision(empresa, monto, type) {
    var _a, _b;
    let comision = null;
    switch (type) {
        case "mercado_pago": {
            const porcentajeComision = empresa.mercado_pago_comision.comision / 100;
            const comisionPorcentajeTotal = monto * porcentajeComision;
            comision =
                comisionPorcentajeTotal +
                    ((_a = empresa.mercado_pago_comision.transaccion) !== null && _a !== void 0 ? _a : 0);
            break;
        }
        case "izipay": {
            const tasaIziPay = enviroments_config_1.default.VITE_IZIPAY_COMISION / 100;
            const tasaIGV = enviroments_config_1.default.VITE_IZIPAY_COMISION_IMPUESTO / 100;
            const comisionIziPay = monto * tasaIziPay;
            const igvIziPay = comisionIziPay * tasaIGV;
            const igvCanalVirtual = enviroments_config_1.default.VITE_IZIPAY_COMISION_TRANSACCION * tasaIGV;
            const comisionTotal = comisionIziPay +
                igvIziPay +
                enviroments_config_1.default.VITE_IZIPAY_COMISION_TRANSACCION +
                igvCanalVirtual;
            comision = (0, helpers_1.subtotal)(comisionTotal, 18, true);
            break;
        }
        case "stripe": {
            const porcentajeComision = enviroments_config_1.default.VITE_STRIPE_COMISION / 100;
            const comisionPorcentajeTotal = monto * porcentajeComision;
            comision =
                comisionPorcentajeTotal +
                    ((_b = enviroments_config_1.default.VITE_STRIPE_COMISION_TRANSACCION) !== null && _b !== void 0 ? _b : 0);
            break;
        }
        default:
            comision = 0;
            break;
    }
    return comision;
}
function paypalComision(monto, dolarNow) {
    return ((0, helpers_1.subtotal)(monto * dolarNow, enviroments_config_1.default.VITE_PAYPAL_COMISION, true) +
        enviroments_config_1.default.VITE_PAYPAL_TRANSACTION);
}
