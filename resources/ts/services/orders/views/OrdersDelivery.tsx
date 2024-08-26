import { sweetModal } from "@vigilio/sweet";
import { useTable } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import type { OrdersSchemaFromServer } from "../schemas/orders.schema";
import VigilioTable from "~/components/table";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import OrdersShow from "./OrdersShow";
import ordersColumns from "../libs/OrdersColumns";
import { ordersDeliveryPaginatorApi } from "@/common/paginator/orders.paginator.api";
import { adminDeliverysApi } from "../apis/admin.deliverys.api";
import { useEffect } from "preact/hooks";
import dayjs from "dayjs";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";

function OrdersDelivery() {
	const { time, SelectTimer } = usePaginatorTimer();
	const tableDelivery = useTable({
		columns: ordersColumns,
		pagination: { limit: 20 },
	});

	const ordersDerliveryPaginatorQuery = ordersDeliveryPaginatorApi(
		tableDelivery,
		time,
	);
	const adminDelivery = adminDeliverysApi();
	function handleOpenOrderDelivery(order: OrdersSchemaFromServer) {
		return sweetModal((onclose) => ({
			html: reactComponent(
				<OrdersShow
					refetch={() => {
						ordersDerliveryPaginatorQuery.refetch(false);
						onclose();
					}}
					params={{ order_code: order.order_code }}
				/>,
			),
			showCloseButton: true,
			position: "start",
			sweetWidth: "800px",
			isCloseInBackground: false,
		}));
	}

	useEffect(() => {
		// cuando cambie el time en el select. hacer peticion
		ordersDerliveryPaginatorQuery.refetch(false);
	}, [time]);
	return (
		<Container className="p-2">
			<div className="mx-1  flex flex-col gap-4">
				<AdminBreadCrumb current="Deliverys" />
			</div>
			<button
				type="button"
				aria-label="to open pedidos"
				class="flex justify-center gap-2 items-center p-1 rounded-md dark:bg-admin-terciary dark:text-white bg-paper-light w-[180px] font-bold text-sm active:scale-110"
				onClick={() =>
					sweetModal({
						showCloseButton: true,
						html: reactComponent(
							<div>
								<h4 class="text-xl font-bold text-center dark:text-white mb-2">
									Deliverys
								</h4>
								<div class="grid grid-cols-2 max-w-[500px] gap-2">
									<div class="flex flex-col justify-center gap-2 items-center p-2 rounded-md shadow bg-white">
										<span class="text-center font-bold flex justify-center items-center gap-1">
											<i class="fas fa-calendar-day text-3xl" />{" "}
											{dayjs().format("DD MMMM YYYY")}
										</span>
									</div>
									<div class="flex flex-col gap-2 items-center  text-white bg-blue-500 p-2 shadow rounded-md">
										<span class="text-center font-semibold">
											Ordenes de Hoy
										</span>
										<p class="text-2xl font-bold">
											{adminDelivery.data?.count.deliverys}
										</p>
									</div>
									<div class="flex flex-col gap-2 items-center bg-success p-2 rounded-md shadow text-white">
										<span class="text-center font-semibold">
											Ordenes Pagados y entregados
										</span>
										<p class="text-2xl font-bold">
											{adminDelivery.data?.count.pagados}
										</p>
									</div>
									<div class="flex flex-col gap-2 items-center bg-danger p-2 rounded-md text-white">
										<span class="text-center font-semibold">
											Ordenes Con problemas
										</span>
										<p class="text-2xl font-bold">
											{adminDelivery.data?.count.problema}
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
				<VigilioTable
					query={ordersDerliveryPaginatorQuery}
					table={tableDelivery}
				>
					<VigilioTable.header>
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
							<VigilioTable.tbody.row handleClick={handleOpenOrderDelivery}>
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

export default OrdersDelivery;
