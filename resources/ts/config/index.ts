import { storageInformation } from "@/information/stores/information.store";

const enviroments = {
	VITE_URL: import.meta.env.VITE_URL,
	VITE_VIGILIO_WEB: import.meta.env.VITE_VIGILIO_WEB,
	VITE_VIGILIO_TOKEN: import.meta.env.VITE_VIGILIO_TOKEN,
	VITE_VIGILIO_SUNAT: import.meta.env.VITE_VIGILIO_SUNAT,
	VITE_SUNAT_TOKEN: import.meta.env.VITE_SUNAT_TOKEN,
	VITE_IGV: import.meta.env.VITE_IGV,
	VITE_DIASFACTURASBOLETA: import.meta.env.VITE_DIASFACTURASBOLETA,
	VITE_PASARELA_COMISION: storageInformation!.mercado_pago_comision.comision,
	VITE_PASARELA_COMISION_IMPUESTO:
		storageInformation!.mercado_pago_comision.transaccion ?? 0,
	VITE_PASARELA_COMISION_TRANSACCION: Number(
		import.meta.env.VITE_PASARELA_COMISION_TRANSACCION,
	),
	VITE_NIUBIZ_WEB: import.meta.env.VITE_NIUBIZ_WEB,
	VITE_TOKEN_VIGILIO_SERVICES: import.meta.env.VITE_TOKEN_VIGILIO_SERVICES,
	VITE_BG_PRIMARY: import.meta.env.VITE_BG_PRIMARY,
	VITE_PLUBIC_VAPID_KEY: import.meta.env.VITE_PLUBIC_VAPID_KEY as string,
	VITE_PRIVATE_VAPID_KEY: import.meta.env.VITE_PRIVATE_VAPID_KEY as string,
	VITE_PAYPAL_COMISION: Number(import.meta.env.VITE_PAYPAL_COMISION),
	VITE_PAYPAL_TRANSACTION: Number(import.meta.env.VITE_PAYPAL_TRANSACTION),
	// IZIPAY
	VITE_IZIPAY_URL: import.meta.env.VITE_IZIPAY_URL,
	VITE_IZIPAY_PUBLIC_KEY: import.meta.env.VITE_IZIPAY_PUBLIC_KEY,
	TYPE_BORDER: storageInformation?.setting.type_border ?? "square",
	TYPE_START: "star" as "heart" | "star",
	TYPE_CART: storageInformation?.setting.type_cart ?? "far fa-shopping-cart",
};

export default enviroments;
