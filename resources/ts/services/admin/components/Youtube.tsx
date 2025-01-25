import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useSignal } from "@preact/signals";
import enviroments from "~/config";

function Youtube() {
    const opacity = useSignal(1);
    const show = useSignal(false);
    return (
        <div
            class="w-full dark:bg-admin-paper-dark bg-white shadow p-1 "
            style={{ opacity: opacity.value }}
        >
            <div class="h-[400px]">
                <iframe
                    class="w-full  h-full"
                    width="849"
                    height="600"
                    src={`https://www.youtube.com/embed/${
                        storageEmpresa!.tipo_empresa.tipo_servicio_id === 3
                            ? "Nuuyg6QCcSA"
                            : storageEmpresa?.dial_code === "51" &&
                              storageEmpresa.tipo_empresa.tipo_servicio_id !== 3
                            ? "mB0roQcDtAo"
                            : "YPDyJNB3bV8"
                    }`}
                    title="Resumen Tutorial Negocio Digital con Inteligencia Aritificial"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerpolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                />
            </div>
            <div>
                <div class="w-full justify-between flex p-2">
                    <div />
                    <input
                        type="range"
                        max={1}
                        min={0}
                        step={0.1}
                        onChange={(e) => {
                            const opa = Number(
                                (e.target as HTMLInputElement).value
                            );

                            opacity.value = opa < 0.3 ? 0.3 : opa;
                        }}
                    />
                    <button
                        type="button"
                        onClick={() => {
                            show.value = !show.value;
                        }}
                        aria-label="down"
                    >
                        <i class="fas fa-sort-down" />
                    </button>
                </div>
            </div>
            <div
                class={`h-[180px] overflow-auto ${
                    show.value ? "max-h-[500px]" : "max-h-0 overflow-hidden"
                } delay-custom-1 text-xs dark:text-white`}
            >
                <b>
                    Negocio Digital - Aplicacion Web Eccomerce con Inteligencia
                    Artificial
                    <a
                        href={`${enviroments.VITE_VIGILIO_WEB}`}
                        rel="noreferrer"
                        target="_blank"
                        class="text-primary"
                    >
                        https://www.vigilio-services.com
                    </a>
                </b>
                <br />
                <br />
                <br />

                {storageEmpresa!.tipo_empresa.tipo_servicio_id === 3 ? (
                    <>
                        <b>00:00:00</b> - Intro
                        <br />
                        <b>00:00:40</b> - Resumen de tu Web y Inteligencia
                        Artificial
                        <br />
                        <b>00:06:20</b> - Configuración de tu Web
                        <br />
                        <b>00:15:40</b> - Dashboard, Servicios y Productos -
                        Variantes, Marcas, Categorías
                        <br />
                        <b>00:28:00</b> - Cupones de Descuento
                        <br />
                        <b>00:29:00</b> - Pasarelas de Pago (PayPal, Tarjeta de
                        crédito, etc.)
                        <br />
                        <b>00:37:15</b> - Gestión de Pedidos - Órdenes (PDF -
                        impresora térmica)
                        <br />
                        <b>00:43:30</b> - WhatsApp CRM y Multi-Whatsapp
                        (mensajes masivos, grupos, etc.)
                        <br />
                        <b>00:46:40</b> - Inteligencia Artificial y Citas I.A.
                        <br />
                        <b>00:59:49</b> - Personalización Web (edición,
                        noticias, posts, Short Links, etc.)
                        <br />
                        <b>01:05:30</b> - Sistema de Finanzas
                        <br />
                        <b>01:08:00</b> - Agradecimientos
                        <br />
                    </>
                ) : (
                    <>
                        {" "}
                        {storageEmpresa?.dial_code === "51" &&
                        storageEmpresa.tipo_empresa.tipo_servicio_id !== 3 ? (
                            <>
                                <b>00:00:00</b> - Intro
                                <br />
                                <b>00:00:40</b> - Resumen de tu Web e
                                Inteligencia Artificial
                                <br />
                                <b>00:07:20</b> - Configuración de tu Web
                                <br />
                                <b>00:16:40</b> - Dashboard, Productos,
                                Variantes, Marcas, Categorías
                                <br />
                                <b>00:21:30</b> - Cupones de Descuento
                                <br />
                                <b>00:23:10</b> - Pasarelas de Pago (PayPal,
                                Tarjeta de crédito, etc.)
                                <br />
                                <b>00:28:55</b> - Gestión de Pedidos y Órdenes
                                (PDF - impresora térmica)
                                <br />
                                <b>00:33:15</b> - Whatsapp CRM y MultiWhatsapp
                                (mensajes masivos, grupos, etc.)
                                <br />
                                <b>00:40:10</b> - Inteligencia Artificial y
                                Citas con I.A.
                                <br />
                                <b>00:55:00</b> - Personalización Web (edición,
                                noticias, posts, Short Links, etc.)
                                <br />
                                <b>01:00:00</b> - Sistema de Finanzas
                                <br />
                                <b>01:03:00</b> - Agradecimientos
                                <br />
                            </>
                        ) : (
                            <>
                                <b>00:00:00</b> - Intro
                                <br />
                                <b>00:00:40</b> - Resumen de tu Web y
                                Inteligencia Artificial
                                <br />
                                <b>00:06:20</b> - Configuración de tu Web
                                <br />
                                <b>00:15:40</b> - Dashboard, Productos -
                                Variantes, Marcas, Categorías
                                <br />
                                <b>00:20:30</b> - Cupones de Descuento
                                <br />
                                <b>00:22:10</b> - Pasarelas de Pago (PayPal,
                                Tarjeta de crédito, etc.)
                                <br />
                                <b>00:27:55</b> - Gestión de Pedidos - Órdenes
                                (PDF - impresora térmica)
                                <br />
                                <b>00:32:15</b> - Whatsapp CRM (mensajes
                                masivos, grupos, etc.)
                                <br />
                                <b>00:39:05</b> - Inteligencia Artificial y
                                Citas I.A.
                                <br />
                                <b>00:53:49</b> - Personalización Web (edición,
                                noticias, posts, Short Links, etc.)
                                <br />
                                <b>00:58:30</b> - Sistema de Finanzas
                                <br />
                                <b>01:02:00</b> - Agradecimientos
                                <br />
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default Youtube;
