import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { categoriesIndexApi } from "../apis/categories.index.api";
import Loading from "@/admin/components/Loading";
import Form from "~/components/form";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import {
    CategoriesFinanzasStoreDto,
    categoriesFinanzasStoreDto,
} from "../dtos/categories.store.dto";
import { categoriesFinanzasStoreApi } from "../apis/categories.store.api";
import { handlerError } from "~/libs/helpers";
import { categoriesFinanzasShowApi } from "../apis/categories.show.api";
import { categoriesFinanzasUpdateApi } from "../apis/categories.update.api";
import { categoriesFinanzasDestroyApi } from "../apis/categories.destroy.api";
import LoaderSubmit from "~/components/LoaderSubmit";

function CategoriesStore() {
    const finanzasIndexQuery = categoriesIndexApi();
    let component = null;
    if (finanzasIndexQuery.isLoading) {
        component = <Loading />;
    }
    if (finanzasIndexQuery.isError) {
        component = <span>{finanzasIndexQuery.error?.message}</span>;
    }
    if (finanzasIndexQuery.isSuccess) {
        const ingresos = finanzasIndexQuery.data!.data[0].categoriesFinanzas;
        const egresos = finanzasIndexQuery.data!.data[1].categoriesFinanzas;
        component = (
            <div>
                <h1 class="font-semibold text-white mb-2 text-center text-xl">
                    Tipos
                </h1>
                <table class="w-full">
                    <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary dark:text-secondary-light dark:text-terciary-dark uppercase  shadow-sm  border-b dark:border-admin-terciary">
                        <tr class="px-1 lg:py-1 whitespace-nowrap text-center  text-xs lg:text-sm">
                            {finanzasIndexQuery.data?.data.map((tipo) => (
                                <td class="py-2" key={tipo.id}>
                                    {tipo.id === 2 ? (
                                        <i class="fa-sharp-duotone fa-solid fa-chart-line-up-down" />
                                    ) : (
                                        <i class="fa-solid fa-chart-line-up" />
                                    )}{" "}
                                    {tipo.name}
                                </td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({
                            length: Math.max(ingresos.length, egresos.length),
                        }).map((_, index) => (
                            <tr
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={index}
                                class="border-b h-[30px] dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light"
                            >
                                {" "}
                                <td
                                    class="px-1 lg:py-1 whitespace-nowrap text-center  text-xs lg:text-sm"
                                    onClick={() => {
                                        sweetModal((onClose) => ({
                                            html: reactComponent(
                                                <CategoriesFinancesUpdate
                                                    id={ingresos[index].id}
                                                    refetch={
                                                        finanzasIndexQuery.refetch
                                                    }
                                                    onClose={onClose}
                                                />
                                            ),
                                            showCloseButton: true,
                                            isCloseInBackground: false,
                                        }));
                                    }}
                                >
                                    {ingresos[index] ? (
                                        <>
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: ingresos[index]
                                                        .icon,
                                                }}
                                            />{" "}
                                            {ingresos[index].value}
                                        </>
                                    ) : null}
                                </td>
                                <td class="px-1 lg:py-1 whitespace-nowrap text-center  text-xs lg:text-sm">
                                    {egresos[index] ? (
                                        <>
                                            <span
                                                dangerouslySetInnerHTML={{
                                                    __html: egresos[index].icon,
                                                }}
                                            />{" "}
                                            {egresos[index].value}
                                        </>
                                    ) : null}
                                </td>
                            </tr>
                        ))}
                        <tr class="border-b h-[30px] dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black dark:hover:bg-admin-terciary dark:text-secondary-light dark:hover:text-secondary-light">
                            <td class="text-center">
                                <button
                                    class="bg-success px-3 py-1.5 rounded-md font-bold my-1"
                                    onClick={() => {
                                        sweetModal((onClose) => ({
                                            html: reactComponent(
                                                <CategoriesStoreEgresos
                                                    tipo_finanza_id={1}
                                                    refetch={
                                                        finanzasIndexQuery.refetch
                                                    }
                                                    onClose={onClose}
                                                />
                                            ),
                                            showCloseButton: true,
                                            isCloseInBackground: false,
                                        }));
                                    }}
                                    type="button"
                                >
                                    +
                                </button>
                            </td>
                            <td class="text-center">
                                <button
                                    class="bg-success px-3 py-1.5 rounded-md font-bold  my-1"
                                    type="button"
                                    onClick={() => {
                                        sweetModal((onClose) => ({
                                            html: reactComponent(
                                                <CategoriesStoreEgresos
                                                    tipo_finanza_id={2}
                                                    refetch={
                                                        finanzasIndexQuery.refetch
                                                    }
                                                    onClose={onClose}
                                                />
                                            ),
                                            showCloseButton: true,
                                            isCloseInBackground: false,
                                        }));
                                    }}
                                >
                                    +
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
    return component;
}

interface CategoriesStoreEgresosProps {
    tipo_finanza_id: number;
    refetch: (clean?: boolean) => void;
    onClose: () => void;
}
function CategoriesStoreEgresos({
    tipo_finanza_id,
    refetch,
    onClose,
}: CategoriesStoreEgresosProps) {
    const categoriesFinanzasStoreMutation = categoriesFinanzasStoreApi();
    const categoriesFinanzasForn = useForm<CategoriesFinanzasStoreDto>({
        resolver: valibotVigilio(categoriesFinanzasStoreDto),
        defaultValues: { tipo_finanza_id },
    });
    function categoriesFinanzas(body: CategoriesFinanzasStoreDto) {
        categoriesFinanzasStoreMutation.mutate(body, {
            onSuccess() {
                sweetAlert({
                    icon: "success",
                    title: "Agregado correctamente",
                });
                refetch(false);
                onClose();
            },
            onError(err) {
                handlerError(categoriesFinanzasForn, err);
            },
        });
    }
    return (
        <div>
            <h1 class="font-semibold dark:text-white mb-2">
                {tipo_finanza_id === 2 ? (
                    <>
                        {" "}
                        <i class="fa-solid fa-chart-line-up" /> Ingresos
                    </>
                ) : (
                    <>
                        <i class="fa-sharp-duotone fa-solid fa-chart-line-up-down" />{" "}
                        Egresos
                    </>
                )}
            </h1>
            <Form {...categoriesFinanzasForn} onSubmit={categoriesFinanzas}>
                <Form.control
                    title="Nombre"
                    placeholder="Recibo de Agua"
                    name={"value" as keyof CategoriesFinanzasStoreDto}
                />
                <Form.control
                    title="Icono"
                    name={"icon" as keyof CategoriesFinanzasStoreDto}
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
                <Form.button.submit
                    title="Guardar"
                    disabled={
                        categoriesFinanzasStoreMutation.isLoading || false
                    }
                    isLoading={
                        categoriesFinanzasStoreMutation.isLoading || false
                    }
                />
            </Form>
        </div>
    );
}

interface CategoriesFinancesUpdateProps {
    id: number;
    refetch: (clean?: boolean) => void;
    onClose: () => void;
}
function CategoriesFinancesUpdate({
    id,
    onClose,
    refetch,
}: CategoriesFinancesUpdateProps) {
    const categoriesFinanzasShowQuery = categoriesFinanzasShowApi(id);
    let component = null;
    if (categoriesFinanzasShowQuery.isLoading) {
        component = <Loading />;
    }
    if (categoriesFinanzasShowQuery.isError) {
        component = (
            <span class="dark:text-white">
                {categoriesFinanzasShowQuery.error?.message}
            </span>
        );
    }
    if (categoriesFinanzasShowQuery.isSuccess) {
        const category_finanza =
            categoriesFinanzasShowQuery.data!.category_finanza;
        const categoriesFinanzasUpdateMutation =
            categoriesFinanzasUpdateApi(id);
        const categoriesFinanzasDestroyMutation =
            categoriesFinanzasDestroyApi();

        const categoriesFinanzasForn = useForm<CategoriesFinanzasStoreDto>({
            resolver: valibotVigilio(categoriesFinanzasStoreDto),
            defaultValues: category_finanza,
        });
        function categoriesFinanzas(body: CategoriesFinanzasStoreDto) {
            categoriesFinanzasUpdateMutation.mutate(body, {
                onSuccess() {
                    sweetAlert({
                        icon: "success",
                        title: "Editado correcmtente correctamente",
                    });
                    onClose();
                    refetch(false);
                },
                onError(err) {
                    handlerError(categoriesFinanzasForn, err);
                },
            });
        }
        component = (
            <div>
                <h1 class="font-semibold dark:text-white mb-2">
                    {category_finanza?.value}
                </h1>
                <Form {...categoriesFinanzasForn} onSubmit={categoriesFinanzas}>
                    <Form.control
                        title="Nombre"
                        placeholder="Recibo de Agua"
                        name={"value" as keyof CategoriesFinanzasStoreDto}
                    />
                    <Form.control
                        title="Icono"
                        name={"icon" as keyof CategoriesFinanzasStoreDto}
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
                    <div class="flex gap-2 items-center">
                        <Form.button.submit
                            title="Guardar"
                            disabled={
                                categoriesFinanzasUpdateMutation.isLoading ||
                                false
                            }
                            isLoading={
                                categoriesFinanzasUpdateMutation.isLoading ||
                                false
                            }
                        />
                        <button
                            class="bg-danger text-white text-xs px-4 py-2 rounded-md mt-2.5"
                            onClick={() => {
                                sweetModal({
                                    title: `Estas seguro de eliminar ${category_finanza.value}`,
                                }).then(({ isConfirmed }) => {
                                    if (isConfirmed) {
                                        categoriesFinanzasDestroyMutation.mutate(
                                            category_finanza.id,
                                            {
                                                onSuccess() {
                                                    sweetAlert({
                                                        icon: "success",
                                                        title: "Eliminado correctamente",
                                                    });
                                                    onClose();
                                                    refetch(false);
                                                },
                                                onError(data) {
                                                    sweetAlert({
                                                        icon: "danger",
                                                        title: data.message,
                                                    });
                                                },
                                            }
                                        );
                                    }
                                });
                            }}
                            disabled={
                                categoriesFinanzasDestroyMutation.isLoading ||
                                false
                            }
                            type="button"
                        >
                            {categoriesFinanzasDestroyMutation.isLoading ? (
                                <LoaderSubmit />
                            ) : (
                                <>
                                    <i class="fa-solid fa-trash" /> Eliminar
                                </>
                            )}
                        </button>
                    </div>
                </Form>
            </div>
        );
    }
    return component;
}
export default CategoriesStore;
