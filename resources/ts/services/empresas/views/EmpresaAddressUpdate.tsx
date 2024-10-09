import Form from "~/components/form";
import { EmpresaAddressUpdateApi } from "../apis/empresas.address.update.api";
import { useForm } from "react-hook-form";
import { useMemo, useEffect } from "preact/hooks";
import {
	empresaAddressUpdateDto,
	EmpresaAddressUpdateDto,
} from "../dtos/empresas.address.update.dto";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import { valibotVigilio } from "~/libs/valibot";
import { citiesIndexApi } from "@/ubigeo/apis/citites.api.index";
import { storageEmpresa } from "../stores/empresa.store";
import useAuthStore from "@/auth/stores/auth.store";

function EmpresaAddressUpdate() {
	const authStore = useAuthStore();
	if (!authStore.guards.permissionAdminGuard()) {
		window.history.back();
		return null;
	}
	const EmpresaAddressUpdateMutation = EmpresaAddressUpdateApi();
	const citysIndexQuery = citiesIndexApi();

	const EmpresaAddressUpdateForm = useForm<
		EmpresaAddressUpdateDto & {
			region: string;
			ubigeo: string;
		}
	>({
		defaultValues: {
			...storageEmpresa!.address,
			region: storageEmpresa!.address.city.region.name,
			ubigeo: storageEmpresa!.address.city.code,
		},
		resolver: valibotVigilio(empresaAddressUpdateDto),
	});
	const city_id = EmpresaAddressUpdateForm.watch("city_id");

	const citysSelect = useMemo(() => {
		if (citysIndexQuery.isSuccess && citysIndexQuery.data) {
			return citysIndexQuery.data.data.map((value) => ({
				key: value.id,
				value: `${value.region.name} - ${value.name}`,
			}));
		}
		return [];
	}, [citysIndexQuery.data, citysIndexQuery.isSuccess]);
	function onEmpresaAddressUpdate(
		data: EmpresaAddressUpdateDto & {
			region: string;
			ubigeo: string;
		},
	) {
		const { ubigeo, region, ...rest } = data;
		sweetModal({
			title: "¿Estás seguro de editar la dirección?",
			showCancelButton: true,
			showCloseButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				EmpresaAddressUpdateMutation.mutate(rest, {
					onSuccess(data) {
						sweetAlert({ icon: "success", title: data.message });
						// window.location.reload();
					},
					onError(error) {
						handlerError(EmpresaAddressUpdateForm, error);
					},
				});
			}
		});
	}

	useEffect(() => {
		if (city_id) {
			const distrito = citysIndexQuery.data?.data.find(
				(dis) => dis.id === city_id,
			);
			if (distrito) {
				EmpresaAddressUpdateForm.setValue("region", distrito.region.name);

				EmpresaAddressUpdateForm.setValue("ubigeo", distrito.code);
			}
		}
	}, [city_id]);
	return (
		<Container className="p-2">
			<div className="flex flex-col gap-4 mx-1 ">
				<AdminBreadCrumb current="dirección" />
			</div>
			<div class="p-2">
				<h3 class="dark:text-white lg:text-2xl  font-bold uppercase text-center flex gap-2  w-full mb-4">
					<i class="fas fa-map" />
					Dirección de la empresa
				</h3>
				<Form {...EmpresaAddressUpdateForm} onSubmit={onEmpresaAddressUpdate}>
					<div class="w-full relative">
						<Form.control.selectInput
							title="Ciudad"
							array={citysSelect}
							placeholder="Escriba su ciudad"
							name={"city_id" as keyof EmpresaAddressUpdateDto}
							isLoading={citysIndexQuery.isLoading || false}
						/>{" "}
						<Form.control
							title="Region"
							placeholder=""
							name={"region" as keyof EmpresaAddressUpdateDto}
							disabled
						/>
					</div>
					<div class="flex gap-2 w-full">
						<Form.control
							title="Urbanización"
							placeholder=""
							name={"urbanizacion" as keyof EmpresaAddressUpdateDto}
						/>
						<Form.control
							title="Ubigeo"
							placeholder=""
							name={"ubigeo" as keyof EmpresaAddressUpdateDto}
							disabled
						/>
					</div>

					<Form.control
						title="Direccion"
						placeholder=""
						name={"direccion" as keyof EmpresaAddressUpdateDto}
					/>
					<Form.control
						title="Codigo de Local"
						placeholder=""
						name={"codLocal" as keyof EmpresaAddressUpdateDto}
						question="ejm: 0000"
					/>
					<Form.button.submit
						title="Actualizar"
						ico={null}
						disabled={EmpresaAddressUpdateMutation.isLoading || false}
						isLoading={EmpresaAddressUpdateMutation.isLoading || false}
					/>
				</Form>
			</div>
		</Container>
	);
}

export default EmpresaAddressUpdate;
