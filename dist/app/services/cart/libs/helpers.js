"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subtotal = subtotal;
exports.formatMoney = formatMoney;
exports.calculatePorcentajeDiscount = calculatePorcentajeDiscount;
exports.redondeo = redondeo;
exports.subtotalIgv = subtotalIgv;
function subtotal(price, discount, increase = false) {
    if (increase) {
        return price + (discount * price) / 100;
    }
    return price - (discount * price) / 100;
}
function formatMoney(empresa, number, money) {
    return money === "DOLARES"
        ? number.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        })
        : number.toLocaleString(empresa.money.international_simbolo, {
            style: "currency",
            currency: empresa.money.simbolo,
        });
}
function calculatePorcentajeDiscount(initial, final) {
    const porcentajeDescuento = ((initial - final) / initial) * 100;
    return Number(porcentajeDescuento.toFixed());
}
function redondeo(total) {
    return Math.floor(total * 10) / 10;
}
function subtotalIgv(empresa, product, coupon = null) {
    var _a;
    let subDiscount = subtotal(product.price, (_a = product.discount) !== null && _a !== void 0 ? _a : 0);
    if (coupon) {
        subDiscount = subtotal(subDiscount, coupon);
    }
    return empresa.enabled_igv
        ? subtotal(subDiscount, empresa.igv, true)
        : subDiscount;
}
