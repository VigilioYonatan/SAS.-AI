import { notificationsPaginatorApi } from "@/common/paginator/notifications.paginator.api";
import { notificationsCountApi } from "@/notifications/api/notifications.count.api";
import { notificationsUpdateApi } from "@/notifications/api/notifications_user.update.api";
import {
    colorByNotificationType,
    iconByNotificationType,
} from "@/notifications/libs";
import type {
    NotifcationType,
    NotificationsSchemaFromServer,
} from "@/notifications/schemas/notifications.schema";
import { useSignal } from "@preact/signals";
import usePaginator from "@vigilio/preact-paginator";
import { useEffect } from "preact/hooks";
import AdminHr from "~/components/AdminHr";
import LoaderSubmit from "~/components/LoaderSubmit";
import { delay, showTime } from "~/libs/helpers";
import { printFileUser } from "../../users/libs/helpers";
import { NoProfileImage } from "~/config/settings";
import { sweetAlert } from "@vigilio/sweet";
import useAuthStore from "@/auth/stores/auth.store";
import { reactComponent } from "~/libs/preact";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useSocketStore from "~/stores/socket.store";
import { notificationsCleanApi } from "../api/notifications.clean.api";
import { Fragment } from "preact/jsx-runtime";

export function useNotifications() {
    const notifications = useSignal<NotificationsSchemaFromServer[]>([]);
    const empresa = useEmpresastore();
    const paginatorNotifications = usePaginator({
        limit: 16,
    });
    const { io } = useSocketStore();
    const authStore = useAuthStore();

    const notificationsCleanMutation = notificationsCleanApi();
    const notificationsCountQuery = notificationsCountApi();
    const notificationsUpdateMutation = notificationsUpdateApi();
    const notificationsPaginatorQuery = notificationsPaginatorApi({
        limit: paginatorNotifications.pagination.value.limit,
        offset: paginatorNotifications.pagination.value.offset,
    });

    useEffect(() => {
        io?.on(
            "notifications:store",
            async (data: {
                notification: NotificationsSchemaFromServer;
                success: true;
                users_permission: number[];
            }) => {
                const notification = data.notification;
                if (notification.type === "comment") {
                    await delay(5);
                }
                if (!authStore.state?.enabledNotification) return;
                // roles permitidos
                if (!authStore.state) return;
                if (notification.user_id === authStore.state!.id) return;
                if (!data.users_permission.includes(authStore.state!.id))
                    return;

                notificationsCountQuery.transformData((val) => ({
                    ...val,
                    data: val.data + 1,
                }));
                notifications.value = [
                    {
                        ...notification,
                        NotificationsUser: {
                            isRead: false,
                            notification_id: notification.id,
                            user_id: empresa.state!.id,
                        },
                    },
                    ...notifications.value,
                ];
                if (
                    storageEmpresa?.enabledSound &&
                    notification.type === "order"
                ) {
                    const audio = new Audio("/sounds/tin.mp3");
                    audio.load();
                    audio.play();
                }
                // solo mostrar notificaiones push a ordens y tienes que estar activado notifaciones
                // await showNotification({
                //     title: `Nueva notificación: ${notification.type}`,
                //     body: notification.content,
                //     icon: empresa.state!.logo
                //         ? printFileWithDimension(
                //               empresa.state!.logo,
                //               100
                //           )[0]!
                //         : "",
                //     url: notification.url,
                // });

                sweetAlert({
                    html: reactComponent(
                        <div
                            onClick={() => redirect(notification)}
                            class="flex flex-col py-1 bg-background-light dark:bg-background-dark shadow"
                        >
                            <div class="flex gap-2 justify-between">
                                <picture class="relative h-[40px] mr-2">
                                    <img
                                        class="min-w-[30px] min-h-[30px] max-w-[30px] max-h-[30px] rounded-full mx-2"
                                        src={
                                            notification.user_id
                                                ? printFileUser(
                                                      notification.use?.photo!,
                                                      100
                                                  )[0]
                                                : NoProfileImage()
                                        }
                                        width={20}
                                        height={20}
                                        alt=""
                                    />
                                    <div
                                        class={`absolute bottom-0 right-0 [&>i]:text-xs rounded-full min-w-[20px] min-h-[20px] max-w-[20px] max-h-[20px] flex justify-center items-center dark:text-white ${colorByNotificationType(
                                            notification.type as NotifcationType
                                        )} `}
                                        dangerouslySetInnerHTML={{
                                            __html: iconByNotificationType(
                                                notification.type as NotifcationType
                                            ),
                                        }}
                                    />
                                </picture>

                                <div class="flex flex-col text-start dark:text-secondary-light">
                                    <div
                                        class="text-xs dark:text-white"
                                        dangerouslySetInnerHTML={{
                                            __html: notification.content,
                                        }}
                                    />
                                    <span class="text-xs font-semibold text-gray-400 ">
                                        {showTime(notification.createdAt!)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ),
                    height: 80,
                    width: 300,
                    timer: 5,
                });
            }
        );
        return () => io?.off("notifications:store");
    }, []);

    async function redirect(notification: NotificationsSchemaFromServer) {
        if (notification.NotificationsUser) {
            if (!notification.NotificationsUser?.isRead) {
                await notificationsUpdateMutation.mutateAsync({
                    notification_id: notification.id,
                    isRead: true,
                });
            }
        } else {
            await notificationsUpdateMutation.mutateAsync({
                notification_id: notification.id,
                isRead: true,
            });
        }
        window.location.href = notification.url;
    }
    function handleScroll(e: Event) {
        const div = e.target as HTMLDivElement;
        if (div.scrollTop + div.clientHeight >= div.scrollHeight) {
            // Si el usuario llega al final de la lista, carga más datos
            paginatorNotifications.pagination.onNextPage();
        }
    }

    // useEffect(() => {
    //     connectSocket();
    // }, []);

    interface IrintNotificacionsCardProps {
        isWeb?: boolean;
    }
    function printNotificacionsCard({
        isWeb = false,
    }: IrintNotificacionsCardProps) {
        return (
            <>
                {!notifications.value.length ? (
                    <span class="dark:text-white text-xs">
                        No hay notificaciones
                    </span>
                ) : (
                    <>
                        {notifications.value.map((notification) => {
                            return (
                                <Fragment key={notification.id}>
                                    <button
                                        onClick={() => redirect(notification)}
                                        type="button"
                                        aria-label="change page"
                                        class={`${
                                            notification.NotificationsUser
                                                .isRead
                                                ? ""
                                                : `${
                                                      isWeb
                                                          ? `dark:bg-paper-dark ${
                                                                storageEmpresa
                                                                    ?.setting
                                                                    .bg_color_paper ===
                                                                storageEmpresa
                                                                    ?.setting
                                                                    .bg_color_background
                                                                    ? "bg-gray-200 !text-black"
                                                                    : "bg-paper-light"
                                                            }  `
                                                          : "dark:bg-admin-terciary  bg-paper-light"
                                                  } `
                                        } flex flex-col py-1`}
                                    >
                                        <div class="flex gap-2 justify-between">
                                            <picture class="relative h-[40px]">
                                                <img
                                                    class="min-w-[30px] min-h-[30px] rounded-full mx-2"
                                                    src={
                                                        notification.user_id
                                                            ? printFileUser(
                                                                  notification.use!
                                                                      .photo,
                                                                  100
                                                              )[0]
                                                            : NoProfileImage()
                                                    }
                                                    width={20}
                                                    height={20}
                                                    alt=""
                                                />
                                                <div
                                                    class={`absolute bottom-0 right-0 [&>i]:text-xs rounded-full w-[20px] h-[20px] flex justify-center items-center text-white ${colorByNotificationType(
                                                        notification.type as NotifcationType
                                                    )} `}
                                                    dangerouslySetInnerHTML={{
                                                        __html: iconByNotificationType(
                                                            notification.type as NotifcationType
                                                        ),
                                                    }}
                                                />
                                            </picture>

                                            <div class="flex flex-col text-start dark:text-secondary-light">
                                                <div
                                                    class="text-xs line-clamp-2"
                                                    dangerouslySetInnerHTML={{
                                                        __html: notification.content,
                                                    }}
                                                />
                                                <span class="text-xs">
                                                    {showTime(
                                                        notification.createdAt!
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </button>
                                    <AdminHr spacing={0} />
                                </Fragment>
                            );
                        })}
                    </>
                )}
                {notificationsPaginatorQuery.isLoading ||
                notificationsPaginatorQuery.isFetching ? (
                    <div class="flex justify-center items-center">
                        <LoaderSubmit />
                    </div>
                ) : null}
            </>
        );
    }

    function Notifications(props: { onClose: () => void; isWeb?: boolean }) {
        return (
            <div
                class={`flex flex-col   justify-center items-center relative bg-background-light ${
                    props.isWeb
                        ? "dark:bg-paper-dark"
                        : "dark:bg-admin-paper-dark"
                }  rounded-md shadow-sm`}
            >
                <button
                    class="absolute right-0 mr-2 mt-1 top-0 dark:text-white "
                    type="button"
                    aria-label="close"
                    onClick={() => props.onClose()}
                >
                    x
                </button>
                <span class="dark:text-white my-1 font-semibold">
                    Notificaciones
                </span>
                <div class="h-[300px] overflow-auto " onScroll={handleScroll}>
                    {printNotificacionsCard({ isWeb: props.isWeb })}
                    {notificationsCountQuery.data?.data! > 0 ? (
                        <button
                            type="button"
                            class={`dark:text-white mx-auto text-xs flex justify-center items-center absolute py-2 bottom-0 w-full ${
                                props.isWeb
                                    ? "dark:bg-paper-dark"
                                    : "dark:bg-admin-paper-dark"
                            }`}
                            onClick={() => {
                                notificationsCleanMutation.mutate(null, {
                                    onSuccess: (data) => {
                                        notificationsCountQuery.transformData(
                                            (val) => ({
                                                ...val,
                                                data: 0,
                                            })
                                        );
                                        notifications.value =
                                            notifications.value.map((noti) => ({
                                                ...noti,
                                                NotificationsUser: {
                                                    ...noti.NotificationsUser,
                                                    isRead: true,
                                                },
                                            }));

                                        sweetAlert({
                                            icon: "success",
                                            title: data.message,
                                        });
                                    },
                                    onError(error) {
                                        sweetAlert({
                                            icon: "danger",
                                            title: error.message,
                                        });
                                    },
                                });
                            }}
                        >
                            <i class="fa-solid fa-broom-wide mr-2" />
                            Limpiar Notificaciones
                        </button>
                    ) : null}
                </div>
            </div>
        );
    }
    interface NotificationCountComponentProps {
        isWeb?: boolean;
    }
    function NotificationCountComponent({
        isWeb = false,
    }: NotificationCountComponentProps) {
        return notificationsCountQuery.data?.data! > 0 ? (
            <span
                class={`header-icon-notification-span absolute left-[4px] top-[-5px] text-xs ${
                    isWeb ? "bg-primary" : "bg-danger"
                } px-[.3rem] font-bold rounded-full text-white  border-2 border-white`}
            >
                {notificationsCountQuery.data?.data! > 99
                    ? "+99"
                    : notificationsCountQuery?.data?.data}
            </span>
        ) : null;
    }

    useEffect(() => {
        notificationsPaginatorQuery.refetch(false);
    }, [
        paginatorNotifications.pagination.value.limit,
        paginatorNotifications.pagination.value.offset,
    ]);

    useEffect(() => {
        if (notificationsPaginatorQuery.isSuccess) {
            notifications.value = [
                ...notifications.value,
                ...(notificationsPaginatorQuery.data?.results! ?? []),
            ];
        }
    }, [
        notificationsPaginatorQuery.isSuccess,
        notificationsPaginatorQuery.data,
    ]);
    return {
        state: notifications.value,
        methods: {
            NotificationCountComponent,
            Notifications,
        },
    };
}

export default useNotifications;
