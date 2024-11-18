import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useSignal } from "@preact/signals";
import confetti from "canvas-confetti";
import { useEffect } from "preact/hooks";
import { delay } from "~/libs/helpers";
interface BeforeInstallPromptEvent extends Event {
	readonly platform: string;
	readonly userChoice: Promise<{
		outcome: "accepted" | "dismissed";
		platform: string;
	}>;
	prompt(): void;
}
function MessagePWA() {
	if (!storageEmpresa?.setting.shows.android) return null;
	// Signals para manejar el estado de la PWA
	const deferredPrompt = useSignal<BeforeInstallPromptEvent | null>(null);
	const showBanner = useSignal(false);

	useEffect(() => {
		async function handleBeforeInstallPrompt(e: Event) {
			const event = e as BeforeInstallPromptEvent;
			event.preventDefault();
			await delay(10);
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
				<div className="fixed bottom-40 left-2 bg-primary z-[99] p-2 rounded-md shadow w-[220px]">
					<button
						type="button"
						class="bg-white text-black w-[20px] font-bold h-[20px] rounded-full text-xs absolute -right-2 -top-2 border-2 border-white"
						onClick={() => {
							showBanner.value = false;
						}}
					>
						x
					</button>
					<p class="text-center font-bold  text-sm">
						¡Nuestra web está disponible para instalar con un solo click como
						una aplicación Android - PC!
					</p>
					<button
						class=" bg-[#09DD84] px-4 py-2 hover:scale-110 delay-custom-1 rounded-md text-xs block mx-auto text-white mt-2 border-2 border-white"
						type="button"
						aria-label="pwa"
						onClick={handleInstallClick}
					>
						<i class="fa-brands fa-android mr-2" />
						Instalar
					</button>
					<img
						class="absolute right-2 -bottom-1 object-contain"
						src="/images/settings/others/android.png"
						width={50}
						height={50}
						alt="android"
					/>
				</div>
			)}
		</>
	);
}

export default MessagePWA;
