import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import Form from "~/components/form";
import { variantsShowApi } from "@/products/apis/options/variants.show.api";
import { useForm, type UseFormReturn } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { variantsUpdateApi } from "@/products/apis/options/variants.update.api";
import {
	variantsUpdateDto,
	type VariantsUpdateDto,
} from "@/products/dtos/options/variants.update.dto";
import { useEffect, useMemo } from "preact/hooks";
import type { ProductsSchemaFromServer } from "@/products/schemas/products.schema";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { type FilesSchema } from "~/libs/upload";
import { printImagesProduct } from "@/products/libs/helpers";
import { useSignal } from "@preact/signals";
import { handlerError } from "~/libs/helpers";

interface VariantsShowProps {
	product_id: number;
	variant_id: number;
	product: ProductsSchemaFromServer;
	refetch: (clean?: boolean) => void;
}
function VariantsShow({
	product_id,
	variant_id,
	product,
	refetch,
}: VariantsShowProps) {
	const optionsShowQuery = variantsShowApi(product_id, variant_id);
	let component = null;

	if (optionsShowQuery.isLoading) {
		component = <Loading />;
	}
	if (optionsShowQuery.isError) {
		component = <View404 message={optionsShowQuery.error?.message} />;
	}
	if (optionsShowQuery.isSuccess && optionsShowQuery.data) {
		const variant = optionsShowQuery.data.variant;
		const variantsUpdateMutation = variantsUpdateApi(product_id, variant_id);

		const variantUpdateForm = useForm<VariantsUpdateDto>({
			resolver: valibotVigilio(variantsUpdateDto),
			defaultValues: useMemo(() => {
				const { createdAt, updatedAt, id, product_id, ...rest } = variant;
				return rest;
			}, []),
		});

		const ilimit = variantUpdateForm.watch("ilimit");
		const images = variantUpdateForm.watch("images");

		function onUpdateVariant(data: VariantsUpdateDto) {
			variantsUpdateMutation.mutate(data, {
				onSuccess(data) {
					sweetAlert({ icon: "success", title: data.message });
					refetch(false);
				},
				onError(error) {
					handlerError(variantUpdateForm, error);
				},
			});
		}
		component = (
			<div>
				<span class="text-primary text-md">
					{product.name} {variant.sku}
				</span>
				<Form {...variantUpdateForm} onSubmit={onUpdateVariant}>
					<Form.control
						title="SKU"
						placeholder="SKU-00223"
						name={"sku" as keyof VariantsUpdateDto}
					/>
					<div class="w-full flex flex-row gap-2">
						<Form.control.toggle
							name={"ilimit" as keyof VariantsUpdateDto}
							title="Ilimitado"
							question="Cuando la variante es ilimitado quiere decir que hay stock."
						/>
						{!ilimit ? (
							<Form.control
								name={"stock" as keyof VariantsUpdateDto}
								type="number"
								title="Cantidad"
								placeholder="Cantidad de variantes"
								options={{ setValueAs: Number }}
							/>
						) : null}
					</div>
					<div>
						<span class="dark:text-white text-xs">Images</span>
						<div class="flex gap-2 flex-wrap">
							{images.length ? (
								<>
									{images.map((image) => (
										<div key={image}>
											<img
												class="rounded-md object-contain"
												src={printImagesProduct(product.images, 500).find(
													(_, i) => i + 1 === image,
												)}
												width={50}
												height={50}
												alt=""
											/>
										</div>
									))}
								</>
							) : (
								<span class="dark:text-white text-xs">
									No tienes images seleccionados
								</span>
							)}
						</div>
						<button
							onClick={() => {
								sweetModal({
									html: reactComponent(
										<VariantImages
											images={product.images}
											variantUpdateForm={variantUpdateForm}
										/>,
									),
									showCloseButton: true,
								});
							}}
							type="button"
							aria-label="show and select images"
							class="px-2 py-1 rounded-md text-xs text-white bg-primary mt-2"
						>
							<i class="fas fa-images" />
						</button>
					</div>
					<Form.button.submit
						title="Editar"
						ico={null}
						disabled={variantsUpdateMutation.isLoading || false}
						isLoading={variantsUpdateMutation.isLoading || false}
					/>
				</Form>
			</div>
		);
	}
	return component;
}

interface VariantImagesProps {
	images: FilesSchema[] | null;
	variantUpdateForm: UseFormReturn<VariantsUpdateDto>;
}
function VariantImages({ images, variantUpdateForm }: VariantImagesProps) {
	const imagesVariant = useSignal(variantUpdateForm.watch("images"));

	useEffect(() => {
		variantUpdateForm.setValue("images", imagesVariant.value);
	}, [imagesVariant.value]);

	function chooseImage(image: number) {
		const existImage = imagesVariant.value.find((img) => img === image);
		if (existImage) {
			const imagesFilter = imagesVariant.value.filter((img) => img !== image);
			imagesVariant.value = imagesFilter;
			return;
		}
		imagesVariant.value = [...imagesVariant.value, image];
	}

	return (
		<div>
			<span class="dark:text-white mb-3 block">Seleccionar Imagenes</span>
			<div class="flex gap-2  flex-wrap">
				{images?.length ? (
					<>
						{printImagesProduct(images, 500).map((image, i) => (
							<div key={image}>
								<button
									type="button"
									aria-label="choose image"
									onClick={() => {
										chooseImage(i + 1);
									}}
									class={`rounded-md overflow-hidden ${
										imagesVariant.value.some((img) => img === i + 1)
											? "border-2 border-primary"
											: ""
									}`}
								>
									<img
										src={image}
										width={100}
										class="w-[100px] h-[100px] object-contain"
										height={100}
										alt={image}
									/>
								</button>
							</div>
						))}
					</>
				) : (
					<span class="dark:text-white text-xs">No hay imagenes</span>
				)}
			</div>
		</div>
	);
}
export default VariantsShow;
