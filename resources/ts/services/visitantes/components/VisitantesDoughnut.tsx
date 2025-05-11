import { Chart, DoughnutController } from "chart.js/auto";
import { useEffect, useRef } from "react";
import { visitantesDoughnutApi } from "../apis/visitantes.api";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";
Chart.register(DoughnutController);

export default function VisitantesDoughnut() {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const chartBrowserRef = useRef<HTMLCanvasElement>(null);
    const chartBrowserInstance = useRef<Chart | null>(null);
    const { SelectTimer, time } = usePaginatorTimer();
    const visitantesDoughnutQuery = visitantesDoughnutApi(time);

    useEffect(() => {
        const resultadosOSMapped =
            visitantesDoughnutQuery.data?.resultadosOSMapped;

        if (
            chartRef.current &&
            resultadosOSMapped &&
            resultadosOSMapped.length > 0
        ) {
            const ctx = chartRef.current.getContext("2d");

            if (ctx) {
                // Destruir la instancia anterior si existe
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                chartInstance.current = new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: resultadosOSMapped?.map((item) => item.os),
                        datasets: [
                            {
                                data: resultadosOSMapped?.map(
                                    (item) => item.count
                                ),
                                backgroundColor: [
                                    "#0078D7",
                                    "#36A2EB",
                                    "#FFCE56",
                                    "#4BC0C0",
                                    "#9966FF",
                                    "#000000",
                                ],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top",
                            },
                            title: {
                                display: true,
                                text: "Distribución de Navegadores",
                                font: {
                                    size: 16,
                                },
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const label = context.label || "";
                                        const value = context.raw || 0;
                                        const total =
                                            context.dataset.data.reduce(
                                                (a, b) => a + b,
                                                0
                                            );
                                        const percentage = Math.round(
                                            (Number(value) / total) * 100
                                        );
                                        return `${label}: ${value} (${percentage}%)`;
                                    },
                                },
                            },
                        },
                        cutout: "70%",
                    },
                });
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [visitantesDoughnutQuery.data]);
    useEffect(() => {
        visitantesDoughnutQuery.refetch();
    }, [time]);
    //
    useEffect(() => {
        const resultadosBrowserMapped =
            visitantesDoughnutQuery.data?.resultadosBrowserMapped;

        if (
            chartBrowserRef.current &&
            resultadosBrowserMapped &&
            resultadosBrowserMapped.length > 0
        ) {
            const ctx = chartBrowserRef.current.getContext("2d");

            if (ctx) {
                // Destruir la instancia anterior si existe
                if (chartBrowserInstance.current) {
                    chartBrowserInstance.current.destroy();
                }

                chartBrowserInstance.current = new Chart(ctx, {
                    type: "doughnut",
                    data: {
                        labels: resultadosBrowserMapped?.map(
                            (item) => item.browser
                        ),
                        datasets: [
                            {
                                data: resultadosBrowserMapped?.map(
                                    (item) => item.count
                                ),
                                backgroundColor: [
                                    "#FBBC05",
                                    "#0078D7",
                                    "#00A1F1",
                                    "#EA4335",
                                ],
                                borderWidth: 1,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: "top",
                            },
                            title: {
                                display: true,
                                text: "Distribución de Sistemas Operativos",
                                font: {
                                    size: 16,
                                },
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        const label = context.label || "";
                                        const value = context.raw || 0;
                                        const total =
                                            context.dataset.data.reduce(
                                                (a, b) => a + b,
                                                0
                                            );
                                        const percentage = Math.round(
                                            (Number(value) / total) * 100
                                        );
                                        return `${label}: ${value} (${percentage}%)`;
                                    },
                                },
                            },
                        },
                        cutout: "70%",
                    },
                });
            }
        }

        return () => {
            if (chartBrowserInstance.current) {
                chartBrowserInstance.current.destroy();
            }
        };
    }, [visitantesDoughnutQuery.data]);
    useEffect(() => {
        visitantesDoughnutQuery.refetch();
    }, [time]);
    return (
        <div className="flex flex-col gap-4">
            <div className="p-6 shadow-xl w-full">
                <div className="flex gap-2 justify-between items-center">
                    <div />
                    <SelectTimer />
                </div>
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "300px",
                    }}
                >
                    <canvas ref={chartRef} />
                </div>
            </div>
            {/*  */}{" "}
            <div className="p-6 shadow-xl w-full">
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        height: "300px",
                    }}
                >
                    <canvas ref={chartBrowserRef} />
                </div>
            </div>
        </div>
    );
}
