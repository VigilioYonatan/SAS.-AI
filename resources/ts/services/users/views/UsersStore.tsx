import Form from "~/components/form";
import { type UsersStoreDto, usersStoreDto } from "../dtos/users.store.dto";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { useForm } from "react-hook-form";
import { usersStoreApi } from "../apis/users.store.api";
import { sweetModal, sweetAlert } from "@vigilio/sweet";
import { useEffect } from "preact/hooks";
import { valibotVigilio } from "~/libs/valibot";
import { handlerError } from "~/libs/helpers";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface UsersStoreProps {
    refetch: (clean?: boolean) => Promise<void>;
    onClose: () => void;
}
function UsersStore({ refetch, onClose }: UsersStoreProps) {
    const usersStoreDtoForm = useForm<UsersStoreDto>({
        resolver: valibotVigilio(usersStoreDto),
        mode: "all",
        defaultValues: {
            enabled: true,
            empresa_id: storageEmpresa!.id,
        },
    });
    const usersStoreApiMutation = usersStoreApi();

    function onAddUser(body: UsersStoreDto) {
        sweetModal({
            title: `¿Estás seguro de agregar un nuevo usuario ${body.username}?`,
            customIcon: "<i class='fas fa-user text-3xl dark:text-white' ></i>",
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                usersStoreApiMutation.mutate(body, {
                    onSuccess(data) {
                        usersStoreDtoForm.reset();
                        sweetAlert({
                            icon: "success",
                            title: `<p class="text-center">Nuevo usuario agregado correctamente <b>${data.user.username}</b></p>`,
                        });
                        refetch(false);
                        onClose();
                    },
                    onError(error) {
                        handlerError(usersStoreDtoForm, error);
                    },
                });
            }
        });
    }

    const name = usersStoreDtoForm.watch("name");
    const username = usersStoreDtoForm.watch("username");

    useEffect(() => {
        if (username) {
            usersStoreDtoForm.setValue("slug", transformSlug(username || ""), {
                shouldValidate: true,
            });
        }
    }, [username]);
    useEffect(() => {
        if (name) {
            usersStoreDtoForm.setValue(
                "username",
                `${name}-${Math.random().toString(32).slice(2, 4)}`.replaceAll(
                    " ",
                    ""
                ),
                { shouldValidate: true }
            );
        }
    }, [name]);

    return (
        <div class="text-start">
            <Form {...usersStoreDtoForm} onSubmit={onAddUser}>
                <div class="flex justify-between items-center mb-4 ">
                    <h3 class="dark:text-white text-2xl font-bold uppercase text-center flex gap-2">
                        <i class="fas fa-users" />
                        Agregar Usuario
                    </h3>
                    <Form.button.reset />
                </div>
                <div class="grid gap-4 lg:grid-cols-5">
                    <div class="lg:col-span-3">
                        <div class="w-full flex flex-col sm:flex-row gap-2">
                            <Form.control
                                ico={<i class="fas fa-user" />}
                                name={"name" as keyof UsersStoreDto}
                                title="Nombre"
                                placeholder="Jhon"
                            />
                            <Form.control
                                name={"username" as keyof UsersStoreDto}
                                title="Nombre de usuario"
                                placeholder="JhonXXXXX"
                            />
                            <Form.control
                                name={"slug" as keyof UsersStoreDto}
                                title="Slug"
                                placeholder="Jhon"
                                options={{ setValueAs: transformSlug }}
                                disabled
                            />
                        </div>
                        <div class="w-full flex flex-col sm:flex-row gap-2">
                            <Form.control
                                ico={<i class="fas fa-male" />}
                                name={"lastname" as keyof UsersStoreDto}
                                title="Apellido paterno"
                                placeholder=""
                                question="Este campo no es obligatorio."
                            />
                            <Form.control
                                ico={<i class="fas fa-birthday-cake" />}
                                name={"birthday" as keyof UsersStoreDto}
                                type="date"
                                title="Fecha de Nacimiento"
                                question={"Este campo no es obligatorio."}
                            />
                        </div>
                        <div class="w-full flex flex-col sm:flex-row gap-2">
                            <Form.control
                                ico={<i class="fas fa-at" />}
                                name={"email" as keyof UsersStoreDto}
                                type="email"
                                title="Correo Electrónico"
                                placeholder="correo@gmail.com"
                            />
                            <Form.control
                                ico={<i class="fas fa-lock" />}
                                name={"password" as keyof UsersStoreDto}
                                type="password"
                                title="Contraseña"
                                placeholder="*******"
                                autoComplete="current-password"
                            />
                        </div>
                        <div class="w-full flex flex-col sm:flex-row gap-2">
                            <Form.control.toggle
                                name={"enabled" as keyof UsersStoreDto}
                                title="Habilitado"
                                question="Si el usuario no está habilitado no podra acceder al dashboard, no podra realizar compras,etc."
                            />
                            <Form.control.select
                                name={"role_id" as keyof UsersStoreDto}
                                title="Rol"
                                placeholder="Escoge el rol."
                                array={[
                                    { key: 1, value: "Administrador" },
                                    { key: 2, value: "Trabajador" },
                                ]}
                                options={{ valueAsNumber: true }}
                                ico={<i class="fas fa-user-tag" />}
                                isLoading={false}
                            />
                        </div>

                        <div class="w-full flex flex-col sm:flex-row gap-2">
                            <Form.control
                                ico={<span>+{storageEmpresa?.dial_code}</span>}
                                name={"telephone" as keyof UsersStoreDto}
                                type="tel"
                                title="Numero de Celular"
                                placeholder="XXXXXXXX"
                                question="Este campo no es obligatorio."
                            />
                            <Form.control
                                ico={<i class="fas fa-at" />}
                                name={"address" as keyof UsersStoreDto}
                                title="Dirección"
                                placeholder="MZ D LT - Puente Piedra"
                            />
                        </div>
                    </div>
                    <div class="lg:col-span-2">
                        <Form.control.file
                            name={"photo" as keyof UsersStoreDto}
                            title="Foto de perfil"
                            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                            typeFile="image"
                            typesText="No es obligatorio: JPG, JPEG, WEBP, PNG, GIF"
                        />
                    </div>
                </div>
                <div class="flex justify-center">
                    <Form.button.submit
                        disabled={usersStoreApiMutation.isLoading || false}
                        isLoading={usersStoreApiMutation.isLoading || false}
                        title="Guardar"
                    />
                </div>
            </Form>
        </div>
    );
}

export default UsersStore;
