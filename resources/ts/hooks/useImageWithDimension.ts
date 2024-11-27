import { useSignal } from "@preact/signals";
import { MutableRef, useEffect, useRef } from "preact/hooks";

function useImageWithDimension(
	dimension: number[],
): [number, MutableRef<HTMLDivElement | null>] {
	const divRef = useRef<HTMLDivElement | null>(null);
	const width = useSignal(0);

	const selectedSize = dimension.reduce((prev, curr) => {
		return Math.abs(curr - width.value) < Math.abs(prev - width.value)
			? curr
			: prev;
	});
	useEffect(() => {
		if (divRef.current) {
			width.value = divRef.current.offsetWidth;
		}
		const handleResize = () => {
			if (divRef.current) {
				width.value = divRef.current.offsetWidth;
			}
		};
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return [selectedSize, divRef];
}

export default useImageWithDimension;
