import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import View404 from "@/admin/views/404";
import Loading from "@/admin/components/Loading";
import useAuthStore from "@/auth/stores/auth.store";
import SubcategoriesUpdate from "./SubcategoriesUpdate";
import { formatDateTwo } from "~/libs/helpers";
import { printFileWithDimension } from "~/libs/upload";
import { subcategoriesDestroyApi } from "../apis/subcategories/subcategories.destroy.api";
import { subcategoriesShowApi } from "../apis/subcategories/subcategories.show.api";

interface SubcategoriesShowProps {
    id: string | number;
    onClose: () => void;
    refetch: (clean?: boolean) => void;
}
function SubcategoriesShow({ id, onClose, refetch }: SubcategoriesShowProps) {
    const subcategoriesDestroyMutation = subcategoriesDestroyApi();

    const subcategoriesShowApiQuery = subcategoriesShowApi(id as string);
    let component = null;

    if (subcategoriesShowApiQuery.isLoading) {
        component = <Loading />;
    }
    if (subcategoriesShowApiQuery.isError) {
        component = (
            <View404 message={subcategoriesShowApiQuery.error?.message} />
        );
    }
    if (subcategoriesShowApiQuery.isSuccess && subcategoriesShowApiQuery.data) {
        const subcategory = subcategoriesShowApiQuery.data.subcategory;
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
                                    {subcategory.id}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Nombre:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {subcategory.name}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary p-2 rounded-md">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Slug:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {subcategory.slug}
                                </span>
                            </div>
                        </div>
                        <div className="flex-1 min-w-[250px]">
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary p-2 rounded-md  ">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Creado:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {formatDateTwo(subcategory.createdAt!)}
                                </span>
                            </div>{" "}
                            <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Imagen:
                                </span>
                                <img
                                    src={
                                        printFileWithDimension(
                                            subcategory.image,
                                            100
                                        )[0]
                                    }
                                    width="150"
                                    height="150"
                                    class="object-cover rounded-md"
                                    alt={subcategory.name}
                                />
                            </div>
                            <div class="flex gap-1 flex-col mb-3  odd:bg-paper-light odd:dark:bg-admin-terciary  p-2 rounded-md ">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Actualizado:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {formatDateTwo(subcategory.updatedAt!)}
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
                                            aria-label="button to edit subcategory"
                                            class="px-4 py-2 gap-2 flex items-center rounded-md bg-blue-600"
                                            onClick={() => {
                                                sweetModal((onClose) => ({
                                                    isCloseInBackground: false,
                                                    showCloseButton: true,
                                                    html: reactComponent(
                                                        <SubcategoriesUpdate
                                                            onClose={onClose}
                                                            id={subcategory.id}
                                                            refetch={
                                                                subcategoriesShowApiQuery.refetch
                                                            }
                                                        />
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
                                            aria-label="button to delete subcategory"
                                            onClick={() => {
                                                sweetModal({
                                                    title: "Estas seguro?",
                                                    text: `Quieres eliminar esta categoría <b>${subcategory.name}</b>`,
                                                    icon: "danger",
                                                    showCancelButton: true,
                                                    confirmButtonText:
                                                        "Si, Eliminar!",
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        subcategoriesDestroyMutation.mutate(
                                                            subcategory.id,
                                                            {
                                                                onSuccess:
                                                                    () => {
                                                                        sweetAlert(
                                                                            {
                                                                                icon: "success",
                                                                                title: `La categoría ${subcategory.name} fue eliminado correctamente`,
                                                                            }
                                                                        );
                                                                        onClose();
                                                                        refetch(
                                                                            false
                                                                        );
                                                                    },
                                                                onError: (
                                                                    error
                                                                ) => {
                                                                    sweetModal({
                                                                        icon: "danger",
                                                                        text: `La categoría ${
                                                                            subcategory.name
                                                                        } no fue eliminado, comunicarse con el desarrollador:${JSON.stringify(
                                                                            error
                                                                        )}`,
                                                                        title: "Error!",
                                                                    });
                                                                },
                                                            }
                                                        );
                                                    }
                                                });
                                            }}
                                        >
                                            <i class="fa-solid text-sm fa-trash px-1" />
                                            <span class="text-xs">
                                                Eliminar
                                            </span>
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

export default SubcategoriesShow;
