import ContainerBox from "@/admin/components/ContainerBox";
import { formatMoney } from "@/cart/libs/helpers";
import { Chart } from "chart.js/auto";
import { useEffect, useRef } from "preact/hooks";
import AdminHr from "~/components/AdminHr";
import useThemeStore from "~/stores/theme.store";

interface ChartPercentajeFinanzasProps {
    percentajes: {
        value: string;
        numeric: number;
    }[];
}
function ChartPercentajeFinanzas({
    percentajes,
}: ChartPercentajeFinanzasProps) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const theme = useThemeStore();
    const labels = percentajes.map((p) => p.value);
    async function init() {
        const ctx = chartRef.current?.getContext("2d")!;
        const myChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                labels,
                datasets: [
                    {
                        data: percentajes.map((c) => c.numeric), // Porcentajes correspondientes
                        backgroundColor: [
                            "rgba(75, 192, 192, 0.6)",
                            "rgba(54, 162, 235, 0.6)",
                        ],
                        borderColor: [
                            "rgba(75, 192, 192, 1)",
                            "rgba(54, 162, 235, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true, // Hace que el gráfico sea responsive
                plugins: {
                    legend: { display: false },
                    // title: { color: "white" },
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
            <div class="flex items-center justify-between">
                <span class="dark:text-secondary-light text-secondary-dark font-bold text-sm mt-2 ">
                    Grafico de Ingresos
                </span>
            </div>
            <AdminHr />
            <div class="h-[300px] w-full flex justify-center items-center">
                <canvas ref={chartRef} height={200} width={200} />
            </div>
            <div class="flex justify-center gap-2 mt-4">
                {percentajes.map((p) => (
                    <div
                        class="flex flex-col gap-1 justify-center items-center dark:text-white font-semibold"
                        key={p.value}
                    >
                        <span class="text-center block">{p.value}</span>
                        <span>{formatMoney(p.numeric)}</span>
                    </div>
                ))}
            </div>
        </ContainerBox>
    );
}
export default ChartPercentajeFinanzas;
