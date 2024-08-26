import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { ruletaIndexApi } from "../apis/ruleta/ruleta.index.api";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Form from "~/components/form";
import {
	ruletaUpdateApi,
	ruletaUpdateImageApi,
} from "../apis/ruleta/ruleta.update.api";

import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { getFilesEdit } from "~/libs/upload";
import { useEffect } from "preact/hooks";
import {
	ruletaUpdateDto,
	ruletaUpdateImageDto,
	type RuletaUpdateDto,
	type RuletaUpdateImageDto,
} from "../dtos/ruleta.update.dto";

function RuletaIndex() {
	const ruletaIndexQuery = ruletaIndexApi();
	let component = null;
	if (ruletaIndexQuery.isLoading) {
		component = <Loading className="h-[300px]" />;
	}
	if (ruletaIndexQuery.isError) {
		component = <View404 message="error al ruleta" />;
	}
	if (ruletaIndexQuery.isSuccess) {
		//         option
		// image
		// scale
		// coupon
		// probabilidad
		component = (
			<div class="grid grid-cols-1 md:grid-cols-2  gap-12">
				{ruletaIndexQuery.data?.data.map((ruleta) => {
					const ruletaUpdateMutation = ruletaUpdateApi(ruleta.id);
					const ruletaUpdateImageMutation = ruletaUpdateImageApi(ruleta.id);
					const { image, ...rest } = ruleta;
					const rulesUpdateForm = useForm<RuletaUpdateDto>({
						resolver: valibotVigilio(ruletaUpdateDto),
						defaultValues: rest,
					});
					const rulesUpdateImageForm = useForm<RuletaUpdateImageDto>({
						resolver: valibotVigilio(ruletaUpdateImageDto),
					});
					function onRuletaUpdate(data: RuletaUpdateDto) {
						sweetModal({
							icon: "info",
							title: "¿Estas seguro de editar esta ruleta?",
							showCancelButton: true,
							showCloseButton: true,
						}).then(({ isConfirmed }) => {
							if (isConfirmed) {
								ruletaUpdateMutation.mutate(data, {
									onSuccess() {
										sweetAlert({
											icon: "success",
											title: "Se editó correctamente.",
										});
									},
									onError() {
										sweetAlert({
											icon: "danger",
											title: "Error al editar ruleta",
										});
									},
								});
							}
						});
					}
					function onRuletaImageUpdate(data: RuletaUpdateImageDto) {
						sweetModal({
							icon: "info",
							title: "¿Estas seguro de editar la imagen de  esta ruleta?",
							showCancelButton: true,
							showCloseButton: true,
						}).then(({ isConfirmed }) => {
							if (isConfirmed) {
								ruletaUpdateImageMutation.mutate(data, {
									onSuccess() {
										sweetAlert({
											icon: "success",
											title: "Imagen editado correctamente",
										});
									},
									onError() {
										sweetAlert({
											icon: "danger",
											title: "Error al editar la imagen",
										});
									},
								});
							}
						});
					}

					async function initialUpdateImageRuleta() {
						if (image) {
							const img = await getFilesEdit(image, 300);
							rulesUpdateImageForm.setValue("image", img);
						}
					}
					useEffect(() => {
						initialUpdateImageRuleta();
					}, []);
					return (
						<div class="flex flex-col gap-2" key={ruleta.id}>
							<span class="dark:text-white font-bold text-xl">
								{ruleta.option}
							</span>
							<Form onSubmit={onRuletaUpdate} {...rulesUpdateForm}>
								<div class="grid grid-cols-2 gap-2">
									<Form.control
										name={"option" as keyof RuletaUpdateDto}
										title="Option"
										placeholder="opción"
									/>
									<Form.control
										name={"probabilidad" as keyof RuletaUpdateDto}
										title="Probabilidad"
										placeholder="opción"
										type="number"
										question={
											<div class="w-[100px]">
												La probabilidad entre mayor sea, más saldrá. desde 0%
												hasta 100%
											</div>
										}
										options={{ setValueAs: Number }}
									/>
								</div>
								<div class="grid grid-cols-2 gap-2">
									<Form.control
										name={"coupon" as keyof RuletaUpdateDto}
										title="Descuento de cupon"
										placeholder="% descuento"
									/>
									<Form.control
										name={"scale" as keyof RuletaUpdateDto}
										title="Tamaño de Imagen"
										type="number"
										placeholder="opción"
										options={{ setValueAs: Number }}
									/>
								</div>
								<Form.button.submit
									title="Guardar cambios"
									isLoading={ruletaUpdateMutation.isLoading || false}
									disabled={ruletaUpdateMutation.isLoading || false}
								/>
							</Form>
							<Form
								onSubmit={onRuletaImageUpdate}
								{...rulesUpdateImageForm}
								key={ruleta.id}
							>
								<Form.control.file
									name={"image" as keyof RuletaUpdateDto}
									title="Imagen"
									accept="image/*"
									typeFile="image"
								/>
								<Form.button.submit
									title="Guardar cambios"
									isLoading={ruletaUpdateImageMutation.isLoading || false}
									disabled={ruletaUpdateImageMutation.isLoading || false}
								/>
							</Form>
							<div class="w-full h-[0.1px] bg-gray-700" />
						</div>
					);
				})}
			</div>
		);
	}
	return (
		<Container className="p-2">
			<div className="flex flex-col gap-4 mx-1 ">
				<AdminBreadCrumb current="Juegos" />
			</div>
			<div class="overflow-auto">{component}</div>
		</Container>
	);
}

export default RuletaIndex;
