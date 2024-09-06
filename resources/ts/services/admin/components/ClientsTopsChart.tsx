import { printFileUser } from "@/users/libs/helpers";
import type { UsersSchemaFromServer } from "@/users/schemas/users.schema";
import { Chart } from "chart.js/auto";
import { useRef, useEffect } from "preact/hooks";
import useThemeStore from "~/stores/theme.store";
import { prominent } from "color.js";
import ContainerBox from "./ContainerBox";
import AdminHr from "~/components/AdminHr";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import UsersShow from "@/users/views/UsersShow";
import AlertInfo from "~/components/Alerts/AlertInfo";

interface ClientsTopsChartProps {
	data: {
		cantidad: number;
		user: Pick<UsersSchemaFromServer, "id" | "photo" | "username" | "slug">;
	}[];
}
function ClientsTopsChart({ data }: ClientsTopsChartProps) {
	const chartRef = useRef<HTMLCanvasElement | null>(null);
	const theme = useThemeStore();
	async function init() {
		const ctx = chartRef.current?.getContext("2d")!;
		const MAX = 3;
		const usersnames = data.map((order) => order.user.username).slice(0, MAX);
		const photos = data
			.map((order) => printFileUser(order.user.photo, 100)[0])
			.slice(0, MAX);
		const colorsImages = await Promise.all(
			photos.map(async (photo) => {
				const color = await prominent(photo, { amount: 1 });
				return `rgb(${(color as number[]).join(",")})`;
			}),
		);
		const counts = data.map((order) => order.cantidad);

		const myChart = new Chart(ctx, {
			type: "bar",
			data: {
				labels: usersnames,
				datasets: [
					{
						label: "Ordenes Pagados",
						backgroundColor: colorsImages,
						data: counts,
						image: photos,
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
			plugins: [
				{
					id: "bgImage",
					beforeDatasetDraw(chart, _args, _plugin) {
						const { ctx, data } = chart;
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						(data.datasets as any)[0].image.forEach(
							(image: string, i: number) => {
								const xPos = chart.getDatasetMeta(0).data[i].x;
								const yPos = chart.getDatasetMeta(0).data[i].y;
								const chartImage = new Image();
								chartImage.src = image;

								ctx.drawImage(chartImage, xPos - 25, yPos - 45, 55, 40);
							},
						);
					},
				},
			],
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
		user: Pick<UsersSchemaFromServer, "id" | "photo" | "username" | "slug">;
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
				Consejo: Recomendable crear cupones de descuento solo para clientes
				registrados, para obligar a que tus clientes se registren a tu web.
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
							Foto
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
									key={order.user.id}
								>
									<th>{i + 1}</th>
									<td>
										<img
											width={40}
											height={40}
											src={printFileUser(order.user.photo, 100)[0]}
											class="rounded-full mx-auto"
											alt={order.user.username}
										/>
									</td>
									<th
										class="hover:text-primary hover:underline"
										onClick={() => {
											sweetModal({
												html: reactComponent(
													<UsersShow
														params={{
															slug: order.user.slug,
														}}
													/>,
												),
												showCloseButton: true,
												isCloseInBackground: false,
												sweetWidth: "700px",
											});
										}}
									>
										{order.user.username}
									</th>
									<th>{order.cantidad}</th>
								</tr>
							))}
						</>
					) : (
						<tr>
							<td colSpan={4} class="dark:text-white text-center text-xs py-3">
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
