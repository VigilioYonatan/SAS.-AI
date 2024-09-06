import { useSignal } from "@preact/signals";

const cookieStorage = localStorage.getItem("use_cookie");
function CookiesMessage() {
	const showCookieMessage = useSignal(true);
	if (cookieStorage === "ok") return null;
	return (
		<div class="fixed bottom-20  right-0 left-0 flex justify-center items-center z-[99]">
			<div
				class={`p-2 rounded-lg shadow-md flex flex-col  items-center justify-center max-w-6xl mb-2 dark:bg-paper-dark bg-background-light mx-2 ${
					showCookieMessage.value
						? "translate-y-0 opacity-1"
						: "translate-y-full  opacity-0"
				} delay-custom-1`}
			>
				<h3 class="text-primary font-bold dark:text-white">Uso de Cookies</h3>
				<p class=" dark:text-white  text-sm">
					Este sitio web utiliza cookies únicamente para gestionar sesiones y
					mejorar tu experiencia de navegación. Estas cookies son esenciales
					para el funcionamiento del sitio y no recopilan información personal
					identificable. Al continuar navegando en este sitio, aceptas el uso de
					estas cookies. Para más detalles, consulta nuestra{" "}
					<a
						aria-label="politica"
						href={"/politica-de-privacidad"}
						class="text-primary hover:underline font-bold"
					>
						Política de Cookies
					</a>
					.
				</p>
				<button
					type="button"
					class="bg-primary px-6 py-2 rounded-lg font-bold text-white mt-2"
					aria-label="OK"
					onClick={() => {
						showCookieMessage.value = false;
						localStorage.setItem("use_cookie", "ok");
					}}
				>
					OK
				</button>
			</div>
		</div>
	);
}

export default CookiesMessage;
