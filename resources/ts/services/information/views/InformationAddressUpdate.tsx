import Form from "~/components/form";
import { informationAddressUpdateApi } from "../apis/information.address.update.api";
import { useForm } from "react-hook-form";
import useInformationstore from "../stores/information.store";
import { useMemo, useEffect } from "preact/hooks";
import {
	informationAddressUpdateDto,
	type InformationAddressUpdateDto,
} from "../dtos/information.address.update.dto";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import { valibotVigilio } from "~/libs/valibot";
import { citiesIndexApi } from "@/ubigeo/apis/citites.api.index";

function InformationAddressUpdate() {
	const information = useInformationstore();
	const informationAddressUpdateMutation = informationAddressUpdateApi();
	const citysIndexQuery = citiesIndexApi();

	const informationAddressUpdateForm = useForm<
		InformationAddressUpdateDto & {
			region: string;
			ubigeo: string;
		}
	>({
		defaultValues: {
			...information.state!.address,
			region: information.state!.address.city.region.name,
			ubigeo: information.state!.address.city.code,
		},
		resolver: valibotVigilio(informationAddressUpdateDto),
	});
	const city_id = informationAddressUpdateForm.watch("city_id");
	const citysSelect = useMemo(() => {
		if (citysIndexQuery.isSuccess && citysIndexQuery.data) {
			return citysIndexQuery.data.data.map((value) => ({
				key: value.id,
				value: `${value.region.name} - ${value.name}`,
			}));
		}
		return [];
	}, [citysIndexQuery.data, citysIndexQuery.isSuccess]);
	function onInformationAddressUpdate(
		data: InformationAddressUpdateDto & {
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
				informationAddressUpdateMutation.mutate(rest, {
					onSuccess(data) {
						sweetAlert({ icon: "success", title: data.message });
						window.location.reload();
					},
					onError(error) {
						handlerError(informationAddressUpdateForm, error);
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
				informationAddressUpdateForm.setValue("region", distrito.region.name);

				informationAddressUpdateForm.setValue("ubigeo", distrito.code);
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
				<Form
					{...informationAddressUpdateForm}
					onSubmit={onInformationAddressUpdate}
				>
					<div class="w-full relative">
						<Form.control.selectInput
							title="Ciudad"
							array={citysSelect}
							placeholder="Escriba su ciudad"
							name={"city_id" as keyof InformationAddressUpdateDto}
							isLoading={citysIndexQuery.isLoading || false}
						/>{" "}
						<Form.control
							title="Region"
							placeholder="XXXXXX"
							name={"region" as keyof InformationAddressUpdateDto}
							disabled
						/>
					</div>
					<div class="flex gap-2 w-full">
						<Form.control
							title="Urbanización"
							placeholder=" XXXX XXX"
							name={"urbanizacion" as keyof InformationAddressUpdateDto}
						/>
						<Form.control
							title="Ubigeo"
							placeholder="XXXXXX"
							name={"ubigeo" as keyof InformationAddressUpdateDto}
							disabled
						/>
					</div>

					<Form.control
						title="Direccion"
						placeholder="XXXXXX"
						name={"direccion" as keyof InformationAddressUpdateDto}
					/>
					<Form.control
						title="Codigo de Local"
						placeholder="XXXXXX"
						name={"codLocal" as keyof InformationAddressUpdateDto}
						question="ejm: 0000"
					/>
					<Form.button.submit
						title="Actualizar"
						ico={null}
						disabled={informationAddressUpdateMutation.isLoading || false}
						isLoading={informationAddressUpdateMutation.isLoading || false}
					/>
				</Form>
			</div>
		</Container>
	);
}

export default InformationAddressUpdate;
