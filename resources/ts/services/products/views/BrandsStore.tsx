import Form from "~/components/form";
import { type BrandsStoreDto, brandsStoreDto } from "../dtos/brands.store.dto";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { useForm } from "react-hook-form";
import { brandsStoreApi } from "../apis/brands/brands.store.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useEffect } from "preact/hooks";
import { valibotVigilio } from "~/libs/valibot";
import useAuthStore from "@/auth/stores/auth.store";
import { handlerError } from "~/libs/helpers";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { aiBrandsApi } from "@/bot/apis/ai.brand.api";
import { useSignal } from "@preact/signals";
import LoaderSubmit from "~/components/LoaderSubmit";
import { getFilesEdit } from "~/libs/upload";
import SettingsProduct from "@/admin/components/SettingsProduct";

interface BrandsStoreProps {
	refetch: (clean?: boolean) => Promise<void>;
	onClose: () => void;
	onSetValueBrand?: (value: number) => void;
}
function BrandsStore({ refetch, onClose, onSetValueBrand }: BrandsStoreProps) {
	const { guards } = useAuthStore();
	if (!guards.permissionAdminGuard()) {
		onClose();
		return null;
	}
	const brandsStoreDtoForm = useForm<BrandsStoreDto>({
		resolver: valibotVigilio(brandsStoreDto),
		mode: "all",
		defaultValues: { empresa_id: storageEmpresa!.id },
	});

	const brandsStoreMutation = brandsStoreApi();
	const isLoadingImage = useSignal(false);

	const aiBrandsMutation = aiBrandsApi();
	function onAddCategory(data: BrandsStoreDto) {
		sweetModal({
			title: "Estas seguro de agregar Marca?",
			showCancelButton: true,
			showCloseButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				brandsStoreMutation.mutate(data, {
					onSuccess(data) {
						brandsStoreDtoForm.reset();
						sweetAlert({
							icon: "success",
							title: `<p class="text-center">Nueva marca insertado correctamente <b>${data.brand.name}</b></p>`,
						});
						refetch(false);
						onClose();
						if (onSetValueBrand) {
							onSetValueBrand(data.brand.id);
						}
					},
					onError(error) {
						handlerError(brandsStoreDtoForm, error);
					},
				});
			}
		});
	}
	const name = brandsStoreDtoForm.watch("name");
	useEffect(() => {
		brandsStoreDtoForm.setValue("slug", transformSlug(name || ""));
	}, [name]);
	async function onSearchBrand() {
		if (!name.length) return;
		aiBrandsMutation.mutate(name, {
			async onSuccess(data) {
				isLoadingImage.value = true;
				const images = await getFilesEdit(
					data.data.images.map((img) => ({
						dimension: 500,
						file: img.image,
					})),
					null,
				);
				if (images.length) {
					brandsStoreDtoForm.setValue("image", images);
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
			<Form {...brandsStoreDtoForm} onSubmit={onAddCategory}>
				<div class="flex justify-between items-center mb-4">
					<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
						<i class="fas fa-tags" />
						Agregar Marca
					</h3>
					<div class="flex gap-2 items-center">
						<SettingsProduct />
						<Form.button.reset />
					</div>
				</div>
				<div class="flex flex-col gap-4 justify-center items-center">
					<div class="w-full flex flex-col md:flex-row gap-2">
						<div class="w-full flex gap-1 items-center">
							<Form.control
								name={"name" as keyof BrandsStoreDto}
								title="Nombre"
								placeholder="Nombre de marca"
								question={
									<span>
										Ejemplo: <b>Samsung, Lg, Nike, ...etc.</b>
									</span>
								}
							/>
							<button
								type="button"
								aria-label="add"
								class="bg-primary px-3 py-2 rounded-md shadow text-white mt-2"
								disabled={
									aiBrandsMutation.isLoading || isLoadingImage.value || false
								}
								onClick={onSearchBrand}
							>
								{aiBrandsMutation.isLoading ? (
									<LoaderSubmit />
								) : (
									<i class="fas fa-search" />
								)}
							</button>
						</div>
						<Form.control
							name={"slug" as keyof BrandsStoreDto}
							title="samsung"
							placeholder="nombre-de-marca"
							options={{ setValueAs: transformSlug }}
							disabled
						/>
					</div>
					<Form.control.file
						name={"image" as keyof BrandsStoreDto}
						accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
						title="Imagen *No obligatorio"
						typeFile="image"
						multiple={false}
						showButonCopy
						showButtonClean
					/>
					<Form.button.submit
						isLoading={brandsStoreMutation.isLoading || false}
						disabled={brandsStoreMutation.isLoading || false}
						title="Guardar"
					/>
				</div>
			</Form>
		</div>
	);
}

export default BrandsStore;
