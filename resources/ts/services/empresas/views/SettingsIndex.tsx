import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import { settingsIndexApi } from "../apis/settings/settings.index.api";
import Loading from "@/admin/components/Loading";
import Form from "~/components/form";
import { useEffect, useMemo } from "preact/hooks";
import { handlerError } from "~/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import useEmpresastore from "../stores/empresa.store";
import { useForm } from "react-hook-form";
import {
    settingsIconUpdateDto,
    SettingsIconUpdateDto,
    SettingsPhotoUpdateDto,
    SettingsUpdateDto,
    settingsUpdateDto,
    settingsPhotoUpdateDto,
} from "../dtos/settings.update.dto";
import { valibotVigilio } from "~/libs/valibot";
import { getFilesEdit } from "~/libs/upload";
import {
    settingsUpdateApi,
    settingsUpdateIconApi,
    settingsUpdatePhotoApi,
} from "../apis/settings/settings.update.api";
import Hr from "@/web/components/Hr";
import { settingsDominioUpdateApi } from "../apis/settings/dominio.update.api";
import { Input, pick } from "@vigilio/valibot";
import { settingsSchema } from "../schemas/settings.schema";

const dominioUpdate = pick(settingsSchema, ["host"]);
type DominioUpdate = Input<typeof dominioUpdate>;
function SettingsIndex() {
    const settingsIndexQuery = settingsIndexApi();
    const empresaStore = useEmpresastore();
    let component: JSX.Element | JSX.Element[] | null = null;
    if (settingsIndexQuery.isLoading) {
        component = <Loading />;
    }
    if (settingsIndexQuery.isSuccess) {
        const setting = settingsIndexQuery.data?.data!;
        const empresaUpdateMutation = settingsUpdateApi();
        const empresaUpdateIconMutation = settingsUpdateIconApi();
        const settingsUpdatePhotoMutation = settingsUpdatePhotoApi();
        const settingsDominioUpdateMutation = settingsDominioUpdateApi();
        const settingsUpdateform = useForm<SettingsUpdateDto>({
            resolver: valibotVigilio(settingsUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                const { photo, icon, ...rest } = setting;
                return rest;
            }, []),
        });

        const isCoverImage = settingsUpdateform.watch("isCoverImage");
        const type_border = settingsUpdateform.watch("type_border");
        const type_cart = settingsUpdateform.watch("type_cart");

        const settingsIconUpdateform = useForm<SettingsIconUpdateDto>({
            resolver: valibotVigilio(settingsIconUpdateDto),
            mode: "all",
        });

        const settingsPhotoUpdateform = useForm<SettingsPhotoUpdateDto>({
            resolver: valibotVigilio(settingsPhotoUpdateDto),
            mode: "all",
        });
        const settingsPhotoDominioform = useForm<DominioUpdate>({
            resolver: valibotVigilio(settingsPhotoUpdateDto),
            mode: "all",
            defaultValues: { host: setting.host },
        });

        async function initialUpdateIcon() {
            if (setting.icon) {
                const icon = await getFilesEdit(setting.icon, 300);
                settingsIconUpdateform.setValue("icon", icon);
            }
        }
        async function initialUpdatePhoto() {
            if (setting.photo) {
                const photo = await getFilesEdit(setting.photo, 800);
                settingsPhotoUpdateform.setValue("photo", photo);
            }
        }

        function onUpdateIconEmpresa(body: SettingsIconUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de cambiar el icono de tu web?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    empresaUpdateIconMutation.mutate(
                        { ...body, name: empresaStore.state!.name_empresa },
                        {
                            onSuccess(data) {
                                empresaStore.methods.updateempresa({
                                    setting: {
                                        ...empresaStore.state!.setting,
                                        icon: data.files,
                                    },
                                });
                                sweetAlert({
                                    icon: "success",
                                    title: "Actualizado icono correctamente",
                                });
                            },
                            onError() {
                                sweetAlert({
                                    icon: "danger",
                                    title: "Error al actualizar",
                                });
                            },
                        }
                    );
                }
            });
        }

        function onUpdatePhotoempresa(body: SettingsPhotoUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de cambiar el photo de tu web?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    settingsUpdatePhotoMutation.mutate(
                        { ...body, name: empresaStore.state!.name_empresa },
                        {
                            onSuccess(data) {
                                empresaStore.methods.updateempresa({
                                    setting: {
                                        ...empresaStore.state!.setting,
                                        icon: data.files,
                                    },
                                });
                                sweetAlert({
                                    icon: "success",
                                    title: "Actualizado icono correctamente",
                                });
                            },
                            onError() {
                                sweetAlert({
                                    icon: "danger",
                                    title: "Error al actualizar",
                                });
                            },
                        }
                    );
                }
            });
        }

        function onUpdateempresa(body: SettingsUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de realizar estos cambios en tu web?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    empresaUpdateMutation.mutate(body, {
                        onSuccess() {
                            sweetAlert({
                                icon: "success",
                                title: "Actualizado correctamente tu web correctamente",
                            });
                        },
                        onError(error) {
                            handlerError(settingsUpdateform, error);
                        },
                    });
                }
            });
        }
        function onUpdateHost(body: DominioUpdate) {
            settingsDominioUpdateMutation.mutate(body, {
                onSuccess() {
                    sweetModal({
                        icon: "success",
                        title: "Se agregó nuevo dominio.",
                        text: `Prueba tu dominio como <a class="font-bold text-primary" href='https://www.${body.host}.com'>Probar</a>`,
                    });
                },
                onError(data) {
                    handlerError(settingsIconUpdateform, data);
                },
            });
        }

        useEffect(() => {
            initialUpdateIcon();
        }, []);
        useEffect(() => {
            initialUpdatePhoto();
        }, []);
        component = (
            <>
                <div class="p-4 max-w-3xl">
                    <h3 class="dark:text-white lg:text-2xl  font-bold uppercase text-center flex gap-2  w-full mb-4">
                        <i class="fa-solid fa-tools" />
                        Configuración de tu web
                    </h3>
                    <Form
                        className="flex gap-4 flex-col"
                        {...settingsUpdateform}
                        onSubmit={onUpdateempresa}
                    >
                        <div class="grid grid-cols-2 md:grid-cols-4">
                            <div class="w-[120px]">
                                <Form.control
                                    type="color"
                                    name={"bg_color" as keyof SettingsUpdateDto}
                                    title="color de tu web"
                                />
                            </div>
                            <div class="w-[120px]">
                                <Form.control
                                    type="color"
                                    name={
                                        "bg_color_responsive" as keyof SettingsUpdateDto
                                    }
                                    title="color responsive"
                                />
                            </div>
                            <Form.control.toggle
                                title="¿Modo Nocturno?"
                                name={"isDark" as keyof SettingsUpdateDto}
                            />
                            <Form.control.toggle
                                title="¿Animación de Scroll?"
                                name={"isScrolling" as keyof SettingsUpdateDto}
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <span class="text-xs font-semibold dark:text-white">
                                Producto
                            </span>
                            <div class="flex gap-4 items-center">
                                <div
                                    class={`w-[200px] shadow bg-paper-light dark:bg-admin-terciary overflow-hidden ${
                                        type_border === "circle"
                                            ? "rounded-md"
                                            : ""
                                    }`}
                                >
                                    <img
                                        class={`mx-auto w-[300px] h-[200px] ${
                                            isCoverImage
                                                ? "object-cover"
                                                : "object-contain"
                                        }`}
                                        width={200}
                                        height={150}
                                        src="https://http2.mlstatic.com/D_NQ_NP_993674-MLA31895860508_082019-O.webp"
                                        alt=""
                                    />
                                </div>
                                <div>
                                    <Form.control.select
                                        name={
                                            "type_border" as keyof SettingsUpdateDto
                                        }
                                        title="Borde"
                                        array={[
                                            { key: "circle", value: "Redondo" },
                                            {
                                                key: "square",
                                                value: "Rectangular",
                                            },
                                        ]}
                                        placeholder="Escoger tipo de border"
                                    />
                                    <Form.control.toggle
                                        name={
                                            "isCoverImage" as keyof SettingsUpdateDto
                                        }
                                        title="¿Cover Imagen?"
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2 items-center">
                            <div>
                                <span class="text-xs dark:text-white font-semibold">
                                    Tipo de Icono
                                </span>
                                <div class="flex gap-2">
                                    <button
                                        class={`w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                            type_cart === "far fa-shopping-cart"
                                                ? "bg-paper-light dark:bg-admin-terciary"
                                                : ""
                                        }`}
                                        type="button"
                                        onClick={() =>
                                            settingsUpdateform.setValue(
                                                "type_cart",
                                                "far fa-shopping-cart"
                                            )
                                        }
                                    >
                                        <i class="far fa-shopping-cart text-lg dark:text-white" />
                                    </button>
                                    <button
                                        class={`w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                            type_cart === "far fa-shopping-bag"
                                                ? "bg-paper-light dark:bg-admin-terciary"
                                                : ""
                                        }`}
                                        type="button"
                                        onClick={() =>
                                            settingsUpdateform.setValue(
                                                "type_cart",
                                                "far fa-shopping-bag"
                                            )
                                        }
                                    >
                                        <i class="far fa-shopping-bag text-lg dark:text-white" />
                                    </button>
                                    <button
                                        class={`w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                            type_cart ===
                                            "far fa-shopping-basket"
                                                ? "bg-paper-light dark:bg-admin-terciary"
                                                : ""
                                        }`}
                                        type="button"
                                        onClick={() =>
                                            settingsUpdateform.setValue(
                                                "type_cart",
                                                "far fa-shopping-basket"
                                            )
                                        }
                                    >
                                        <i class="far fa-shopping-basket text-lg dark:text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <Form.control.area
                            name={"about" as keyof SettingsUpdateDto}
                            title="Acerca de la empresa"
                            placeholder="xxxxxxxxxx"
                        />

                        <Form.button.submit
                            title="Actualizar"
                            className="self-start"
                            isLoading={empresaUpdateMutation.isLoading || false}
                            disabled={empresaUpdateMutation.isLoading || false}
                        />
                    </Form>
                    <Hr spacing={13} />
                    <br />
                    <Form
                        className="flex gap-4  flex-col"
                        {...settingsPhotoDominioform}
                        onSubmit={onUpdateHost}
                    >
                        <span class="font-semibold dark:text-secondary-light">
                            ¿Quieres tener tu propio dominio.com?
                        </span>
                        <div class="flex gap-2 items-center">
                            <Form.control
                                type="text"
                                ico={<i class="far fa-globe" />}
                                name={"host" as keyof SettingsUpdateDto}
                                title="Dominio web"
                                placeholder="tudominio.com"
                                question={
                                    <div class="w-[180px]">
                                        ¿Ya tienes un dominio?. Necesitas tener
                                        uno, En internet hay muchos proveedores
                                        de dominios como Hostinger, GoDaddy,
                                        etc.
                                        <br />
                                        <span>Recomendamos el siguente </span>
                                        <a
                                            href="https://www.hosting-ssd.com/hosting/cart.php?a=add&domain=register"
                                            target="_blank"
                                            class="font-bold text-primary"
                                            rel="noreferrer"
                                        >
                                            Ir
                                        </a>
                                    </div>
                                }
                            />
                            <Form.button.submit
                                title="Actualizar"
                                className="py-4"
                                isLoading={
                                    empresaUpdateMutation.isLoading || false
                                }
                                disabled={
                                    empresaUpdateMutation.isLoading || false
                                }
                            />
                        </div>
                    </Form>
                    <br />
                    <Hr spacing={13} />
                    <Form
                        {...settingsIconUpdateform}
                        onSubmit={onUpdateIconEmpresa}
                    >
                        <Form.control.file
                            name={"icon" as keyof SettingsIconUpdateDto}
                            title="Icono de la web"
                            accept="image/*"
                            multiple={false}
                            typeFile="image"
                        />
                        <Form.button.submit
                            disabled={
                                empresaUpdateIconMutation.isLoading || false
                            }
                            isLoading={
                                empresaUpdateIconMutation.isLoading || false
                            }
                            title="Guardar Cambios"
                        />
                    </Form>
                    <Hr spacing={13} />

                    <br />
                    <Hr spacing={13} />
                    <br />
                    <Form
                        {...settingsPhotoUpdateform}
                        onSubmit={onUpdatePhotoempresa}
                    >
                        <Form.control.file
                            name={"photo" as keyof SettingsPhotoUpdateDto}
                            title="Imagen de  tu negocio/empresa"
                            accept="image/*"
                            typeFile="image"
                            multiple={false}
                        />
                        <Form.button.submit
                            disabled={
                                settingsUpdatePhotoMutation.isLoading || false
                            }
                            isLoading={
                                settingsUpdatePhotoMutation.isLoading || false
                            }
                            title="Guardar Cambios"
                        />
                    </Form>
                </div>
            </>
        );
    }

    return (
        <Container className="p-2">
            <>
                <div class="flex flex-col gap-4 mx-1 ">
                    <AdminBreadCrumb current="Configuración de tu web" />
                </div>
                {component}
            </>
        </Container>
    );
}

export default SettingsIndex;
