import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

function useCounter(value: number, seconds = 1) {
	const count = useSignal(0);

	useEffect(() => {
		const duration = seconds * 1000; // 3 segundos
		const totalSteps = value;
		const stepTime = duration / totalSteps; // Tiempo entre cada incremento

		const interval = setInterval(() => {
			if (count.value < value) {
				count.value += 1;
			} else {
				clearInterval(interval);
			}
		}, stepTime);

		return () => clearInterval(interval); // Limpia el intervalo cuando se desmonte el componente
	}, []);
	return count.value;
}

export default useCounter;
