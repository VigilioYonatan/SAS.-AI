import Container from "@/admin/components/Container";
import useAuthStore from "@/auth/stores/auth.store";
import { useTable } from "@vigilio/preact-table";
import contactsColumns from "../libs/ContactsColumns";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import VigilioTable from "~/components/table";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { useForm } from "react-hook-form";
import { useSignal } from "@preact/signals";
import { empresaContactsUpdateApi } from "@/empresas/apis/empresas.contacts.update.api";
import {
    whatsappGetQrApi,
    whatsappRestart,
    whatsappSendMessageApi,
    whatsappSendFileApi,
} from "../apis/whatsapp.api";
import {
    delay,
    formatDateTwo,
    handlerError,
    NOW,
    restarDays,
    TimePeru,
} from "~/libs/helpers";
import {
    contactsSchema,
    empresasSchema,
    groupWhatsapp,
    type ContactsSchema,
    type GroupWhatsapp,
} from "@/empresas/schemas/empresas.schema";
import { empresaContactsIndexApi } from "@/empresas/apis/empresas.contacts.index.api";
import Form from "~/components/form";
import { valibotVigilio } from "~/libs/valibot";
import { empresaContactsStoreUpdateApi } from "@/empresas/apis/empresas.contacts.store.api";
import LoaderSubmit from "~/components/LoaderSubmit";
import { Fragment } from "preact/jsx-runtime";
import { groupWhatsappStoreApi } from "../apis/group-whatsapp.store.api";
import { groupWhatsappIndexApi } from "../apis/group-whatsapp.index.api";
import { groupWhatsappShowApi } from "../apis/group-whatsapp.show.api";
import { groupWhatsappDestroyApi } from "../apis/group-whatsapp.destroy.api";
import type { Whatsappconfig } from "../../empresas/schemas/empresas.schema";
import Loading from "@/admin/components/Loading";
import { groupWhatsappTelephoneDestroyApi } from "../apis/group-whatsapp.telephone.destroy.api";
import { empresaContactsSearchApi } from "@/empresas/apis/empresas.contacts.search.api";
import useDropdown from "~/hooks/useDropdown";
import { empresaGroupWhatsappUpdateApi } from "@/empresas/apis/empresas.group-whatsapp.update.api";
import { empresaWhatsappConfigUpdateApi } from "@/empresas/apis/empresas.whatsapp-config.api";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { whatsappLogoutApi } from "../apis/whatsapp-logout.api";
import { empresaContactsPaginatorApi } from "@/common/paginator/empresa.contacts.paginator.api";
import { empresaContactsFavoritesApi } from "@/empresas/apis/empresas.contacts.favorites.api";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useCountDown from "~/hooks/useCountDown";
import Helper from "~/components/Helper";
import { whatsappInfoImage } from "~/config/settings";
import { whatsappUpdateApi } from "../apis/whatsapp.update.api";
import { empresaContactsDestroyAllApi } from "@/empresas/apis/empresas.contacts.delete.api";
import AlertDanger from "~/components/Alerts/AlertDanger";
import { Input, pick } from "@vigilio/valibot";
import { useMutation } from "@vigilio/preact-fetching";
import { useMediaQueryNoReactive } from "~/hooks/useMediaQuery";
import AlertSuccess from "~/components/Alerts/AlertSuccess";

function Whatsapp() {
    const authStore = useAuthStore();
    const whatsappLogoutMutation = whatsappLogoutApi();
    if (!authStore.guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const empresaStore = useEmpresastore();
    const whatsappUpdateMutate = whatsappUpdateApi();
    const empresaContactsDestroyAllMutation = empresaContactsDestroyAllApi();
    const empresaContactsUpdateMutation = empresaContactsUpdateApi();
    const table = useTable({
        columns: contactsColumns,
        pagination: { limit: 20 },
        methods: { empresaContactsUpdateMutation },
    });

    const query = empresaContactsPaginatorApi(table);

    // actualizar tabla data

    function onSendALL(type: "selected" | "all" | "favorites") {
        sweetModal((onClose) => ({
            isCloseInBackground: false,
            showCloseButton: true,
            html: reactComponent(
                <ChatWhatsapp
                    type={type}
                    contacts={table.checks.value}
                    onClose={onClose}
                />
            ),
            sweetWidth: "600px",
        }));
    }
    function onStoreGroup() {
        sweetModal((onClose) => ({
            isCloseInBackground: false,
            showCloseButton: true,
            html: reactComponent(
                <GroupWhatsappStore
                    contacts={table.checks.value}
                    onClose={onClose}
                    clear={table.checks.clearChecks}
                />
            ),
            sweetWidth: "300px",
        }));
    }
    //enabled: "No estamos disponible este momento. Intentelo más tarde"
    //cerrado: "Cerrado. No estamos disponible este momento. Intentelo más tarde"
    //thank: "Muchas gracias por la compra, Su {COMPROBANTE} 😊."
    //thank2: "No olvides visitar nuestro sitio web: {URL} 😊 para tener más información de nuestros productos, como ofertas y novedades."
    //sendpdf: "Hola, Aqui {NAME_EMPRESA} le adyunta su {COMPROBANTE} 😊"
    return (
        <Container className="p-2">
            <div className=" flex flex-col gap-4">
                <AdminBreadCrumb current="Whatsapp" />
            </div>
            <div class="flex gap-2 items-center md:justify-between flex-wrap justify-center">
                <div class="flex gap-2 items-center">
                    <button
                        className="bg-success px-4 py-2 rounded-md shadow text-white mr-2 self-end  font-semibold flex items-center justify-center gap-3 text-xs"
                        type="button"
                        onClick={() => {
                            sweetModal({
                                html: reactComponent(<QrWhatsapp />),
                                showCloseButton: true,
                                isCloseInBackground: false,
                            });
                        }}
                    >
                        <i class="fab fa-whatsapp text-lg" /> Conectar Whatsapp
                    </button>
                    <button
                        className=" px-4 py-3.5 relative rounded-md bg-black shadow text-white mr-2 self-end  font-bold flex items-center justify-center gap-3 text-xs"
                        type="button"
                        onClick={() => {
                            sweetModal({
                                html: reactComponent(<WhatsappFREE />),
                                showCloseButton: true,
                                isCloseInBackground: false,
                                sweetWidth: "1200px",
                                position: useMediaQueryNoReactive(
                                    "(min-width:700px)"
                                )
                                    ? "center"
                                    : "start",
                            });
                        }}
                    >
                        WHATSAPP
                        <span class="absolute rotate-[45deg] -top-2 -right-5 text-[10px] bg-primary py-1 px-2 rounded-md">
                            {storageEmpresa?.whatsapp_mode.type === "FREE"
                                ? "GRATIS"
                                : "VPS"}
                        </span>
                    </button>
                </div>

                <div class="flex gap-2 items-center">
                    <button
                        class="flex gap-2 items-center  dark:bg-admin-terciary bg-paper-light dark:text-white  rounded-md px-4 py-2 shadow"
                        type="button"
                        onClick={() => {
                            sweetModal({
                                html: reactComponent(
                                    <MessagesWhatsappSettings />
                                ),
                                showCloseButton: true,
                                isCloseInBackground: false,
                            });
                        }}
                    >
                        <i class="fas fa-cogs" />
                    </button>
                    <button
                        type="button"
                        class="text-white bg-danger px-2 py-1 rounded-md shadow mr-2"
                        disabled={whatsappLogoutMutation.isLoading || false}
                        aria-label="close whatsapp"
                        onClick={() => {
                            sweetModal({
                                icon: empresaStore.state?.enabledBot
                                    ? "danger"
                                    : "success",
                                title: `¿Estas seguro de ${
                                    empresaStore.state?.enabledBot
                                        ? "detener"
                                        : "iniciar"
                                }  sesión whatsapp?`,
                                text: `Se  ${
                                    empresaStore.state?.enabledBot
                                        ? "detenendrá"
                                        : "iniciará"
                                } sesión whatsapp.`,
                                isCloseInBackground: false,
                                showCancelButton: true,
                            }).then(({ isConfirmed }) => {
                                if (isConfirmed) {
                                    whatsappLogoutMutation.mutate(null, {
                                        onSuccess() {
                                            if (
                                                empresaStore.state?.enabledBot
                                            ) {
                                                empresaStore.methods.updateempresa(
                                                    {
                                                        enabledBot: false,
                                                    }
                                                );
                                            } else {
                                                empresaStore.methods.updateempresa(
                                                    {
                                                        enabledBot: true,
                                                    }
                                                );
                                            }
                                            sweetAlert({
                                                icon: "success",
                                                title: "Se cerro sessión correctamente. Espero unos segundos para el reinicio",
                                                height: 60,
                                            });
                                        },
                                        onError() {
                                            sweetAlert({
                                                icon: "danger",
                                                title: "¿Se cerró sesión de whatsapp. y se reinicio qr.",
                                                height: 60,
                                            });
                                        },
                                    });
                                }
                            });
                        }}
                    >
                        {whatsappLogoutMutation.isLoading ? (
                            <LoaderSubmit />
                        ) : (
                            <>
                                {empresaStore.state!.enabledBot ? (
                                    <i class="fas fa-stop" />
                                ) : (
                                    <i class="fas fa-play" />
                                )}
                            </>
                        )}
                    </button>
                    <button
                        disabled={whatsappUpdateMutate.isLoading || false}
                        type="button"
                        aria-label="update"
                        class="relative bg-blue-600 text-white px-2 py-2 rounded-md shadow text-xs"
                        onClick={() => {
                            sweetModal({
                                title: "¿Estas seguro que quieres actualizar WhatsApp?",
                                showCancelButton: true,
                                showCloseButton: true,
                            }).then(({ isConfirmed }) => {
                                if (isConfirmed) {
                                    whatsappUpdateMutate.mutate(null, {
                                        onSuccess() {
                                            sweetAlert({
                                                icon: "success",
                                                title: "WhatsApp Actualizado Correctamente.",
                                            });
                                        },
                                        onError() {
                                            sweetAlert({
                                                icon: "danger",
                                                title: "Hubo un problema al actualizar whatsApp.",
                                            });
                                        },
                                    });
                                }
                            });
                        }}
                    >
                        {whatsappUpdateMutate.isLoading ? (
                            <LoaderSubmit />
                        ) : (
                            <>
                                <i class="fas fa-sync-alt" /> Actualizar
                            </>
                        )}

                        <Helper top={1} right={1}>
                            <b class="w-[100px]">
                                Actualizar a Whatsapp la ultima versión <br />
                                Usar cuando WhatsApp no esté funcionando.
                            </b>
                        </Helper>
                    </button>
                </div>
            </div>

            <div class="flex flex-wrap items-center gap-3  justify-between">
                <div class="flex flex-col md:flex-row gap-2 items-center w-full  justify-center">
                    <button
                        type="button"
                        onClick={() => {
                            sweetModal({
                                html: reactComponent(
                                    <StoreContact refetch={query.refetch} />
                                ),
                                showCloseButton: true,
                                isCloseInBackground: false,
                            });
                        }}
                        aria-label="send all"
                        class=" px-2 py-2 rounded-md dark:text-white text-sm flex  gap-2 items-center font-semibold  w-full justify-center  shadow bg-paper-light   dark:bg-admin-terciary"
                    >
                        <i class="fas fa-user" /> Agregar Nuevo contacto
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            sweetModal({
                                html: reactComponent(<GroupIndex />),
                                showCloseButton: true,
                                isCloseInBackground: false,
                            });
                        }}
                        aria-label="send all"
                        class=" px-2 py-2 rounded-md dark:text-white text-sm flex  gap-2 items-center font-semibold  w-full justify-center  shadow bg-paper-light   dark:bg-admin-terciary"
                    >
                        <i class="fa-duotone fa-people-group" /> Ver grupos
                    </button>
                </div>

                <div class="flex gap-2  w-full justify-center flex-col md:flex-row items-center">
                    <button
                        type="button"
                        onClick={() => onSendALL("favorites")}
                        aria-label="send all"
                        class=" px-2 py-2 rounded-md dark:text-white text-sm flex  gap-2 items-center font-semibold  w-full justify-center  shadow bg-paper-light   dark:bg-admin-terciary"
                    >
                        <span>
                            <i class="fas fa-star" /> Enviar solo a favoritos
                        </span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onSendALL("all")}
                        aria-label="send all"
                        class=" px-2 py-2 rounded-md dark:text-white text-sm flex  gap-2 items-center font-semibold  w-full justify-center  shadow bg-paper-light   dark:bg-admin-terciary"
                    >
                        <span>
                            <i class="fa-brands fa-whatsapp" /> Enviar a todos
                        </span>
                    </button>
                </div>
            </div>
            {table.checks.value.length ? (
                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => onSendALL("selected")}
                        aria-label="send all"
                        class="bg-blue-600 px-2 py-2  rounded-md text-white text-sm  shadow-md w-full"
                    >
                        <i class="fa-brands fa-whatsapp" /> Enviar a
                        seleccionados <b>{table.checks.value.length}</b>
                    </button>
                    <button
                        type="button"
                        onClick={() => onStoreGroup()}
                        aria-label="send all"
                        class="bg-blue-600 px-2 py-2  rounded-md text-white text-sm  shadow-md w-full"
                    >
                        <i class="fa-duotone fa-people-group" /> Agregar a grupo{" "}
                        <b>{table.checks.value.length}</b>
                    </button>
                </div>
            ) : (
                <></>
            )}
            <AlertInfo>
                <span class="font-semibold">
                    Seleccione a un(a)s usuario para enviar mensajes
                </span>
            </AlertInfo>
            <div class="overflow-auto ">
                <VigilioTable query={query} table={table}>
                    <VigilioTable.header>
                        <VigilioTable.header.tools
                            hiddenDelete
                            placeholderSearch="Buscar por nombre"
                        />
                        <div class="flex gap-1 items-center">
                            <VigilioTable.header.limit />
                            <button
                                type="button"
                                class="text-xs text-white bg-danger font-semibold px-4 py-2 rounded-md shadow"
                                disabled={
                                    empresaContactsDestroyAllMutation.isLoading ||
                                    false
                                }
                                onClick={() => {
                                    sweetModal({
                                        icon: "info",
                                        showCloseButton: true,
                                        showCancelButton: true,
                                        title: "¿Estas seguro de formatear la lista, grupos, etc de Whatsapp?",
                                    }).then(({ isConfirmed }) => {
                                        if (isConfirmed) {
                                            empresaContactsDestroyAllMutation.mutate(
                                                null,
                                                {
                                                    onSuccess(data) {
                                                        sweetAlert({
                                                            icon: "success",
                                                            title: data.message,
                                                        });
                                                    },
                                                    onError() {
                                                        sweetAlert({
                                                            icon: "danger",
                                                            title: "Hubo un error al formatear whatsapp",
                                                        });
                                                    },
                                                }
                                            );
                                        }
                                    });
                                }}
                            >
                                {empresaContactsDestroyAllMutation.isLoading ? (
                                    <LoaderSubmit />
                                ) : (
                                    <>
                                        <i class="fas fa-trash" /> Formatear
                                    </>
                                )}
                            </button>
                        </div>
                    </VigilioTable.header>
                    <VigilioTable.table>
                        <VigilioTable.thead>
                            <VigilioTable.thead.row>
                                <VigilioTable.thead.th />
                            </VigilioTable.thead.row>
                        </VigilioTable.thead>
                        <VigilioTable.tbody>
                            <VigilioTable.tbody.row>
                                {(data) => (
                                    <VigilioTable.tbody.td data={data} />
                                )}
                            </VigilioTable.tbody.row>
                        </VigilioTable.tbody>
                    </VigilioTable.table>
                    <VigilioTable.footer>
                        <VigilioTable.footer.paginator />
                        <VigilioTable.footer.show />
                    </VigilioTable.footer>
                </VigilioTable>
            </div>
        </Container>
    );
}

interface ChatWhatsappProps {
    contacts: number[];
    type: "favorites" | "all" | "selected";
    onClose: () => void;
}
function ChatWhatsapp({ contacts, type, onClose }: ChatWhatsappProps) {
    const messages = useSignal<(string | File)[]>([]);
    const messageForm = useForm<{ message: string }>({});
    const delayValue = useSignal(15);
    const botSendMessageMutation = whatsappSendMessageApi();
    const whatsappSendFileMutation = whatsappSendFileApi();
    const empresaFavoritesMutation = empresaContactsFavoritesApi();
    const empresaContactsMutation = empresaContactsIndexApi();
    const messageSuccess = useSignal<string | null>(null);
    const isLoading = useSignal<boolean>(false);

    function onSendMessage(data: { message: string }) {
        messages.value = [...messages.value, data.message];
        messageForm.reset();
    }

    function removeMessage(message: string | File) {
        messages.value = messages.value.filter((m) => m !== message);
    }
    async function sendMessage() {
        if (!messages.value.length) return;
        sweetModal({
            title: "¿Estás seguro de enviar mensajes de whatsapp?",
            customIcon:
                "<i class='fa-brands fa-whatsapp text-3xl dark:text-white' ></i>",
            showCloseButton: true,
            showCancelButton: true,
        }).then(async ({ isConfirmed }) => {
            if (isConfirmed) {
                if (type === "selected") {
                    await send(contacts as unknown as string[]);
                    return;
                }
                if (type === "all") {
                    empresaContactsMutation.mutate(null, {
                        async onSuccess(data) {
                            await send(
                                data.data.map((contact) =>
                                    String(contact.telephone)
                                )
                            );
                        },
                    });
                    return;
                }
                if (type === "favorites") {
                    empresaFavoritesMutation.mutate(null, {
                        async onSuccess(data) {
                            await send(
                                data.favorites.map((contact) =>
                                    String(contact.telephone)
                                )
                            );
                        },
                    });
                    return;
                }
            }
        });
    }

    async function send(contacts: string[]) {
        isLoading.value = true;
        for (const contact of contacts) {
            await delay(delayValue.value);

            for (const message of messages.value) {
                if (message instanceof File) {
                    whatsappSendFileMutation.mutateAsync({
                        file: message,
                        telephone: String(contact),
                    });
                } else {
                    await botSendMessageMutation.mutateAsync({
                        message,
                        telephone: String(contact),
                    });
                }

                await delay(2);
            }
            messageSuccess.value = `Se envió correctamente mensaje a ${contact}`;
        }
        isLoading.value = false;
        messageSuccess.value = null;
        messages.value = [];
        sweetAlert({
            icon: "success",
            title: "Se envio los mensajes correctamente.",
        });
        onClose();
    }
    return (
        <div class="p-2 relative rounded-md overflow-hidden">
            <h3 class="text-xl text-primary font-bold text-center flex justify-center items-center">
                {type === "all"
                    ? "Enviar a todos"
                    : type === "favorites"
                    ? "Enviar a favoritos"
                    : `Enviar a seleccionados ${contacts?.length}`}
            </h3>
            <div class="flex flex-col h-[520px] gap-1.5 m-1 overflow-auto form-chat mb-12  p-3">
                {messages.value.length ? (
                    <>
                        {messages.value.map((message) => (
                            <Fragment key={message}>
                                {message instanceof File ? (
                                    <div class=" font-normal bg-[#E1FEC4] px-2 py-1 rounded-md self-end flex flex-col relative">
                                        {message.type.includes("image") ? (
                                            <img
                                                width={100}
                                                height={100}
                                                src={URL.createObjectURL(
                                                    message
                                                )}
                                                alt=""
                                            />
                                        ) : (
                                            <span>
                                                Archivo:{" "}
                                                <span class="underline">
                                                    {message.name}
                                                </span>{" "}
                                            </span>
                                        )}
                                        <button
                                            type="button"
                                            class="bg-danger text-white w-[15px] h-[15px] rounded-full absolute -top-2 -right-2 flex justify-center items-center"
                                            aria-label="remove"
                                            onClick={() =>
                                                removeMessage(message)
                                            }
                                        >
                                            x
                                        </button>
                                    </div>
                                ) : (
                                    <div class=" font-normal bg-[#E1FEC4] px-2 py-1 rounded-md self-end flex flex-col relative">
                                        <p class="text-sm font-semibold">
                                            {message}
                                        </p>
                                        <button
                                            type="button"
                                            class="bg-danger text-white w-[15px] h-[15px] rounded-full absolute -top-2 -right-2 flex justify-center items-center"
                                            aria-label="remove"
                                            onClick={() =>
                                                removeMessage(message)
                                            }
                                        >
                                            x
                                        </button>
                                    </div>
                                )}
                            </Fragment>
                        ))}
                    </>
                ) : (
                    <span class="text-center block dark:text-white">
                        No se ha escrito mensaje
                    </span>
                )}
            </div>
            {messageSuccess.value ? (
                <h3 class="text-white py-2 px-1 bg-success  mb-8 ">
                    <i class="fa-solid fa-check" /> {messageSuccess.value}
                </h3>
            ) : null}
            <form
                onSubmit={messageForm.handleSubmit(onSendMessage)}
                class="absolute bottom-0 right-0 left-0  flex   overflow-auto  h-[38px] shadow rounded-md"
            >
                <input
                    class="w-full  outline-none px-1 bg-paper-light dark:bg-admin-terciary dark:text-white "
                    type="text"
                    {...messageForm.register("message", {
                        required: {
                            message: "Este campo es obligatorio",
                            value: true,
                        },
                    })}
                    placeholder="Escribir mensaje"
                />
                <button
                    class="px-4 py-2 flex justify-center items-center dark:text-white   font-light bg-primary"
                    type="submit"
                    aria-label="send message"
                >
                    <i class="fa-solid fa-paper-plane-top" />
                </button>
                <div class="relative">
                    <input
                        type="number"
                        value={delayValue.value}
                        onChange={(e) => {
                            const delay = Number(
                                (e.target as HTMLInputElement).value
                            );
                            if (delay < 15) {
                                delayValue.value = 15;
                                return;
                            }
                            delayValue.value = delay;
                        }}
                        class="w-[60px] h-full  bg-paper-light dark:bg-admin-terciary dark:text-white  pl-2"
                    />
                    <span class="text-[8px] dark:text-white absolute  w-full left-2 top-6 z-10">
                        seg x mensaje
                    </span>
                </div>

                <label
                    class="px-4 dark:text-white border border-gray-600 flex justify-center items-center"
                    type="button"
                    id="file"
                >
                    <i class="fa-solid fa-image" />
                    <input
                        type="file"
                        hidden
                        id="file"
                        onChange={(e) => {
                            messages.value = [
                                ...messages.value,
                                ...(e.target as HTMLInputElement).files!,
                            ];
                        }}
                        accept="image/*"
                    />
                </label>
                <label
                    class="px-4 dark:text-white border border-gray-600 flex justify-center items-center"
                    type="button"
                    id="file2"
                >
                    <i class="fa-solid fa-paperclip" />
                    <input
                        type="file"
                        hidden
                        id="file2"
                        onChange={(e) => {
                            messages.value = [
                                ...messages.value,
                                ...(e.target as HTMLInputElement).files!,
                            ];
                        }}
                        accept=".doc, .docx, .pdf"
                    />
                </label>
                {messages.value.length ? (
                    <button
                        class="px-4 py-2 flex justify-center relative items-center text-white font-light bg-green-600 ml-2 rounded-md  "
                        type="submit"
                        aria-label="send message"
                        onClick={() => sendMessage()}
                        disabled={botSendMessageMutation.isLoading || false}
                    >
                        {isLoading.value ? (
                            <LoaderSubmit />
                        ) : (
                            <>
                                <i class="fa-brands fa-whatsapp mr-1" /> Enviar
                            </>
                        )}

                        {type === "selected" ? (
                            <span class="absolute -top-0 -right-0 w-[20px] h-[20px] font-bold rounded-full bg-danger text-white flex justify-center items-center z-[99]">
                                {contacts.length}
                            </span>
                        ) : null}
                    </button>
                ) : null}
            </form>

            <style jsx>{`
                .form-chat {
                    scrollbar-color: black;
                    scrollbar-width: thin;
                }
            `}</style>
        </div>
    );
}

interface StoreContactProps {
    refetch: (clean?: boolean) => void;
}

function StoreContact({ refetch }: StoreContactProps) {
    const storeContact = useForm<ContactsSchema>({
        resolver: valibotVigilio(contactsSchema),
        defaultValues: { ia: true },
    });
    const empresaContactsStoreUpdateMutation = empresaContactsStoreUpdateApi();

    function onAddContact(body: ContactsSchema) {
        sweetModal({
            title: "¿Estás seguro de agregar este contacto en whatsapp?",
            customIcon:
                "<i class='fa-brands fa-whatsapp text-3xl dark:text-white' ></i>",
            showCloseButton: true,
            showCancelButton: true,
        }).then(async ({ isConfirmed }) => {
            if (isConfirmed) {
                empresaContactsStoreUpdateMutation.mutate(body, {
                    onSuccess(data) {
                        sweetAlert({ title: data.message, icon: "success" });
                        refetch(false);
                    },
                    onError(error) {
                        handlerError(storeContact, error);
                    },
                });
            }
        });
    }
    return (
        <>
            <h2 class="dark:text-white text-xl mb-4 uppercase">
                <i class="fas fa-user" /> Agregar contacto
            </h2>{" "}
            <Form {...storeContact} onSubmit={onAddContact}>
                <Form.control
                    name={"name" as keyof ContactsSchema}
                    placeholder="XXXX"
                    title="Nombre del contacto"
                />
                <Form.control
                    name={"telephone" as keyof ContactsSchema}
                    placeholder="9XXXXXX"
                    title="Nombre del contacto"
                    ico={<span>+{storageEmpresa?.dial_code}</span>}
                />
                <Form.control.toggle
                    name={"isFavorite" as keyof ContactsSchema}
                    title="Favorito"
                />
                <Form.button.submit
                    title="Guardar Contacto"
                    disabled={
                        empresaContactsStoreUpdateMutation.isLoading || false
                    }
                    isLoading={
                        empresaContactsStoreUpdateMutation.isLoading || false
                    }
                />
            </Form>
        </>
    );
}

export function QrWhatsapp() {
    const whatsappRestartMutation = whatsappRestart();
    const { state } = useEmpresastore();

    return (
        <div class="flex flex-col gap-4 justify-center items-center">
            <h3 class="text-xl font-bold text-paper-light flex items-center gap-2 text-primary">
                <span>Conectar bot de WhatsApp</span>{" "}
                <i class="fa-duotone fa-message-bot" />
            </h3>
            <br />
            {restarDays(NOW().toDate(), state!.timeWhatsapp, "seconds") >= 0 ? (
                <>
                    {(() => {
                        const countdown = useCountDown(
                            storageEmpresa!.timeWhatsapp
                        );
                        return (
                            <div class="flex justify-center items-center flex-col gap-2">
                                <span class="dark:text-white">
                                    Se está generando Whatsapp Código QR
                                </span>
                                <div class="flex gap-2 items-center">
                                    <span class="text-3xl font-bold  dark:text-white">
                                        {countdown.minutes}
                                    </span>
                                    <span class="text-3xl font-bold  dark:text-white">
                                        {" "}
                                        :{" "}
                                    </span>
                                    <span class="text-3xl font-bold  dark:text-white">
                                        {countdown.seconds}
                                    </span>
                                </div>
                                <AlertInfo>
                                    <div class="flex flex-col">
                                        <b>Recomendación:</b>
                                        No mover la cámara bruscamente a la hora
                                        de escanear el QR.
                                    </div>
                                </AlertInfo>
                            </div>
                        );
                    })()}
                </>
            ) : (
                <>
                    {(() => {
                        const qrCodeQuery = whatsappGetQrApi();
                        return (
                            <>
                                <p class="text-md text-center dark:text-white font-bold flex gap-1 items-center">
                                    Escanea este codigo Qr en ajustes de tu
                                    whatsapp
                                    {"  "}
                                    <button
                                        class="relative block"
                                        type="button"
                                    >
                                        <Helper top={10} right={10}>
                                            <img
                                                src={whatsappInfoImage()}
                                                width={300}
                                                height={300}
                                                alt=""
                                            />
                                        </Helper>
                                    </button>
                                </p>
                                {qrCodeQuery.isLoading && (
                                    <p class="dark:text-white">
                                        Cargando QR...
                                    </p>
                                )}
                                {qrCodeQuery.data && (
                                    <div class="relative flex flex-col  gap-2">
                                        <img
                                            width={300}
                                            height={300}
                                            src={URL.createObjectURL(
                                                qrCodeQuery.data
                                            )}
                                            class="rounded-lg"
                                            alt="bot whatsapp"
                                        />
                                        <div class="flex justify-between gap-2">
                                            <div />
                                            <button
                                                type="button"
                                                class="self-end bg-black bg-opacity-60 w-[30px] h-[30px] flex justify-center items-center rounded-md"
                                                disabled={
                                                    whatsappRestartMutation.isLoading ||
                                                    false
                                                }
                                                onClick={() => {
                                                    whatsappRestartMutation.mutate(
                                                        null,
                                                        {
                                                            onSuccess() {
                                                                sweetAlert({
                                                                    icon: "success",
                                                                    title: "Reinciado correctamente whatsapp",
                                                                }).then(() => {
                                                                    window.location.reload();
                                                                });
                                                            },
                                                            onError() {
                                                                sweetAlert({
                                                                    icon: "success",
                                                                    title: "Reinciado correctamente whatsapp",
                                                                }).then(() => {
                                                                    window.location.reload();
                                                                });
                                                            },
                                                        }
                                                    );
                                                }}
                                            >
                                                {whatsappRestartMutation.isLoading ? (
                                                    <LoaderSubmit />
                                                ) : (
                                                    <i class="fa-solid fa-rotate-right text-white text-xl" />
                                                )}
                                            </button>
                                            <div />
                                        </div>
                                    </div>
                                )}
                                <ul class="list-image-none flex flex-col gap-2">
                                    {/* <a
                                        target="_blank"
                                        rel="noreferrer"
                                        href="/api/whatsapp/qr"
                                        class="text-xs text-primary font-semibold hover:underline text-center"
                                    >
                                        Click aquí para obtener el QR sin
                                        esperar
                                    </a> */}
                                    <li class="dark:text-white text-center text-sm">
                                        *Si no está funcionando el qr. Intentelo
                                        2 - 3 veces{" "}
                                        <i class="fa-solid fa-rotate-right text-white " />
                                    </li>{" "}
                                    <li class="dark:text-white text-center text-sm">
                                        *Si se conectó correctamente, esperar
                                        unos minutos para añadir tus contactos
                                        automáticamente.{" "}
                                    </li>
                                </ul>
                            </>
                        );
                    })()}
                </>
            )}
        </div>
    );
}
interface GroupStoreProps {
    contacts: number[];
    onClose: () => void;
    clear: () => void;
}
function GroupWhatsappStore({ contacts, onClose, clear }: GroupStoreProps) {
    const groupWhatsappStoreMutation = groupWhatsappStoreApi();
    const groupStoreForm = useForm<GroupWhatsapp>({
        resolver: valibotVigilio(groupWhatsapp),
        defaultValues: {
            members: contacts.map((contact) => contact.toString()),
        },
    });
    function onGroupStore(body: GroupWhatsapp) {
        groupWhatsappStoreMutation.mutate(body, {
            onSuccess(data) {
                sweetAlert({ icon: "success", title: data.message });
                clear();
                onClose();
            },

            onError(error) {
                handlerError(groupStoreForm, error);
            },
        });
    }
    return (
        <div>
            <div class="flex items-center ">
                <h1 class="dark:text-white font-bold text-xl  text-center flex-1">
                    Crear Grupo
                </h1>
            </div>
            <Form
                className="w-full"
                {...groupStoreForm}
                onSubmit={onGroupStore}
            >
                <Form.control
                    name={"name" as keyof GroupWhatsapp}
                    placeholder="Grupo 1"
                    title="Nombre"
                />
                <div class="break-words">
                    <span class="text-primary ">
                        Numeros de telefonos <b>{contacts.length}</b>
                    </span>
                    <div class="dark:text-white h-[100px]  break-words overflow-auto  text-wrap">
                        <pre class="break-words text-wrap">
                            {JSON.stringify(contacts)}
                        </pre>
                    </div>
                </div>

                <Form.button.submit
                    title="Guardar"
                    ico={null}
                    isLoading={groupWhatsappStoreMutation.isLoading || false}
                    disabled={groupWhatsappStoreMutation.isLoading || false}
                />
            </Form>
        </div>
    );
}

function GroupIndex() {
    const groupWhatsappDestroyMutation = groupWhatsappDestroyApi();
    const groupWhatsappStoreQuery = groupWhatsappIndexApi();
    if (groupWhatsappStoreQuery.isLoading) return null;
    return (
        <div>
            <div class="flex  mb-6 items-center ">
                <h1 class="dark:text-white font-bold text-xl mb-2 text-center flex-1">
                    Grupos
                </h1>
            </div>
            <div class="grid grid-cols-2 gap-2">
                {groupWhatsappStoreQuery.data?.data.length ? (
                    <>
                        {groupWhatsappStoreQuery.data?.data.map((group) => (
                            <div
                                type="button"
                                class="flex gap-2 items-center justify-center dark:bg-admin-terciary bg-paper-light rounded-md shadow p-1 dark:text-white "
                                key={group.name}
                                onClick={() => {
                                    sweetModal({
                                        html: reactComponent(
                                            <GroupWhatsappShow
                                                refetch={
                                                    groupWhatsappStoreQuery.refetch
                                                }
                                                name={group.name}
                                            />
                                        ),
                                        showCloseButton: true,
                                        isCloseInBackground: false,
                                    });
                                }}
                            >
                                <div class="flex flex-col gap-1 items-center">
                                    <span class="dark:text-white">
                                        {group.name}
                                    </span>
                                    <i class="fa-duotone fa-people-group" />
                                    <span>{group.members.length}</span>
                                    <button
                                        type="button"
                                        class="bg-danger px-2 py-1 rounded-md text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            sweetModal({
                                                icon: "info",
                                                title: "Estas seguro de eliminar este grupo?",
                                                showCloseButton: true,
                                                showCancelButton: true,
                                            }).then(({ isConfirmed }) => {
                                                if (isConfirmed) {
                                                    groupWhatsappDestroyMutation.mutate(
                                                        group.name,
                                                        {
                                                            onSuccess(data) {
                                                                sweetAlert({
                                                                    title: data.message,
                                                                    icon: "success",
                                                                });
                                                                groupWhatsappStoreQuery.refetch(
                                                                    false
                                                                );
                                                            },
                                                            onError(error) {
                                                                sweetAlert({
                                                                    title: error.message,
                                                                    icon: "danger",
                                                                });
                                                            },
                                                        }
                                                    );
                                                }
                                            });
                                        }}
                                    >
                                        <i class="fas fa-trash" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <h3
                        class="dark:text-white col-span-2 text-center
                    "
                    >
                        No hay miembros
                    </h3>
                )}
            </div>
        </div>
    );
}

interface GroupWhatsappShowProps {
    name: string;
    refetch: (clean?: boolean) => void;
}
function GroupWhatsappShow({ name, refetch }: GroupWhatsappShowProps) {
    const groupWhatsappShowQuery = groupWhatsappShowApi(name);

    let component: JSX.Element | null = null;
    if (groupWhatsappShowQuery.isLoading) {
        component = <Loading />;
    }
    if (groupWhatsappShowQuery.isSuccess) {
        const groupWhatsappTelephoneDestroyMutation =
            groupWhatsappTelephoneDestroyApi();
        const empresaGroupWhatsappUpdateMutation =
            empresaGroupWhatsappUpdateApi();
        const value = useSignal("");
        const isOpenMoreMembers = useSignal(false);
        const empresaContactsSearchQuery = empresaContactsSearchApi(value);
        const newContacts = useSignal<
            {
                name: string;
                telephone: string;
                isFavorite: boolean;
            }[]
        >([]);
        const dropdown = useDropdown();

        component = (
            <div>
                <div class="flex justify-between">
                    <div class="" />
                    <span class="dark:text-white mb-2 block font-bold text-xl text-center">
                        {name}
                    </span>
                    <button
                        type="button"
                        class="text-xl text-white bg-primary px-3 py-1 rounded-md mr-7"
                        onClick={() => {
                            isOpenMoreMembers.value = !isOpenMoreMembers.value;
                        }}
                    >
                        +
                    </button>
                </div>
                {isOpenMoreMembers.value ? (
                    <>
                        {" "}
                        <div class="flex gap-2 mb-2 relative mt-2">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    dropdown.onOpen();
                                    empresaContactsSearchQuery.refetch(false);
                                }}
                                class="flex gap-2 w-full shadow p-1 rounded-md overflow-hidden border border-primary"
                            >
                                <input
                                    class="w-full border-none outline-none bg-transparent dark:text-white"
                                    type="text"
                                    placeholder="Digite nombre"
                                    onChange={(e) => {
                                        value.value = (
                                            e.target as HTMLInputElement
                                        ).value;
                                    }}
                                />
                                <button
                                    type="submit"
                                    class="bg-primary px-3 py-2 rounded-md text-white "
                                >
                                    Buscar
                                </button>
                            </form>
                            {empresaContactsSearchQuery.isSuccess &&
                            dropdown.dropdownOpen ? (
                                <div class="absolute dark:bg-admin-terciary bg-white shadow p-2 top-6 w-full">
                                    {empresaContactsSearchQuery.data?.data
                                        .length ? (
                                        <div
                                            class={`flex flex-col ${
                                                dropdown.dropdownOpen
                                                    ? ""
                                                    : "hidden"
                                            }`}
                                        >
                                            {empresaContactsSearchQuery.data?.data.map(
                                                (contact) => (
                                                    <div
                                                        class="flex  gap-2 items-center tex-xs justify-between my-1"
                                                        key={contact.telephone}
                                                    >
                                                        <span class="text-sm dark:text-white">
                                                            {contact.name} |{" "}
                                                            {contact.telephone}
                                                        </span>
                                                        {groupWhatsappShowQuery.data?.group.members.find(
                                                            (member) =>
                                                                member.telephone ===
                                                                contact.telephone
                                                        ) ? (
                                                            <i class="fas fa-empty-set mx-auto" />
                                                        ) : (
                                                            <button
                                                                onClick={() => {
                                                                    const existContact =
                                                                        newContacts.value.find(
                                                                            (
                                                                                co
                                                                            ) =>
                                                                                co.telephone ===
                                                                                contact.telephone
                                                                        );
                                                                    if (
                                                                        existContact
                                                                    ) {
                                                                        newContacts.value =
                                                                            newContacts.value.filter(
                                                                                (
                                                                                    cont
                                                                                ) =>
                                                                                    cont.telephone !==
                                                                                    contact.telephone
                                                                            );
                                                                        return;
                                                                    }
                                                                    sweetAlert({
                                                                        icon: "success",
                                                                        title: "Agregado correctamente",
                                                                    });
                                                                    newContacts.value =
                                                                        [
                                                                            ...newContacts.value,
                                                                            contact,
                                                                        ];
                                                                }}
                                                                type="button"
                                                                class="bg-primary px-3 py-2 rounded-md text-white"
                                                            >
                                                                {newContacts.value.some(
                                                                    (co) =>
                                                                        co.telephone ===
                                                                        contact.telephone
                                                                )
                                                                    ? "-"
                                                                    : "+"}
                                                            </button>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                            <button
                                                type="button"
                                                class="dark:text-white w-full text-center"
                                                onClick={() => {
                                                    dropdown.onClose();
                                                }}
                                            >
                                                Cerrar
                                            </button>
                                        </div>
                                    ) : (
                                        <span class="dark:text-white">
                                            No hay contactos encontrados
                                        </span>
                                    )}
                                </div>
                            ) : null}
                        </div>
                    </>
                ) : null}

                {newContacts.value.length ? (
                    <div class="bg-paper-light dark:bg-admin-terciary p-2 rounded-md my-2 flex flex-col">
                        {newContacts.value.map((contact) => (
                            <div
                                key={contact.telephone}
                                class=" dark:text-white flex justify-between"
                            >
                                <span class="py-1">
                                    {contact.name} - {contact.telephone}{" "}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        newContacts.value =
                                            newContacts.value.filter(
                                                (c) =>
                                                    c.telephone !==
                                                    contact.telephone
                                            );
                                    }}
                                >
                                    x
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            class="dark:text-white  mt-2"
                            onClick={() => {
                                empresaGroupWhatsappUpdateMutation.mutate(
                                    {
                                        name,
                                        members: [
                                            ...groupWhatsappShowQuery.data!.group.members.map(
                                                (v) => v.telephone
                                            ),
                                            ...newContacts.value.map(
                                                (v) => v.telephone
                                            ),
                                        ],
                                    },
                                    {
                                        onSuccess() {
                                            sweetAlert({
                                                title: "Se editó grupo",
                                            });
                                            groupWhatsappShowQuery.refetch();
                                            newContacts.value = [];
                                        },
                                    }
                                );
                            }}
                        >
                            {empresaGroupWhatsappUpdateMutation.isLoading ? (
                                <LoaderSubmit />
                            ) : (
                                "Agregar y actualizar"
                            )}
                        </button>
                    </div>
                ) : null}

                <div class="grid grid-cols-2 gap-2  h-[500px] overflow-auto my-2">
                    {groupWhatsappShowQuery.data?.group.members.map(
                        (member) => (
                            <div
                                class="dark:bg-admin-terciary bg-paper-light p-1 rounded-md dark:text-white  self-start gap-2 items-center flex justify-between cursor-pointer"
                                key={member.telephone}
                            >
                                <span class="text-black dark:text-white">
                                    {member.name} | {member.telephone}
                                </span>
                                <button
                                    onClick={() => {
                                        sweetModal({
                                            icon: "info",
                                            title: `Estas seguro de eliminar este miembro ${member.name}?`,
                                            showCloseButton: true,
                                            showCancelButton: true,
                                        }).then(({ isConfirmed }) => {
                                            if (isConfirmed) {
                                                groupWhatsappTelephoneDestroyMutation.mutate(
                                                    {
                                                        name,
                                                        telephone:
                                                            member.telephone,
                                                    },
                                                    {
                                                        onSuccess(data) {
                                                            sweetAlert({
                                                                title: data.message,
                                                                icon: "success",
                                                            });
                                                            groupWhatsappShowQuery.refetch(
                                                                false
                                                            );
                                                            refetch(false);
                                                        },
                                                        onError(error) {
                                                            sweetAlert({
                                                                title: error.message,
                                                                icon: "danger",
                                                            });
                                                        },
                                                    }
                                                );
                                            }
                                        });
                                    }}
                                    type="button"
                                    class=" text-white bg-danger px-2 py-1 rounded-md "
                                >
                                    <i class="fas fa-trash" />
                                </button>
                            </div>
                        )
                    )}
                </div>
                {groupWhatsappShowQuery.data?.group.members.length ? (
                    <button
                        type="button"
                        class="px-3 py-2 rounded-md text-white bg-primary  mt-3"
                        aria-label="send message group"
                        onClick={() => {
                            sweetModal((onClose) => ({
                                isCloseInBackground: false,
                                showCloseButton: true,
                                html: reactComponent(
                                    <ChatWhatsapp
                                        type={"selected"}
                                        contacts={
                                            groupWhatsappShowQuery.data?.group.members.map(
                                                (member) => member.telephone
                                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                            ) as any
                                        }
                                        onClose={onClose}
                                    />
                                ),
                                sweetWidth: "600px",
                            }));
                        }}
                    >
                        Enviar mensaje al grupo
                    </button>
                ) : null}
            </div>
        );
    }
    return component;
}

function MessagesWhatsappSettings() {
    const empresa = useEmpresastore();
    const empresaWhatsappConfigUpdateMutation =
        empresaWhatsappConfigUpdateApi();
    const whatsappConfigForm = useForm<Whatsappconfig>({
        defaultValues: empresa.state!.whatsappconfig,
    });
    function onUpdateWhatsapp(body: Whatsappconfig) {
        sweetModal({ title: "¿estas seguro de realizar esta acción?" }).then(
            ({ isConfirmed }) => {
                if (isConfirmed) {
                    empresaWhatsappConfigUpdateMutation.mutate(body, {
                        onSuccess(data) {
                            empresa.methods.updateempresa({
                                whatsappconfig: body,
                            });
                            sweetAlert({
                                icon: "success",
                                title: data.message,
                            });
                        },
                        onError(error) {
                            handlerError(whatsappConfigForm, error);
                        },
                    });
                }
            }
        );
    }
    return (
        <div class="flex flex-col gap-4 justify-center items-center">
            <h3 class="text-xl font-bold text-paper-light flex items-center gap-2 text-primary">
                <span>Configurar mensajes de whatsapp</span>
                <i class="fa-duotone fa-message-bot" />
            </h3>
            <Form {...whatsappConfigForm} onSubmit={onUpdateWhatsapp}>
                <div class="mb-2 flex justify-between items-center">
                    <AlertInfo>
                        <span>No borrar las variables {"{}"}</span>
                    </AlertInfo>
                    <button
                        class="justify-end  dark:bg-admin-terciary px-4 py-2 rounded-md shadow dark:text-white bg-paper-lights"
                        type="button"
                        aria-label="reset"
                        onClick={() => {
                            whatsappConfigForm.reset({
                                enabled:
                                    "No estamos disponible este momento. Intentelo más tarde.",
                                cerrado:
                                    "Cerrado. No estamos disponible este momento. Intentelo más tarde.",
                                thank: "Muchas gracias por su compra, Su {COMPROBANTE}😊.",
                                thank2: "No olvides visitar nuestro sitio web: {URL} 😊 para tener más información de nuestros productos, como ofertas y novedades.",
                                sendpdf:
                                    "Hola, Aqui {NAME_EMPRESA} le adyunta su {COMPROBANTE} 😊.",
                            });
                        }}
                    >
                        Reset
                    </button>
                </div>

                <Form.control
                    title="Web disponible Mensaje"
                    name={"enabled" as keyof Whatsappconfig}
                />
                <Form.control
                    title="Tienda Cerrado"
                    name={"cerrado" as keyof Whatsappconfig}
                />
                <Form.control
                    title="Agradecimiento 1"
                    name={"thank" as keyof Whatsappconfig}
                />
                <Form.control
                    title="Agradecimiento 2"
                    name={"thank2" as keyof Whatsappconfig}
                />
                <Form.control
                    title="Mensaje al enviar pdf"
                    name={"sendpdf" as keyof Whatsappconfig}
                />
                <Form.button.submit
                    title="Guardar cambios"
                    isLoading={
                        empresaWhatsappConfigUpdateMutation.isLoading || false
                    }
                    disabled={
                        empresaWhatsappConfigUpdateMutation.isLoading || false
                    }
                />
            </Form>
        </div>
    );
}
const whatsappmodeDto = pick(empresasSchema, ["whatsapp_mode"]);
type WhatsappmodeDto = Input<typeof whatsappmodeDto>;
function WhatsappFREE() {
    const whatsappmodeForm = useForm<WhatsappmodeDto>({
        resolver: valibotVigilio(whatsappmodeDto),
        defaultValues: {
            whatsapp_mode: storageEmpresa?.whatsapp_mode,
        },
    });
    const chooseVPS = useSignal(false);
    const type = whatsappmodeForm.watch("whatsapp_mode.type");
    const year = whatsappmodeForm.watch("whatsapp_mode.date");

    const whatsappModeMutation = useMutation(
        "/empresas/whatsapp_mode",
        async (url, body: WhatsappmodeDto) => {
            const response = await fetch(`/api${url}`, {
                method: "POST",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
    function onWhatsappMode(body: WhatsappmodeDto) {
        if (body.whatsapp_mode.type === "VPS") {
            if (!body.whatsapp_mode.ip?.length) {
                whatsappmodeForm.setError("whatsapp_mode.ip", {
                    message: "Este campo es obligatorio.",
                });
                return;
            }
            if (!body.whatsapp_mode.password?.length) {
                whatsappmodeForm.setError("whatsapp_mode.password", {
                    message: "Este campo es obligatorio.",
                });
                return;
            }
            if (!body.whatsapp_mode.cpu?.length) {
                whatsappmodeForm.setError("whatsapp_mode.cpu", {
                    message: "Este campo es obligatorio.",
                });
                return;
            }

            if (!body.whatsapp_mode.memory?.length) {
                whatsappmodeForm.setError("whatsapp_mode.memory", {
                    message: "Este campo es obligatorio.",
                });
                return;
            }
        }
        sweetModal({
            icon: "info",
            title: `¿Estas seguro de cambiar el modo a <b>${body.whatsapp_mode.type}</b>`,
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                whatsappModeMutation.mutate(body, {
                    onSuccess(data) {
                        sweetAlert({ icon: "success", title: data.message });
                    },
                    onError(error) {
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        handlerError(whatsappmodeForm, error as any);
                    },
                });
            }
        });
    }
    return (
        <Form
            {...whatsappmodeForm}
            onSubmit={onWhatsappMode}
            className="flex flex-col gap-6 "
        >
            <h3 class="font-semibold text-center dark:text-white text-xl lg:text-2xl">
                CAMBIAR WHATSAPP
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div class="flex justify-center flex-col items-center ">
                    <img
                        src="/images/settings/others/vigilio-services-ico.webp"
                        width={100}
                        alt=""
                    />
                    <span class=" font-semibold text-lg  dark:text-white">
                        GRATIS
                    </span>
                    <p class=" text-center text-sm  dark:text-white">
                        <b>Mensajes Ilimitados</b>
                        <br />
                        Si experimentas lentitud al usar WhatsApp, te sugerimos
                        considerar la opción de migrar a un VPS. Esto puede
                        mejorar significativamente el rendimiento y la
                        eficiencia de tu servicio.
                        <br /> 1 vCPU - 1GB RAM
                    </p>
                    <br />
                    <AlertDanger>
                        <span class="text-sm font-bold text-center">
                            Lastimosamente WhatsApp ya no ofrece una opción
                            gratuita hasta nuevo aviso, Recomendamos migrarse a
                            un VPS.
                            {restarDays(
                                NOW().toDate(),
                                TimePeru(
                                    storageEmpresa!.createdAt as Date
                                ).toDate(),
                                "day"
                            ) > 0 ? (
                                <>
                                    <br />
                                    Estas probando gratis por{" "}
                                    {restarDays(
                                        NOW().toDate(),
                                        TimePeru(
                                            storageEmpresa!.createdAt as Date
                                        ).toDate(),
                                        "day"
                                    )}{" "}
                                    días
                                </>
                            ) : null}
                        </span>
                    </AlertDanger>
                    <button
                        type="button"
                        class="bg-primary px-4 py-2 rounded-md text-white mt-2 text-xs font-bold"
                        onClick={() => {
                            whatsappmodeForm.setValue("whatsapp_mode", {
                                cpu: null,
                                ip: null,
                                memory: null,
                                password: null,
                                type: "FREE",
                                date: null,
                            });
                            chooseVPS.value = false;
                        }}
                    >
                        {type === "FREE" ? (
                            <>
                                <i class="fas fa-check-circle" /> Elegido
                            </>
                        ) : (
                            "Elegir"
                        )}
                    </button>
                </div>{" "}
                <div class="flex justify-center flex-col items-center    dark:text-white">
                    <img
                        src="/images/settings/others/vps.png"
                        width={100}
                        alt=""
                    />
                    <b class="text-lg">VPS</b>
                    <span class=" font-semibold">USD $29 / Anual</span>
                    <p class=" text-center text-sm ">
                        {" "}
                        <b>Mejor Opción - Mensajes Ilimitados</b>
                        <br />
                        Acelera WhatsApp - Entre mejor sea el vps, más rapido
                        irá WhatsApp. Activalo en 2 minutos <br /> Mínimo 2 vCPU
                        - 2GB RAM
                        <br />
                    </p>{" "}
                    {storageEmpresa?.whatsapp_mode.type === "VPS" ? (
                        <span class="text-success font-semibold text-xs">
                            WhatsApp VPS{" "}
                            {restarDays(
                                NOW().toDate(),
                                TimePeru(year as Date).toDate()
                            )}
                            .
                        </span>
                    ) : null}
                    <button
                        type="button"
                        class="bg-primary px-4 py-2 rounded-md text-white mt-2 text-xs font-bold"
                        onClick={() => {
                            chooseVPS.value = !chooseVPS.value;
                            if (!chooseVPS.value) {
                                whatsappmodeForm.setValue("whatsapp_mode", {
                                    ...storageEmpresa!.whatsapp_mode,
                                    type: "FREE",
                                });
                            } else {
                                whatsappmodeForm.setValue("whatsapp_mode", {
                                    ...storageEmpresa!.whatsapp_mode,
                                    date: formatDateTwo(
                                        NOW().add(360, "days").toDate(),
                                        "YYYY-MM-DD"
                                    ) as Date,
                                    type: "VPS",
                                });
                            }
                        }}
                    >
                        {type === "VPS" ? (
                            <>
                                <i class="fas fa-check-circle" /> Elegido
                            </>
                        ) : (
                            "Elegir"
                        )}
                    </button>
                    <div
                        class={`${
                            chooseVPS.value
                                ? "max-h-[200px] overflow-auto"
                                : "max-h-0 overflow-hidden"
                        } delay-custom-1 mt-2`}
                    >
                        <span class="dark:text-white text-xs">
                            - Ir a Proveedor{" "}
                            <a
                                href={
                                    storageEmpresa?.dial_code === "51"
                                        ? "https://elastika.pe/store/vps"
                                        : "https://contabo.com/en/"
                                }
                                target="_blank"
                                rel="noreferrer"
                                class="text-primary underline"
                            >
                                Recomendado
                            </a>
                            , Registrarse, obtener el servicio VPS y completar
                            formulario en 2 minutos{" "}
                            <a
                                href={
                                    storageEmpresa?.dial_code === "51"
                                        ? "https://youtu.be/msYxTrbVLNY"
                                        : "https://www.youtube.com/watch?v=msYxTrbVLNY&feature=youtu.be"
                                }
                                target="_blank"
                                rel="noreferrer"
                                class="text-primary underline"
                            >
                                Ver tutorial
                            </a>
                        </span>
                        <div class="grid grid-cols-2 md:grid-cols-1 gap-2">
                            <Form.control
                                title="IP de VPS"
                                placeholder="1XX.X.X.X"
                                name={
                                    "whatsapp_mode.ip" as keyof WhatsappmodeDto
                                }
                                autoComplete="off"
                            />
                            <Form.control
                                title="Contraseña de VPS"
                                placeholder=""
                                type="password"
                                name={
                                    "whatsapp_mode.password" as keyof WhatsappmodeDto
                                }
                                autoComplete="off"
                            />
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-1 gap-2">
                            <Form.control
                                title="vCPU"
                                placeholder="2"
                                name={
                                    "whatsapp_mode.cpu" as keyof WhatsappmodeDto
                                }
                                type="number"
                                question="Mínimo 2 de vCPU"
                            />
                            <Form.control
                                title="Memoria RAM"
                                placeholder="2"
                                name={
                                    "whatsapp_mode.memory" as keyof WhatsappmodeDto
                                }
                                type="number"
                                question="Mínimo 2 de MEMORIA RAM"
                            />
                        </div>
                    </div>
                </div>
                <div class="flex justify-center flex-col items-center  md:h-[300px]  dark:text-white">
                    <img
                        src="/images/settings/others/whatsapp_business.webp"
                        width={100}
                        alt=""
                    />
                    <b class="text-lg text-center">WhatsApp Business API</b>
                    <span class=" font-semibold  text-center">
                        USD $400 - $1000 / anual
                    </span>
                    <p class="text-sm text-center">
                        <b>Mensajes Ilimitados</b>
                        <br />
                        En estos momentos no estamos disponible con la API de
                        Whatsapp, debido a su alto precio, Más adelante
                        estaremos habilitando esta opción.
                    </p>
                </div>
            </div>
            {whatsappModeMutation.isSuccess ? (
                <AlertSuccess>
                    <span class="text-center">
                        Recargar Página y Esperar unos segundos para escanear
                        Código QR WhatsApp.
                    </span>
                </AlertSuccess>
            ) : (
                <></>
            )}
            {whatsappModeMutation.isLoading ? (
                <AlertInfo>Cargando... Esto puede tomar unos minutos</AlertInfo>
            ) : (
                <></>
            )}
            <Form.button.submit
                title="Guardar"
                className="mx-auto py-4 px-2 rounded-md block"
                isLoading={whatsappModeMutation.isLoading || false}
                disabled={whatsappModeMutation.isLoading || false}
            />
        </Form>
    );
}
export default Whatsapp;
