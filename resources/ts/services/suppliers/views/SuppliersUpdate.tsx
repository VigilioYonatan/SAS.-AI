import Form from "~/components/form";
import { useForm } from "react-hook-form";
import useAuthstore from "@/auth/stores/auth.store";
import { valibotVigilio } from "~/libs/valibot";
import { useEffect, useMemo } from "preact/hooks";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import { suppliersShowApi } from "../apis/suppliers.show.api";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import {
	suppliersLogoUpdateDto,
	suppliersUpdateDto,
	type SuppliersLogoUpdateDto,
	type SuppliersUpdateDto,
} from "../dtos/suppliers.update.dto";
import {
	suppliersUpdateApi,
	suppliersUpdateLogoApi,
} from "../apis/suppliers.update.api";
import { getFilesEdit } from "~/libs/upload";
import AdminHr from "~/components/AdminHr";
import { storageInformation } from "@/information/stores/information.store";

interface SupplierUpdateProps {
	id: number;
	onClose: () => void;
	refetch: (clean?: boolean) => void;
}
function SuppliersUpdate({ id, refetch, onClose }: SupplierUpdateProps) {
	const { guards } = useAuthstore();
	if (!guards.permissionAdminGuard()) {
		window.history.back();
		return null;
	}
	const suppliersQuery = suppliersShowApi(id);

	let component: JSX.Element | JSX.Element[] | null = null;

	if (suppliersQuery.isLoading) {
		component = <Loading />;
	}
	if (suppliersQuery.isError) {
		component = <View404 message={`No se encontró un proveedor: ${id}`} />;
	}
	if (suppliersQuery.isSuccess) {
		const supplier = suppliersQuery.data!.supplier;
		const suppliersUpdateDtoForm = useForm<SuppliersUpdateDto>({
			resolver: valibotVigilio(suppliersUpdateDto),
			mode: "all",
			defaultValues: useMemo(() => {
				const { createdAt, updatedAt, id, logo, ...rest } = supplier;
				return {
					...rest,
				};
			}, []),
		});
		const formSuppliersUpdateLogo = useForm<SuppliersLogoUpdateDto>({
			mode: "all",
			resolver: valibotVigilio(suppliersLogoUpdateDto),
		});

		const suppliersUpdateMutation = suppliersUpdateApi(id);
		const suppliersUpdateLogoMutation = suppliersUpdateLogoApi(supplier.id);

		function onUpdateSupplier(data: SuppliersUpdateDto) {
			sweetModal({
				title: `¿Estás seguro de editar el proveedor ${supplier.razon_social}?`,
				customIcon:
					"<i class='far fa-person-dolly dark:text-white text-3xl' ></i>",
				showCancelButton: true,
				showCloseButton: true,
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					suppliersUpdateMutation.mutate(data, {
						onSuccess(data) {
							sweetAlert({
								icon: "success",
								title: `Se realizó los cambios correctamente ${data.supplier.razon_social}`,
							});
							refetch(false);
							onClose();
						},
						onError(error) {
							handlerError(suppliersUpdateDtoForm, error);
						},
					});
				}
			});
		}
		const onUpdateLogoSupplier = (data: SuppliersLogoUpdateDto) => {
			sweetModal({
				title: "¿Estás seguro de editar la logo del proveedor?",
				customIcon:
					"<i class='far fa-person-dolly dark:text-white text-3xl' ></i>",
				showCancelButton: true,
				showCloseButton: true,
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					suppliersUpdateLogoMutation.mutate(
						{ ...data, razon_social: supplier.razon_social },
						{
							onSuccess() {
								sweetAlert({
									icon: "success",
									title: "Se actualizó logo correctamente",
								});
								refetch(false);
							},
							onError(error) {
								handlerError(formSuppliersUpdateLogo, error);
							},
						},
					);
				}
			});
		};
		async function initialUpdateLogo() {
			if (supplier.logo) {
				const logo = await getFilesEdit(supplier.logo, 300);
				formSuppliersUpdateLogo.setValue("logo", logo);
			}
		}

		useEffect(() => {
			initialUpdateLogo();
		}, []);

		component = (
			<div class="text-start  mt-6">
				<Form {...suppliersUpdateDtoForm} onSubmit={onUpdateSupplier}>
					<div class="flex justify-between items-center">
						<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 items-center">
							<i class="far fa-person-dolly" />
							Editar Proveedor
						</h3>
						<Form.button.reset />
					</div>

					<div class="flex flex-col md:flex-row gap-2 items-center">
						<Form.control
							title="Ruc"
							name={"ruc" as keyof SuppliersUpdateDto}
							placeholder="(10|20)XXXXXXXXXX"
							disabled
						/>
						<Form.control
							type="tel"
							title="Razon Social"
							name={"razon_social" as keyof SuppliersUpdateDto}
							placeholder="XXXXXXX S.A"
							disabled
						/>
					</div>
					<div class="flex  flex-col md:flex-row gap-2 items-center">
						<Form.control
							title="Actividad"
							name={"activity" as keyof SuppliersUpdateDto}
							placeholder="*Venta de Computadoras"
						/>
						<Form.control
							title="Web"
							name={"web" as keyof SuppliersUpdateDto}
							question="Este campo no es obligatorio"
							placeholder="*https://www.proveedor.com"
						/>
					</div>
					<div class="flex  flex-col md:flex-row gap-2 items-center">
						<Form.control
							type="tel"
							title="Télefono"
							name={"contact" as keyof SuppliersUpdateDto}
							placeholder="(01)XXXXXXXXXX"
							question="Este campo no es obligatorio"
						/>
						<Form.control
							type="tel"
							title="Celular"
							name={"phone_one" as keyof SuppliersUpdateDto}
							placeholder={`${storageInformation?.dial_code}XXXXXXXX`}
						/>
						<Form.control
							type="tel"
							title="Celular 2"
							name={"phone_two" as keyof SuppliersUpdateDto}
							question="Este campo no es obligatorio"
							placeholder={`${storageInformation?.dial_code}XXXXXXXX`}
						/>
					</div>
					<div class="flex  flex-col md:flex-row gap-2 items-center">
						<Form.control
							title="Correo Electrónico"
							name={"email" as keyof SuppliersUpdateDto}
							placeholder="Correo electrónico @"
						/>
						<Form.control
							title="Correo Electrónico 2"
							name={"email2" as keyof SuppliersUpdateDto}
							question="Este campo no es obligatorio"
							placeholder="Correo electrónico @"
						/>
					</div>

					<div class="flex justify-center">
						<Form.button.submit
							ico={null}
							disabled={suppliersUpdateMutation.isLoading || false}
							isLoading={suppliersUpdateMutation.isLoading || false}
							title="Actualizar"
						/>
					</div>
				</Form>
				<AdminHr />
				<div class="flex justify-between items-center">
					<h3 class="dark:text-white text-lg lg:text-2xl font-bold uppercase text-center flex gap-2">
						<i class="fa-solid fa-image" />
						Editar Logo - {supplier.razon_social}
					</h3>
				</div>
				<Form {...formSuppliersUpdateLogo} onSubmit={onUpdateLogoSupplier}>
					<Form.control.file
						name={"logo" as keyof SuppliersLogoUpdateDto}
						title="Logo de empresa"
						accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
						typeFile="image"
					/>
					<div class="flex justify-center">
						<Form.button.submit
							disabled={suppliersUpdateLogoMutation.isLoading || false}
							isLoading={suppliersUpdateLogoMutation.isLoading || false}
							ico={null}
							title="Editar"
						/>
					</div>
				</Form>
			</div>
		);
	}
	return component;
}

export default SuppliersUpdate;
