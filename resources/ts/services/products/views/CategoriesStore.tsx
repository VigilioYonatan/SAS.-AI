import Form from "~/components/form";
import {
	type CategoriesStoreDto,
	categoriesStoreDto,
} from "../dtos/categories.store.dto";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { useForm } from "react-hook-form";
import { categoriesStoreApi } from "../apis/categories/categories.store.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useEffect } from "preact/hooks";
import { valibotVigilio } from "~/libs/valibot";
import useAuthStore from "@/auth/stores/auth.store";
import { handlerError } from "~/libs/helpers";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { aiCategoryApi } from "@/bot/apis/ai.category.api";
import { getFilesEdit } from "~/libs/upload";
import LoaderSubmit from "~/components/LoaderSubmit";
import { useSignal } from "@preact/signals";

interface CategoriesStoreProps {
	refetch: (clean?: boolean) => Promise<void>;
	onClose: () => void;
	onSetValueCategory?: (value: number) => void;
}
function CategoriesStore({
	refetch,
	onClose,
	onSetValueCategory,
}: CategoriesStoreProps) {
	const { guards } = useAuthStore();
	if (!guards.permissionAdminGuard()) {
		onClose();
		return null;
	}
	const categoriesStoreDtoForm = useForm<CategoriesStoreDto>({
		resolver: valibotVigilio(categoriesStoreDto),
		mode: "all",
		defaultValues: { empresa_id: storageEmpresa!.id },
	});

	const categoriesStoreMutation = categoriesStoreApi();
	const aiCategoryMutation = aiCategoryApi();
	const isLoadingImage = useSignal(false);

	function onAddCategory(data: CategoriesStoreDto) {
		sweetModal({
			icon: "info",
			title: "¿Estás seguro de agregar esta categoría?",
			showCancelButton: true,
			showCloseButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				categoriesStoreMutation.mutate(data, {
					onSuccess(data) {
						categoriesStoreDtoForm.reset();
						sweetModal({
							icon: "success",
							text: `<p class="text-center">Nueva categoría insertado correctamente <b>${data.category.name}</b></p>`,
						});
						refetch(false);
						onClose();
						if (onSetValueCategory) {
							onSetValueCategory(data.category.id);
						}
					},
					onError(error) {
						handlerError(categoriesStoreDtoForm, error);
					},
				});
			}
		});
	}
	const name = categoriesStoreDtoForm.watch("name");
	useEffect(() => {
		categoriesStoreDtoForm.setValue("slug", transformSlug(name || ""));
	}, [name]);
	async function onSearchCategory() {
		aiCategoryMutation.mutate(name, {
			async onSuccess(data) {
				isLoadingImage.value = true;
				const images = await getFilesEdit(
					data.data.images.map((img) => ({
						dimension: 500,
						file: img.image,
					})),
					null,
				);
				categoriesStoreDtoForm.setValue("icon", data.data.ico);
				if (images.length) {
					categoriesStoreDtoForm.setValue("image", images);
				}
				isLoadingImage.value = false;
				sweetAlert({
					icon: "success",
					title: `Se añadio correctamente propiedades para ${name}`,
				});
			},
			onError() {
				sweetAlert({
					icon: "danger",
					title: "Error al obtener información de producto",
				});
			},
		});
	}

	return (
		<div className="mt-6 text-start">
			<Form {...categoriesStoreDtoForm} onSubmit={onAddCategory}>
				<div class="flex justify-between items-center mb-4">
					<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
						<i class="fa-solid fa-layer-group" />
						Agregar Categoría
					</h3>
					<Form.button.reset />
				</div>
				<div class="flex flex-col gap-4 justify-center items-center">
					<div class="w-full flex flex-col md:flex-row gap-2">
						<div class="w-full flex gap-1 items-center">
							<Form.control
								name={"name" as keyof CategoriesStoreDto}
								title="Nombre"
								placeholder="Nombre de Categoría"
								question={
									<span>
										Ejemplo: <b>Laptops, zapatos, etc</b>
									</span>
								}
							/>
							<button
								type="button"
								aria-label="add"
								class="bg-primary px-3 py-2 rounded-md shadow text-white mt-2"
								disabled={
									aiCategoryMutation.isLoading || isLoadingImage.value || false
								}
								onClick={onSearchCategory}
							>
								{aiCategoryMutation.isLoading ? (
									<LoaderSubmit />
								) : (
									<i class="fas fa-search" />
								)}
							</button>
						</div>
						<Form.control
							name={"slug" as keyof CategoriesStoreDto}
							title="Slug"
							placeholder="nombre-de-categoria"
							options={{ setValueAs: transformSlug }}
							disabled
						/>
					</div>
					<div class="w-full flex gap-2 items-center">
						<Form.control
							name={"icon" as keyof CategoriesStoreDto}
							title="Icono"
							type="text"
							placeholder="<i class='fa-solid fa-brush'></i>"
							question={
								<div>
									<p>
										Busque un icono{" "}
										<a
											class="font-bold underline"
											href="https://fontawesome.com/search"
											target="_blank"
											rel="noreferrer"
										>
											Aquí
										</a>{" "}
										y copie y pegue
									</p>
									<br />
									Este campo no es obligatorio.
								</div>
							}
						/>
						{categoriesStoreDtoForm.watch("icon") ? (
							<div
								dangerouslySetInnerHTML={{
									__html: categoriesStoreDtoForm.watch("icon")!,
								}}
								class="mt-3"
							/>
						) : null}
					</div>

					<Form.control.file
						name={"image" as keyof CategoriesStoreDto}
						accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
						title="Imagen *No obligatorio"
						typeFile="image"
						multiple={false}
						showButonCopy
					/>
					<Form.button.submit
						isLoading={categoriesStoreMutation.isLoading || false}
						disabled={categoriesStoreMutation.isLoading || false}
						title="Guardar"
					/>
				</div>
			</Form>
		</div>
	);
}

export default CategoriesStore;
