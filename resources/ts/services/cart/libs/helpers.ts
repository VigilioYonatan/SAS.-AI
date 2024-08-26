import useInformationstore from "@/information/stores/information.store";
import enviroments from "~/config";

export function pasarelaComision(monto: number) {
	const tasaIziPay = enviroments.VITE_PASARELA_COMISION / 100;
	const tasaIGV = enviroments.VITE_PASARELA_COMISION_IMPUESTO / 100;

	const comisionIziPay = monto * tasaIziPay;
	const igvIziPay = comisionIziPay * tasaIGV;

	const igvCanalVirtual =
		enviroments.VITE_PASARELA_COMISION_TRANSACCION * tasaIGV;

	const comisionTotal =
		comisionIziPay +
		igvIziPay +
		enviroments.VITE_PASARELA_COMISION_TRANSACCION +
		igvCanalVirtual;

	return comisionTotal;
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
export function formatSoles(number: number) {
	return number.toLocaleString("es-PE", {
		style: "currency",
		currency: "PEN",
	});
}


export function calculatePorcentajeDiscount(initial: number, final: number) {
	const porcentajeDescuento = ((initial - final) / initial) * 100;
	return Number(porcentajeDescuento.toFixed()); //
}

/* pasar producto, show discount. mostrar precio con descuento, agregar mas descuento */
export function subtotalIgv(
	product: ProductsSchemaFromServer,
	showWithDiscount = true,
	moreDiscount: number | null = null,
) {
	const informationStore = useInformationstore();
	// ganancias
	let price = subtotal(
		product.price,
		product.earning ?? informationStore.state!.earning,
		true,
	);
	// si puso descuento
	if (showWithDiscount) {
		price = subtotal(price, product.discount ?? 0);
	}
	//otro descuento puede ser cupon
	if (moreDiscount) {
		price = subtotal(price, moreDiscount);
	}

	return informationStore.state?.igv
		? subtotal(price, enviroments.VITE_IGV, true)
		: price;
}
export function igv(monto: number) {
	const informationStore = useInformationstore();
	return informationStore.state?.igv
		? subtotal(monto, enviroments.VITE_IGV, true)
		: monto;
}

export function redondeo(total: number) {
	return Math.floor(total * 10) / 10;
}
