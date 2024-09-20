import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useSignal } from "@preact/signals";
import confetti from "canvas-confetti";
import { useEffect } from "preact/hooks";
interface BeforeInstallPromptEvent extends Event {
	readonly platform: string;
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
	prompt(): void;
}
function MessagePWA() {
	// Signals para manejar el estado de la PWA
	const deferredPrompt = useSignal<BeforeInstallPromptEvent | null>(null);
	const showBanner = useSignal(false);

	useEffect(() => {
		function handleBeforeInstallPrompt(e: Event) {
			const event = e as BeforeInstallPromptEvent;
			event.preventDefault();
			deferredPrompt.value = event;
			showBanner.value = true;
		}

		window.addEventListener(
			"beforeinstallprompt",
			handleBeforeInstallPrompt as EventListener,
		);

		// Limpiar el event listener cuando el componente se desmonte
		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt as EventListener,
			);
		};
	}, []);

	async function handleInstallClick() {
		const promptEvent = deferredPrompt.value;
		if (promptEvent) {
			promptEvent.prompt();
			const choiceResult = await promptEvent.userChoice;
			if (choiceResult.outcome === "accepted") {
				confetti({
					particleCount: 100,
					spread: 70,
					origin: { y: 0.6 },
				});
			}
			deferredPrompt.value = null; // Limpiar el evento
			showBanner.value = false; // Ocultar el banner
		}
	}

	useEffect(() => {
		function handleAppInstalled() {
			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			console.log("La PWA ha sido instalada.");
		}

		window.addEventListener(
			"appinstalled",
			handleAppInstalled as EventListener,
		);

		// Limpiar el event listener cuando el componente se desmonte
		return () => {
			window.removeEventListener(
				"appinstalled",
				handleAppInstalled as EventListener,
			);
		};
	}, []);

	return (
		<>
			{showBanner.value && storageEmpresa?.logo && (
				<div className="fixed bottom-40 left-2 bg-primary z-[99] p-2 rounded-md shadow w-[200px]">
					<p class="text-center font-bold text-white text-sm">
						¡Nuestra aplicación está disponible como una PWA!
					</p>
					<button
						class=" bg-[#09DD84] px-4 py-2 hover:scale-110 delay-custom-1 rounded-md text-xs block mx-auto text-white mt-2"
						type="button"
						aria-label="pwa"
						onClick={handleInstallClick}
					>
						<i class="fa-brands fa-android mr-2" />
						Instalar
					</button>
				</div>
			)}
		</>
	);
}

export default MessagePWA;
