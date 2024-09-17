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
			storageEmpresa?.dial_code === "51"
				? {
						element: "#Proveedores",
						popover: {
							title: "Proveedores",
							description:
								"Aquí encontrarás la <b>información de tus proveedores</b>.",
						},
					}
				: {},

			{
				element: "#Perfil",
				popover: {
					title: "Perfil",
					description:
						"Aquí encontrarás la <b>información y configuración de tu Perfil</b>.",
				},
			},
			{
				element: "#Configuracion",
				popover: {
					title: "Configuracion",
					description:
						"Aquí podrás hacer <b>configuraciones a tu web y empresa</b>.",
				},
			},
			{
				element: "#Plus",
				popover: {
					title: "Plus",
					description: "<b>Más Productos y servicios para tu web</b>.",
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
		" Acceso a la tienda y administrador de tu web.",
		"Agregar Categorías, Marcas y Productos.",
		"Agregar Cupones de descuento.",
		"Carrito de Compra Y Metodos de pagos.",
		"Gestion de Pedidos.",
		"Perzonalicación de tu web.",
		"Boton de WhatsApp y Chat con Inteligencia Artificial.",
		"Short Links.",
		"+ 10 Millones de Tokens A.I por mes.",
		"Reclamaciones, noticia y publicaciónes.",
		"Vender en Todo el País (opcional)",
		"Multiplataforma - Todos los dispositivos.",
		"Pasarela de Pagos y mucho más...",
	],
	tienda: [
		"Acceso a la tienda y administrador de tu web.",
		"Usuarios ilimitados",
		"Productos ilimitados",
		"Clientes ilimitados",
		"Ventas Local y Delivery.",
		"Notificaciones de tus pedidos.",
		"Whatsapp CRM - Enviar mensajes masivos.",
		storageEmpresa?.tipo_empresa.tipo_servicio_id === 2
			? "Pisos y Mesas en tiempo Real."
			: null,
		"Inteligencia Artificial CLAUDE AI Y OPEN AI.",
		"Genera links de Pago",
		"Asistente Artificial - Entrenamiento personalizado.",
		"Gestión de órdenes o pedidos.",
		"Automatización de Respuestas y tareas.",
		"Reconocimiento de Voz Whatsapp.",
		"15 millones de tokens para el uso de la Inteligencia Artificial mensualmente GRATIS",
		"Soporte, mantenimiento y mucho más..",
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
