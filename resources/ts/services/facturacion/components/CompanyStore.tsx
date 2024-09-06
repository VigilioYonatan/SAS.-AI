import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import Form from "~/components/form";
import useInformationstore from "@/information/stores/information.store";
import {
	informationFacturacionCertificadoUpdateApi,
	informationFacturacionUpdateApi,
} from "@/information/apis/information.facturacion.update.api";
import {
	type InformationFacturacionCertificadoUpdateDto,
	informationFacturacionCertificadoUpdateDto,
} from "../../information/dtos/information.facturacion.update.dto";
import {
	informationFacturacionUpdateDto,
	type InformationFacturacionUpdateDto,
} from "@/information/dtos/information.facturacion.update.dto";
import AdminHr from "~/components/AdminHr";
import { getFilesEdit } from "~/libs/upload";
import { useEffect } from "preact/hooks";
import { handlerError } from "~/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import View404 from "@/admin/views/404";
import { informationPrivateApi } from "@/information/apis/information.private.api";
import Loading from "@/admin/components/Loading";
import AlertInfo from "~/components/Alerts/AlertInfo";

interface CompaniesStoreProps {
	onClose?: () => void;
}
function CompaniesStore({ onClose }: CompaniesStoreProps) {
	const informationQuery = informationPrivateApi();
	let component: JSX.Element | JSX.Element[] | null = null;
	if (informationQuery.isLoading) {
		component = <Loading />;
	}
	if (informationQuery.isError) {
		component = <View404 message={informationQuery.error?.message} />;
	}
	if (informationQuery.isSuccess) {
		const information = informationQuery.data!.information!;

		const informationFacturacionUpdateMutation =
			informationFacturacionUpdateApi();
		const informationFacturacionCertificadoUpdateMutation =
			informationFacturacionCertificadoUpdateApi();
		const informationStore = useInformationstore();
		const informationFacturacionUpdateForm =
			useForm<InformationFacturacionUpdateDto>({
				resolver: valibotVigilio(informationFacturacionUpdateDto),
				defaultValues: information.company,
			});
		const informationFacturacionCertificadoUpdateForm =
			useForm<InformationFacturacionCertificadoUpdateDto>({
				resolver: valibotVigilio(informationFacturacionCertificadoUpdateDto),
			});

		function onInformationFacturacionUpdate(
			data: InformationFacturacionUpdateDto,
		) {
			sweetModal({
				title: "¿Estas seguro de realizar estos cambios?",
				showCancelButton: true,
				showCloseButton: true,
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					informationFacturacionUpdateMutation.mutate(data, {
						onSuccess() {
							if (onClose) {
								sweetAlert({
									icon: "success",
									title: "Se realizaron los cambios correctamente",
								});
								onClose();
							} else {
								sweetAlert({
									icon: "success",
									title: "Se realizaron los cambios correctamente",
								}).then(() => {
									window.location.reload();
								});
							}
						},
						onError(error) {
							sweetAlert({
								icon: "success",
								title: "Se realizaron los cambios correctamente",
							}).then(() => {
								handlerError(informationFacturacionUpdateForm, error);
							});
						},
					});
				}
			});
		}
		function onInformationFacturacionCertificadoUpdate(
			body: InformationFacturacionCertificadoUpdateDto,
		) {
			sweetModal({
				title: "¿Estas seguro de realizar estos cambios?",
				showCancelButton: true,
				showCloseButton: true,
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					informationFacturacionCertificadoUpdateMutation.mutate(body, {
						onSuccess(data) {
							if (onClose) {
								sweetAlert({
									icon: "success",
									title: "Se realizaron los cambios correctamente",
								});
								onClose();
							} else {
								sweetAlert({
									icon: "success",
									title: "Se realizaron los cambios correctamente",
								});
							}
							informationStore.methods.updateInformation({
								certificado: data.files,
							});
						},
						onError(error) {
							handlerError(informationFacturacionUpdateForm, error);
						},
					});
				}
			});
		}
		async function onInitial() {
			if (information.certificado) {
				const file = await getFilesEdit(
					information.certificado,
					null,
					"text/html",
				);
				informationFacturacionCertificadoUpdateForm.setValue(
					"certificado",
					file,
				);
			}
		}
		useEffect(() => {
			onInitial();
		}, []);
		component = (
			<div class="p-4 ">
				<div class="flex justify-between items-center">
					<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
						<i class="fa-solid fa-file-certificate" />
						Informacion
					</h3>
				</div>
				<Form
					{...informationFacturacionUpdateForm}
					onSubmit={onInformationFacturacionUpdate}
				>
					<AlertInfo>
						<div class="font-semibold">
							Obtener <b> certificado digital</b> como contraseña de certificado
							totalmente gratis.{" "}
							<a
								href="https://www.youtube.com/watch?v=8Ouj8edT0Hc"
								target="blank"
								class="dark:text-white font-bold hover:underline"
							>
								Ver video
							</a>
							<br />
							Si no funciona esta opción recomendable obtenerlo en SUNAT o
							buscar un proveedor.
							<br />
							<b>Importante:</b> Recuerda actualizar su certificado Digital
							cierto tiempo.
						</div>
					</AlertInfo>
					<div class="flex gap-2 items-center">
						<Form.control
							title="Nombre Comercial"
							name={"nombreComercial" as keyof InformationFacturacionUpdateDto}
							question="Nombre de tu empresa"
							placeholder="XXXXXXXXX"
						/>
						<Form.control
							title="RazonSocial"
							name={"razonSocial" as keyof InformationFacturacionUpdateDto}
							placeholder="EMPRESA S.A.C"
						/>
					</div>
					<div class="flex gap-2 items-center">
						<Form.control
							title="Ruc"
							name={"ruc" as keyof InformationFacturacionUpdateDto}
							placeholder="XXXXXXXXX"
						/>
						<Form.control
							title="Contraseña de certificado digital"
							type="password"
							name={
								"certificado_password" as keyof InformationFacturacionUpdateDto
							}
							placeholder="XXXXXXXXX"
						/>
					</div>
					<AlertInfo>
						<div class="font-semibold">
							Para obtener cuenta sol para emitir boletas , facturas, notas,
							etc.{" "}
							<a
								href="https://youtu.be/_bBRw7-IgO0"
								target="blank"
								class="dark:text-white font-bold hover:underline"
							>
								Ver video
							</a>
						</div>
					</AlertInfo>
					<div class="flex gap-2 items-center">
						<Form.control
							title="Sol Usuario"
							name={"sol_user" as keyof InformationFacturacionUpdateDto}
							placeholder="XXXXXXXXX"
						/>
						<Form.control
							title="Sol Password"
							name={"sol_pass" as keyof InformationFacturacionUpdateDto}
							placeholder="XXXXXXXXX"
							type="password"
						/>
					</div>
					<br />
					<AlertInfo>
						<div class="font-semibold">
							Para obtener credenciales para guias de remisión, Si tu negocio o
							empresa lo requiere.{" "}
							<a
								href="https://www.youtube.com/watch?v=vDdtqwJITT4"
								target="blank"
								class="dark:text-white font-bold hover:underline"
							>
								Ver video
							</a>
						</div>
					</AlertInfo>
					<div class="flex gap-2 items-center">
						<Form.control
							title="Cliente id"
							name={"client_id" as keyof InformationFacturacionUpdateDto}
							placeholder="XXXXXXXXX"
						/>
						<Form.control
							title="Cliente secreto"
							name={"client_secret" as keyof InformationFacturacionUpdateDto}
							type="password"
							placeholder="XXXXXXXXX"
						/>
					</div>
					<Form.control.toggle
						title="Habilitar"
						name={"production" as keyof InformationFacturacionUpdateDto}
						question={
							<div class="w-[130px]">
								Si está habilitado se emitirá en los servidores de sunat. Si
								está desabilitado no se enviará en los servidores de sunat, será
								modo de prueba
							</div>
						}
					/>
					<Form.button.submit
						disabled={informationFacturacionUpdateMutation.isLoading || false}
						isLoading={informationFacturacionUpdateMutation.isLoading || false}
						title="Guardar"
						ico={null}
					/>
				</Form>
				<AdminHr />
				<div class="flex justify-between items-center">
					<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
						<i class="fa-solid fa-file-certificate" />
						Certificado digital
					</h3>
				</div>
				<Form
					{...informationFacturacionCertificadoUpdateForm}
					onSubmit={onInformationFacturacionCertificadoUpdate}
				>
					<Form.control.file
						title="Certificado Digital (.pfx, .p12, .pem)"
						name={
							"certificado" as keyof InformationFacturacionCertificadoUpdateDto
						}
						typeFile="file"
						accept=".pem,.pfx,.p12"
					/>
					<Form.button.submit
						disabled={
							informationFacturacionCertificadoUpdateMutation.isLoading || false
						}
						isLoading={
							informationFacturacionCertificadoUpdateMutation.isLoading || false
						}
						title="Guardar"
						ico={null}
					/>
				</Form>
			</div>
		);
	}
	return component;
}

export default CompaniesStore;
