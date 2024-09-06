import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

function useScroll() {
	const isScroll = useSignal(false);
	useEffect(() => {
		let scrollTimeout: ReturnType<typeof setTimeout> | null = null;

		const handleScroll = () => {
			isScroll.value = true;
			if (scrollTimeout) clearTimeout(scrollTimeout);
			// Llama a `handleScrollEnd` después de 200 ms
			scrollTimeout = setTimeout(() => {
				isScroll.value = false;
			}, 600);
		};

		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (scrollTimeout) clearTimeout(scrollTimeout);
		};
	}, []);
	return { isScroll: isScroll.value };
}

export default useScroll;
