import ContainerBox from "@/admin/components/ContainerBox";
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
    async function init() {
        const ctx = chartRef.current?.getContext("2d")!;

        const myChart = new Chart(ctx, {
            type: "doughnut",
            data: {
                datasets: [
                    {
                        label: "Distribución de Gastos",
                        data: [22, 31, 14, 33], // Porcentajes correspondientes
                        backgroundColor: [
                            "rgba(75, 192, 192, 0.6)", // Color para "Gastos"
                            "rgba(54, 162, 235, 0.6)", // Color para "Servicios"
                            "rgba(153, 102, 255, 0.6)", // Color para "Ahorro"
                            "rgba(255, 99, 132, 0.6)", // Color para "Deudas"
                        ],
                        borderColor: [
                            "rgba(75, 192, 192, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(153, 102, 255, 1)",
                            "rgba(255, 99, 132, 1)",
                        ],
                        borderWidth: 1,
                    },
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation> images error type
                ] as any,
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
                    Clientes top
                </span>
            </div>
            <AdminHr />
            <div class="h-[300px] w-full flex justify-center items-center">
                <canvas ref={chartRef} height={200} width={200} />
            </div>
        </ContainerBox>
    );
}
export default ChartPercentajeFinanzas;
