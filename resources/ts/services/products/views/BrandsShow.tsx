import { formatDate } from "@vigilio/express-core/helpers";
import { brandsShowApi } from "../apis/brands/brands.show.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { brandsDestroyApi } from "../apis/brands/brands.destroy.api";
import { printFileWithDimension } from "~/libs/upload";
import { reactComponent } from "~/libs/preact";
import View404 from "@/admin/views/404";
import Loading from "@/admin/components/Loading";
import useAuthStore from "@/auth/stores/auth.store";
import BrandsUpdate from "./BrandsUpdate";

interface BrandsShowProps {
    id: string | number;
    onClose: () => void;
    refetch: (clean?: boolean) => void;
}
function BrandsShow({ id, onClose, refetch }: BrandsShowProps) {
    const brandsDestroyMutation = brandsDestroyApi();

    const brandsShowApiQuery = brandsShowApi(id as string);
    let component = null;

    if (brandsShowApiQuery.isLoading) {
        component = <Loading />;
    }
    if (brandsShowApiQuery.isError) {
        component = <View404 message={brandsShowApiQuery.error?.message} />;
    }
    if (brandsShowApiQuery.isSuccess && brandsShowApiQuery.data) {
        const brand = brandsShowApiQuery.data.brand;
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
                                    {brand.id}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Nombre:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {brand.name}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary p-2 rounded-md">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Slug:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {brand.slug}
                                </span>
                            </div>
                            {brand.image ? (
                                <div class="flex gap-1 flex-col mb-3 p-2 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Imagen:
                                    </span>
                                    <img
                                        src={
                                            printFileWithDimension(
                                                brand.image,
                                                100
                                            )[0]
                                        }
                                        width="150"
                                        height="150"
                                        class="object-cover rounded-md"
                                        alt={brand.name}
                                    />
                                </div>
                            ) : null}
                        </div>
                        <div className="flex-1 min-w-[250px]">
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary p-2 rounded-md  ">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Creado:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {formatDate(brand.createdAt!)}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3  odd:bg-paper-light odd:dark:bg-admin-terciary  p-2 rounded-md ">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Actualizado:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {formatDate(brand.updatedAt!)}
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
                                            aria-label="button to edit brand"
                                            class="px-4 py-2 gap-2 flex items-center rounded-md bg-blue-600"
                                            onClick={() => {
                                                sweetModal((onClose) => ({
                                                    isCloseInBackground: false,
                                                    showCloseButton: true,
                                                    html: reactComponent(
                                                        <BrandsUpdate
                                                            onClose={onClose}
                                                            id={brand.id}
                                                            refetch={
                                                                brandsShowApiQuery.refetch
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
                                            aria-label="button to delete brand"
                                            onClick={() => {
                                                sweetModal({
                                                    title: "Estas seguro?",
                                                    text: `Quieres eliminar esta categoría <b>${brand.name}</b>`,
                                                    icon: "danger",
                                                    showCancelButton: true,
                                                    confirmButtonText:
                                                        "Si, Eliminar!",
                                                }).then((result) => {
                                                    if (result.isConfirmed) {
                                                        brandsDestroyMutation.mutate(
                                                            brand.id,
                                                            {
                                                                onSuccess:
                                                                    () => {
                                                                        sweetAlert(
                                                                            {
                                                                                icon: "success",
                                                                                title: `La categoría ${brand.name} fue eliminado correctamente`,
                                                                            }
                                                                        );
                                                                        refetch(
                                                                            false
                                                                        );
                                                                        onClose();
                                                                    },
                                                                onError: (
                                                                    error
                                                                ) => {
                                                                    sweetModal({
                                                                        icon: "danger",
                                                                        text: `La categoría ${
                                                                            brand.name
                                                                        } no fue eliminado, :${JSON.stringify(
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

export default BrandsShow;
