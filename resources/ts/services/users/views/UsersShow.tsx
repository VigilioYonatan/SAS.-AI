import { formatDate } from "@vigilio/express-core/helpers";
import { usersShowApi } from "../apis/users.show.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { usersDestroyApi } from "../apis/users.destroy.api";
import {
    arrayRoles,
    numberPhoneFormated,
    printFileUser,
} from "../libs/helpers";
import useAuthstore from "@/auth/stores/auth.store";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import Form from "~/components/form";
import { usersUpdateApi } from "../apis/users.update.api";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { usersUpdateDto, type UsersUpdateDto } from "../dtos/users.update.dto";
import { useMemo } from "preact/hooks";
import { handlerError, NOW, restarDays } from "~/libs/helpers";
import Container from "@/admin/components/Container";

interface UsersShowProps {
    params: { slug?: string | number };
    refetch?: (clean?: boolean | undefined) => Promise<void>;
    onClose?: () => void;
}
function UsersShow({ params: { slug }, refetch, onClose }: UsersShowProps) {
    const { state, guards } = useAuthstore();
    const { mutate } = usersDestroyApi();
    const usersShowApiQuery = usersShowApi(slug as string);
    let component = null;

    if (usersShowApiQuery.isLoading) {
        component = <Loading />;
    }
    if (usersShowApiQuery.isError) {
        component = <View404 message={`No se encontró un usuario: ${slug}`} />;
    }
    if (usersShowApiQuery.isSuccess) {
        const { user } = usersShowApiQuery.data!;
        const usersUpdateMutation = usersUpdateApi(user.id);
        const usersUpdateForm = useForm<UsersUpdateDto>({
            resolver: valibotVigilio(usersUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                return {
                    enabled: user.enabled,
                    role_id: user.role_id,
                };
            }, []),
        });

        function onUpdateUser(body: UsersUpdateDto) {
            if (!guards.permissionAdminGuard()) return;
            sweetModal({
                title: `Deseas Actualizar usuario ${user.username}`,
                showCloseButton: true,
                showCancelButton: true,
                customIcon:
                    "<i class='fas fa-user text-3xl dark:text-white' ></i>",
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    usersUpdateMutation.mutate(body, {
                        onSuccess() {
                            if (refetch && onClose) {
                                onClose();
                                refetch();
                            }
                            sweetAlert({
                                icon: "success",
                                title: "Se actualizó información del usuario correctamente",
                            });
                        },
                        onError(error) {
                            handlerError(usersUpdateForm, error);
                        },
                    });
                }
            });
        }
        component = (
            <Container className="p-4">
                <div class="flex gap-4 flex-col text-start">
                    <img
                        src={printFileUser(user.photo, 300)[0]}
                        class="rounded-md mb-5 w-[150px] h-[150px] object-cover  mx-auto"
                        width="300"
                        height="300"
                        alt={user.name}
                    />
                    <div class="flex gap-4 flex-wrap justify-center  font-semibold">
                        <div class="flex-1 min-w-[250px]">
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    ID:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {user.id}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Nombre:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {user.name}
                                </span>
                            </div>
                            {user.role_id !== 4 ? (
                                <>
                                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                        <span class="text-primary dark:text-terciary font-bold">
                                            Apelidos:
                                        </span>
                                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                            {user.lastname || "No se ingresó"}
                                        </span>
                                    </div>
                                </>
                            ) : null}
                            <Form onSubmit={onUpdateUser} {...usersUpdateForm}>
                                <Form.control
                                    title="Especialidad"
                                    name={"speciality" as keyof UsersUpdateDto}
                                    placeholder=""
                                    ico={<i class="fas fa-user-hard-hat" />}
                                    type="text"
                                />
                                <div class="flex gap-1 flex-col mb-3  [&>div>label]:hidden [&>div]:h-auto  odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Rol
                                    </span>
                                    <Form.control.select
                                        title=""
                                        name={"role_id" as keyof UsersUpdateDto}
                                        placeholder="Seleccion rol"
                                        array={arrayRoles}
                                        isLoading={false}
                                        options={{
                                            value: user.role_id,
                                            valueAsNumber: true,
                                        }}
                                        disabled={
                                            !guards.permissionAdminGuard()
                                        }
                                    />
                                </div>
                                <div class="flex gap-1 flex-col mb-3  odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Habilitado:
                                    </span>
                                    <Form.control.toggle
                                        title=""
                                        name={"enabled" as keyof UsersUpdateDto}
                                        options={{
                                            value: user.enabled,
                                        }}
                                        disabled={
                                            !guards.permissionAdminGuard() ||
                                            user.role_id === 1
                                        }
                                        question="Si el usuario no está habilitado no podra acceder al dashboard, no podra realizar compras,etc."
                                    />
                                </div>
                                <div class="flex gap-1 flex-col mb-3  odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Es bot?:
                                    </span>
                                    <Form.control.toggle
                                        title=""
                                        name={"isBot" as keyof UsersUpdateDto}
                                        options={{
                                            value: user.isBot,
                                        }}
                                        disabled={
                                            !guards.permissionAdminGuard()
                                        }
                                        question={
                                            <>
                                                Si el usuario es bot, responderá
                                                los comentarios de los clientes
                                                automaticamente <br />
                                                Solo puede haber un usuario bot.
                                            </>
                                        }
                                    />
                                </div>
                                {guards.permissionAdminGuard() ? (
                                    <Form.button.submit
                                        disabled={
                                            usersUpdateMutation.isLoading ||
                                            false
                                        }
                                        isLoading={
                                            usersUpdateMutation.isLoading ||
                                            false
                                        }
                                        ico={<i class="fas fa-pen" />}
                                        className="py-3 px-4"
                                        title="Actualizar Usuario"
                                    />
                                ) : (
                                    <></>
                                )}
                            </Form>{" "}
                        </div>
                        <div class="flex-1 min-w-[250px]">
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2 ">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Slug:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {user.slug}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Fecha de nacimiento:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide flex flex-col">
                                    {user.birthday ? (
                                        <>
                                            <span>
                                                {formatDate(
                                                    user.birthday as unknown as string
                                                )}
                                            </span>
                                            <span>
                                                <i class="fas fa-birthday-cake" />{" "}
                                                {new Date().getFullYear() -
                                                    new Date(
                                                        user.birthday
                                                    ).getFullYear()}{" "}
                                                años
                                            </span>
                                        </>
                                    ) : (
                                        "no se ingresó"
                                    )}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Dirección:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {user.address || "no se ingresó"}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Telefono:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {user.telephone ? (
                                        <div class="flex gap-1 items-center">
                                            <i class="fas fa-mobile-alt" />
                                            {numberPhoneFormated(
                                                user.telephone
                                            )}
                                        </div>
                                    ) : (
                                        "no se ingresó"
                                    )}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Compras realizadas:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {user.buys?.length ? (
                                        <div class="flex flex-col gap-1">
                                            {user.buys.map((buy, i) => (
                                                <div
                                                    class="flex gap-1 items-center"
                                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                    key={i}
                                                >
                                                    <span class="flex">
                                                        <a
                                                            class="hover:text-primary text-xs"
                                                            href={`/admin/orders/${buy.order}`}
                                                        >
                                                            {buy.order}
                                                        </a>{" "}
                                                    </span>
                                                    <span class="flex text-xs">
                                                        <span>{buy.title}</span>
                                                    </span>
                                                    {buy.date ? (
                                                        <span class="flex text-xs">
                                                            <span>
                                                                {restarDays(
                                                                    NOW(),
                                                                    buy.date,
                                                                    "day"
                                                                )}{" "}
                                                                días
                                                            </span>
                                                        </span>
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <span class="text-xs">
                                            No hay compras
                                        </span>
                                    )}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-1 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2 ">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Creado:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {formatDate(user.createdAt!)}
                                </span>
                            </div>{" "}
                            <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Correo Electrónico:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide line-clamp-2">
                                    {user.email || "no se ingresó"}
                                </span>
                            </div>
                            <div class="flex gap-1 flex-col mb-1 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Actualizado:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {formatDate(user.updatedAt!)}
                                </span>
                            </div>
                            {user.role_id !== 1 &&
                            guards.permissionAdminGuard() ? (
                                <div class="flex gap-1 flex-col mb-1  odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Acciones:
                                    </span>
                                    <div class="flex items-center gap-1 text-white">
                                        {state?.id !== user.id ? (
                                            <button
                                                class="px-4 py-2 rounded-md bg-red-600 flex items-center"
                                                type="button"
                                                aria-label="button to delete user"
                                                onClick={() => {
                                                    sweetModal({
                                                        title: "Estas seguro?",
                                                        text: `Quieres eliminar este usuario <b>${user.name}</b>`,
                                                        icon: "danger",
                                                        showCancelButton: true,
                                                        confirmButtonText:
                                                            "Si, Eliminar!",
                                                    }).then((result) => {
                                                        if (
                                                            result.isConfirmed
                                                        ) {
                                                            mutate(user.id, {
                                                                onSuccess:
                                                                    () => {
                                                                        sweetModal(
                                                                            {
                                                                                icon: "success",
                                                                                title: "Success",
                                                                                text: `El usuario ${user.name} fue eliminado correctamente`,
                                                                            }
                                                                        );
                                                                        window.location.reload();
                                                                    },
                                                                onError: (
                                                                    error
                                                                ) => {
                                                                    sweetModal({
                                                                        icon: "danger",
                                                                        text: `El usuario ${
                                                                            user.name
                                                                        } no fue eliminado, :${JSON.stringify(
                                                                            error
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
                                                <span class="text-xs">
                                                    Eliminar
                                                </span>
                                            </button>
                                        ) : null}
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </Container>
        );
    }
    return component;
}

export default UsersShow;
