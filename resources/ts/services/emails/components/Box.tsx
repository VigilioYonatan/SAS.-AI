import { useEffect, useRef } from "preact/hooks";
import { Chart } from "chart.js/auto";

interface BoxProps {
	usedStorage: number;
	allowedStorage: number;
}
function Box({ usedStorage, allowedStorage }: BoxProps) {
	const chartRef = useRef<HTMLCanvasElement | null>(null);
	useEffect(() => {
		const myChart = new Chart(chartRef.current!, {
			type: "doughnut",
			data: {
				datasets: [
					{
						label: "Cantidad de uso",
						data: [usedStorage / 1024, allowedStorage / 1024],
						backgroundColor: ["#22C55E", "#3B82F6"],
						hoverOffset: 4,
					},
				],
			},
			options: { responsive: true },
		});

		// Limpia el gráfico cuando el componente se desmonta
		return () => myChart.destroy();
	}, []);
	return (
		<div>
			<div class="h-[300px] flex justify-center items-center">
				<canvas ref={chartRef} />
			</div>
			<div class="flex gap-2 my-4 justify-center">
				<div
					class="w-[200px] h-[20px] text-xs font-bold flex justify-center items-center"
					style={{ backgroundColor: "#22C55E" }}
				>
					{(usedStorage / 1024).toFixed(2)} MB usado
				</div>
				<div
					class="w-[200px] h-[20px] text-xs font-bold flex justify-center items-center"
					style={{ backgroundColor: "#3B82F6" }}
				>
					{(allowedStorage / 1024).toFixed(2)} MB
				</div>
			</div>
		</div>
	);
}

export default Box;
