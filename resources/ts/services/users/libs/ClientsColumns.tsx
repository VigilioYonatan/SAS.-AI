import type { Columns } from "@vigilio/preact-table";
import { ClientsSchemaFromServer } from "../schemas/client.schema";
import { formatTelephoneNumber } from "~/libs/helpers";
import { empresaContactsSearchApi } from "@/empresas/apis/empresas.contacts.search.api";
import { empresaContactsStoreUpdateApi } from "@/empresas/apis/empresas.contacts.store.api";
import { useEffect } from "preact/hooks";
import LoaderSubmit from "~/components/LoaderSubmit";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

export type ClientsIndexSecondaryPaginator = "acciones" | "index";

const clientsColumns: Columns<
    ClientsSchemaFromServer,
    ClientsIndexSecondaryPaginator
> = [
    { key: "id", isSort: true },
    { key: "fullname", header: "Nombre Completo" },
    {
        key: "telephone",
        header: "Telephono",
        cell: (props) =>
            `+${storageEmpresa?.dial_code} ${formatTelephoneNumber(
                props.telephone
            )}`,
    },

    {
        key: "enabled",
        header: "Habilitado",
        cell: (props) => {
            return (
                <div>
                    <div
                        class={`${
                            props.enabled ? "bg-success" : "bg-danger"
                        } w-[15px] h-[15px]`}
                    />
                </div>
            );
        },
    },
    {
        key: "acciones",
        cell: (props, _index) => {
            const empresaContactsSearchQuery =
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                empresaContactsSearchApi({ value: props.telephone } as any);
            const empresaContactsStoreUpdateMutate =
                empresaContactsStoreUpdateApi();
            useEffect(() => {
                empresaContactsSearchQuery.refetch();
            }, []);
            let component: JSX.Element | JSX.Element[] | null = null;
            if (empresaContactsSearchQuery.isFetching) {
                component = <LoaderSubmit color="var(--primary)" />;
            }

            if (empresaContactsSearchQuery.isSuccess) {
                component = (
                    <>
                        {empresaContactsSearchQuery.data?.data.length ? (
                            <button
                                type="button"
                                onClick={() => {
                                    empresaContactsStoreUpdateMutate.mutate({
                                        ia: true,
                                        isFavorite: false,
                                        name: props.fullname ?? "sin nombre",
                                        telephone: props.telephone,
                                    });
                                }}
                            >
                                <i class="fab fa-whatsapp-square" />
                            </button>
                        ) : null}
                    </>
                );
            }

            return (
                <div class="flex gap-2 items-center justify-center">
                    {component}
                </div>
            );
        },
    },
];
export default clientsColumns;
