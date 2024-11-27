import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { NOW, restarDays } from "~/libs/helpers";

const enviroments = {
	VITE_ENV: import.meta.env.VITE_ENV,
	VITE_VIGILIO_WEB: import.meta.env.VITE_VIGILIO_WEB,
	VITE_VIGILIO_TOKEN: import.meta.env.VITE_VIGILIO_TOKEN,
	VITE_VIGILIO_SUNAT: import.meta.env.VITE_VIGILIO_SUNAT,
	VITE_SUNAT_TOKEN: import.meta.env.VITE_SUNAT_TOKEN,
	VITE_IGV: import.meta.env.VITE_IGV,
	VITE_DIASFACTURASBOLETA: import.meta.env.VITE_DIASFACTURASBOLETA,
	VITE_PASARELA_COMISION: storageEmpresa!.mercado_pago_comision.comision,
	VITE_PASARELA_COMISION_IMPUESTO:
		storageEmpresa!.mercado_pago_comision.transaccion ?? 0,
	VITE_PASARELA_COMISION_TRANSACCION: Number(
		storageEmpresa!.mercado_pago_comision.transaccion ?? 0,
	),
	VITE_IZIPAY_COMISION: Number(import.meta.env.VITE_IZIPAY_COMISION),
	VITE_IZIPAY_COMISION_IMPUESTO: Number(
		import.meta.env.VITE_IZIPAY_COMISION_IMPUESTO,
	),
	VITE_IZIPAY_COMISION_TRANSACCION: Number(
		import.meta.env.VITE_IZIPAY_COMISION_TRANSACCION,
	),
	VITE_NIUBIZ_WEB: import.meta.env.VITE_NIUBIZ_WEB,
	VITE_TOKEN_VIGILIO_SERVICES: import.meta.env.VITE_TOKEN_VIGILIO_SERVICES,
	VITE_BG_PRIMARY: import.meta.env.VITE_BG_PRIMARY,
	VITE_PLUBIC_VAPID_KEY: import.meta.env.VITE_PLUBIC_VAPID_KEY as string,
	VITE_PRIVATE_VAPID_KEY: import.meta.env.VITE_PRIVATE_VAPID_KEY as string,
	VITE_PAYPAL_COMISION: Number(import.meta.env.VITE_PAYPAL_COMISION),
	VITE_PAYPAL_TRANSACTION: Number(import.meta.env.VITE_PAYPAL_TRANSACTION),
	VITE_PAYPAL_COMISION_EURO: Number(import.meta.env.VITE_PAYPAL_COMISION_EURO),
	VITE_PAYPAL_TRANSACTION_EURO: Number(
		import.meta.env.VITE_PAYPAL_TRANSACTION_EURO,
	),
	// IZIPAY
	VITE_IZIPAY_URL: import.meta.env.VITE_IZIPAY_URL,
	TYPE_BORDER: storageEmpresa?.setting.type_border ?? "square",
	TYPE_START: storageEmpresa?.setting.type_star as "heart" | "star",
	TYPE_CART: storageEmpresa?.setting.type_cart ?? "far fa-shopping-cart",
	// stripe
	VITE_STRIPE_COMISION: Number(import.meta.env.VITE_STRIPE_COMISION),
	VITE_STRIPE_COMISION_TRANSACCION: Number(
		import.meta.env.VITE_STRIPE_COMISION_TRANSACCION,
	),
};

export default enviroments;
export function fechasVencidas() {
	const fechas = {
		mensual: restarDays(
			NOW().toDate(),
			storageEmpresa!.payments.mensual.date as Date,
			"day",
		),
		// redes: restarDays(
		//     NOW().toDate(),
		//     storageEmpresa!.payments.redes.date as Date,
		//     "day"
		// ),
		token: storageEmpresa!.payments.tokens.tokens,
		facturacion: storageEmpresa!.payments.facturacion
			? restarDays(
					NOW().toDate(),
					storageEmpresa!.payments.facturacion?.date as Date,
					"day",
				)
			: null,
	};
	return fechas.mensual < 5 && fechas.mensual >= 0
		? "tu plan mensual"
		: // : fechas.redes < 5 && fechas.mensual >= 0
			// ? "tu plan de redes mensual"
			fechas.facturacion && fechas.facturacion < 5 && fechas.mensual >= 0
			? "tu plan de Facturación mensual"
			: fechas.token < 500000
				? "tus tokens IA"
				: null;
}

export const BASE_URL =
	storageEmpresa!.setting.host.host && storageEmpresa!.setting.host.enabled
		? `https://www.${storageEmpresa!.setting.host.host}`
		: enviroments.VITE_ENV === "production"
			? `https://www.${storageEmpresa!.slug}.vigilio-services.com`
			: `http://www.${storageEmpresa!.slug}.localhost:4003`;
