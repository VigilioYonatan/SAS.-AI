import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export function driverInitial() {
	const driverA = driver({
		showProgress: true,
		popoverClass: "driverjs-theme",
		steps: [
			{
				popover: {
					title: storageEmpresa!.name_empresa.toUpperCase(),
					description:
						"Bienvenido a su <b>negocio digital con Inteligencia Artificial</b> 😀.",
				},
			},
			{
				element: "#Dashboard", // Elemento a resaltar
				popover: {
					title: "Dashboard",
					description: "Aquí encontrarás la resumen sobre tus <b>empresa</b>.",
				},
			},
			[1, 2].includes(storageEmpresa!.tipo_empresa.tipo_servicio_id)
				? {
						element: "#Productos",
						popover: {
							title: "Productos",
							description:
								"Aquí encontrarás la información sobre tus <b>productos</b>.",
						},
					}
				: {},
			{
				element: "#Local",
				popover: {
					title: "Local",
					description:
						"Aquí encontrarás la información sobre tus  <b>ordenes o pedidos hechas en tu local</b>.",
				},
			},
			{
				element: "#Delivery",
				popover: {
					title: "Delivery",
					description:
						"Aquí encontrarás la información sobre tus <b>ordenes o pedidos hechas en la aplicación web</b>.",
				},
			},
			storageEmpresa?.tipo_empresa.tipo_servicio_id === 3
				? {
						element: "#Servicios",
						popover: {
							title: "Servicios",
							description:
								"Aquí encontrarás la información sobre tus <b>Servicios</b>.",
						},
					}
				: {},
			{
				element: "#MetodosdePago",
				popover: {
					title: "Metodos de Pago",
					description: "Actualiza la información de tus métodos de pago.",
				},
			},
			{
				element: "#Whatsapp",
				popover: {
					title: "Whatsapp",
					description:
						"Aquí podrás usar <b>Whatsapp - Whatsapp CRM</b> al máximo.",
				},
			},
			{
				element: "#InteligenciaArtificial",
				popover: {
					title: "Inteligencia Artificial",
					description:
						"Aquí encontrarás la información y <b>configuración de tu Inteligencia Artificial</b>.",
				},
			},
			{
				element: "#Usuarios",
				popover: {
					title: "Usuarios",
					description: "Aquí encontrarás la <b>información tus usuarios</b>.",
				},
			},
			{
				element: "#herramientas",
				popover: {
					title: "Herramientas",
					description: "Más herramientas para tu web.",
				},
			},
		].filter((a) => Object.keys(a).length),
		allowClose: false,
	});

	// Iniciar el recorrido
	driverA.drive();
}

type Pay = "mensual" | "facturacion" | "telegram" | "tienda" | "tokens";
export const payments: Record<Pay, string[]> = {
	mensual: [
		"Asistente Virtual con Inteligencia Artificial.",
		"Generador de links de pagos I.A.",
		"Estado de los pedidos I.A.",
		"Agendar citas con I.A",
		"Entrenamiento Personalizado I.A.",
		"Chat con Inteligencia Artificial en tu tienda.",
		"Reconocimiento de Voz WhatsApp.",
		"5 millones de tokens I.A.",
		"Genera links de Pago",
		"Automatización de Respuestas y tareas.",
		"Reconocimiento de Voz Whatsapp.",
		"Soporte, Actualizaciones, mantenimiento y mucho más...",
	],
	tienda: [
		"Usuarios y Clientes ilimitados.",
		"Productos, Marcas y Categorias ilimitados.",
		"Mesas y Pisos para Restaurantes",
		"Servicios ilimitados.",
		"Ventas Local y Delivery.",
		"Notificaciones de tus pedidos.",
		"Whatsapp CRM - Enviar mensajes masivos.",
		"Asistente Virtual con I.A.",
		"Gestión de órdenes o pedidos CRM.",
		"Pasarelas de Pagos.",
		"Vender en Todo el País (opcional)",
		"Publicaciones.",
		"Herramientas.",
		"Carrito de Compra.",
		"Aplicativo Android.",
		"Short Links.",
		"Perzonalicación de Tu Web.",
		"Gestión de órdenes o pedidos.",
		"Automatización de Respuestas y tareas.",
		"Soporte, Actualizaciones, mantenimiento y mucho más...",
	].filter(Boolean) as string[],
	facturacion: [
		"Acceso al Dashboard de Facturación.",
		"Emitir Boleta, Notas, Guías.",
		"PDF ilimitado.",
		"XML ilimitado.",
		"CDR ilimitado.",
		"Soporte y mantenimiento.",
	],
	telegram: [
		"Inteligencia Artificial CLAUDE AI Y OPEN AI.",
		"Bot Artificial - Entrenamiento personalizado.",
		"Genera links de Pago.",
		"Gestión de órdenes o pedidos.",
		"Automatización de Respuestas y tareas.",
		"Reconocimiento de Voz Whatsapp.",
		"Soporte, mantenimiento y mucho más..",
	],
	tokens: [],
};
