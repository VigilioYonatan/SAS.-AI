import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import useAuthStore from "@/auth/stores/auth.store";
import OrdersIndex from "./OrdersIndex";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import OrdersShow from "./OrdersShow";
import Loading from "@/admin/components/Loading";
import { useSignal } from "@preact/signals";
import useSocketStore from "~/stores/socket.store";
import { useEffect } from "preact/hooks";
import { STATUSORDER } from "../libs";
import { FloorsSchema } from "../schemas/floors.schema";
import FloorsStore from "./FloorsStore";
import { MesasOrdersSchemaFromServer } from "../schemas/mesas.schema";
import MesasStore from "./MesasStore";
import { ProductsLocal } from "@/admin/views/MesasLocal";

function MesasIndex() {
	const floorsMesas = useSignal<
		(FloorsSchema & { mesas: MesasOrdersSchemaFromServer[] })[] | null
	>(null);
	const isLoading = useSignal(true);
	const { guards } = useAuthStore();
	const { io, connectSocket } = useSocketStore();

	useEffect(() => {
		connectSocket();
	}, []);

	useEffect(() => {
		io?.on(
			"floors_mesas:index",
			(data: {
				success: true;
				floors: (FloorsSchema & {
					mesas: MesasOrdersSchemaFromServer[];
				})[];
			}) => {
				isLoading.value = false;
				floorsMesas.value = data.floors;
			},
		);
		return () => io?.off("floors_mesas:index");
	}, [io]);

	function onMesasStore() {
		sweetModal((onClose) => ({
			customIcon:
				"<i class='far fa-tablet-rugged text-5xl dark:text-white text-secondary-dark mb-2' />",
			title: "¿Estás seguro de agregar una mesa?",
			html: reactComponent(<MesasStore onClose={onClose} />),
			showCloseButton: true,
			showCancelButton: true,
		}));
	}
	function onFloorStore() {
		sweetModal((onClose) => ({
			customIcon:
				"<i class='fa-regular fa-building text-5xl dark:text-white text-secondary-dark mb-2' />",
			title: "¿Estás seguro de agregar un piso?",
			html: reactComponent(<FloorsStore onClose={onClose} />),
			showCloseButton: true,
			showCancelButton: true,
		}));
	}
	function onOrderIndex() {
		sweetModal((_onClose) => ({
			html: reactComponent(<OrdersIndex />),
			showCloseButton: true,
			showCancelButton: true,
			sweetWidth: "1000px",
			position: "start",
		}));
	}
	function onOrderShow(order_code: string) {
		sweetModal({
			html: reactComponent(<OrdersShow params={{ order_code }} />),
			showCloseButton: true,
			position: "start",
			sweetWidth: "800px",
			isCloseInBackground: false,
		});
	}

	function onShowProduct() {
		sweetModal({
			html: reactComponent(<ProductsLocal />),
			showCloseButton: true,
			position: "start",
			sweetWidth: "1200px",
			isCloseInBackground: false,
		});
	}

	return (
		<Container className="p-2">
			<div className="flex flex-col gap-4 mx-1">
				<AdminBreadCrumb current="local" />
				<div class="flex  items-center justify-between flex-wrap gap-2">
					<div class="flex gap-3 items-center">
						<button
							type="button"
							class="bg-orange-600 px-2 py-2  text-white rounded-md font-bold text-xs uppercase shadow"
							aria-label="button to open products"
							onClick={onShowProduct}
						>
							<i class="fas fa-burger" /> Ver Productos
						</button>
						<button
							type="button"
							class="bg-blue-500 px-2 py-2  text-white rounded-md font-bold text-xs uppercase shadow"
							aria-label="button to open create new user"
							onClick={onOrderIndex}
						>
							<i class="fas fa-store" /> Ver ordenes
						</button>
					</div>
					{guards.permissionAdminGuard() ? (
						<div class="flex gap-3 items-center">
							<button
								type="button"
								class="bg-primary px-2 py-2  text-white rounded-md font-bold text-xs uppercase shadow"
								aria-label="button to open create new user"
								onClick={onMesasStore}
							>
								<i class="far fa-tablet-rugged mr-1" /> Agregar Mesa
							</button>
							<button
								type="button"
								class="bg-blue-600 px-2 py-2  text-white rounded-md font-bold text-xs uppercase shadow"
								aria-label="button to open create new user"
								onClick={onFloorStore}
							>
								<i class="fa-regular fa-building mr-1" /> Agregar Piso
							</button>
						</div>
					) : null}
				</div>
			</div>
			<div class="flex flex-col gap-6">
				{isLoading.value ? (
					<Loading />
				) : (
					<>
						{floorsMesas.value?.length ? (
							<>
								{floorsMesas.value.map((floor) => (
									<div key={floor.id}>
										<h2 class="text-primary mb-2 font-bold uppercase dark:text-white">
											{floor.name}
										</h2>
										<div class="flex gap-4 flex-wrap mx-1  max-w-6xl">
											{" "}
											{floor.mesas.length ? (
												<div class="flex flex-wrap gap-2">
													{floor.mesas.map((mesas) => (
														<article
															class=" flex max-w-[200px] min-w-[170px] h-[110px] flex-1 lg:w-[200px] lg:h-[120px] rounded-md dark:bg-admin-terciary bg-paper-light  gap-4  relative  overflow-auto"
															key={mesas.id}
														>
															<span class="absolute z-10 left-0 top-0 bg-primary right-0 text-center text-white font-bold tracking-wider">
																{mesas.mesa_code}
															</span>
															<div class="flex gap-1 flex-wrap    justify-center w-full p-1 mt-6">
																{mesas.orders.map((order) => (
																	<button
																		type="button"
																		aria-label="button to open order"
																		onClick={() =>
																			onOrderShow(order.order_code)
																		}
																		// si estado 1 confirmado  o 2. preparado
																		class={`${
																			order.status_order_id ===
																			STATUSORDER.confirmado
																				? "bg-primary "
																				: "bg-orange-600"
																		} text-[0.7rem]   w-[70px] flex flex-col items-center justify-center p-1 rounded-md text-white self-start`}
																		key={order.id}
																	>
																		<i class="fas fa-store mb-1 text-lg" />
																		<span class="text-[0.7rem] font-bold">
																			{order.status_order_id ===
																			STATUSORDER.confirmado
																				? "Confirmado"
																				: "Preparado"}
																		</span>
																		<span class="font-bold text-[0.5rem]">
																			{order.order_code}
																		</span>
																	</button>
																))}
															</div>
														</article>
													))}
												</div>
											) : (
												<span class="dark:text-white text-xs font-semibold">
													No hay ninguna mesa agregada
												</span>
											)}
										</div>
									</div>
								))}
							</>
						) : (
							<span class="dark:text-white">No hay pisos ni mesas</span>
						)}
					</>
				)}
			</div>
		</Container>
	);
}

export default MesasIndex;
