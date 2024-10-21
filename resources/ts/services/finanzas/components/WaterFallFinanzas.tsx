import ContainerBox from "@/admin/components/ContainerBox";
import { Chart } from "chart.js/auto";
import { useEffect, useRef } from "preact/hooks";
import AdminHr from "~/components/AdminHr";
import useThemeStore from "~/stores/theme.store";
import { Ingreso } from "../apis/finanzas.all.api";

interface WaterFallFinanzasProps {
	percentajes: Ingreso[];
}
function WaterFallFinanzas({ percentajes }: WaterFallFinanzasProps) {
	const chartRef = useRef<HTMLCanvasElement | null>(null);
	const theme = useThemeStore();
	async function init() {
		const ctx = chartRef.current?.getContext("2d")!;
		const labels = percentajes.map((p) => p.name);

		const myChart = new Chart(ctx, {
			type: "bar",
			data: {
				labels,
				datasets: [
					{
						// label: "Monto",
						data: percentajes.map((p) => p.monto),
						backgroundColor: [
							"rgba(255, 99, 132, 0.5)",
							"rgba(54, 162, 235, 0.5)",
							"rgba(255, 206, 86, 0.5)",
							"rgba(75, 192, 192, 0.5)",
							"rgba(153, 102, 255, 0.5)",
							"rgba(255, 159, 64, 0.5)",
							"rgba(199, 199, 199, 0.5)",
						],
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: false, // Oculta la leyenda por completo
					},
					title: {
						display: false,
						text: "",
					},
				},
				scales: {
					x: {
						stacked: true,
						ticks: {
							color: theme.state === "dark" ? "#FFF" : "#000",
						},
						grid: {
							color: theme.state === "dark" ? "#D3D3D3" : "#A9A9A9",
						},
					},
					y: {
						stacked: true,
						beginAtZero: true,
						ticks: {
							color: theme.state === "dark" ? "#FFF" : "#000",
						},
						grid: {
							color: theme.state === "dark" ? "#D3D3D3" : "#A9A9A9",
						},
					},
				},
			},
		});
		// Limpia el gráfico cuando el componente se desmonta
		return () => myChart.destroy();
	}
	useEffect(() => {
		init();
	}, [theme.state]);

	return (
		<ContainerBox>
			<div class="flex items-center justify-between h-full">
				<span class="dark:text-secondary-light text-secondary-dark font-bold text-sm mt-2 ">
					Gráfico de Egresos
				</span>
			</div>
			<AdminHr />
			<div class="h-[300px] w-full flex justify-center items-center">
				<canvas ref={chartRef} height={200} width={300} class="w-full" />
			</div>
		</ContainerBox>
	);
}
export default WaterFallFinanzas;
