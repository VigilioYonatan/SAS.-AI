import { useSignal } from "@preact/signals";
import enviroments from "~/config";

function Youtube() {
	const opacity = useSignal(1);
	const show = useSignal(false);
	return (
		<div
			class="w-full dark:bg-admin-paper-dark bg-white shadow p-1"
			style={{ opacity: opacity.value }}
		>
			<div class="h-[400px]">
				<iframe
					class="w-full  h-full"
					width="849"
					height="600"
					src="https://www.youtube.com/embed/CWFdkB75R1Q"
					title="Aplicacion Web Tienda Virtual con Inteligencia Artificial - WHATSAPP CRM MOBILE"
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
							const opa = Number((e.target as HTMLInputElement).value);

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
					Tienda Virtual - Aplicacion Web Eccomerce con Inteligencia Artificial
					CHAT - Whatsapp CRM por{" "}
					<a
						href={`${enviroments.VITE_URL}`}
						rel="noreferrer"
						target="_blank"
						class="text-primary"
					>
						https://www.vigilio-services.com
					</a>
				</b>
				<br />
				<b>Demo:</b>
				<a
					href="https://www.demo.vigilio-services.com"
					rel="noreferrer"
					target="_blank"
					class="text-primary"
				>
					https://www.demo.vigilio-services.com
				</a>
				<br />
				<br />
				<b>00:00:00</b> - Inicio
				<br /> <b>00:03:28</b> - Local y Delivery ventas <br /> <b>00:09:20</b>{" "}
				- Configuración de su empresa y web.
				<br /> <b>00:27:40</b> - Herramientas.
				<br />
				<b>00:31:00</b> - Productos, Categorias, Subcategorias, Familias y
				marcas.
				<br /> <b>00:52:38</b> - Cupones de descuento.
				<br /> <b>00:55:22</b> - Usuarios, proveedores y Posts.
				<br /> <b>00:58:00</b> - Facturación.
				<br /> <b>00:55:00</b> - Whatsapp CRM.
				<br /> <b>01:01:00</b> - Vendedor con Inteligencia Artificial.
				<br /> <b> 01:10:00 </b>- Mi perfil y notificaciones.
				<br />
				<b>01:14:00</b> - Horario de Atención y Roles.
				<br /> <b>01:16:00</b> - Buzón de Correo Electrónicos, Correo
				Corporativos y más.
				<br /> <b>01:22:00</b> - Ruleta Juego.
				<br /> <b>01:28:00</b> - Ordenes - Pedidos - Impresora termica PDF.
				<br />
				<b>01:35:00</b> - Más caracterisiticas de tu web.
				<br /> <b>01:41:00</b> - Restaurantes - MESAS en tiempo real <br />
				<b>01:44:00</b> - Como aumentar tus ventas - cupones, whatsapp y usando
				inteligencia Artificial
				<br />
				<br />{" "}
				<b>
					* Descargar y Instalar APP imprimir boletas , facturas,etc en android
					- EJECUTAS EL ARCHIVO DESCARGADO Y INSTALAS EN TU CELULAR ANDROID
				</b>
				<br />
				<a
					href="https://www.vigilio-services.com/sh/7ivt"
					target="_blank"
					rel="noreferrer"
				>
					https://www.vigilio-services.com/sh/7ivt
				</a>
			</div>
		</div>
	);
}

export default Youtube;
