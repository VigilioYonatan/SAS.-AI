import enviroments from ".";
// tipo de negocio
export function negocio() {
	return "Restaurante";
}
export function linkVigilio() {
	return enviroments.VITE_VIGILIO_WEB;
}
export function NoProfileImage() {
	return `${enviroments.VITE_URL}/images/settings/others/no-profile.webp`;
}
export function NoImage() {
	return `${enviroments.VITE_URL}/images/settings/others/no-image.webp`;
}
export function logoImage() {
	return `${enviroments.VITE_URL}/images/logo.png`;
}
export function PdfImage() {
	return `${enviroments.VITE_URL}/images/settings/others/pdf.webp`;
}
export function XmlImage() {
	return `${enviroments.VITE_URL}/images/settings/others/xml.webp`;
}
export function cdrImage() {
	return `${enviroments.VITE_URL}/images/settings/others/cdr.webp`;
}
export function SunatImage() {
	return `${enviroments.VITE_URL}/images/settings/others/sunat-original.webp`;
}
export function VisaMastercardImage() {
	return `${enviroments.VITE_URL}/images/settings/payments/visa-mastercard.webp`;
}

export function audioNotificacionAuthRegister() {
	return `${enviroments.VITE_URL}/sounds/bellsound.mp3`;
}

export function yapeImage() {
	return `${enviroments.VITE_URL}/images/settings/payments/yape.webp`;
}
export function visaImage() {
	return `${enviroments.VITE_URL}/images/settings/payments/visa.webp`;
}
export function mastercardImage() {
	return `${enviroments.VITE_URL}/images/settings/payments/mastercard.webp`;
}
export function paypalImage() {
	return `${enviroments.VITE_URL}/images/settings/payments/paypal.webp`;
}
export function paypalICOImage() {
	return `${enviroments.VITE_URL}/images/settings/payments/paypal_ico.webp`;
}
export function bcpImage() {
	return `${enviroments.VITE_URL}/images/settings/payments/bcp.webp`;
}
export function bbvaImage() {
	return `${enviroments.VITE_URL}/images/settings/payments/bbva.webp`;
}
export function interbankImage() {
	return `${enviroments.VITE_URL}/images/settings/payments/interbank.webp`;
}
export function vigilioServicesImage() {
	return `${enviroments.VITE_URL}/images/settings/vigilio-services-ico.webp`;
}
export function markerImage() {
	return `${enviroments.VITE_URL}/images/settings/others/marker.webp`;
}
export function plinImage() {
	return `${enviroments.VITE_URL}/images/settings/payments/plin.webp`;
}
export function libroReclamacionesImage() {
	return `${enviroments.VITE_URL}/images/settings/others/libro_de_reclamaciones.webp`;
}
export function petImage() {
	return `${enviroments.VITE_URL}/images/settings/others/pet.webp`;
}
export function authWallpaper() {
	return `${enviroments.VITE_URL}/images/settings/others/auth-wallpaper.webp`;
}

export function imageBackgroundIA() {
	return "https://www.remove.bg/es/upload";
}

export function serviceWorker() {
	return `${enviroments.VITE_URL}/js/service-worker.js`;
}
export function ruletaSound() {
	return `${enviroments.VITE_URL}/sounds/ruleta.mp3`;
}
export function tinSound() {
	return `${enviroments.VITE_URL}/sounds/tin.mp3`;
}

export function rouletteImage() {
	return `${enviroments.VITE_URL}/images/settings/others/roulette.webp`;
}
export function pedidosImage() {
	return `${enviroments.VITE_URL}/images/settings/others/pedidos.png`;
}
// map
export const coordMaps = { lat: -11.854602, lng: -77.071552 };
