import Form from "~/components/form";
import { informationAddressUpdateApi } from "../apis/information.address.update.api";
import { useForm } from "react-hook-form";
import useInformationstore from "../stores/information.store";
import { useMemo, useEffect } from "preact/hooks";
import { districtsIndexApi } from "@/ubigeo/apis/districts.api.index";
import {
	informationAddressUpdateDto,
	type InformationAddressUpdateDto,
} from "../dtos/information.address.update.dto";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import { valibotVigilio } from "~/libs/valibot";

function InformationAddressUpdate() {
	const information = useInformationstore();
	const informationAddressUpdateMutation = informationAddressUpdateApi();
	const districtsIndexQuery = districtsIndexApi();

	const informationAddressUpdateForm = useForm<
		InformationAddressUpdateDto & {
			department: string;
			province: string;
			ubigeo: string;
		}
	>({
		defaultValues: {
			...information.state!.address,
			department: information.state!.address.district.province.department.name,
			province: information.state!.address.district.province.name,
			ubigeo: information.state!.address.district_id,
		},
		resolver: valibotVigilio(informationAddressUpdateDto),
	});
	const district_id = informationAddressUpdateForm.watch("district_id");
	const districtsSelect = useMemo(() => {
		if (districtsIndexQuery.isSuccess && districtsIndexQuery.data) {
			return districtsIndexQuery.data.data.map((value) => ({
				key: value.ubigeo,
				value: `${value.name} - ${value.province.name} - ${value.province.department.name}`,
			}));
		}
		return [];
	}, [districtsIndexQuery.data, districtsIndexQuery.isSuccess]);
	function onInformationAddressUpdate(
		data: InformationAddressUpdateDto & {
			department: string;
			province: string;
			ubigeo: string;
		},
	) {
		const { department, province, ubigeo, ...rest } = data;
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
		if (district_id) {
			const distrito = districtsIndexQuery.data?.data.find(
				(dis) => dis.ubigeo === district_id,
			);
			if (distrito) {
				informationAddressUpdateForm.setValue(
					"department",
					distrito.province.department.name,
				);
				informationAddressUpdateForm.setValue(
					"province",
					distrito.province.name,
				);
				informationAddressUpdateForm.setValue("ubigeo", district_id);
			}
		}
	}, [district_id]);
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
							title="Distrito"
							array={districtsSelect}
							placeholder="Escriba su distrito"
							name={"district_id" as keyof InformationAddressUpdateDto}
							isLoading={districtsIndexQuery.isLoading || false}
						/>
					</div>

					<div class="flex gap-2 w-full">
						<Form.control
							title="Departamento"
							placeholder="XXXXXX"
							name={"department" as keyof InformationAddressUpdateDto}
							disabled
						/>
						<Form.control
							title="Provincia"
							placeholder="XXXXXX"
							name={"province" as keyof InformationAddressUpdateDto}
							disabled
						/>
					</div>

					<div class="flex gap-2 w-full">
						<Form.control
							title="Urbanización"
							placeholder="MZ XXXX XXX"
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
