import { useEffect, useState } from "preact/hooks";
import { useForm, type UseFormReturn } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import Form from "~/components/form";
import useCartStore from "../stores/cart.store";
import {
	formatDolares,
	formatMoney,
	pasarelaComision,
	paypalComision,
} from "../libs/helpers";
import { sweetModal } from "@vigilio/sweet";
import type { OrdersCartStoreDto } from "@/orders/dtos/orders-cart.dto";
import { ordersStoreApi } from "@/orders/apis/orders.store.api";
import { PAYMETHOD, STATUSORDER } from "@/orders/libs";
import {
	VisaMastercardImage,
	mercadoPagoImage,
	plinImage,
	yapeImage,
} from "~/config/settings";
import useAuthStore from "@/auth/stores/auth.store";
import useSocketStore from "~/stores/socket.store";
import enviroments from "~/config";
import { handlerError } from "~/libs/helpers";
import {
	ordersStoreDto,
	type OrdersStoreDto,
} from "@/orders/dtos/orders.store.dto";
import useEmpresastore, {
	storageEmpresa,
} from "@/empresas/stores/empresa.store";
import { paypalPaymentApi } from "@/payments/apis/paypal.payment.api";
import LoaderSubmit from "~/components/LoaderSubmit";
import { useSignal } from "@preact/signals";
import { websConverterApi } from "@/admin/apis/converter.api";
import Loading from "@/admin/components/Loading";
import { cartDestroyApi } from "../apis/cart.destroy.api";
import { printFileWithDimension } from "~/libs/upload";
import { Fragment } from "preact/jsx-runtime";
import { productOBJ } from "@/products/libs/helpers";
import { mercadoPagoPaymentApi } from "@/payments/apis/mercadopago.api";
import { DIALCODE, transferencias } from "@/empresas/libs/helpers";
import IzipayForm from "../components/IzipayForm";
import { stripeOrderApi } from "@/payments/apis/stripe.payment.api";

export function verifyBank(transferencia: Record<string, string | null>) {
	return Object.values(transferencia).filter((val) => val).length;
}

type PaymentGatewayProps = {
	ordersCartStoreDtoForm: UseFormReturn<OrdersCartStoreDto>;
	ordersCartStoreDto: OrdersCartStoreDto;
	onClose: () => void;
};

function Niubiz({
	ordersCartStoreDtoForm,
	ordersCartStoreDto,
	onClose,
}: PaymentGatewayProps) {
	const [step, setStep] = useState<"method" | "payment">("method");
	const [paymentMethod, setPaymentMethod] = useState<
		| "card"
		| "yape"
		| "efectivo"
		| "transferencias"
		| "paypal"
		| "qrYape|qrPlin"
		| "izipay"
		| "stripe"
	>("efectivo");
	const dolarNow = useSignal<number | null>(null);
	const websConverterMutation = websConverterApi();

	useEffect(() => {
		websConverterMutation.mutate(
			{
				amount: "1",
				from: storageEmpresa!.money.simbolo,
				to: "USD",
			},
			{
				onSuccess(data) {
					const value = Number.parseFloat(data.result.todayNumber);
					dolarNow.value = value;
				},
			},
		);
	}, []);

	let component: null | JSX.Element | JSX.Element[] = null;

	if (websConverterMutation.isLoading) {
		component = <Loading className="h-[600px]" />;
	}
	if (websConverterMutation.isError) {
		component = (
			<span class="text-xs dark:text-white">
				Se está solucionando este problema. Pruebelo más tarde
			</span>
		);
	}

	if (websConverterMutation.isSuccess) {
		const empresa = useEmpresastore();

		component = (
			<div>
				{step === "method" ? (
					<>
						<div class="flex font-bold text-xl items-center justify-center py-4 w-full text-primary dark:text-white">
							METODOS DE PAGO
						</div>
						<h3 class="font-bold text-xl dark:text-white text-center mb-3">
							{formatMoney(ordersCartStoreDtoForm.watch("total"))}
						</h3>
						<p class=" mb-4 dark:text-white">Elige un metodo de pago:</p>
						<div class="space-y-3">
							{empresa.state!.metodos_pago.enable_efectivo ? (
								<label class="flex items-start cursor-pointer px-3 py-2 space-x-3 bg-background-light dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-paper-light border-neutral-200/70">
									<input
										type="radio"
										name="radio-group"
										value="card"
										class="text-gray-900 translate-y-px focus:ring-gray-700"
										checked={paymentMethod === "efectivo"}
										onChange={() => setPaymentMethod("efectivo")}
									/>
									<span class="relative flex flex-col text-left space-y-1.5 leading-none">
										<span class="font-semibold text-sm">Pagar en efectivo</span>
										<span class="text-sm text-terciary">
											Realizarás el pago cuando recibes el producto.
										</span>
									</span>
								</label>
							) : null}

							{empresa.state!.metodos_pago.transferencias &&
							transferencias(empresa.state!.metodos_pago.transferencias) ? (
								<label class="flex items-start cursor-pointer px-3 py-2 space-x-3 bg-background-light dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-paper-light border-neutral-200/70 relative">
									<input
										type="radio"
										name="radio-group"
										value="transferencias"
										class="text-gray-900 translate-y-px focus:ring-gray-700"
										checked={paymentMethod === "transferencias"}
										onChange={() => setPaymentMethod("transferencias")}
									/>
									<span class="relative flex flex-col text-left space-y-1.5 leading-none">
										<span class="font-semibold text-sm">
											Transferencia Bancaria
										</span>
										<div class="flex gap-2 items-center">
											{empresa.state!.bancos.map((bank) => {
												const tr = empresa.state!.metodos_pago.transferencias!;
												return (
													<Fragment key={bank.key}>
														{tr[bank.key as keyof typeof tr] &&
														verifyBank(tr[bank.key as keyof typeof tr]) ? (
															<img
																class="h-6 object-contain"
																width={40}
																src={bank.image}
																alt={bank.value}
															/>
														) : null}
													</Fragment>
												);
											})}
										</div>
									</span>
									<div class="absolute bottom-0 text-xs right-1  font-bold flex-col flex  items-end mr-1 m-1">
										<span>Sin comision</span>
									</div>
								</label>
							) : null}
							{empresa.state!.metodos_pago.mercado_pago.enabled &&
							storageEmpresa?.dial_code !== DIALCODE.españa ? (
								<>
									<label class="flex items-start cursor-pointer px-3 py-2 space-x-3 bg-background-light dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-paper-light border-neutral-200/70 relative">
										<input
											type="radio"
											name="radio-group"
											value="card"
											class="text-gray-900 translate-y-px focus:ring-gray-700"
											checked={paymentMethod === "card"}
											onChange={() => setPaymentMethod("card")}
										/>
										<span class="relative flex flex-col text-left space-y-1.5 leading-none">
											<span class="font-semibold text-sm">
												Tarjeta de credito o debito
											</span>
											<span class="text-sm opacity-50 flex gap-2 items-center">
												<img
													class="h-6 w-[40px] object-contain"
													src={mercadoPagoImage()}
													alt="mercado pago"
													width={100}
													height={100}
												/>
												<img
													class="h-6 w-[40px] object-contain"
													src={VisaMastercardImage()}
													alt="visa"
													width={100}
													height={100}
												/>
											</span>
										</span>
										{empresa.state!.enabledClientPayComision ? (
											<span class="absolute bottom-0 text-xs right-1  font-bold flex-col flex items-end m-1 dark:text-white  text-center ">
												+%
												{enviroments.VITE_PASARELA_COMISION} +
												{enviroments.VITE_PASARELA_COMISION_TRANSACCION > 0
													? ` ${formatMoney(
															enviroments.VITE_PASARELA_COMISION_TRANSACCION,
														)}`
													: null}
												<br />
												comisión pasarela
											</span>
										) : null}
									</label>
								</>
							) : null}
							{empresa.state!.metodos_pago.stripe.enabled &&
							storageEmpresa?.dial_code === DIALCODE.españa ? (
								<>
									<label class="flex items-start cursor-pointer px-3 py-2 space-x-3 bg-background-light dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-paper-light border-neutral-200/70 relative">
										<input
											type="radio"
											name="radio-group"
											value="stripe"
											class="text-gray-900 translate-y-px focus:ring-gray-700"
											checked={paymentMethod === "stripe"}
											onChange={() => setPaymentMethod("stripe")}
										/>
										<span class="relative flex flex-col text-left space-y-1.5 leading-none">
											<span class="font-semibold text-sm">
												Tarjeta de credito o debito
											</span>
											<span class="text-sm opacity-50 flex gap-2 items-center">
												<img
													class="h-6 w-[40px] object-contain"
													src={
														"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGZVxQZ2UYa4aZMO1u_hgQPt-OVvqLq5MnoA&s"
													}
													alt="stripe"
													width={100}
													height={100}
												/>
												<img
													class="h-6 w-[40px] object-contain"
													src={VisaMastercardImage()}
													alt="visa"
													width={100}
													height={100}
												/>
											</span>
										</span>
										{empresa.state!.enabledClientPayComision ? (
											<span class="absolute bottom-0 text-xs right-1  font-bold flex-col flex items-end m-1 dark:text-white  text-center ">
												+%
												{enviroments.VITE_STRIPE_COMISION} +
												{enviroments.VITE_STRIPE_COMISION_TRANSACCION > 0
													? ` ${formatMoney(
															enviroments.VITE_STRIPE_COMISION_TRANSACCION,
														)}`
													: null}
												<br />
												comisión pasarela
											</span>
										) : null}
									</label>
								</>
							) : null}
							{empresa.state!.metodos_pago.izipay.enabled &&
							storageEmpresa?.dial_code === DIALCODE.peru ? (
								<>
									<label class="flex items-start cursor-pointer px-3 py-2 space-x-3 bg-[#F72C46] dark:bg-background-dark text-white dark:border-paper-dark border rounded-md shadow-sm  border-neutral-200/70 relative">
										<input
											type="radio"
											name="radio-group"
											value="card"
											class="text-gray-900 translate-y-px focus:ring-gray-700"
											checked={paymentMethod === "izipay"}
											onChange={() => setPaymentMethod("izipay")}
										/>
										<span class="relative flex flex-col text-left space-y-1.5 leading-none">
											<span class="font-semibold text-sm">
												Tarjeta de credito o debito
											</span>
											<span class="text-sm  flex gap-2 items-center">
												<img
													class="h-6 w-[40px] object-contain"
													src="https://iziweb001b.s3.amazonaws.com/webresources/img/logo.png"
													alt="izipay"
													width={100}
													height={100}
												/>
												<img
													class="h-6 w-[40px] object-contain"
													src={VisaMastercardImage()}
													alt="visa"
													width={100}
													height={100}
												/>
											</span>
										</span>
										{empresa.state!.enabledClientPayComision ? (
											<span class="absolute bottom-0 text-xs right-1  font-bold flex-col flex items-end m-1 dark:text-white  text-center ">
												{enviroments.VITE_IZIPAY_COMISION}% + S/.
												{enviroments.VITE_IZIPAY_COMISION_TRANSACCION}
												<br />
												comisión pasarela
											</span>
										) : null}
									</label>
								</>
							) : null}

							{empresa.state!.metodos_pago.paypal.enabled ? (
								<label class="flex items-start px-3 py-4  space-x-3 bg-background-light dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-paper-light border-neutral-200/70 cursor-pointer relative">
									<input
										type="radio"
										name="radio-group"
										value="paypal"
										class="text-gray-900 translate-y-px focus:ring-gray-700"
										checked={paymentMethod === "paypal"}
										onChange={() => setPaymentMethod("paypal")}
									/>

									<span>
										{" "}
										<i class="fa-brands fa-paypal" /> Pagar con paypal
									</span>
									{empresa.state!.enabledClientPayComision ? (
										<div class="absolute bottom-0 text-xs right-1  font-bold flex-col flex items-end m-1">
											<span>Comisión paypal</span>
											<span>
												+{enviroments.VITE_PAYPAL_COMISION}% +{" "}
												{enviroments.VITE_PAYPAL_TRANSACTION} USD
											</span>
											<span>Solo disponible en $</span>
										</div>
									) : null}
								</label>
							) : null}
							{empresa.state?.dial_code === "51" ? (
								<>
									{empresa.state!.metodos_pago.qrYape ||
									empresa.state!.metodos_pago.qrPlin ? (
										<label class="flex items-start px-3 py-4  space-x-3 bg-background-light dark:bg-background-dark dark:text-white dark:border-paper-dark border rounded-md shadow-sm hover:bg-paper-light border-neutral-200/70 cursor-pointer relative">
											<input
												type="radio"
												name="radio-group"
												value="qrYape|qrPlin"
												class="text-gray-900 translate-y-px focus:ring-gray-700"
												checked={paymentMethod === "qrYape|qrPlin"}
												onChange={() => setPaymentMethod("qrYape|qrPlin")}
											/>

											<span class="flex gap-2 items-center">
												<div class="flex gap-2 items-center">
													{empresa.state!.metodos_pago.qrYape ? (
														<img
															src={yapeImage()}
															width={30}
															height={30}
															alt="yape"
														/>
													) : null}
													{empresa.state!.metodos_pago.qrPlin ? (
														<img
															src={plinImage()}
															width={30}
															height={30}
															alt="plin"
														/>
													) : null}
												</div>{" "}
												Pagar con{" "}
												{empresa.state!.metodos_pago.qrYape ? "Qr Yape " : null}
												{empresa.state!.metodos_pago.qrPlin
													? "- Qr Plin"
													: null}
											</span>
											<div class="absolute bottom-0 text-xs right-1  font-bold flex-col flex  items-end mr-1 m-1">
												<span>Sin comision</span>
											</div>
										</label>
									) : null}
								</>
							) : null}
						</div>
					</>
				) : null}
				{step === "payment" ? (
					<div class="relative">
						<button
							class="absolute top-0 left-0 bg-primary rounded-lg px-2 py-1"
							type="button"
							onClick={() => setStep("method")}
							aria-label="Volver atrás"
						>
							<i class="fas fa-arrow-left text-xl" />
						</button>

						{paymentMethod === "card" ? (
							<NiubizCardForm
								ordersCartStoreDtoForm={ordersCartStoreDtoForm}
								ordersCartStoreDto={ordersCartStoreDto}
							/>
						) : paymentMethod === "yape" ? (
							<></>
						) : paymentMethod === "transferencias" ? (
							<TransferenciaPayment
								ordersCartStoreDtoForm={ordersCartStoreDtoForm}
								ordersCartStoreDto={ordersCartStoreDto}
								onClose={onClose}
								dolarNow={dolarNow.value!}
							/>
						) : paymentMethod === "paypal" ? (
							<PaypalPayment
								ordersCartStoreDto={ordersCartStoreDto}
								onClose={onClose}
								dolarValue={dolarNow.value}
							/>
						) : paymentMethod === "qrYape|qrPlin" ? (
							<QrYapePlin
								ordersCartStoreDto={ordersCartStoreDto}
								onClose={onClose}
								ordersCartStoreDtoForm={ordersCartStoreDtoForm}
							/>
						) : paymentMethod === "izipay" ? (
							<IzipayForm
								onClose={onClose}
								ordersCartStoreDtoForm={ordersCartStoreDtoForm}
								order={ordersCartStoreDtoForm.getValues()}
							/>
						) : paymentMethod === "stripe" ? (
							<StripePayment
								onClose={onClose}
								ordersCartStoreDto={ordersCartStoreDto}
							/>
						) : (
							<Efectivo
								ordersCartStoreDtoForm={ordersCartStoreDtoForm}
								ordersCartStoreDto={ordersCartStoreDto}
								onClose={onClose}
							/>
						)}
					</div>
				) : null}
				{step === "method" && (
					<button
						type="button"
						class="w-full mt-4 inline-flex items-center justify-center px-4 py-2 text-sm font-medium tracking-wide text-white transition-colors duration-200 rounded-md bg-neutral-950 hover:bg-neutral-900"
						onClick={() => setStep("payment")}
					>
						Continuar
					</button>
				)}
			</div>
		);
	}
	return component;
}

interface EfectivoProps {
	ordersCartStoreDtoForm: UseFormReturn<OrdersCartStoreDto>;
	ordersCartStoreDto: OrdersCartStoreDto;
	onClose: () => void;
}
function Efectivo({
	onClose,
	ordersCartStoreDto,
	ordersCartStoreDtoForm,
}: EfectivoProps) {
	const cartStore = useCartStore();
	const ordersStoreMutation = ordersStoreApi();
	const cartDestroyMutation = cartDestroyApi();
	const authStore = useAuthStore();
	const { io } = useSocketStore();

	function onOrderEfectivo() {
		sweetModal({
			title: "¿Estas seguro de realizar esta orden?",
			text: "",
			showCloseButton: true,
			showCancelButton: true,
			isCloseInBackground: false,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				ordersStoreMutation.mutate(
					{
						...ordersCartStoreDto,
						status_order_id: STATUSORDER.confirmado,
					},
					{
						async onSuccess(data) {
							onClose();
							cartStore.methods.cleanStorage();
							ordersCartStoreDtoForm.reset();
							io?.emit("notifications:order-store", {
								total: data.order.total,
								order_code: data.order.order_code,
								user_id: data.order.user_id ?? null,
							});
							if (authStore.state) {
								await Promise.all(
									cartStore.state.cart!.map(
										async (cart) =>
											await cartDestroyMutation.mutateAsync({
												variant_id: cart.variant ? cart.variant.id : null,
												...productOBJ(cart.id),
											}),
									),
								);
							}
							sweetModal({
								icon: "success",
								html: `<div class="p-3"><div class="flex items-center justify-center mb-2">
                                                <h2 class="text-2xl font-semibold text-primary dark:text-white text-center">Pago Exitoso</h2>
                                            </div>
                                            <div class="text-center">
                                                 <i class="fa-solid fa-circle-check text-green-500 text-6xl"></i>
                                                <p class="mt-4 text-lg  w-full">Su orden se realizó correctamente  <b class='block w-full'>${data.order.order_code}</b></p>
                                            </div>
                                            <div class="flex justify-center">
                                                <a  target='_blank' href='/pedidos?code=${data.order.order_code}' class="px-4 py-2 bg-primary text-white rounded-lg  focus:outline-none mt-3">
                                                Ver Pedido
                                                </a>
                                            </div>
                                            </div>
                    `,
								showCloseButton: true,
								sweetWidth: "600px",
							});
						},
						onError(error) {
							onClose();
							sweetModal({
								icon: "danger",
								title: "Hubo un error al realizar esta orden",
								text: JSON.stringify(error.message),
								showCloseButton: true,
							}).then(() => {
								window.location.reload();
							});
						},
					},
				);
			}
		});
	}

	return (
		<div class="dark:text-white">
			<h1 class="text-xl font-bold text-center py-3 text-primary dark:text-white">
				Pago en Efectivo
			</h1>
			<span class="mx-auto text-xl mb-2 block">
				{formatMoney(ordersCartStoreDtoForm.getValues("total"))}
			</span>
			<div class="flex flex-col gap-3 text-sm">
				<div class="flex items-center gap-2">
					<span class="font-semibold">Metodo de pago:</span>
					<span>Efectivo</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="font-semibold">Telefono:</span>
					<span>
						+{storageEmpresa?.dial_code} {ordersCartStoreDto.telephone}
					</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="font-semibold">Dirección:</span>
					<span>{ordersCartStoreDto.address}</span>
				</div>
				<div class="flex items-center gap-2">
					<span class="font-semibold">Referencia:</span>
					<span>{ordersCartStoreDto.reference}</span>
				</div>
			</div>
			<button
				type="button"
				aria-label="realizar pedido"
				class="bg-primary px-4 py-2 rounded-md text-white uppercase font-bold mt-5 mb-2 text-xs"
				disabled={ordersStoreMutation.isLoading || false}
				onClick={onOrderEfectivo}
			>
				{ordersStoreMutation.isLoading ? <LoaderSubmit /> : "Realizar Pedido"}
			</button>
		</div>
	);
}
interface QrYapePlinProps {
	ordersCartStoreDtoForm: UseFormReturn<OrdersCartStoreDto>;
	ordersCartStoreDto: OrdersCartStoreDto;
	onClose: () => void;
}
function QrYapePlin({
	onClose,
	ordersCartStoreDto,
	ordersCartStoreDtoForm,
}: QrYapePlinProps) {
	const empresa = useEmpresastore();
	const ordersStoreMutation = ordersStoreApi();
	const cartDestroyMutation = cartDestroyApi();
	const cartStore = useCartStore();
	const authStore = useAuthStore();
	const transferenciaForm = useForm<OrdersCartStoreDto>({
		resolver: valibotVigilio(ordersStoreDto),
		defaultValues: {
			...ordersCartStoreDto,
			pay_method_id: PAYMETHOD.yape,
			status_order_id: STATUSORDER.pendiente,
		},
	});

	const { io } = useSocketStore();
	function onTransferenciaStore(data: OrdersCartStoreDto) {
		if (!data.transferencia_image) {
			transferenciaForm.setError("transferencia_image", {
				message: "Este campo es obligatorio.",
			});
			return;
		}
		sweetModal({
			customIcon:
				"<i class='fas fa-store text-5xl dark:text-white text-secondary-dark mb-2' />",
			title: "¿Estás seguro de realizar este orden?",
			text: "",
			showCloseButton: true,
			showCancelButton: true,
			isCloseInBackground: false,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				ordersStoreMutation.mutate(data, {
					async onSuccess(data) {
						io?.emit("notifications:order-store", {
							order_code: data.order.order_code,
							total: data.order.total,
							user_id: data.order.user_id ?? null,
						});
						if (authStore.state) {
							await Promise.all(
								cartStore.state.cart!.map(
									async (cart) =>
										await cartDestroyMutation.mutateAsync({
											...productOBJ(cart.id),
											variant_id: cart.variant ? cart.variant.id : null,
										}),
								),
							);
						}
						sweetModal({
							icon: "success",
							html: `<div class="p-3"><div class="flex items-center justify-center mb-2">
                                        <h2 class="text-2xl font-semibold text-primary dark:text-white text-center">Se envió su orden correctamente</h2>
                                    </div>
                                    <div class="text-center">
                                         <i class="fa-solid fa-circle-check text-green-500 text-6xl"></i>
                                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 w-full">Se realizó orden correctamente <b class='block w-full'>${data.order.order_code}</b></p>
                                    </div>
                                    <div class="flex justify-center">
                                        <a  target='_blank' href='/pedidos?code=${data.order.order_code}' class="px-4 py-2 bg-primary text-white rounded-lg  focus:outline-none mt-3">
                                        Ver Pedido
                                        </a>
                                    </div>
                                    </div>
            `,
							showCloseButton: true,
							sweetWidth: "600px",
						});
						onClose();
						cartStore.methods.cleanStorage();
						ordersCartStoreDtoForm.reset();
					},
					onError(error) {
						handlerError(transferenciaForm, error);
					},
				});
			}
		});
	}
	return (
		<div class="dark:text-white">
			<h1 class="text-xl font-bold text-center py-3">
				{empresa.state!.metodos_pago.qrYape ? "Yape Qr " : ""}
				{empresa.state!.metodos_pago.qrPlin ? "o Plin Qr" : ""}
			</h1>
			<p class="text-sm">
				Tu pedido no se procesará hasta que se haya recibido el importe en
				nuestra cuenta.
			</p>
			<span class="font-bold">
				{formatMoney(ordersCartStoreDtoForm.getValues("total"))}
			</span>
			<div class="flex gap-4 items-center justify-center">
				{empresa.state!.metodos_pago.qrYape ? (
					<div class="flex flex-col items-center justify-center rounded-md">
						<img
							class="mx-auto mt-2  w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] object-contain rounded-md"
							width={500}
							height={500}
							src={
								printFileWithDimension(
									empresa.state!.metodos_pago.qrYape,
									500,
								)[0]
							}
							alt="qr"
						/>
						<img
							src={yapeImage()}
							width={30}
							class="mt-2"
							height={30}
							alt="yape"
						/>
					</div>
				) : null}
				{empresa.state!.metodos_pago.qrPlin &&
				empresa.state!.metodos_pago.qrYape ? (
					<span class="font-bold text-xl">ó</span>
				) : null}

				{empresa.state!.metodos_pago.qrPlin ? (
					<div class="flex flex-col items-center justify-center rounded-md">
						<img
							class="mx-auto mt-2 rounded-md w-[200px] h-[200px] lg:w-[300px] lg:h-[300px] object-contain "
							width={500}
							height={500}
							src={
								printFileWithDimension(
									empresa.state!.metodos_pago.qrPlin,
									500,
								)[0]
							}
							alt="qr"
						/>
						<img
							src={plinImage()}
							width={30}
							class="mt-2 rounded-md"
							height={30}
							alt="plin"
						/>
					</div>
				) : null}
			</div>

			<Form
				className="mt-3"
				{...transferenciaForm}
				onSubmit={onTransferenciaStore}
			>
				<Form.control.file
					title={`Sube tu comprobante ${
						empresa.state!.metodos_pago.qrYape ? "yape" : ""
					} ${
						empresa.state!.metodos_pago.qrYape &&
						empresa.state!.metodos_pago.qrPlin
							? "ó"
							: ""
					} ${empresa.state!.metodos_pago.qrPlin ? "plin" : ""}`}
					accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
					name={"transferencia_image" as keyof OrdersStoreDto}
					typeFile="image"
				/>
				<Form.button.submit
					className="mx-auto py-3 px-4 rounded-md mt-3"
					disabled={ordersStoreMutation.isLoading || false}
					isLoading={ordersStoreMutation.isLoading || false}
					title="Subir imagen"
				/>
			</Form>
		</div>
	);
}
interface NiubizCardFormProps {
	ordersCartStoreDtoForm: UseFormReturn<OrdersCartStoreDto>;
	ordersCartStoreDto: OrdersCartStoreDto;
}
function NiubizCardForm({
	ordersCartStoreDtoForm,
	ordersCartStoreDto,
}: NiubizCardFormProps) {
	const cartStore = useCartStore();
	const mercadoPagoPaymentMutate = mercadoPagoPaymentApi();

	return (
		<div class="flex flex-col gap-2">
			<h1 class="text-xl font-bold text-center py-3 text-primary dark:text-white">
				MERCADO PAGO
			</h1>
			{storageEmpresa?.enabledClientPayComision ? (
				<div class="flex flex-col justify-center items-center text-sm">
					Comisión pasarela
					<span class=" text-xs  font-bold flex-col flex m-1 dark:text-white  text-center ">
						+ %{enviroments.VITE_PASARELA_COMISION} +
						{enviroments.VITE_PASARELA_COMISION_TRANSACCION > 0
							? ` ${formatMoney(
									enviroments.VITE_PASARELA_COMISION_TRANSACCION,
								)}`
							: null}
						<br />
					</span>
				</div>
			) : null}
			<span class="font-bold dark:text-white flex justify-center items-center">
				Total:{" "}
				{storageEmpresa?.enabledClientPayComision
					? formatMoney(
							cartStore.methods.getTotal() +
								pasarelaComision(cartStore.methods.getTotal(), "mercado_pago"),
						)
					: formatMoney(cartStore.methods.getTotal())}
			</span>
			<button
				type="button"
				class="bg-primary px-4 py-1 rounded-md border-2 border-primary hover:bg-transparent text-white delay-custom-1 hover:text-primary flex gap-2 items-center justify-center "
				onClick={() => {
					mercadoPagoPaymentMutate.mutate(
						{
							...ordersCartStoreDto,
							pay_method_id: PAYMETHOD.tarjeta,
						},
						{
							onSuccess(data) {
								location.href = data.result.init_point;
							},
							onError(err) {
								handlerError(ordersCartStoreDtoForm, err);
							},
						},
					);
				}}
				disabled={mercadoPagoPaymentMutate.isLoading || false}
			>
				<img
					src={mercadoPagoImage()}
					width={100}
					height={100}
					class="w-[30px] h-[30px] object-contain"
					alt=""
				/>{" "}
				{mercadoPagoPaymentMutate.isLoading ? (
					<div class="flex gap-2 items-center font-semibold">
						<span class="text-xs">Espere un momento ....</span>
						<LoaderSubmit />
					</div>
				) : (
					"Pagar"
				)}
			</button>
		</div>
	);
}

interface TransferenciaPaymentProps {
	ordersCartStoreDtoForm: UseFormReturn<OrdersCartStoreDto>;
	ordersCartStoreDto: OrdersCartStoreDto;
	onClose: () => void;
	dolarNow: number;
}
function TransferenciaPayment({
	onClose,
	ordersCartStoreDto,
	ordersCartStoreDtoForm,
	dolarNow,
}: TransferenciaPaymentProps) {
	const empresa = useEmpresastore();
	const ordersStoreMutation = ordersStoreApi();
	const cartStore = useCartStore();
	const authStore = useAuthStore();
	const cartDestroyMutation = cartDestroyApi();
	const transferenciaForm = useForm<OrdersCartStoreDto>({
		resolver: valibotVigilio(ordersStoreDto),
		defaultValues: {
			...ordersCartStoreDto,
			pay_method_id: PAYMETHOD.transferencia,
			status_order_id: STATUSORDER.pendiente,
		},
	});

	const { io } = useSocketStore();
	function onTransferenciaStore(data: OrdersCartStoreDto) {
		if (!data.transferencia_image) {
			transferenciaForm.setError("transferencia_image", {
				message: "Este campo es obligatorio.",
			});
			return;
		}
		sweetModal({
			customIcon:
				"<i class='fas fa-store text-5xl dark:text-white text-secondary-dark mb-2' />",
			title: "¿Estás seguro de realizar este orden?",
			text: "",
			showCloseButton: true,
			showCancelButton: true,
			isCloseInBackground: false,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				ordersStoreMutation.mutate(data, {
					async onSuccess(data) {
						io?.emit("notifications:order-store", {
							order_code: data.order.order_code,
							total: data.order.total,
							user_id: data.order.user_id ?? null,
						});
						if (authStore.state) {
							await Promise.all(
								cartStore.state.cart!.map(
									async (cart) =>
										await cartDestroyMutation.mutateAsync({
											...productOBJ(cart.id),
											variant_id: cart.variant ? cart.variant.id : null,
										}),
								),
							);
						}
						sweetModal({
							icon: "success",
							html: `<div class="p-3"><div class="flex items-center justify-center mb-2">
                                        <h2 class="text-2xl font-semibold text-primary dark:text-white text-center">Se envió su orden correctamente</h2>
                                    </div>
                                    <div class="text-center">
                                         <i class="fa-solid fa-circle-check text-green-500 text-6xl"></i>
                                        <p class="mt-4 text-lg text-gray-600 dark:text-gray-300 w-full">Se realizó orden correctamente <b class='block w-full'>${data.order.order_code}</b></p>
                                    </div>
                                    <div class="flex justify-center">
                                        <a  target='_blank' href='/pedidos?code=${data.order.order_code}' class="px-4 py-2 bg-primary text-white rounded-lg  focus:outline-none mt-3">
                                        Ver Pedido
                                        </a>
                                    </div>
                                    </div>`,
							showCloseButton: true,
							sweetWidth: "600px",
						});
						onClose();
						cartStore.methods.cleanStorage();
						ordersCartStoreDtoForm.reset();
					},
					onError(error) {
						handlerError(transferenciaForm, error);
					},
				});
			}
		});
	}
	return (
		<div class="dark:text-white">
			<h1 class="text-xl font-bold text-center py-3">Transferencia Bancaria</h1>
			<p class="text-sm">
				Realiza tu pago directamente en nuestra cuentas bancaria. Tu pedido no
				se procesará hasta que se haya recibido el importe en nuestra cuenta.
			</p>
			<span class="font-bold mt-2 block">
				{formatMoney(cartStore.methods.getTotal())} /{" "}
				{formatDolares(cartStore.methods.getTotal() / dolarNow)}
			</span>
			{empresa.state!.bancos.map((bank) => {
				const tr = empresa.state!.metodos_pago.transferencias!;
				const money = empresa.state!.money;
				return (
					<Fragment key={bank.key}>
						{tr[bank.key as keyof typeof tr] &&
						verifyBank(tr[bank.key as keyof typeof tr]) ? (
							<>
								<div class="flex flex-col my-2">
									<span class="font-bold text-primary dark:text-white">
										{bank.value}
									</span>
									{tr[bank.key as keyof typeof tr].titular}
									<br />
									{tr[bank.key as keyof typeof tr][
										// biome-ignore lint/suspicious/noExplicitAny: <explanation>
										money.simbolo as any
									] ? (
										<b class="text-sm">
											{money.money}:{" "}
											<span class="font-normal">
												{
													tr[
														bank.key as keyof typeof tr
														// biome-ignore lint/suspicious/noExplicitAny: <explanation>
													][money.simbolo as any]
												}
											</span>
										</b>
									) : null}
									{tr[bank.key as keyof typeof tr].dolares ? (
										<b class="text-sm">
											Dolares:{" "}
											<span class="font-normal">
												{tr[bank.key as keyof typeof tr].dolares}
											</span>
										</b>
									) : null}
								</div>
								<div class="h-[1px] w-full bg-terciary" />
							</>
						) : null}
					</Fragment>
				);
			})}

			<Form
				className="mt-3"
				{...transferenciaForm}
				onSubmit={onTransferenciaStore}
			>
				<Form.control.file
					title="Imagen de voucher"
					accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
					name={"transferencia_image" as keyof OrdersStoreDto}
					typeFile="image"
				/>
				<Form.button.submit
					className="mx-auto py-3 px-4 rounded-md mt-3"
					disabled={ordersStoreMutation.isLoading || false}
					isLoading={ordersStoreMutation.isLoading || false}
					title="Subir imagen"
				/>
			</Form>
		</div>
	);
}

interface PaypalPaymentProps {
	ordersCartStoreDto: OrdersCartStoreDto;
	onClose: () => void;
	dolarValue: number | null;
}
function PaypalPayment({
	onClose,
	ordersCartStoreDto,
	dolarValue,
}: PaypalPaymentProps) {
	const empresa = useEmpresastore();
	const transferenciaForm = useForm<OrdersCartStoreDto>({
		resolver: valibotVigilio(ordersStoreDto),
		defaultValues: {
			...ordersCartStoreDto,
			pay_method_id: PAYMETHOD.paypal,
			status_order_id: STATUSORDER.pendiente,
		},
	});
	const paypalPaymentMutation = paypalPaymentApi();

	function onPaymentPaypal() {
		paypalPaymentMutation.mutate(
			{ ...ordersCartStoreDto, pay_method_id: PAYMETHOD.paypal },
			{
				onSuccess(data) {
					// Get: "https://www.sandbox.paypal.com/checkoutnow?token=9GV26179CU8491828"
					window.location.href = data.result.links[1].href;
					onClose();
				},
				onError(error) {
					handlerError(transferenciaForm, error);
				},
			},
		);
	}

	return (
		<div>
			<h1 class="text-xl font-bold text-center py-3 dark:text-white ">
				<i class="fa-brands fa-paypal" /> Paypal
			</h1>
			<span class="text-2xl font-bold text-center block dark:text-white">
				{dolarValue ? (
					formatDolares(
						empresa.state!.enabledClientPayComision
							? paypalComision(ordersCartStoreDto.total, dolarValue)
							: ordersCartStoreDto.total / dolarValue,
					)
				) : (
					<LoaderSubmit />
				)}
			</span>
			{empresa.state?.enabledClientPayComision ? (
				<>
					<p class="text-sm dark:text-white">
						PayPal solo permite transacciones en dólares estadounidenses y
						aplica una comisión del {enviroments.VITE_PAYPAL_COMISION}% más $
						{enviroments.VITE_PAYPAL_TRANSACTION} USD por cada transacción. Por
						esta razón, el precio original se convierte a dólares, y se le añade
						la comisión correspondiente.
					</p>
					<a
						class="text-primary hover:underline text-xs"
						target="_blank"
						rel="noreferrer"
						href="https://www.paypal.com/pe/webapps/mpp/business-support/pricing#:~:text=Comisi%C3%B3n%20por%20transacci%C3%B3n%205.40%20%25%20%2B%20USD,para%20solicitar%20nuestras%20tarifas%20preferenciales."
					>
						Más información
					</a>
				</>
			) : (
				<p class="text-sm dark:text-white">
					PayPal solo permite transacciones en dólares estadounidenses por esta
					razón, el precio original se convierte a dólares.
				</p>
			)}

			<button
				class="bg-primary px-4 py-2 rounded-md text-white block mx-auto mt-4"
				type="button"
				aria-label="pay to paypal"
				onClick={onPaymentPaypal}
				disabled={paypalPaymentMutation.isLoading || false}
			>
				{paypalPaymentMutation.isLoading ? <LoaderSubmit /> : "Realizar pago"}
			</button>
		</div>
	);
}
interface StripePaymentProps {
	ordersCartStoreDto: OrdersCartStoreDto;
	onClose: () => void;
}
function StripePayment({ onClose, ordersCartStoreDto }: StripePaymentProps) {
	const empresa = useEmpresastore();
	const transferenciaForm = useForm<OrdersCartStoreDto>({
		resolver: valibotVigilio(ordersStoreDto),
		defaultValues: {
			...ordersCartStoreDto,
			pay_method_id: PAYMETHOD.tarjeta,
			status_order_id: STATUSORDER.pendiente,
		},
	});
	const stripeMutation = stripeOrderApi();

	function onPaymentPaypal() {
		stripeMutation.mutate(
			{ ...ordersCartStoreDto, pay_method_id: PAYMETHOD.tarjeta },
			{
				onSuccess(data) {
					window.location.href = data.url;
					onClose();
				},
				onError(error) {
					handlerError(transferenciaForm, error);
				},
			},
		);
	}

	return (
		<div>
			<h1 class="text-xl font-bold text-center py-3 dark:text-white ">
				<i class="fa-brands fa-paypal" /> STRIPE
			</h1>
			<span class="text-2xl font-bold text-center block dark:text-white">
				{formatMoney(ordersCartStoreDto.total)}
			</span>
			{empresa.state?.enabledClientPayComision ? (
				<>
					<p class="text-sm dark:text-white">
						+ Comision Stripe {enviroments.VITE_PAYPAL_COMISION}% +
						{formatMoney(enviroments.VITE_PAYPAL_TRANSACTION)}
					</p>
					<a
						class="text-primary hover:underline text-xs"
						target="_blank"
						rel="noreferrer"
						href="https://stripe.com/es/pricing"
					>
						Más información
					</a>
				</>
			) : null}

			<button
				class="bg-primary px-4 py-2 rounded-md text-white block mx-auto mt-4"
				type="button"
				aria-label="pay to paypal"
				onClick={onPaymentPaypal}
				disabled={stripeMutation.isLoading || false}
			>
				{stripeMutation.isLoading ? <LoaderSubmit /> : "Realizar pago"}
			</button>
		</div>
	);
}
export default Niubiz;
