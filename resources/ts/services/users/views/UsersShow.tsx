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
import {
    formatDateTwo,
    handlerError,
    isDateWithin,
    TimePeru,
} from "~/libs/helpers";
import Container from "@/admin/components/Container";
import useInformationStore from "@/information/stores/information.store";

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
        const information = useInformationStore();
        const usersUpdateForm = useForm<UsersUpdateDto>({
            resolver: valibotVigilio(usersUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                return {
                    specialty: user.specialty,
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
                                            Apelido Paterno:
                                        </span>
                                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                            {user.father_lastname ||
                                                "No se ingresó"}
                                        </span>
                                    </div>
                                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                        <span class="text-primary dark:text-terciary font-bold">
                                            Apelido Materno:
                                        </span>
                                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                            {user.mother_lastname ||
                                                "No se ingresó"}
                                        </span>
                                    </div>

                                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                        <span class="text-primary dark:text-terciary font-bold">
                                            Dni:
                                        </span>
                                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide line-clamp-2">
                                            {user.dni || "no se ingresó"}
                                        </span>
                                    </div>
                                </>
                            ) : null}
                            <Form onSubmit={onUpdateUser} {...usersUpdateForm}>
                                <div class="flex gap-1 flex-col mb-3  [&>div>label]:hidden [&>div]:h-auto odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                    <span class="text-primary dark:text-terciary font-bold">
                                        Especialidad:
                                    </span>
                                    <Form.control
                                        title=""
                                        name={
                                            "specialty" as keyof UsersUpdateDto
                                        }
                                        placeholder="A que se dedica este usuario"
                                        disabled={
                                            !guards.permissionAdminGuard()
                                        }
                                    />
                                </div>
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
                                {guards.permissionAdminGuard() &&
                                user.id !== 1 ? (
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
                            <div class="mt-4 flex gap-1 flex-col mb-3  [&>div>label]:hidden [&>div]:h-auto  odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    Premios:
                                </span>
                                <div class="h-[200px] overflow-auto">
                                    <table>
                                        <thead>
                                            <tr class=" bg-primary text-white py-1">
                                                <th class="text-xs dark:text-white">
                                                    ID
                                                </th>
                                                <th class="text-xs dark:text-white">
                                                    Premio
                                                </th>
                                                <th class="text-xs dark:text-white">
                                                    CUPÓN
                                                </th>
                                                <th class="text-xs dark:text-white">
                                                    DISPONIBLE
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {user.premios.premio.map(
                                                (premio, i) => (
                                                    <tr
                                                        class="text-xs dark:text-white  py-2"
                                                        key={`${premio.earning}${i}`}
                                                    >
                                                        <td>
                                                            <div class="flex justify-center items-center">
                                                                {i + 1}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="flex justify-center items-center">
                                                                {premio.earning}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="flex justify-center items-center gap-2 dark:text-white">
                                                                {premio.coupon ??
                                                                    ""}
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="flex justify-center items-center">
                                                                {!isDateWithin(
                                                                    premio.date,
                                                                    information.state!
                                                                        .max_days_premios
                                                                ) ? (
                                                                    <div class="flex gap-2 items-center">
                                                                        <div class="bg-success w-[10px] h-[10px] rounded-full text-white" />
                                                                        <span class="text-xs">
                                                                            Vence{" "}
                                                                            {formatDateTwo(
                                                                                TimePeru(
                                                                                    premio.date
                                                                                )
                                                                                    .add(
                                                                                        information.state!
                                                                                            .max_days_premios,
                                                                                        "day"
                                                                                    )
                                                                                    .toDate()
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                ) : (
                                                                    <span class="bg-danger px-2 py-1 rounded-md text-white">
                                                                        Venció
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
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
                            {user.role_id !== 4 ? (
                                <>
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
                                </>
                            ) : null}
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
                            <div class="flex gap-1 flex-col mb-3  odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                                <span class="text-primary dark:text-terciary font-bold">
                                    google:
                                </span>
                                <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                    {user.google || "no se ingresó"}
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
                                                                        } no fue eliminado, comunicarse con el desarrollador:${JSON.stringify(
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
