import Form from "~/components/form";
import {
	type SuppliersStoreDto,
	suppliersStoreDto,
} from "../dtos/suppliers.store.dto";
import { useForm } from "react-hook-form";
import { suppliersStoreApi } from "../apis/suppliers.store.api";
import useAuthstore from "@/auth/stores/auth.store";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import { rucApi } from "@/orders/apis/others/ruc.api";
import { useEffect } from "preact/hooks";
import { isValidRUC } from "@/orders/libs";
import LoaderSubmit from "~/components/LoaderSubmit";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface SupplierstoreProps {
	refetch: (clean: boolean) => void;
}
function SuppliersStore({ refetch }: SupplierstoreProps) {
	const { guards } = useAuthstore();
	if (!guards.permissionAdminGuard()) {
		window.history.back();
		return null;
	}
	const rucMutation = rucApi();
	const suppliersStoreDtoForm = useForm<SuppliersStoreDto>({
		resolver: valibotVigilio(suppliersStoreDto),
		mode: "all",
		defaultValues: {
			empresa_id: storageEmpresa!.id,
		},
	});
	const suppliersStoreMutation = suppliersStoreApi();

	const ruc = suppliersStoreDtoForm.watch("ruc");

	function onAddSupplier(body: SuppliersStoreDto) {
		sweetModal({
			title: "¿Estás seguro de agregar un proveedor?",
			customIcon:
				"<i class='far fa-person-dolly text-3xl dark:text-white' ></i>",
			showCancelButton: true,
			showCloseButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				suppliersStoreMutation.mutate(body, {
					onSuccess(data) {
						sweetAlert({
							icon: "success",
							title: `se agregó proveedor ${data.supplier.razon_social} correctamente`,
						});
						refetch(false);
						suppliersStoreDtoForm.reset();
					},
					onError(error) {
						handlerError(suppliersStoreDtoForm, error);
					},
				});
			}
		});
	}

	useEffect(() => {
		if (ruc) {
			if (isValidRUC.test(ruc)) {
				rucMutation.mutate(ruc, {
					onSuccess(data) {
						suppliersStoreDtoForm.setValue(
							"razon_social",
							data.result.razon_social,
						);
						suppliersStoreDtoForm.clearErrors("razon_social");
					},
					onError() {
						suppliersStoreDtoForm.setError(
							"ruc",
							{ message: "Ruc no válido" },
							{ shouldFocus: true },
						);
						suppliersStoreDtoForm.setValue("razon_social", "");
					},
				});
			} else {
				suppliersStoreDtoForm.setValue("razon_social", "");
			}
		}
	}, [ruc]);

	return (
		<div class="text-start">
			<Form {...suppliersStoreDtoForm} onSubmit={onAddSupplier}>
				<div class="flex justify-between items-center">
					<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 items-center">
						<i class="far fa-person-dolly" />
						Agregar Proveedor
					</h3>
					<Form.button.reset />
				</div>

				<div class="flex flex-col md:flex-row gap-2 items-center">
					<Form.control
						title="Ruc"
						name={"ruc" as keyof SuppliersStoreDto}
						placeholder="(10|20)XXXXXXXXXX"
						disabled={rucMutation.isLoading || false}
					/>
					<div class="flex items-center gap-2 w-full">
						<Form.control
							type="tel"
							title="Razon Social"
							name={"razon_social" as keyof SuppliersStoreDto}
							placeholder="XXXXXXX S.A"
							disabled={rucMutation.isLoading || false}
						/>
						{rucMutation.isLoading ? (
							<div class="mt-2">
								<LoaderSubmit />
							</div>
						) : null}
					</div>
				</div>
				<div class="flex  flex-col md:flex-row gap-2 items-center">
					<Form.control
						title="Actividad"
						name={"activity" as keyof SuppliersStoreDto}
						placeholder="*Venta de Computadoras"
					/>
					<Form.control
						title="Web"
						name={"web" as keyof SuppliersStoreDto}
						question="Este campo no es obligatorio"
						placeholder="*https://www.proveedor.com"
					/>
				</div>
				<div class="flex  flex-col md:flex-row gap-2 items-center">
					<Form.control
						type="tel"
						title="Télefono"
						name={"contact" as keyof SuppliersStoreDto}
						placeholder="(01)XXXXXXXXXX"
						question="Este campo no es obligatorio"
					/>
					<Form.control
						type="tel"
						title="Celular"
						name={"phone_one" as keyof SuppliersStoreDto}
						placeholder="9XXXXXXXX"
						ico={<span>+{storageEmpresa?.dial_code}</span>}
					/>
					<Form.control
						type="tel"
						title="Celular 2"
						name={"phone_two" as keyof SuppliersStoreDto}
						question="Este campo no es obligatorio"
						ico={<span>+{storageEmpresa?.dial_code}</span>}
						placeholder="9XXXXXXXX"
					/>
				</div>
				<div class="flex  flex-col md:flex-row gap-2 items-center">
					<Form.control
						title="Correo Electrónico"
						name={"email" as keyof SuppliersStoreDto}
						placeholder="Correo electrónico @"
					/>
					<Form.control
						title="Correo Electrónico 2"
						name={"email2" as keyof SuppliersStoreDto}
						question="Este campo no es obligatorio"
						placeholder="Correo electrónico @"
					/>
					<Form.control
						title="Dirección"
						name={"address" as keyof SuppliersStoreDto}
						placeholder="Dirección"
					/>
				</div>
				<Form.control.file
					name={"logo" as keyof SuppliersStoreDto}
					accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
					title="Logo"
					typeFile="image"
				/>
				<div class="flex justify-center">
					<Form.button.submit
						ico={null}
						disabled={suppliersStoreMutation.isLoading || false}
						isLoading={suppliersStoreMutation.isLoading || false}
						title="Guardar"
					/>
				</div>
			</Form>
		</div>
	);
}

export default SuppliersStore;
