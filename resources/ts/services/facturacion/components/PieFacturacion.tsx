import { useEffect, useRef } from "preact/hooks";
import { Chart } from "chart.js/auto";
import type { AdminFacturationSystemAPI } from "../apis/systemFacturation.api";

interface PieFacturacionProps {
	count: AdminFacturationSystemAPI["count"];
}
function PieFacturacion({ count }: PieFacturacionProps) {
	const chartRef = useRef<HTMLCanvasElement | null>(null); // Ref para acceder al elemento del gráfico

	useEffect(() => {
		// Crea el gráfico cuando el componente se monta
		const myChart = new Chart(chartRef.current!, {
			type: "doughnut",
			data: {
				// labels: ["Facturas", "Boletas", "Notas de Credito"],
				datasets: [
					{
						label: "Cantidades",
						data: [count.facturas, count.boletas, count.notaCredito],
						backgroundColor: ["#22C55E", "#3B82F6", "#F97316"],
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
			<canvas ref={chartRef} />
			<div class="flex gap-2 justify-center items-center mt-4">
				<div class="flex flex-col justify-center items-center p-1 gap-1 text-[#22C55E] font-bold ">
					<i class="fa-sharp fa-solid fa-ballot-check text-2xl" />
					<span class="text-sm">Facturas</span>
				</div>
				<div class="flex flex-col justify-center items-center gap-1 text-[#3B82F6] font-bold ">
					<i class="fal fa-receipt text-2xl" />
					<span>Boletas</span>
				</div>
				<div class="flex flex-col justify-center items-center gap-1 text-orange-600 font-bold">
					<i class="fas fa-file-invoice text-2xl" />
					<span>N. Credito</span>
				</div>
				<div class="flex flex-col justify-center items-center gap-1 dark:text-white font-bold">
					<i class="fas fa-file-invoice text-2xl" />
					<span>N. Debito</span>
				</div>
			</div>
		</div>
	);
}

export default PieFacturacion;
