import { createChart, ColorType } from "lightweight-charts";
import { useEffect, useRef } from "preact/hooks";
import useThemeStore from "~/stores/theme.store";
import ContainerBox from "./ContainerBox";
import AdminHr from "~/components/AdminHr";
interface AdminChartProps {
	data: {
		time: string;
		value: number;
	}[];
	refetch?: (clean?: boolean) => void;
}
const AdminChart = ({ data, refetch }: AdminChartProps) => {
	const { state } = useThemeStore();
	const chartContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const handleResize = () => {
			chart.applyOptions({
				width: chartContainerRef.current!.clientWidth,
			});
		};

		const chart = createChart(chartContainerRef.current!, {
			layout: {
				background: {
					type: ColorType.Solid,
					color: state === "dark" ? "#1F2937" : "#fff",
				},
				textColor: state === "dark" ? "#fff" : "#000",
			},
			width: chartContainerRef.current!.clientWidth,
			height: 300,
		});
		chart.timeScale().fitContent();

		const newSeries = chart.addAreaSeries({
			lineColor: "#2962FF",
			topColor: "#2962FF",
			bottomColor: "rgba(41, 98, 255, 0.28)",
		});
		newSeries.setData(data);
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
			chart.remove();
		};
	}, [data, state]);

	return (
		<ContainerBox>
			<div class="flex justify-between items-center">
				<span class="dark:text-secondary-light text-secondary-dark font-bold text-xl mt-2">
					Gráfico
				</span>
				{refetch ? (
					<button
						type="button"
						class="bg-primary text-white px-2 py-1 mb-2  rounded-md"
						onClick={() => refetch(false)}
					>
						<i class="fas fa-sync-alt " />
					</button>
				) : null}
			</div>

			<AdminHr />
			<div class="overflow-auto w-full" ref={chartContainerRef} />
		</ContainerBox>
	);
};

export default AdminChart;
