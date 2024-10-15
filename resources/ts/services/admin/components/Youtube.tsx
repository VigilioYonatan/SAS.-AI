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
                    src="https://www.youtube.com/embed/GEX3Wo8dr_w"
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
                    Artificial CHAT - Whatsapp CRM por{" "}
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
                <b>00:00:00</b> - Intro <br />
                <b>00:01:00</b> - Resumen e Inteligencia Artificial <br />
                <b>00:07:00</b> - Configuraciones de tu web <br />
                <b>00:16:00</b> - Dashboard, Productos, Marcas, Categorías{" "}
                <br />
                <b>00:21:19</b> - Cupones de Descuento <br />
                <b>00:22:40</b> - Pasarelas de Pago <br />
                <b>00:27:00</b> - Gestión de Pedidos - Órdenes <br />
                <b>00:33:15</b> - WhatsApp CRM <br />
                <b>00:39:15</b> - Configuración de la Tienda Virtual <br />
                <b>00:44:30</b> - Finanzas <br />
                <b>00:47:00</b> - Agradecimientos
            </div>
        </div>
    );
}

export default Youtube;
