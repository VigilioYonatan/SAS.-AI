import { sweetModal } from "@vigilio/sweet";
import { useTable } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";
import { ordersLocalsPaginatorApi } from "@/common/paginator/orders.paginator.api";
import { adminOrdersApi } from "../apis/admin.orders.api";
import dayjs from "dayjs";
import VigilioTable from "~/components/table";
import Container from "@/admin/components/Container";
import OrdersShow from "./OrdersShow";
import ordersColumns from "../libs/OrdersColumns";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";
import { useEffect } from "preact/hooks";

function OrdersIndex() {
	const { time, SelectTimer } = usePaginatorTimer();
	const tableLocal = useTable({
		columns: ordersColumns,
		pagination: { limit: 20 },
	});

	const ordersLocalsPaginatorQuery = ordersLocalsPaginatorApi(tableLocal, time);
	const adminOrder = adminOrdersApi();

	function handleOpenOrderLocals(order: OrdersSchemaFromServer) {
		return sweetModal({
			html: reactComponent(
				<OrdersShow
					refetch={() => {
						ordersLocalsPaginatorQuery.refetch(false);
					}}
					params={{ order_code: order.order_code }}
				/>,
			),
			showCloseButton: true,
			position: "start",
			sweetWidth: "800px",
			isCloseInBackground: false,
		});
	}
	useEffect(() => {
		// cuando cambie el time en el select. hacer peticion
		ordersLocalsPaginatorQuery.refetch(false);
	}, [time]);

	return (
		<Container className="p-2 ">
			<button
				type="button"
				aria-label="to open pedidos"
				class="flex justify-center gap-2 items-center p-1 rounded-md shadow dark:bg-admin-terciary dark:text-white  text-sm bg-paper-light w-[180px] font-bold active:scale-110"
				onClick={() =>
					sweetModal({
						showCloseButton: true,
						html: reactComponent(
							<div>
								<h4 class="text-xl font-bold text-center dark:text-white mb-2">
									Ordenes en tu local
								</h4>
								<div class="grid grid-cols-2 gap-2 max-w-[500px]">
									<div class="flex flex-col justify-center gap-2 items-center p-2 rounded-md shadow bg-white">
										<span class="text-center font-bold flex justify-center items-center gap-4">
											<i class="fas fa-calendar-day text-xl" />{" "}
											{dayjs().format("DD MMMM YYYY")}
										</span>
									</div>
									<div class="flex flex-col gap-2 items-center  text-white bg-blue-500 p-2 shadow rounded-md">
										<span class="text-center font-semibold">
											Ordenes de Hoy
										</span>
										<p class="text-2xl font-bold">
											{adminOrder.data?.count.orders}
										</p>
									</div>
									<div class="flex flex-col gap-2 items-center bg-success p-2 rounded-md shadow text-white">
										<span class="text-center font-semibold">
											Ordenes Pagados y entregados
										</span>
										<p class="text-2xl font-bold">
											{adminOrder.data?.count.pagados}
										</p>
									</div>
									<div class="flex flex-col gap-2 items-center bg-danger p-2 rounded-md text-white">
										<span class="text-center font-semibold">
											Ordenes Con problemas
										</span>
										<p class="text-2xl font-bold">
											{adminOrder.data?.count.problema}
										</p>
									</div>
								</div>
							</div>,
						),
					})
				}
			>
				<i class="fas fa-calendar-day text-xl" />{" "}
				{dayjs().format("DD MMMM YYYY")}
			</button>
			<div class="overflow-auto">
				<VigilioTable query={ordersLocalsPaginatorQuery} table={tableLocal}>
					<VigilioTable.header className="flex justify-center md:justify-between items-center mb-3  flex-wrap gap-2">
						<SelectTimer />
						<div className="flex items-center gap-1">
							<VigilioTable.header.limit />
							<VigilioTable.header.refetch />
						</div>
					</VigilioTable.header>
					<VigilioTable.table>
						<VigilioTable.thead>
							<VigilioTable.thead.row>
								<VigilioTable.thead.th />
							</VigilioTable.thead.row>
						</VigilioTable.thead>
						<VigilioTable.tbody>
							<VigilioTable.tbody.row handleClick={handleOpenOrderLocals}>
								{(data) => <VigilioTable.tbody.td data={data} />}
							</VigilioTable.tbody.row>
						</VigilioTable.tbody>
					</VigilioTable.table>
					<VigilioTable.footer>
						<div className="flex justify-center flex-col items-center gap-2">
							<VigilioTable.footer.paginator />
							<VigilioTable.footer.show />
						</div>
					</VigilioTable.footer>
				</VigilioTable>
			</div>
		</Container>
	);
}

export default OrdersIndex;
