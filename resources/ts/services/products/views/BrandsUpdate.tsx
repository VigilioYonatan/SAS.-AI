import { useForm } from "react-hook-form";
import {
	type BrandsUpdateDto,
	brandsUpdateDto,
	brandsUpdateImageDto,
	BrandsUpdateImagesDto,
} from "../dtos/brands.update.dto";
import {
	brandsUpdateApi,
	brandsUpdateImagesApi,
} from "../apis/brands/brands.update.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useEffect, useMemo } from "preact/hooks";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { brandsShowApi } from "../apis/brands/brands.show.api";
import { valibotVigilio } from "~/libs/valibot";
import { handlerError } from "~/libs/helpers";
import Form from "~/components/form";
import Loading from "@/admin/components/Loading";
import useAuthStore from "@/auth/stores/auth.store";
import View404 from "@/admin/views/404";
import { getFilesEdit } from "~/libs/upload";

interface BrandsUpdateProps {
	refetch: (clean?: boolean) => Promise<void>;
	onClose: () => void;
	id: string | number;
}

function BrandsUpdate({ id, onClose, refetch }: BrandsUpdateProps) {
	if (!useAuthStore().guards.permissionAdminGuard()) {
		onClose();
		return null;
	}
	const query = brandsShowApi(id as string);

	let component = null;

	if (query.isLoading) {
		component = <Loading />;
	}
	if (query.isError) {
		component = <View404 message={query.error?.message} />;
	}
	if (query.isSuccess && query.data) {
		const brand = query.data.brand;
		const brandsUpdateMutation = brandsUpdateApi(brand.id);

		const brandsUpdateForm = useForm<BrandsUpdateDto>({
			resolver: valibotVigilio(brandsUpdateDto),
			mode: "all",
			defaultValues: useMemo(() => {
				const { createdAt, updatedAt, id, ...rest } = brand;
				return rest;
			}, []),
		});
		function onUpdateBrand(body: BrandsUpdateDto) {
			sweetModal({
				icon: "success",
				title: "Estas seguro de agregar Marca?",
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					brandsUpdateMutation.mutate(body, {
						onSuccess(data) {
							sweetAlert({
								icon: "success",
								title: `<p class="text-center">Categoría actualizado correctamente <b>${data.brand.name}</b></p>`,
							});
							onClose();
							refetch(false);
						},
						onError(error) {
							handlerError(brandsUpdateForm, error);
						},
					});
				}
			});
		}

		const name = brandsUpdateForm.watch("name");
		useEffect(() => {
			brandsUpdateForm.setValue("slug", transformSlug(name || ""));
		}, [name]);
		const formProductsNormalUpdateImages = useForm<BrandsUpdateImagesDto>({
			mode: "all",
			resolver: valibotVigilio(brandsUpdateImageDto),
		});
		const brandsUpdateImagesMutate = brandsUpdateImagesApi(brand.id);
		async function initialUpdateImages() {
			if (brand.image) {
				const images = await getFilesEdit(brand.image, 500);
				formProductsNormalUpdateImages.setValue("image", images);
			}
		}
		function onUpdateImagesProduct(data: BrandsUpdateImagesDto) {
			sweetModal({
				title: "¿Estás seguro de editar las imagenes de esta marca?",

				showCloseButton: true,
				showCancelButton: true,
			}).then(({ isConfirmed }) => {
				if (isConfirmed) {
					brandsUpdateImagesMutate.mutate(
						{ ...data, name: brand.name },
						{
							onSuccess() {
								sweetAlert({
									icon: "success",
									title: "Se actualizó imagenes correctamente",
								});

								if (refetch) {
									refetch(false);
								}
								query.refetch(false);
							},
							onError(error) {
								handlerError(formProductsNormalUpdateImages, error);
							},
						},
					);
				}
			});
		}
		useEffect(() => {
			initialUpdateImages();
		}, []);
		component = (
			<div class="p-4">
				<div className="flex flex-col">
					<div class="lg:col-span-3 dark:bg-admin-paper-dark p-4 rounded-md">
						<div class="flex justify-between items-center mb-4">
							<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
								<i class="fa-solid fa-tag" />
								Editar Marca - {brand.name}
							</h3>
						</div>
						<div className="flex flex-col gap-4">
							<Form {...brandsUpdateForm} onSubmit={onUpdateBrand}>
								<div class="flex flex-col gap-4 justify-center items-center">
									<div class="w-full flex flex-col md:flex-row gap-2">
										<Form.control
											name={"name" as keyof BrandsUpdateDto}
											title="Nombre"
											placeholder="SAMSUNG"
										/>
										<Form.control
											name={"slug" as keyof BrandsUpdateDto}
											title="Slug"
											placeholder="samsung"
											options={{
												setValueAs: transformSlug,
											}}
										/>
									</div>
									<Form.button.submit
										disabled={brandsUpdateMutation.isLoading || false}
										isLoading={brandsUpdateMutation.isLoading || false}
										title="Editar"
									/>
								</div>
							</Form>
						</div>
						<br />
						<div class="flex justify-between items-center">
							<h3 class="dark:text-white  font-bold uppercase text-center flex gap-2 break-words text-wrap ">
								<i class="fa-solid fa-tag" />
								Editar imagen - {brand.name}
							</h3>
						</div>
						<Form
							{...formProductsNormalUpdateImages}
							onSubmit={onUpdateImagesProduct}
						>
							<Form.control.file
								name={"image" as keyof BrandsUpdateImagesDto}
								title="Imagen de marca"
								accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
								typeFile="image"
								multiple
								showButonCopy
							/>
							<div class="flex justify-center">
								<Form.button.submit
									disabled={brandsUpdateImagesMutate.isLoading || false}
									isLoading={brandsUpdateImagesMutate.isLoading || false}
									ico={<i class="fas fa-pen" />}
									title="Editar"
								/>
							</div>
						</Form>
					</div>
				</div>
			</div>
		);
	}

	return component;
}

export default BrandsUpdate;
