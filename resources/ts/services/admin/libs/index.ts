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
                        "Aquí encontrarás <b>resumen de tu empresa</b>.",
                },
            },
            {
                element: "#Local",
                popover: {
                    title: "Local",
                    description:
                        "Aquí encontrarás la información de las <b>ordenes o pedidos hechas en tu local</b>.",
                },
            },
            {
                element: "#Delivery",
                popover: {
                    title: "Delivery",
                    description:
                        "Aquí encontrarás la información de las <b>ordenes o pedidos hechas en la aplicación web</b>.",
                },
            },
            {
                element: "#Productos",
                popover: {
                    title: "Productos",
                    description:
                        "Aquí encontrarás la <b>información tus productos</b>.",
                },
            },
            storageEmpresa?.tipo_empresa.tipo_servicio_id === 2
                ? {
                      element: "#Servicios",
                      popover: {
                          title: "Servicios",
                          description:
                              "Aquí encontrarás la información de tus <b>Servicios</b>.",
                      },
                  }
                : {},
            {
                element: "#Whatsapp",
                popover: {
                    title: "Whatsapp",
                    description:
                        "Aquí encontrarás la información de tu <b>Whatsapp - Whatsapp CRM</b>.",
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
                element: "#Proveedores",
                popover: {
                    title: "Proveedores",
                    description:
                        "Aquí encontrarás la <b>información de tus proveedores</b>.",
                },
            },

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
                    description:
                        "<b>Más Productos y servicios para tu web</b>.",
                },
            },
            {
                element: "#herramientas",
                popover: {
                    title: "Herramientas",
                    description: "Más herramientas para tu web.",
                },
            },
        ],
        allowClose: false,
    });

    // Iniciar el recorrido
    driverA.drive();
}
