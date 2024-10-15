import { empresaContactsDestroyApi } from "@/empresas/apis/empresas.contacts.destroy.api";
import type { ContactsSchema } from "@/empresas/schemas/empresas.schema";
import type { Columns } from "@vigilio/preact-table";
import { sweetAlert, sweetModal } from "@vigilio/sweet";

export type ContactsIndexSecondaryPaginator = "acciones" | "index";

const contactsColumns: Columns<
    ContactsSchema,
    ContactsIndexSecondaryPaginator,
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    any
> = [
    {
        key: "index",
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        header: (_key, methods, data: any) => {
            return (
                <div onClick={(e) => e.stopPropagation()}>
                    <input
                        type="checkbox"
                        checked={!methods.isEmptyCheck()}
                        onChange={() => {
                            for (const value of data) {
                                methods.onCheck(value.telephone);
                            }
                        }}
                    />
                </div>
            );
        },
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        cell: (props, _i, methods: any) => (
            <div onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={methods.existCheck(props.telephone)}
                    value={props.telephone}
                    onChange={(e) => {
                        const value = (e.target as HTMLInputElement).value;

                        methods.onCheck(value);
                    }}
                />
            </div>
        ),
    },
    {
        key: "isFavorite",
        isSort: true,
        header: "Favoritos",
        cell: (props, _, methods) => (
            <button
                type="button"
                onClick={() =>
                    methods.empresaContactsUpdateMutation.mutate(
                        {
                            ...props,
                            isFavorite: !props.isFavorite,
                        },
                        {
                            onSuccess: (data: { message: string }) => {
                                methods.refetch(false);
                                sweetAlert({
                                    icon: "success",
                                    title: data.message,
                                });
                            },
                            onError: (error: { message: string }) => {
                                sweetAlert({
                                    icon: "danger",
                                    title: `Hubo un error al realizar esta acción, ${error.message}`,
                                });
                            },
                        }
                    )
                }
            >
                <i
                    class={`fa-solid fa-star ${
                        props.isFavorite ? "text-yellow-500" : ""
                    }`}
                />
            </button>
        ),
    },
    { key: "name", header: "Nombre" },
    { key: "telephone", header: "Telefono" },

    {
        key: "acciones",
        cell: (props, _, methods) => {
            const empresaContactsDestroyMutation = empresaContactsDestroyApi();

            return (
                <div class="flex gap-2 items-center justify-center">
                    <button
                        class={` border  border-black  text-white px-3 py-1.5 rounded-md ${
                            props.ia ? "bg-black" : ""
                        }`}
                        type="button"
                        aria-label="enabled ia"
                        onClick={() => {
                            sweetModal({
                                title: "Estas seguro de quitar la IA a  este usuario?",
                                text: "Este usuario ya no le responderá la IA si lo desactivas.",
                                icon: "info",
                                showCancelButton: true,
                                showCloseButton: true,
                            }).then(({ isConfirmed }) => {
                                if (isConfirmed) {
                                    methods.empresaContactsUpdateMutation.mutate(
                                        {
                                            ...props,
                                            ia: !props.ia,
                                        },
                                        {
                                            onSuccess: (data: {
                                                message: string;
                                            }) => {
                                                methods.refetch(false);
                                                sweetAlert({
                                                    icon: "success",
                                                    title: data.message,
                                                });
                                            },
                                            onError: (error: {
                                                message: string;
                                            }) => {
                                                sweetAlert({
                                                    icon: "danger",
                                                    title: `Hubo un error al realizar esta acción, ${error.message}`,
                                                });
                                            },
                                        }
                                    );
                                }
                            });
                        }}
                    >
                        <i class="fal fa-user-robot" />
                    </button>
                    <button
                        class="bg-danger text-white px-2 py-1 rounded-md"
                        onClick={() => {
                            sweetModal({
                                icon: "danger",
                                text: `Estas seguro que quieres eliminar este numero ${props.telephone}?`,
                            }).then(({ isConfirmed }) => {
                                if (isConfirmed) {
                                    empresaContactsDestroyMutation.mutate(
                                        { telephone: props.telephone },
                                        {
                                            onSuccess(data) {
                                                sweetAlert({
                                                    icon: "success",
                                                    title: data.message,
                                                });
                                                methods.refetch();
                                            },
                                            onError(error) {
                                                sweetAlert({
                                                    icon: "danger",
                                                    title: error.message,
                                                });
                                            },
                                        }
                                    );
                                }
                            });
                        }}
                        type="button"
                        aria-label="destroy"
                    >
                        <i class="fas fa-trash" />
                    </button>
                </div>
            );
        },
    },
];
export default contactsColumns;
