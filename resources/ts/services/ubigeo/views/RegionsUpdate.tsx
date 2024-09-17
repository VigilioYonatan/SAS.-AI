import useAuthStore from "@/auth/stores/auth.store";
import { valibotVigilio } from "~/libs/valibot";

import { useForm } from "react-hook-form";
import Form from "~/components/form";
import View404 from "@/admin/views/404";
import Loading from "@/admin/components/Loading";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import { formatMoney, subtotal } from "@/cart/libs/helpers";
import useEmpresastore from "@/empresas/stores/empresa.store";
import { regionsShowApi } from "../apis/regions.show.api";
import { regionsUpdateDto, RegionsUpdateDto } from "../dtos/regions.update.dto";
import { regionsUpdateApi } from "../apis/regions.update.api";

interface RegionsUpdateProps {
	refetch: (clean?: boolean) => void;
	id: string;
	onClose: () => void;
}

function RegionsUpdate({ id, refetch, onClose }: RegionsUpdateProps) {
	const { guards } = useAuthStore();
	if (!guards.permissionAdminGuard()) {
		window.history.back();
		return null;
	}
	const regionsQuery = regionsShowApi(id);

	let component: JSX.Element | JSX.Element[] | null = null;

	if (regionsQuery.isLoading) {
		component = <Loading />;
	}
	if (regionsQuery.isError) {
		component = <View404 message={`No se encontró una region: ${id}`} />;
	}
	if (regionsQuery.isSuccess) {
		const region = regionsQuery.data!.data;

		const regionsUpdateDtoForm = useForm<RegionsUpdateDto>({
			resolver: valibotVigilio(regionsUpdateDto),
			mode: "all",
			defaultValues: {
				days: region.days,
				enabled: region.enabled,
				priceShipping: region.priceShipping,
				name: region.name,
				code: region.code,
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} as any,
		});

		const regionsUpdateMutation = regionsUpdateApi(id);
		const price = regionsUpdateDtoForm.watch("priceShipping");
		const empresa = useEmpresastore();
		function onUpdateSupplier(body: RegionsUpdateDto) {
			sweetModal({
				title: `¿Estás seguro de editar el region ${region.name}?`,
				customIcon:
					"<i class='far fa-person-dolly dark:text-white text-3xl' ></i>",
				showCancelButton: true,
				showCloseButton: true,
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					regionsUpdateMutation.mutate(body, {
						onSuccess() {
							sweetAlert({
								icon: "success",
								title: `Se realizó los cambios correctamente ${region.name}`,
							});
							refetch(false);
							onClose();
						},
						onError(error) {
							handlerError(regionsUpdateDtoForm, error);
						},
					});
				}
			});
		}

		component = (
			<div class="text-start  mt-6">
				<Form {...regionsUpdateDtoForm} onSubmit={onUpdateSupplier}>
					<div class="flex justify-between items-center flex-wrap">
						<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 items-center">
							<i class="far fa-person-dolly" />
							Editar Región Envio {region.name}
						</h3>
						<Form.button.reset />
					</div>

					<div class="flex flex-col md:flex-row gap-2 items-center">
						<Form.control
							title="Departamento"
							name={"name" as keyof RegionsUpdateDto}
							disabled
						/>
						<div class="flex gap-2 items-center w-full">
							<Form.control
								type="number"
								title="Precio de envio"
								name={"priceShipping" as keyof RegionsUpdateDto}
								placeholder="0"
								options={{ setValueAs: Number }}
							/>
							{empresa.state!.enabled_igv ? (
								<span class="dark:text-white text-xs">
									inc. +{empresa.state!.igv}%{" "}
									{formatMoney(subtotal(price, empresa.state!.igv, true))}{" "}
									{empresa.state!.tipo_impuesto}
								</span>
							) : null}
						</div>
					</div>
					<div class="flex flex-col md:flex-row gap-2 items-center">
						<Form.control
							title="Codigo"
							name={"code" as keyof RegionsUpdateDto}
							disabled
						/>
						<Form.control
							title="Dias de envio"
							name={"days" as keyof RegionsUpdateDto}
							type="number"
							options={{ setValueAs: Number }}
							question="Dias de envio que enviarás el producto a tu cliente de esta region"
						/>
						<Form.control.toggle
							title="Disponible"
							name={"enabled" as keyof RegionsUpdateDto}
							question="Disponible enviar ordenes para esta región?"
						/>
					</div>
					<div class="flex justify-center">
						<Form.button.submit
							ico={null}
							disabled={regionsUpdateMutation.isLoading || false}
							isLoading={regionsUpdateMutation.isLoading || false}
							title="Actualizar"
						/>
					</div>
				</Form>
			</div>
		);
	}
	return component;
}

export default RegionsUpdate;
