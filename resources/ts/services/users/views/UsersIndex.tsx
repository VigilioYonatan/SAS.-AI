import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useTable } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import { usersPaginatorApi } from "@/common/paginator/users.paginator.api";
import type { UsersSchemaFromServer } from "@/users/schemas/users.schema";
import VigilioTable from "~/components/table";
import usersColumns from "../libs/UsersColumns";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import useAuthstore from "@/auth/stores/auth.store";
import UsersShow from "./UsersShow";
import UsersStore from "./UsersStore";
import { useForm } from "react-hook-form";
import { Input, minLength, number, object, string } from "@vigilio/valibot";
import { valibotVigilio } from "~/libs/valibot";
import Form from "~/components/form";
import { BASE_URL } from "~/config";
import { notificationsMessageApi } from "@/notifications/api/notifications_message.api";
import usersFormColumns from "../libs/UsersFormColumn";
import { usersFormPaginatorApi } from "@/common/paginator/users_form.paginator.api";

function UsersIndex() {
    const table = useTable({
        columns: usersColumns,
    });

    const query = usersPaginatorApi(table);
    const { guards } = useAuthstore();

    const handleOpenUser = (user: UsersSchemaFromServer) => {
        return sweetModal((onClose) => ({
            html: reactComponent(
                <UsersShow
                    params={{ slug: user.slug }}
                    refetch={query.refetch}
                    onClose={onClose}
                />
            ),
            showCloseButton: true,
            isCloseInBackground: false,
            sweetWidth: "800px",
            position: "start",
            hiddeBackground: false,
        }));
    };

    function onUsersStore() {
        sweetModal((onClose) => ({
            html: reactComponent(
                <UsersStore onClose={onClose} refetch={query.refetch} />
            ),
            sweetWidth: "1000px",
            showCloseButton: true,
            position: "start",
            isCloseInBackground: false,
            hiddeBackground: false,
        }));
    }

    return (
        <Container className="p-2">
            <div className="flex flex-col gap-4 mx-1 ">
                <AdminBreadCrumb current="usuarios" />
                <div class="flex  items-center justify-between gap-2">
                    {guards.permissionAdminGuard() ? (
                        <button
                            type="button"
                            class="bg-primary px-6 py-2 text-xs font-bold self-start rounded-md text-white flex justify-center items-center gap-2"
                            aria-label="button to open create new user"
                            onClick={onUsersStore}
                        >
                            <i class="fas fa-user" /> Agregar Usuario
                        </button>
                    ) : null}
                    {guards.permissionAdminGuard() ? (
                        <div class="flex gap-2 items-center">
                            <button
                                type="button"
                                class="bg-black px-6 py-2 text-xs font-bold self-start rounded-md text-white flex justify-center items-center gap-2"
                                onClick={() => {
                                    sweetModal({
                                        html: reactComponent(<UsersWeb />),
                                        showCloseButton: true,
                                        isCloseInBackground: false,
                                        sweetWidth: "650px",
                                    });
                                }}
                            >
                                <i class="far fa-users-class" /> Usuarios CHAT
                                IA
                            </button>
                            <button
                                type="button"
                                class="bg-black px-6 py-2 text-xs font-bold self-start rounded-md text-white flex justify-center items-center gap-2"
                                onClick={() => {
                                    sweetModal({
                                        html: reactComponent(
                                            <SendNotification />
                                        ),
                                        showCloseButton: true,
                                        isCloseInBackground: false,
                                    });
                                }}
                            >
                                <i class="fas fa-bells" /> Enviar notificaciones
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>

            <div class="overflow-x-auto overflow-y-hidden">
                <VigilioTable query={query} table={table}>
                    <VigilioTable.header>
                        <VigilioTable.header.tools
                            hiddenInput={false}
                            hiddenDelete
                        />
                        <div class="flex items-center gap-1">
                            <VigilioTable.header.limit />
                            <VigilioTable.header.refetch />
                        </div>
                    </VigilioTable.header>
                    <VigilioTable.table>
                        <VigilioTable.thead>
                            <VigilioTable.thead.row>
                                <VigilioTable.thead.th />
                            </VigilioTable.thead.row>
                        </VigilioTable.thead>
                        <VigilioTable.tbody>
                            <VigilioTable.tbody.row
                                handleClick={handleOpenUser}
                            >
                                {(data) => (
                                    <VigilioTable.tbody.td data={data} />
                                )}
                            </VigilioTable.tbody.row>
                        </VigilioTable.tbody>
                    </VigilioTable.table>
                    <VigilioTable.footer>
                        <VigilioTable.footer.show />
                        <VigilioTable.footer.paginator />
                    </VigilioTable.footer>
                </VigilioTable>
            </div>
        </Container>
    );
}
const notificationMessageDto = object({
    title: string([minLength(3)]),
    message: string([minLength(3)]),
    url: string([minLength(3)]),
    days: number(),
    again: number(),
});
export type NotificationMessageDto = Input<typeof notificationMessageDto>;

function SendNotification() {
    const notificionForm = useForm<NotificationMessageDto>({
        resolver: valibotVigilio(notificationMessageDto),
        defaultValues: { url: BASE_URL, days: 1, again: 1 },
    });
    const notificationsMessageMutation = notificationsMessageApi();
    function onNotification(body: NotificationMessageDto) {
        sweetModal({
            title: "¿Estás seguro de enviar las notificaciones?",
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                notificationsMessageMutation.mutate(body, {
                    onSuccess() {
                        sweetAlert({
                            icon: "success",
                            title: "Se envió notificaciones correctamente",
                        });
                    },
                    onError() {
                        sweetAlert({
                            icon: "danger",
                            title: "No Se envió notificaciones ",
                        });
                    },
                });
            }
        });
    }
    return (
        <div>
            <h1 class="dark:text-white font-bold mb-2 text-center">
                Enviar notificaciones
            </h1>
            <p class="text-xs font-semibold text-gray-400 text-center">
                A tus clientes que tienen su dispositivo instalado la app, le
                aparecerá la notificación
            </p>
            <Form onSubmit={onNotification} {...notificionForm}>
                <Form.control
                    title="Titulo"
                    name="title"
                    placeholder="Cupón 10% de descuento CXXXXX"
                />
                <Form.control
                    title="Mensaje"
                    name="message"
                    placeholder="Por solo hoy, cupón 10% de descuento CXXXXX"
                />
                <Form.control
                    title="URL"
                    name="url"
                    question="Cuando el cliente presione click a la notificación se redigirá al link"
                    placeholder="Por solo hoy, cupón 10% de descuento CXXXXX"
                />
                <div class="grid grid-cols-2 gap-2">
                    <Form.control
                        title="Días"
                        type="number"
                        options={{ setValueAs: Number }}
                        name="days"
                        question={
                            <div>
                                Se enviarán la notificación los dias seguidos
                                que pongas.
                                <br />
                                Si digitas 3, se le enviará la notificación, hoy
                                hasta 2 días más automaticamente.
                            </div>
                        }
                    />
                    <Form.control
                        title="Cuantas Veces por días"
                        type="number"
                        options={{ setValueAs: Number }}
                        name="again"
                        question={
                            <div>
                                Cuantas veces por día le enviará la notificación
                                <br />1 vez, 2 veces?
                            </div>
                        }
                    />
                </div>
                <Form.button.submit
                    ico={<i class="fas fa-bell" />}
                    isLoading={notificationsMessageMutation.isLoading || false}
                    disabled={notificationsMessageMutation.isLoading || false}
                    title="Enviar"
                />
            </Form>
        </div>
    );
}

function UsersWeb() {
    const table = useTable({
        columns: usersFormColumns,
    });

    const query = usersFormPaginatorApi(table);
    return (
        <div class="overflow-x-auto overflow-y-hidden">
            <h3 class="font-bold text-xl dark:text-white my-3">
                Usuarios CHAT AI
            </h3>
            <VigilioTable query={query} table={table}>
                <VigilioTable.header>
                    <VigilioTable.header.tools
                        hiddenInput={false}
                        hiddenDelete
                    />
                    <div class="flex items-center gap-1">
                        <VigilioTable.header.limit />
                        <VigilioTable.header.refetch />
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
                            {(data) => <VigilioTable.tbody.td data={data} />}
                        </VigilioTable.tbody.row>
                    </VigilioTable.tbody>
                </VigilioTable.table>
                <VigilioTable.footer>
                    <VigilioTable.footer.show />
                    <VigilioTable.footer.paginator />
                </VigilioTable.footer>
            </VigilioTable>
        </div>
    );
}
export default UsersIndex;
