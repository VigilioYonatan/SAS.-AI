import Loading from "@/admin/components/Loading";
import { ordersShowApi } from "../apis/orders.show.api";
import View404 from "@/admin/views/404";
import TableDetailsOrder from "./TableDetailsOrder";
import Invoice from "./Invoice";
import Ticket from "./Ticket";
import Note from "./Note";
import { printFileUser } from "@/users/libs/helpers";
import { payMethodIcon } from "../libs";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { showTime } from "~/libs/helpers";

interface OrderShowClientProps {
	order_code: string;
}
function OrderShowClient({ order_code }: OrderShowClientProps) {
	const ordersShowQuery = ordersShowApi(order_code!);
	let component = null;

	if (ordersShowQuery.isLoading) {
		component = <Loading />;
	}
	if (ordersShowQuery.isError) {
		component = <View404 message={`No se encontró un orden ${order_code}`} />;
	}
	if (ordersShowQuery.isSuccess && ordersShowQuery.data) {
		const order = ordersShowQuery.data.order;

		component = (
			<div>
				<div className="flex gap-4 flex-col text-start p-2">
					<div className="flex  flex-wrap justify-center  font-semibold ">
						<div class="flex gap-2 w-full">
							<div class="flex gap-1 flex-col mb-3  py-2  flex-1  p-2">
								<span class="text-primary dark:text-terciary font-bold">
									ID:
								</span>
								<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
									{order.id}
								</span>
							</div>
							<div class="flex gap-1 flex-col mb-3  py-2 flex-1  p-2">
								<span class="text-primary dark:text-terciary font-bold">
									Código:
								</span>
								<div class="flex gap-2 items-center">
									<span class="text-sm dark:text-white">
										<i
											class={`fas  text-xl ${
												!order.isDelivery ? "fa-store" : " fa-motorcycle"
											}`}
										/>
									</span>
									<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
										{order.order_code}
									</span>
								</div>
							</div>
						</div>
						{/*form  */}
						<div class="my-4 w-full">
							<TableDetailsOrder order={order} isClient />
						</div>
						<div class="flex gap-2 w-full">
							{order.invoice?.kind_invoice_code === "01" ||
							order.invoice?.kind_invoice_code === "03" ? (
								<Invoice order={order} refetch={ordersShowQuery.refetch} />
							) : null}
							{order.invoice?.kind_invoice_code === "00" ? (
								<Ticket order={order} />
							) : null}
							{order.note?.kind_invoice_code === "07" ||
							order.note?.kind_invoice_code === "08" ? (
								<Note refetch={ordersShowQuery.refetch} order={order} />
							) : null}
						</div>
						<div class="grid md:grid-cols-2 gap-2 w-full">
							<div class="w-full flex gap-1 flex-col mb-3  p-2">
								<span class="text-primary dark:text-terciary font-bold">
									Estado de orden:
								</span>
								<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
									{order.status_order.name}
								</span>
							</div>
							<div class="w-full flex gap-1 flex-col mb-3  p-2">
								<span class="text-primary dark:text-terciary font-bold">
									Dirección:
								</span>
								<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
									{order.address || "No se ingresó"}
								</span>
							</div>
							{order.seller_id ? (
								<div class="w-full flex gap-1 flex-col mb-3  p-2">
									<span class="text-primary dark:text-terciary font-bold">
										Trabajador
									</span>

									<img
										class="rounded-full w-[40px] h-[40px] "
										src={printFileUser(order.seller.photo, 100)[0]}
										width={100}
										height={100}
										alt={order.seller.username}
									/>
									<a
										href={`/admin/usuarios/${order.seller.id}`}
										target="_blank"
										rel="noreferrer"
										class="dark:text-secondary-light text-secondary-dark tracking-wide text-xs"
									>
										{order.seller.username}
									</a>
								</div>
							) : null}
							{order.user_id ? (
								<div class="w-full flex gap-1 flex-col mb-3  p-2">
									<span class="text-primary dark:text-terciary font-bold">
										Cliente
									</span>
									<img
										class="rounded-full w-[40px] h-[40px]"
										src={printFileUser(order.user.photo, 100)[0]}
										width={100}
										height={100}
										alt={order.user.username}
									/>
									<a
										href={`/admin/usuarios/${order.user.id}`}
										target="_blank"
										rel="noreferrer"
										class="dark:text-secondary-light text-secondary-dark tracking-wide text-xs"
									>
										{order.user.username}
									</a>
								</div>
							) : (
								<div class="w-full flex gap-1 flex-col mb-3  p-2">
									<span class="text-primary dark:text-terciary font-bold">
										Cliente
									</span>
									<span class="dark:text-secondary-light text-secondary-dark tracking-wide ">
										No registrado
									</span>
								</div>
							)}
							<div class="flex w-full gap-1 flex-col mb-3    relative">
								<span class="text-primary dark:text-terciary font-bold">
									Metódo de pago:
								</span>
								<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
									<div
										dangerouslySetInnerHTML={{
											__html: payMethodIcon()[order.pay_method_id],
										}}
									/>
									{order.pasarela_response ? (
										<button
											type="button"
											aria-label="show"
											class="text-xs bg-primary px-2 py-1 rounded-md text-white ml-2"
											onClick={() => {
												sweetModal({
													html: reactComponent(
														<div class="w-full break-words">
															<h1 class="text-primary text-center font-bold">
																Transacción
															</h1>
															<pre class="dark:text-white break-words w-full ">
																<p>
																	{JSON.stringify(
																		order.pasarela_response,
																		null,
																		1,
																	)}
																</p>
															</pre>
														</div>,
													),
													showCloseButton: true,
													sweetWidth: "600px",
												});
											}}
										>
											<i class="fa-solid fa-eye mr-1" /> Ver Transacción
										</button>
									) : null}
								</span>
							</div>
							<div class="flex gap-1 flex-col mb-3  py-2 rounded-md w-full">
								<span class="text-primary dark:text-terciary font-bold">
									Creado:
								</span>
								<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
									{showTime(order.createdAt)}
								</span>
							</div>
							<div class="flex gap-1 flex-col mb-3  py-2 rounded-md w-full">
								<span class="text-primary dark:text-terciary font-bold">
									Actualizado:
								</span>
								<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
									{showTime(order.updatedAt)}
								</span>
							</div>
						</div>
						{order.telephone ? (
							<div class="grid md:grid-cols-2 gap-2 w-full">
								<div class="flex gap-1 flex-col mb-3  py-2 rounded-md w-full">
									<span class="text-primary dark:text-terciary font-bold">
										Numero de Telefono
									</span>
									<span class="dark:text-secondary-light text-secondary-dark tracking-wide flex gap-2 items-center">
										<i class="fab fa-whatsapp" />
										{order.telephone}
									</span>
								</div>
							</div>
						) : null}
					</div>
				</div>
			</div>
		);
	}
	return component;
}

export default OrderShowClient;
