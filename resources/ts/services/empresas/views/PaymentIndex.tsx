import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import { metodoIndexApi } from "../apis/metodos_pago/metodos_pago.index.api";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import Form from "~/components/form";
import { useForm } from "react-hook-form";
import {
	empresaQrPlinUpdateDto,
	empresaQrYapeUpdateDto,
	metodosPagoUpdateDto,
	MetodosPagoUpdateDto,
} from "../dtos/metodosPago.update.dto";
import { valibotVigilio } from "~/libs/valibot";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { Fragment } from "preact/jsx-runtime";
import { formatMoney } from "@/cart/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import {
	empresaUpdateQrPlinApi,
	empresaUpdateQrYapeApi,
	metodosUpdateApi,
} from "../apis/metodos_pago/metodos_pago.update.api";
import enviroments from "~/config";
import { handlerError } from "~/libs/helpers";
import Hr from "@/web/components/Hr";
import { useEffect } from "preact/hooks";
import { getFilesEdit } from "~/libs/upload";
import useEmpresastore from "../stores/empresa.store";
import useAuthStore from "@/auth/stores/auth.store";

function PaymentIndex() {
	const authStore = useAuthStore();
	if (!authStore.guards.permissionAdminGuard()) {
		window.history.back();
		return null;
	}
	const metodoIndexQuery = metodoIndexApi();

	let component: JSX.Element | JSX.Element[] | null = null;
	if (metodoIndexQuery.isLoading) {
		component = <Loading />;
	}
	if (metodoIndexQuery.isError) {
		component = <View404 message={"error"} />;
	}
	if (metodoIndexQuery.isSuccess) {
		const empresa = useEmpresastore();
		const metodosUpdateMutate = metodosUpdateApi();
		const empresaUpdateQrYapeMutation = empresaUpdateQrYapeApi();
		const empresaUpdateQrPlinMutation = empresaUpdateQrPlinApi();
		const metodosPagoUpdateForm = useForm<MetodosPagoUpdateDto>({
			resolver: valibotVigilio(metodosPagoUpdateDto),
			mode: "all",
			defaultValues: metodoIndexQuery.data?.metodo,
		});
		const settingsQrYapeUpdateform = useForm<empresaQrYapeUpdateDto>({
			resolver: valibotVigilio(empresaQrYapeUpdateDto),
			mode: "all",
		});
		const settingsQrPlinUpdateform = useForm<empresaQrPlinUpdateDto>({
			resolver: valibotVigilio(empresaQrPlinUpdateDto),
			mode: "all",
		});
		function onUpdate(data: MetodosPagoUpdateDto) {
			sweetModal({
				title: "¿Estas seguro de realizar estos cambios?",
				showCancelButton: true,
				showCloseButton: true,
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					metodosUpdateMutate.mutate(data, {
						onSuccess() {
							sweetAlert({
								title: "Se editó correctamente",
								icon: "success",
							});
						},
						onError(error) {
							sweetAlert({
								title: error.message,
								icon: "danger",
							});
						},
					});
				}
			});
		}
		function onUpdateQrYapeempresa(body: empresaQrYapeUpdateDto) {
			sweetModal({
				title: "¿Estas seguro de cambiar el qr Yape de tu web?",
				showCancelButton: true,
				showCloseButton: true,
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					empresaUpdateQrYapeMutation.mutate(body, {
						onSuccess() {
							sweetAlert({
								icon: "success",
								title: "Actualizado qr correctamente",
							});
						},
						onError(error) {
							handlerError(settingsQrYapeUpdateform, error);
						},
					});
				}
			});
		}
		function onUpdateQrPlinempresa(body: empresaQrPlinUpdateDto) {
			sweetModal({
				title: "¿Estas seguro de cambiar el qr Plin de tu web?",
				showCancelButton: true,
				showCloseButton: true,
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					empresaUpdateQrPlinMutation.mutate(body, {
						onSuccess() {
							sweetAlert({
								icon: "success",
								title: "Actualizado qr correctamente",
							});
						},
						onError(error) {
							handlerError(settingsQrPlinUpdateform, error);
						},
					});
				}
			});
		}
		async function initialUpdateQrYape() {
			if (metodoIndexQuery.data?.metodo.qrYape) {
				const icon = await getFilesEdit(
					metodoIndexQuery.data?.metodo.qrYape,
					500,
				);
				settingsQrYapeUpdateform.setValue("qrYape", icon);
			}
		}
		async function initialUpdateQrPlin() {
			if (metodoIndexQuery.data?.metodo.qrPlin) {
				const icon = await getFilesEdit(
					metodoIndexQuery.data?.metodo.qrPlin,
					500,
				);
				settingsQrPlinUpdateform.setValue("qrPlin", icon);
			}
		}
		useEffect(() => {
			initialUpdateQrYape();
		}, []);
		useEffect(() => {
			initialUpdateQrPlin();
		}, []);
		component = (
			<div class="px-4">
				<AlertInfo>
					<b>
						- Para usar pasarelas de pago de{" "}
						<span class="font-bold">Mercado pago o Paypal</span>, es necesario
						obtener algunos credenciales, ya que los ingresos tienen que ir a
						sus cuentas bancarias.
						<br />- No compartir las credeciales con otras personas o empresas.
						<br />- Por seguridad y privacidad, La empresa{" "}
						<a
							class="font-bold"
							target="_blank"
							rel="noreferrer"
							href={enviroments.VITE_VIGILIO_WEB}
						>
							Vigilio Services
						</a>{" "}
						no le pedirá ninguna información sobre sus cuentas bancarias ni
						otros datos personales.
						<br />
						Recuerda botón <b>"Guardar"</b> para actualizar sus cambios.
					</b>
				</AlertInfo>
				<Form {...metodosPagoUpdateForm} onSubmit={onUpdate}>
					<div>
						<span class="flex gap-2 items-center dark:text-white font-bold">
							<i class="fa-brands fa-cc-visa" />{" "}
							<i class="fa-brands fa-cc-mastercard" />
							Mercado Pago
						</span>
						<br />
						<AlertInfo>
							<span>
								Registrarse en Mercado Pago y obtener tu credenciales
								rápidamente.{" "}
								<a
									class="font-bold underline"
									target="_blank"
									rel="noreferrer"
									href="https://youtu.be/z8x-X4iKYiI"
								>
									Ver video
								</a>
								<br />
								Recuerda Registrate en mercado Pago y obtener tus credenciales
								de producción de Mercado Pago.
							</span>
						</AlertInfo>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-2">
							<Form.control
								title="Mercado Pago Access Token"
								name={"mercado_pago.token" as keyof MetodosPagoUpdateDto}
								type="password"
							/>
							<Form.control.toggle
								title="Activar Mercado Pago"
								name={"mercado_pago.enabled" as keyof MetodosPagoUpdateDto}
							/>
						</div>
					</div>
					<div class="my-4">
						<span class="flex gap-2 items-center dark:text-white  font-bold">
							<i class="fa-brands fa-paypal" />
							Paypal
						</span>
						<br />
						<AlertInfo>
							<span>
								Registrarse en Paypal y obtener tu credenciales en 1 minuto{" "}
								<a
									class="font-bold underline"
									target="_blank"
									rel="noreferrer"
									href="https://www.youtube.com/watch?v=FM0eVMfvn9M"
								>
									Ver video
								</a>
								<br />
								Recuerda Registrate en PayPal y obtener tus credenciales de
								producción de PayPal.
							</span>
						</AlertInfo>
						<div class="grid grid-cols-1 md:grid-cols-3 gap-2">
							<Form.control
								title="Paypal Client ID"
								name={"paypal.paypal_client_id" as keyof MetodosPagoUpdateDto}
								type="password"
							/>
							<Form.control
								title="Paypal Secret Key"
								name={"paypal.paypal_secret_key" as keyof MetodosPagoUpdateDto}
								type="password"
							/>
							<Form.control.toggle
								title="Activar Paypal"
								name={"paypal.enabled" as keyof MetodosPagoUpdateDto}
							/>
						</div>
					</div>
					<div class="my-4">
						<div class="flex justify-between">
							<span class="flex gap-2 items-center dark:text-white font-bold">
								<i class="fa-regular fa-building-columns" /> Transferencias
								Bancarias
							</span>
							<button
								class="text-white w-[20px] h-[20px] text-xs dark:text-black bg-black flex justify-center items-center font-bold rounded-full dark:bg-white"
								type="button"
								aria-label="on show transferencias"
								onClick={() => {
									sweetModal({
										html: reactComponent(
											<div class="dark:text-white flex flex-col gap-2">
												<h1 class="text-xl">Cuentas Bancarias</h1>
												<p class="text-sm">
													Tus clientes podrán pagar por transferencia bancaría,
													te enviaran una imagen del comprobante de pago. y tú
													confirmarás la orden si el pago fue realizado
													correctamente.
												</p>
												<AlertInfo>
													<span>
														Recomendable. Disponible cuentas bancarias sin
														comisiones*
													</span>
												</AlertInfo>
												<AlertInfo>
													<span>
														Si no tienes ninguna cuenta bancaria, no estará
														habilitado el boton de pagar por transferencia.
													</span>
												</AlertInfo>
											</div>,
										),
										showCloseButton: true,
									});
								}}
							>
								?
							</button>
						</div>

						{empresa.state!.bancos.map((bank) => {
							const money = empresa.state!.money;
							return (
								<Fragment key={bank.key}>
									<div class="flex flex-col my-2">
										<span class="font-bold  dark:text-white text-xs">
											{bank.value}
										</span>
										<div class="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
											<Form.control
												ico={
													<span>
														<i class="fa-solid fa-user" />
													</span>
												}
												title="Titular"
												name={
													`transferencias.${bank.key}.titular` as keyof MetodosPagoUpdateDto
												}
											/>
											<Form.control
												title={`Cuenta en ${money.money}`}
												ico={<span>{formatMoney(0)[0]}</span>}
												name={
													`transferencias.${bank.key}.${
														empresa.state!.money.simbolo
													}` as keyof MetodosPagoUpdateDto
												}
											/>
											<Form.control
												title="Cuenta en Dolares"
												name={
													`transferencias.${bank.key}.dolares` as keyof MetodosPagoUpdateDto
												}
												ico={<span>$</span>}
											/>
										</div>
									</div>
									<div class="h-[1px] w-full bg-terciary" />
								</Fragment>
							);
						})}
					</div>
					<div class="my-4">
						<span class="flex gap-2 items-center dark:text-white font-bold">
							Otros
						</span>
						<div>
							<Form.control.toggle
								title="Habilitar Pago efectivo"
								name={"enable_efectivo" as keyof MetodosPagoUpdateDto}
								question="Tus clientes pagarán cuando reciben el producto."
							/>
						</div>
					</div>
					<Form.button.submit
						title="Guardar"
						disabled={metodosUpdateMutate.isLoading || false}
						isLoading={metodosUpdateMutate.isLoading || false}
					/>
				</Form>
				<Hr spacing={13} />
				{empresa.state!.dial_code === "51" ? (
					<div class="flex flex-col md:flex-row gap-4 items-center">
						<Form
							{...settingsQrYapeUpdateform}
							onSubmit={onUpdateQrYapeempresa}
						>
							<Form.control.file
								name={"qrYape" as keyof MetodosPagoUpdateDto}
								title="Qr Yape  - metodo de pago Yape"
								accept="image/*"
								typeFile="image"
							/>
							<Form.button.submit
								disabled={empresaUpdateQrYapeMutation.isLoading || false}
								isLoading={empresaUpdateQrYapeMutation.isLoading || false}
								title="Guardar Cambios"
							/>
						</Form>
						<Form
							{...settingsQrPlinUpdateform}
							onSubmit={onUpdateQrPlinempresa}
						>
							<Form.control.file
								name={"qrPlin" as keyof MetodosPagoUpdateDto}
								title="Qr plin  - metodo de pago Plin"
								accept="image/*"
								typeFile="image"
							/>
							<Form.button.submit
								disabled={empresaUpdateQrPlinMutation.isLoading || false}
								isLoading={empresaUpdateQrPlinMutation.isLoading || false}
								title="Guardar Cambios"
							/>
						</Form>
					</div>
				) : null}
			</div>
		);
	}
	return (
		<Container className="p-2">
			<>
				<div class="flex flex-col gap-4 mx-1 ">
					<AdminBreadCrumb current="Metodo de Pagos" />
				</div>
				{component}
			</>
		</Container>
	);
}

export default PaymentIndex;
