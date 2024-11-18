import { useSignal } from "@preact/signals";
import { useEffect, useState } from "preact/hooks";
//  HOOK media query reactivo y no reactivo
function useMediaQuery(query: string): boolean {
	const getMatches = (query: string): boolean => {
		// Prevents SSR issues
		if (typeof window !== "undefined") {
			return window.matchMedia(query).matches;
		}
		return false;
	};

	const [matches, setMatches] = useState<boolean>(getMatches(query));

	function handleChange() {
		setMatches(getMatches(query));
	}

	useEffect(() => {
		const matchMedia = window.matchMedia(query);

		// Triggered at the first client-side load and if query changes
		handleChange();

		// Listen matchMedia
		if (matchMedia.addListener) {
			matchMedia.addListener(handleChange);
		} else {
			matchMedia.addEventListener("change", handleChange);
		}

		return () => {
			if (matchMedia.removeListener) {
				matchMedia.removeListener(handleChange);
			} else {
				matchMedia.removeEventListener("change", handleChange);
			}
		};
	}, [query]);

	return matches;
}
export function useMedia(props: {
	mobile: string | number;
	minitablet: string | number;
	tablet: string | number;
	laptop: string | number;
	custom: string | number;
}) {
	const mobile = useMediaQuery("(min-width: 400px");
	const minitablet = useMediaQuery("(min-width: 550px");
	const tablet = useMediaQuery("(min-width: 750px");
	const laptop = useMediaQuery("(min-width: 1150px");
	return laptop
		? props.laptop
		: tablet
			? props.tablet
			: minitablet
				? props.minitablet
				: mobile
					? props.mobile
					: props.custom;
}
export function useMediaQueryNoReactive(query: string) {
	return window.matchMedia(query).matches;
}

export function ResponsiveWidth() {
	const windowWidth = useSignal(window.innerWidth);

	useEffect(() => {
		const handleResize = () => {
			windowWidth.value = window.innerWidth;
		};

		// Escuchar el evento de redimensionamiento de la ventana
		window.addEventListener("resize", handleResize);

		// Limpieza: eliminar el event listener cuando el componente se desmonte
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return windowWidth.value;
}

export default useMediaQuery;
