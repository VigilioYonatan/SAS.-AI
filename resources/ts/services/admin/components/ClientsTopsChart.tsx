import { Chart } from "chart.js/auto";
import { useRef, useEffect } from "preact/hooks";
import useThemeStore from "~/stores/theme.store";
import ContainerBox from "./ContainerBox";
import AdminHr from "~/components/AdminHr";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { ClientsSchema } from "@/users/schemas/client.schema";

interface ClientsTopsChartProps {
    data: {
        cantidad: number;
        client: ClientsSchema;
    }[];
}
function ClientsTopsChart({ data }: ClientsTopsChartProps) {
    const chartRef = useRef<HTMLCanvasElement | null>(null);
    const theme = useThemeStore();
    async function init() {
        const ctx = chartRef.current?.getContext("2d")!;
        const MAX = 3;
        const usersnames = data
            .map((order) => order.client.fullname)
            .slice(0, MAX);

        const counts = data.map((order) => order.cantidad);

        const myChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: usersnames,
                datasets: [
                    {
                        label: "Ordenes Pagados",
                        backgroundColor: "var(--primary)",
                        data: counts,
                    },
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation> images error type
                ] as any,
            },
            options: {
                scales: {
                    y: {
                        grace: 5,
                        grid: { color: "transparent" },
                        ticks: {
                            color: theme.state === "dark" ? "#fff" : "#000",
                        },
                    },
                    x: {
                        grid: { color: "transparent" },
                        ticks: {
                            color: theme.state === "dark" ? "#fff" : "#000",
                        },
                    },
                },
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

    function onShowTops() {
        sweetModal({
            showCloseButton: true,
            html: reactComponent(<LeaderBoarding data={data} />),
            position: "start",
        });
    }
    return (
        <ContainerBox>
            <div class="flex items-center justify-between">
                <span class="dark:text-secondary-light text-secondary-dark font-bold text-xl mt-2">
                    Clientes top
                </span>
                <button
                    class="bg-primary text-white px-2 py-1 rounded-md"
                    type="button"
                    aria-label="clientes top leadering"
                    onClick={onShowTops}
                >
                    <i class="fas fa-tasks" />
                </button>
            </div>

            <AdminHr />
            <canvas ref={chartRef} />
        </ContainerBox>
    );
}

interface LeaderBoardingProps {
    data: {
        cantidad: number;
        client: ClientsSchema;
    }[];
}
function LeaderBoarding({ data }: LeaderBoardingProps) {
    return (
        <div class="flex flex-col">
            <span class="dark:text-secondary-light text-secondary-dark font-bold text-xl mt-2">
                Clientes top
            </span>
            <AdminHr />
            <AlertInfo>
                Consejo: Recomendable crear cupones de descuento solo para
                clientes TOP, para obligar a que tus clientes se registren a tu
                web.
            </AlertInfo>
            <table>
                <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary dark:text-secondary-light dark:text-terciary-dark uppercase  shadow-sm  border-b dark:border-admin-terciary">
                    <tr>
                        <th
                            scope="col"
                            class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer"
                        >
                            ID
                        </th>

                        <th
                            scope="col"
                            class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer"
                        >
                            Usuario
                        </th>
                        <th
                            scope="col"
                            class="px-1 py-2 lg:px-3 lg:py-3  dark:bg-admin-terciary text-center cursor-pointer"
                        >
                            Ordenes
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.length ? (
                        <>
                            {data.slice(0, 20).map((order, i) => (
                                <tr
                                    class="border-b h-[60px] dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light text-xs"
                                    key={order.client.id}
                                >
                                    <th>{i + 1}</th>

                                    <th class="hover:text-primary hover:underline">
                                        {order.client.fullname}
                                    </th>
                                    <th>{order.cantidad}</th>
                                </tr>
                            ))}
                        </>
                    ) : (
                        <tr>
                            <td
                                colSpan={4}
                                class="dark:text-white text-center text-xs py-3"
                            >
                                Todavia no hay clientes que hicieron ordenes
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
export default ClientsTopsChart;
