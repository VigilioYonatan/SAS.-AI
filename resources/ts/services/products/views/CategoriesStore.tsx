import Form from "~/components/form";
import {
	type CategoriesStoreDto,
	categoriesStoreDto,
} from "../dtos/categories.store.dto";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { useForm } from "react-hook-form";
import { categoriesStoreApi } from "../apis/categories/categories.store.api";
import { sweetModal } from "@vigilio/sweet";
import { useEffect } from "preact/hooks";
import { valibotVigilio } from "~/libs/valibot";
import useAuthStore from "@/auth/stores/auth.store";
import { handlerError } from "~/libs/helpers";
import { storageInformation } from "@/information/stores/information.store";

interface CategoriesStoreProps {
	refetch: (clean?: boolean) => Promise<void>;
	onClose: () => void;
}
function CategoriesStore({ refetch, onClose }: CategoriesStoreProps) {
	const { guards } = useAuthStore();
	if (!guards.permissionAdminGuard()) {
		onClose();
		return null;
	}
	const categoriesStoreDtoForm = useForm<CategoriesStoreDto>({
		resolver: valibotVigilio(categoriesStoreDto),
		mode: "all",
		defaultValues: { information_id: storageInformation!.id },
	});

	const categoriesStoreMutation = categoriesStoreApi();

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
						<Form.control
							name={"name" as keyof CategoriesStoreDto}
							title="Nombre"
							placeholder=""
							question="Ejemplo: Laptops, Zapatillas, Polos,Ceviches,Sopas, etc"
						/>
						<Form.control
							name={"slug" as keyof CategoriesStoreDto}
							title="Slug"
							placeholder="nombre-de-categoria"
							options={{ setValueAs: transformSlug }}
							disabled
						/>
					</div>
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
					<Form.control.file
						name={"image" as keyof CategoriesStoreDto}
						accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
						title="Imagen *No obligatorio"
						typeFile="image"
						multiple={false}
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
