import { formatDate } from "@vigilio/express-core/helpers";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { suppliersShowApi } from "../apis/suppliers.show.api";
import { printFileWithDimension } from "~/libs/upload";
import { suppliersDestroyApi } from "../apis/suppliers.destroy.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import SuppliersUpdate from "./SuppliersUpdate";
interface SuppliersShowProps {
    supplier: string;
    refetch: (clean?: boolean) => void;
    onClose: () => void;
}
function SuppliersShow({ supplier, refetch, onClose }: SuppliersShowProps) {
    const suppliershowIndex = suppliersShowApi(supplier);

    let component = null;
    if (suppliershowIndex.isLoading) {
        component = <Loading />;
    }

    if (suppliershowIndex.isError) {
        component = (
            <View404 message={`No se encontró un proveedor ${supplier}`} />
        );
    }
    if (suppliershowIndex.isSuccess) {
        const supplier = suppliershowIndex.data!.supplier;
        const suppliersDestroyMutation = suppliersDestroyApi();

        component = (
            <>
                <h2 class="text-2xl font-bold text-center text-primary mb-3">
                    {supplier.razon_social}
                </h2>
                <div class="flex gap-4 flex-wrap justify-center  font-semibold">
                    <div class="flex-1 min-w-[250px]">
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                ID:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {supplier.id}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Código:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {supplier.supplier_code}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Ruc:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {supplier.ruc}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Razon Social:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {supplier.razon_social}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Actividad:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {supplier.activity}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Web:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {supplier.web}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Logo:
                            </span>
                            {supplier.logo ? (
                                <img
                                    src={
                                        printFileWithDimension(
                                            supplier.logo,
                                            100
                                        )[0]
                                    }
                                    alt={supplier.razon_social}
                                    width={100}
                                    height={100}
                                />
                            ) : (
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    No se insertó
                                </span>
                            )}
                        </div>
                    </div>
                    <div class="flex-1 min-w-[250px]">
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Correo Electrónico:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {supplier.email}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Correo Electrónico 2:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {supplier.email2 ?? "No se insertó"}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Telefono:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {supplier.contact ?? "No se insertó"}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Numero Celular:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {supplier.phone_one}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Numero Celular 2:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {supplier.phone_two ?? "No se insertó"}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Creado:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {formatDate(supplier.createdAt!)}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                            <span class="text-primary dark:text-terciary font-bold">
                                Actualizado:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {formatDate(supplier.updatedAt!)}
                            </span>
                        </div>{" "}
                        <div class="flex gap-2">
                            <button
                                type="button"
                                aria-label="button to edit brand"
                                class="px-4 py-2 gap-2 flex items-center rounded-md bg-blue-600 text-white"
                                onClick={() => {
                                    sweetModal((onClose) => ({
                                        isCloseInBackground: false,
                                        showCloseButton: true,
                                        html: reactComponent(
                                            <SuppliersUpdate
                                                onClose={onClose}
                                                id={supplier.id}
                                                refetch={
                                                    suppliershowIndex.refetch
                                                }
                                            />
                                        ),
                                        sweetWidth: "600px",
                                    }));
                                }}
                            >
                                <i class="fa-solid text-sm fa-pen lg:mr-1" />
                                <span class="text-xs">Editar</span>
                            </button>
                            <button
                                class="px-4 py-2 rounded-md bg-red-600 flex items-center text-white"
                                type="button"
                                aria-label="button to delete product"
                                onClick={() => {
                                    sweetModal({
                                        title: "Estas seguro?",
                                        text: `Quieres eliminar este proveedor <b>${supplier.razon_social}</b>`,
                                        icon: "danger",
                                        showCancelButton: true,
                                        confirmButtonText: "Si, Eliminar!",
                                        showCloseButton: true,
                                    }).then((result) => {
                                        if (result.isConfirmed) {
                                            suppliersDestroyMutation.mutate(
                                                supplier.id,
                                                {
                                                    onSuccess: () => {
                                                        sweetAlert({
                                                            icon: "success",
                                                            title: `El proveedor ${supplier.razon_social} fue eliminado correctamente`,
                                                        });
                                                        refetch();
                                                        onClose();
                                                    },
                                                    onError: (error) => {
                                                        sweetModal({
                                                            icon: "danger",
                                                            text: `El proveedor ${
                                                                supplier.razon_social
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
                                <span class="text-xs">Eliminar</span>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }
    return component;
}

export default SuppliersShow;
