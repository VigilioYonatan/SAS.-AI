import UsersNewBox from "@/users/components/UsersNewBox";
import Loading from "../components/Loading";
import BoxEntity from "../components/BoxEntity";
import AdminChart from "../components/AdminChart";
import { useTable } from "@vigilio/preact-table";
import ordersColumns from "@/orders/libs/OrdersColumns";
import type { OrdersSchemaFromServer } from "@/orders/schemas/orders.schema";
import Container from "../components/Container";
import AdminHr from "~/components/AdminHr";
import { adminDashboardApi } from "../apis/admin.dashboard.api";
import { reactComponent } from "~/libs/preact";
import { sweetModal } from "@vigilio/sweet";
import ResumeEarning from "../components/ResumeEarnings";
import OrdersShow from "@/orders/views/OrdersShow";
import { ordersPaginatorApi } from "@/common/paginator/orders.paginator.api";
import VigilioTable from "~/components/table";
import usePaginatorTimer from "~/hooks/usePaginatorTimer";
import { useEffect } from "preact/hooks";
import useAuthStore from "@/auth/stores/auth.store";
import ClientsTopsChart from "../components/ClientsTopsChart";
import { formatMoney } from "@/cart/libs/helpers";

function Dashboard() {
	const adminDashboardQuery = adminDashboardApi();

	let component: JSX.Element | JSX.Element[] | null = null;
	if (adminDashboardQuery.isLoading) {
		component = <Loading />;
	}
	if (adminDashboardQuery.error) {
		component = (
			<div class="dark:text-secondary-light text-secondary-dark">
				Error: comunicarse con desarrollador
			</div>
		);
	}
	if (adminDashboardQuery.isSuccess) {
		const { SelectTimer, time } = usePaginatorTimer();
		const authStore = useAuthStore();
		const websData = adminDashboardQuery.data!.results;
		const table = useTable({
			columns: ordersColumns,
			pagination: { limit: 20 },
		});
		const ordersPaginatorQuery = ordersPaginatorApi(table, time);

		function handleOpenOrder(order: OrdersSchemaFromServer) {
			sweetModal({
				html: reactComponent(
					<OrdersShow
						refetch={ordersPaginatorQuery.refetch}
						params={{ order_code: order.order_code }}
					/>,
				),
				showCloseButton: true,
				position: "start",
				sweetWidth: "800px",
				isCloseInBackground: false,
			});
		}

		function openTotalResume() {
			sweetModal({
				html: reactComponent(<ResumeEarning />),
				showCloseButton: true,
				isCloseInBackground: false,
			});
		}
		useEffect(() => {
			// cuando cambie el time en el select. hacer peticion
			ordersPaginatorQuery.refetch(false);
		}, [time]);

		component = (
			<div class="p-4 flex flex-col xl:flex-row  gap-4">
				<section class="w-full">
					<div class="grid sm:grid-cols-2 gap-4">
						<BoxEntity
							title="Usuarios"
							color="bg-blue-500"
							ico={<i class="fas fa-users" />}
							quantity={String(websData.counts.users)}
						/>
						<BoxEntity
							title="Categorias"
							color="bg-yellow-500"
							ico={<i class="fas fa-user-tag" />}
							quantity={String(websData.counts.categories)}
						/>
						<BoxEntity
							title="Productos"
							color="bg-danger"
							ico={<i class="fas fa-hamburger" />}
							quantity={String(websData.counts.products)}
						/>
						{authStore.guards.permissionAdminGuard() ? (
							<BoxEntity
								title="Ventas"
								color="bg-success"
								ico={<i class="fas fa-sack-dollar" />}
								quantity={String(
									formatMoney(websData.counts.gananciasMensual ?? 0),
								)}
								onClick={openTotalResume}
								custom={
									<span class="text-sm font-bold dark:text-white">
										Ver más información
									</span>
								}
							/>
						) : null}
					</div>
					<Container className="p-4 rounded-md my-4 overflow-auto">
						<span class="dark:text-secondary-light block text-center xl:text-start text-secondary-dark font-bold text-xl mt-2">
							Todos los Ordenes
						</span>
						<AdminHr spacing={0} />
						<VigilioTable query={ordersPaginatorQuery} table={table}>
							<VigilioTable.header className="flex  items-center justify-between">
								<SelectTimer />
								<div class="flex gap-2 items-center">
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
									<VigilioTable.tbody.row handleClick={handleOpenOrder}>
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
					</Container>
				</section>
				<section class="xl:w-[500px] flex flex-col gap-4">
					<AdminChart data={websData.ratingYearArray} />
					<ClientsTopsChart data={websData.usersMostOrders} />
					<UsersNewBox users={websData.usersLimit30} />
				</section>
			</div>
		);
	}

	return component;
}

export default Dashboard;
