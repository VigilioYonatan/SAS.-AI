import Form from "~/components/form";
import {
	type SubcategoriesStoreDto,
	subcategoriesStoreDto,
} from "../dtos/subcategories.store.dto";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { useForm } from "react-hook-form";
import { subcategoriesStoreApi } from "../apis/subcategories/subcategories.store.api";
import { sweetModal } from "@vigilio/sweet";
import { useEffect, useMemo } from "preact/hooks";
import { valibotVigilio } from "~/libs/valibot";
import useAuthStore from "@/auth/stores/auth.store";
import { handlerError } from "~/libs/helpers";
import { categoriesIndexApi } from "../apis/categories/categories.index.api";
import { formSelectNumber } from "~/components/form/WebFormSelect";
import SettingsProduct from "@/admin/components/SettingsProduct";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface SubcategoriesStoreProps {
	refetch: (clean?: boolean) => Promise<void>;
	onClose: () => void;
	onSetValueSubcategory?: (value: number) => void;
}
function SubcategoriesStore({
	refetch,
	onClose,
	onSetValueSubcategory,
}: SubcategoriesStoreProps) {
	const { guards } = useAuthStore();
	if (!guards.permissionAdminGuard()) {
		onClose();
		return null;
	}
	const subcategoriesStoreDtoForm = useForm<SubcategoriesStoreDto>({
		resolver: valibotVigilio(subcategoriesStoreDto),
		mode: "all",
		defaultValues: { empresa_id: storageEmpresa!.id },
	});

	const subcategoriesStoreMutation = subcategoriesStoreApi();
	const categoriesIndexQuery = categoriesIndexApi(false);

	const categoriesData = useMemo(() => {
		if (categoriesIndexQuery.isSuccess && categoriesIndexQuery.data) {
			return categoriesIndexQuery.data.data.map((category) => ({
				key: category.id,
				value: category.name,
			}));
		}
		return [];
	}, [categoriesIndexQuery.data, categoriesIndexQuery.isSuccess]);

	function onAddSubcategory(body: SubcategoriesStoreDto) {
		sweetModal({
			icon: "info",
			title: "¿Estás seguro de agregar esta subcategoría?",
			showCancelButton: true,
			showCloseButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				subcategoriesStoreMutation.mutate(body, {
					onSuccess(data) {
						subcategoriesStoreDtoForm.reset();
						sweetModal({
							icon: "success",
							text: `<p class="text-center">Nueva subcategoría insertado correctamente <b>${data.subcategory.name}</b></p>`,
						});
						refetch(false);
						onClose();
						if (onSetValueSubcategory) {
							onSetValueSubcategory(data.subcategory.id);
						}
					},
					onError(error) {
						handlerError(subcategoriesStoreDtoForm, error);
					},
				});
			}
		});
	}
	const name = subcategoriesStoreDtoForm.watch("name");
	useEffect(() => {
		subcategoriesStoreDtoForm.setValue("slug", transformSlug(name || ""));
	}, [name]);

	return (
		<div className="mt-6 text-start">
			<Form {...subcategoriesStoreDtoForm} onSubmit={onAddSubcategory}>
				<div class="flex justify-between items-center mb-4">
					<h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
						<i class="fa-solid fa-table-cells-large" />
						Agregar Subcategoría
					</h3>
					<div class="flex gap-2 items-center">
						<SettingsProduct />
						<Form.button.reset />
					</div>
				</div>
				<div class="flex flex-col gap-4 justify-center items-center">
					<Form.control
						name={"name" as keyof SubcategoriesStoreDto}
						title="Nombre"
						placeholder="Nombre de subcategoría"
					/>
					<Form.control.file
						name={"image" as keyof SubcategoriesStoreDto}
						accept="image/png, image/jpeg, image/jpg, image/webp"
						title="Imagen"
						typeFile="image"
					/>

					<div class="w-full flex flex-col md:flex-row gap-2">
						<Form.control
							name={"slug" as keyof SubcategoriesStoreDto}
							title="Slug"
							placeholder="nombre-de-subcategoría"
							options={{ setValueAs: transformSlug }}
							disabled
						/>
						<Form.control.select
							title="Categoria"
							array={categoriesData}
							name={"category_id" as keyof SubcategoriesStoreDto}
							options={{
								setValueAs: formSelectNumber,
							}}
							placeholder="Escoger categoria"
							isLoading={categoriesIndexQuery.isLoading || false}
						/>
					</div>
					<Form.button.submit
						isLoading={subcategoriesStoreMutation.isLoading || false}
						disabled={subcategoriesStoreMutation.isLoading || false}
						title="Guardar"
					/>
				</div>
			</Form>
		</div>
	);
}

export default SubcategoriesStore;
