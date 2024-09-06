import { formatDate } from "@vigilio/express-core/helpers";
import { categoriesShowApi } from "../apis/categories/categories.show.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { categoriesDestroyApi } from "../apis/categories/categories.destroy.api";
import { reactComponent } from "~/libs/preact";
import View404 from "@/admin/views/404";
import Loading from "@/admin/components/Loading";
import useAuthStore from "@/auth/stores/auth.store";
import CategoriesUpdate from "./CategoriesUpdate";

interface CategoriesShowProps {
	id: string | number;
	onClose: () => void;
	refetch: (clean?: boolean) => void;
}
function CategoriesShow({ id, onClose, refetch }: CategoriesShowProps) {
	const categoriesDestroyMutation = categoriesDestroyApi();

	const categoriesShowApiQuery = categoriesShowApi(id as string);
	let component = null;

	if (categoriesShowApiQuery.isLoading) {
		component = <Loading />;
	}
	if (categoriesShowApiQuery.isError) {
		component = <View404 message={categoriesShowApiQuery.error?.message} />;
	}
	if (categoriesShowApiQuery.isSuccess && categoriesShowApiQuery.data) {
		const category = categoriesShowApiQuery.data.category;
		component = (
			<div class="p-4">
				<div className="flex flex-col gap-4 p-4 text-start">
					<div className="flex flex-wrap justify-center gap-4 font-semibold">
						<div className="flex-1 min-w-[250px]">
							<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary p-2 rounded-md">
								<span class="text-primary dark:text-terciary font-bold">
									ID:
								</span>
								<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
									{category.id}
								</span>
							</div>
							<div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary">
								<span class="text-primary dark:text-terciary font-bold">
									Nombre:
								</span>
								<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
									{category.name}
								</span>
							</div>
							<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary p-2 rounded-md">
								<span class="text-primary dark:text-terciary font-bold">
									Slug:
								</span>
								<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
									{category.slug}
								</span>
							</div>
						</div>
						<div className="flex-1 min-w-[250px]">
							<div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary p-2 rounded-md  ">
								<span class="text-primary dark:text-terciary font-bold">
									Creado:
								</span>
								<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
									{formatDate(category.createdAt!)}
								</span>
							</div>
							<div class="flex gap-1 flex-col mb-3  odd:bg-paper-light odd:dark:bg-admin-terciary  p-2 rounded-md ">
								<span class="text-primary dark:text-terciary font-bold">
									Actualizado:
								</span>
								<span class="dark:text-secondary-light text-secondary-dark tracking-wide">
									{formatDate(category.updatedAt!)}
								</span>
							</div>
							{useAuthStore().guards.permissionAdminGuard() ? (
								<div class="flex gap-1 flex-col mb-3  odd:bg-paper-light odd:dark:bg-admin-terciary p-2 rounded-md">
									<span class="text-primary dark:text-terciary font-bold">
										Acciones:
									</span>
									<div class="flex items-center gap-1 text-white">
										<button
											type="button"
											aria-label="button to edit category"
											class="px-4 py-2 gap-2 flex items-center rounded-md bg-blue-600"
											onClick={() => {
												sweetModal((onClose) => ({
													isCloseInBackground: false,
													showCloseButton: true,
													html: reactComponent(
														<CategoriesUpdate
															onClose={onClose}
															id={category.id}
															refetch={categoriesShowApiQuery.refetch}
														/>,
													),
												}));
											}}
										>
											<i class="fa-solid text-sm fa-pen lg:mr-1" />
											<span class="text-xs">Editar</span>
										</button>
										<button
											class="px-4 py-2 rounded-md bg-red-600 flex items-center"
											type="button"
											aria-label="button to delete category"
											onClick={() => {
												sweetModal({
													title: "Estas seguro?",
													text: `Quieres eliminar esta categoría <b>${category.name}</b>`,
													icon: "danger",
													showCancelButton: true,
													confirmButtonText: "Si, Eliminar!",
												}).then((result) => {
													if (result.isConfirmed) {
														categoriesDestroyMutation.mutate(category.id, {
															onSuccess: () => {
																sweetAlert({
																	icon: "success",
																	title: `La categoría ${category.name} fue eliminado correctamente`,
																});
																onClose();
																refetch(false);
															},
															onError: (error) => {
																sweetModal({
																	icon: "danger",
																	text: `La categoría ${
																		category.name
																	} no fue eliminado, comunicarse con el desarrollador:${JSON.stringify(
																		error,
																	)}`,
																	title: "Error!",
																});
															},
														});
													}
												});
											}}
										>
											<i class="fa-solid text-sm fa-trash px-1" />
											<span class="text-xs">Eliminar</span>
										</button>
									</div>
								</div>
							) : null}
						</div>
					</div>
				</div>
			</div>
		);
	}
	return component;
}

export default CategoriesShow;
