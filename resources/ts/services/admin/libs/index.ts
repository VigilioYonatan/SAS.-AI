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
                    description:
                        "Aquí encontrarás la resumen sobre tus <b>empresa</b>.",
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
                    description:
                        "Actualiza la información de tus métodos de pago.",
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
                    description:
                        "Aquí encontrarás la <b>información tus usuarios</b>.",
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

type Pay = "mensual" | "facturacion" | "redes" | "tienda" | "tokens";
export const payments: Record<Pay, string[]> = {
    mensual: [
        "Dominio Web - 1 año Gratis.",
        "WhatsApp 1 - año Gratis.",
        "Asistente Virtual con Inteligencia Artificial Whatsapp y Telegram Bot I.A.",
        "Links de Pago con Inteligencia Artificial (Cerrar ventas).",
        "Estado de los pedidos con Inteligencia Artificial.",
        "Agenda tus citas con Inteligencia Artificial.",
        "Entrenamiento Personalizado Inteligencia Artificial.",
        "Integración y Chat con Inteligencia Artificial en tu Tienda Virtual.",
        "Reconocimiento de Imágenes y Voz WhatsApp - Telegram.",
        "5 millones de tokens Inteligencia Artificial.",
        "Automatización de Respuestas y tareas.",
        "Soporte y Actualizaciones.",
    ],
    tienda: [
        "Subdominio Web y Asesoría Gratis",
        "15 días de prueba Suscripción Normal I.A",
        "Asistente Virtual con Inteligencia Artificial.",
        "Aplicativo Móvil 📱.",
        "Mesas y Pisos para Restaurantes (opcional).",
        "Usuarios y Clientes ilimitados.",
        "Productos, Marcas y Categorias ilimitados.",
        "Servicios ilimitados.",
        "Ventas Local y Delivery.",
        "Notificaciones de tus pedidos.",
        "Whatsapp CRM - Enviar mensajes masivos.",
        "Pasarelas de Pagos.",
        "Noticias y Publicaciones.",
        "Gestión de órdenes o pedidos CRM.",
        "Herramientas y Animaciones.",
        "Vender en Todo el País (opcional)",
        "Vender en dólares (opcional)",
        "Carrito de Compra.",
        "Personalización de Tu Web.",
        "Gestión de órdenes o pedidos.",
        "Short Links.",
        "Soporte y Actualizaciones.",
    ].filter(Boolean) as string[],
    facturacion: [
        "Acceso al Dashboard de Facturación.",
        "Emitir Boleta, Notas, Guías.",
        "PDF ilimitado.",
        "XML ilimitado.",
        "CDR ilimitado.",
        "Soporte y mantenimiento.",
    ],
    redes: [
        "Administra tus chats de Messenger, Instagram y TikTok en un solo lugar.",
        "Asistente Virtual con Inteligencia Artificial Messenger, Instagram, TikTok y LLamadas.",
        "Integración de Inteligencia Artificial en tus publicaciones en tus redes Sociales.",
        "Generador de links de pagos con Inteligencia Artificial.",
        "Estado de los pedidos  con Inteligencia Artificial.",
        "Agendar citas con Inteligencia Artificial.",
        "Entrenamiento Personalizado con Inteligencia Artificial.",
        "Reconocimiento de Voz Messenger.",
        "Automatización de Respuestas y tareas.",
        "Soporte y Actualizaciones.",
    ],
    tokens: [],
};
