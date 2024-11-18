import { useSignal } from "@preact/signals";
import { ChangeEvent } from "preact/compat";
import { useEffect, useRef } from "preact/hooks";
import { delay } from "~/libs/helpers";

function useVideo() {
	const isPlay = useSignal(false);
	const isHover = useSignal(true);
	const video = useRef<HTMLVideoElement | null>(null);
	const progress = useSignal(0);
	const duration = useSignal(0);
	const currentTime = useSignal(0);

	async function onPlay() {
		video.current?.play();
		isPlay.value = true;
		isHover.value = true;
		await delay(3);
		isHover.value = false;
	}
	async function onPause() {
		video.current?.pause();
		isPlay.value = false;
		await delay(1);
		isHover.value = false;
	}
	function onPlayPause() {
		if (!isPlay.value) {
			onPlay();
			return;
		}
		onPause();
	}

	function onHover() {
		isHover.value = true;
	}
	function onUnHover() {
		isHover.value = false;
	}

	function handleProgressChange(e: ChangeEvent<HTMLInputElement>) {
		if (video.current?.duration) {
			const newTime =
				(Number((e.target as HTMLInputElement).value) / 100) *
				video.current.duration;
			video.current.currentTime = newTime;
			progress.value = Number((e.target as HTMLInputElement).value);
		}
	}

	// Actualizar el progreso cuando el video avanza
	function handleTimeUpdate() {
		if (video.current?.currentTime) {
			currentTime.value = video.current?.currentTime;
		}
	}

	// Establecer la duración del video cuando esté disponible
	const handleLoadedMetadata = () => {
		if (video.current) {
			duration.value = video.current.duration;
		}
	};

	useEffect(() => {
		if (video.current) {
			video.current.addEventListener("loadedmetadata", handleLoadedMetadata);
			video.current.addEventListener("timeupdate", handleTimeUpdate);

			// Limpieza de eventos al desmontar el componente
			return () => {
				video.current?.removeEventListener(
					"loadedmetadata",
					handleLoadedMetadata,
				);
				video.current?.removeEventListener("timeupdate", handleTimeUpdate);
			};
		}
	}, []);
	function formatTime(time: number): string {
		const hours = Math.floor(time / 3600);
		const minutes = Math.floor((time % 3600) / 60);
		const seconds = Math.floor(time % 60);

		if (hours > 0) {
			return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
				2,
				"0",
			)}:${String(seconds).padStart(2, "0")}`;
		}
		return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
			2,
			"0",
		)}`;
	}
	return {
		refs: {
			video,
		},
		state: { isPlay: isPlay.value, isHover: isHover.value },
		methods: {
			onPlayPause,
			onPause,
			onPlay,
			onHover,
			onUnHover,
			reproductor: {
				handleProgressChange,
				handleTimeUpdate,
				progress: progress.value,
				duration: duration.value,
				currentTime: currentTime.value,
				formatTime,
			},
		},
	};
}

export default useVideo;
