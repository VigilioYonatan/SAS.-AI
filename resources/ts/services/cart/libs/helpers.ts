import useEmpresastore, {
	storageEmpresa,
} from "@/empresas/stores/empresa.store";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { ProductsServicioSchemaFromServer } from "@/products/schemas/products_servicio.schema";
import enviroments from "~/config";
export type PASARELA =
	| "stripe"
	| "mercado_pago"
	| "izipay"
	| "normal"
	| "paypal";
export function pasarelaComision(monto: number, type: PASARELA) {
	let comision: number | null = null;
	switch (type) {
		case "mercado_pago": {
			const porcentajeComision =
				storageEmpresa!.mercado_pago_comision.comision / 100;
			const comisionPorcentajeTotal = monto * porcentajeComision;

			// Calcular la comisión total sumando la comisión fija
			comision =
				comisionPorcentajeTotal +
				(storageEmpresa!.mercado_pago_comision.transaccion ?? 0);
			break;
		}
		case "izipay": {
			const tasaIziPay = enviroments.VITE_IZIPAY_COMISION / 100;
			const tasaIGV = enviroments.VITE_IZIPAY_COMISION_IMPUESTO / 100;

			const comisionIziPay = monto * tasaIziPay;
			const igvIziPay = comisionIziPay * tasaIGV;

			const igvCanalVirtual =
				enviroments.VITE_IZIPAY_COMISION_TRANSACCION * tasaIGV;

			const comisionTotal =
				comisionIziPay +
				igvIziPay +
				enviroments.VITE_IZIPAY_COMISION_TRANSACCION +
				igvCanalVirtual;

			comision = subtotal(comisionTotal, 18, true);
			break;
		}
		case "stripe": {
			const porcentajeComision = enviroments.VITE_STRIPE_COMISION / 100;
			const comisionPorcentajeTotal = monto * porcentajeComision;
			comision =
				comisionPorcentajeTotal +
				(enviroments.VITE_STRIPE_COMISION_TRANSACCION ?? 0);
			break;
		}
		default:
			comision = 0;
			break;
	}

	return comision;
}
export function paypalComision(monto: number, dolarNow: number) {
	const convert = monto / dolarNow;
	const comisionPayPalPorcentaje = enviroments.VITE_PAYPAL_COMISION / 100; // 4%
	const tarifaFijaPayPal = enviroments.VITE_PAYPAL_TRANSACTION; // $0.30 por transacción
	const comisionPayPal = convert * comisionPayPalPorcentaje + tarifaFijaPayPal;
	const subtotalConComision = convert + comisionPayPal;
	return subtotalConComision;
}

export function subtotal(price: number, discount: number, increase = false) {
	if (increase) {
		return price + (discount * price) / 100;
	}
	return price - (discount * price) / 100;
}

export function formatDolares(number: number) {
	return number.toLocaleString("en-US", {
		style: "currency",
		currency: "USD",
	});
}
export function formatMoney(number: number) {
	return number.toLocaleString(storageEmpresa?.money.international_simbolo, {
		style: "currency",
		currency: storageEmpresa?.money.simbolo,
	});
}

export function calculatePorcentajeDiscount(initial: number, final: number) {
	const porcentajeDescuento = ((initial - final) / initial) * 100;
	return Number(porcentajeDescuento.toFixed()); //
}

/* pasar producto, show discount. mostrar precio con descuento, agregar mas descuento */
export function subtotalIgv(
	product:
		| ProductsNormalSchemaFromServer
		| ProductsServicioSchemaFromServer
		| ProductsRestaurantSchemaFromServer,
	showWithDiscount = true,
	moreDiscount: number | null = null,
) {
	const empresaStore = useEmpresastore();
	// ganancias
	let price = product.price;
	// si puso descuento
	if (showWithDiscount) {
		price = subtotal(price, product.discount ?? 0);
	}
	//otro descuento puede ser cupon
	if (moreDiscount) {
		price = subtotal(price, moreDiscount);
	}

	return empresaStore.state?.enabled_igv
		? subtotal(price, empresaStore.state?.igv, true)
		: price;
}
export function igv(monto: number) {
	const empresaStore = useEmpresastore();
	return empresaStore.state?.enabled_igv
		? subtotal(monto, empresaStore.state?.igv, true)
		: monto;
}

export function redondeo(total: number) {
	return Math.floor(total * 10) / 10;
}
