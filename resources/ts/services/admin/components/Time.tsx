import { useSignal } from "@preact/signals";
import dayjs from "dayjs";
import { useEffect } from "preact/hooks";

function Time() {
	const time = useSignal("");
	const date = useSignal("");

	function updateTime() {
		const horaActual = dayjs().format("HH:mm:ss");
		const fechaActual = dayjs().format("DD MMMM YYYY");
		time.value = horaActual;
		date.value = fechaActual;
	}

	useEffect(() => {
		const interval = setInterval(() => {
			updateTime();
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div class="flex flex-col justify-center items-center">
			<p class="text-xs dark:text-white text-center">{date.value}</p>
			<span class="text-xs dark:text-white font-bold text-center">
				{time.value}
			</span>{" "}
		</div>
	);
}

export default Time;
