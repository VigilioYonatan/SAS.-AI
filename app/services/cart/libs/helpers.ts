import { Empresas } from "@/empresas/entities/empresas.entity";
import type { Money } from "@/empresas/libs";
import type { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import type { ProductsServicio } from "@/products/entities/products_servicio.entity";

export function subtotal(price: number, discount: number, increase = false) {
    if (increase) {
        return price + (discount * price) / 100;
    }
    return price - (discount * price) / 100;
}

export function formatMoney(empresa: Empresas, number: number, money: Money) {
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

export function calculatePorcentajeDiscount(initial: number, final: number) {
    const porcentajeDescuento = ((initial - final) / initial) * 100;
    return Number(porcentajeDescuento.toFixed()); //
}

export function redondeo(total: number) {
    return Math.floor(total * 10) / 10;
}
export function subtotalIgv(
    empresa: Empresas,
    product: ProductsNormal | ProductsServicio | ProductsRestaurant,
    coupon: null | number = null
) {
    let subDiscount = subtotal(product.price, product.discount ?? 0);
    if (coupon) {
        subDiscount = subtotal(subDiscount, coupon);
    }
    return empresa!.enabled_igv
        ? subtotal(subDiscount, empresa.igv, true)
        : subDiscount;
}
