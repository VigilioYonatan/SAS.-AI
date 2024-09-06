import { InformationEntity } from "@/information/entities/information.entity";
import type { ProductsNormal } from "@/products/entities/products_normal.entity";
import type { ProductsRestaurant } from "@/products/entities/products_restaurant.entity";
import type { ProductsServicio } from "@/products/entities/products_servicio.entity";
import type { Money } from "~/libs/helpers";

export function subtotal(price: number, discount: number, increase = false) {
	if (increase) {
		return price + (discount * price) / 100;
	}
	return price - (discount * price) / 100;
}

export function formatMoney(
	information: InformationEntity,
	number: number,
	money: Money,
) {
	return money === "DOLARES"
		? number.toLocaleString("en-US", {
				style: "currency",
				currency: "USD",
			})
		: number.toLocaleString(information.money.international_simbolo, {
				style: "currency",
				currency: information.money.simbolo,
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
	information: InformationEntity,
	product: ProductsNormal | ProductsServicio | ProductsRestaurant,
	coupon: null | number = null,
) {
	let subDiscount = subtotal(product.price, product.discount ?? 0);
	if (coupon) {
		subDiscount = subtotal(subDiscount, coupon);
	}
	return information!.enabled_igv
		? subtotal(subDiscount, information.igv, true)
		: subDiscount;
}
