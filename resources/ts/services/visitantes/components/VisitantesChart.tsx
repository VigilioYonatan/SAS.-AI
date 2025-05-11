import { useEffect, useRef } from "react";
import { visitantesChartApi } from "../apis/visitantes.api";
import { Chart } from "chart.js";
import { secondsToHMS } from "~/libs/helpers";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";

function VisitantesChart() {
    const chartRef = useRef<HTMLCanvasElement>(null);
    const chartInstance = useRef<Chart | null>(null);
    const { time, SelectTimer } = usePaginatorTimer();
    const visitantesChartQuery = visitantesChartApi(time);
    useEffect(() => {
        const pageData = visitantesChartQuery.data?.data;

        if (chartRef.current && pageData && pageData.length > 0) {
            const ctx = chartRef.current.getContext("2d");

            if (ctx) {
                // Destruir la instancia anterior si existe
                if (chartInstance.current) {
                    chartInstance.current.destroy();
                }

                chartInstance.current = new Chart(ctx, {
                    type: "bar",
                    data: {
                        labels: pageData.map((item) => item.page),
                        datasets: [
                            {
                                label: "Tiempo Total (segundos)",
                                data: pageData.map((item) => {
                                    return item.time;
                                }),
                                backgroundColor: "rgba(54, 162, 235, 0.7)",
                                borderColor: "rgba(54, 162, 235, 1)",
                                borderWidth: 1,
                                yAxisID: "y",
                            },
                            {
                                label: "Número de Visitas",
                                data: pageData.map((item) => {
                                    return item.visits;
                                }),
                                backgroundColor: "rgba(255, 99, 132, 0.7)",
                                borderColor: "rgba(255, 99, 132, 1)",
                                borderWidth: 1,
                                yAxisID: "y1",
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: "Páginas más vistas por tiempo y visitas",
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        let label = context.dataset.label || "";
                                        if (label) label += ": ";
                                        function isCero(time: number) {
                                            return time < 11
                                                ? `0${time}`
                                                : time;
                                        }

                                        if (context.datasetIndex === 0) {
                                            const { hours, minutes, seconds } =
                                                secondsToHMS(
                                                    context.raw as number
                                                );
                                            label += `Tiempo: ${isCero(
                                                hours
                                            )}:${isCero(minutes)}:${isCero(
                                                seconds
                                            )}`;
                                        } else {
                                            label += `${context.raw} visitas`;
                                        }
                                        return label;
                                    },
                                },
                            },
                        },
                        scales: {
                            y: {
                                type: "linear",
                                display: true,
                                position: "left",
                                title: {
                                    display: true,
                                    text: "Tiempo (segundos)",
                                },
                            },
                            y1: {
                                type: "linear",
                                display: true,
                                position: "right",
                                title: {
                                    display: true,
                                    text: "Número de visitas",
                                },
                                grid: {
                                    drawOnChartArea: false,
                                },
                            },
                        },
                    },
                });
            }
        }

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [visitantesChartQuery.data?.data]);

    useEffect(() => {
        visitantesChartQuery.refetch(false);
    }, [time]);
    return (
        <div className="p-6 shadow-xl w-full">
            <div className="flex gap-2 items-center justify-between">
                <h3 className="font-bold text-2xl">Páginas más visitadas</h3>
                <SelectTimer />
            </div>
            <div
                style={{
                    position: "relative",
                    width: "100%",
                    height: "400px",
                }}
            >
                <canvas ref={chartRef} />
            </div>
        </div>
    );
}

export default VisitantesChart;
