import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import { settingsIndexApi } from "../apis/settings/settings.index.api";
import Loading from "@/admin/components/Loading";
import Form from "~/components/form";
import { useEffect, useMemo } from "preact/hooks";
import { handlerError, NOW, restarDays } from "~/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import useEmpresastore, { storageEmpresa } from "../stores/empresa.store";
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
import {
    settingsDominioNameServerUpdateApi,
    settingsDominioUpdateApi,
} from "../apis/settings/dominio.update.api";
import { Input, pick } from "@vigilio/valibot";
import { hamburgers, hostSchema } from "../schemas/settings.schema";
import useAuthStore from "@/auth/stores/auth.store";
import { Link } from "wouter-preact";
import LogoImage from "~/components/LogoImage";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { slug } from "@vigilio/express-core/helpers";
import useCountDown from "~/hooks/useCountDown";
import LoaderSubmit from "~/components/LoaderSubmit";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";

const dominioUpdate = pick(hostSchema, ["host"]);
type DominioUpdate = Input<typeof dominioUpdate>;
function SettingsIndex() {
    const authStore = useAuthStore();
    if (!authStore.guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
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
        const settingsDominioNameServerUpdateMutation =
            settingsDominioNameServerUpdateApi();
        const { state, methods } = useEmpresastore();
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
        const hamburger = settingsUpdateform.watch("hamburger");
        const isLogoImage = settingsUpdateform.watch("isLogoImage");
        const [cp1] = useCopyToClipboard();
        const [cp2] = useCopyToClipboard();
        const settingsIconUpdateform = useForm<SettingsIconUpdateDto>({
            resolver: valibotVigilio(settingsIconUpdateDto),
            mode: "all",
        });

        const settingsPhotoUpdateform = useForm<SettingsPhotoUpdateDto>({
            resolver: valibotVigilio(settingsPhotoUpdateDto),
            mode: "all",
        });
        const settingsPhotoDominioform = useForm<DominioUpdate>({
            resolver: valibotVigilio(dominioUpdate),
            mode: "all",
            // defaultValues: { host: setting.host.host },
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
                            }).then(() => {
                                window.location.reload();
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
            sweetModal({
                title: "¿Estas seguro de agregar un dominio?",
                text: "",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    settingsDominioUpdateMutation.mutate(body, {
                        onSuccess(data) {
                            methods.updateempresa({
                                setting: {
                                    ...state!.setting,
                                    host: data.host,
                                },
                            });
                            sweetModal({
                                icon: "success",
                                title: "Se agregó nuevo dominio.",
                                text: "Estas a un paso para tener tu dominio propio.",
                            });
                        },
                        onError(data) {
                            handlerError(settingsIconUpdateform, data);
                        },
                    });
                }
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
                        Configuración de tu Tienda Virtual
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
                                    question="Color de tu web"
                                />
                            </div>
                            <div class="w-[120px]">
                                <Form.control
                                    type="color"
                                    name={
                                        "bg_color_responsive" as keyof SettingsUpdateDto
                                    }
                                    title="color responsive"
                                    question="Color de tu web en modo responsive"
                                />
                            </div>
                            <Form.control.toggle
                                title="¿Modo Nocturno?"
                                name={"isDark" as keyof SettingsUpdateDto}
                                question="¿Deseas que tu web tenga modo nocturno?"
                            />
                            <Form.control.toggle
                                title="¿Animación de Scroll?"
                                name={"isScrolling" as keyof SettingsUpdateDto}
                                question="Animación cuando tus clientes bajan con el mouse o dedo a tu web"
                            />
                        </div>
                        <div class="flex flex-col gap-2">
                            <span class="text-xs font-semibold dark:text-white">
                                Producto
                            </span>
                            <div class="flex gap-4 items-center">
                                <div
                                    class={`w-[200px]  shadow bg-paper-light dark:bg-admin-terciary overflow-hidden ${
                                        type_border === "circle"
                                            ? "rounded-md"
                                            : ""
                                    }`}
                                >
                                    <div class="relative">
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
                                        {isLogoImage ? (
                                            <div class="absolute right-0 bottom-1 z-[9]">
                                                <LogoImage
                                                    width="40"
                                                    height="40"
                                                />
                                            </div>
                                        ) : null}
                                    </div>
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
                                    <Form.control.toggle
                                        name={
                                            "isLogoImage" as keyof SettingsUpdateDto
                                        }
                                        title="¿Ingresar logo?"
                                        question={
                                            <div class="w-[150px]">
                                                {!storageEmpresa?.logo ? (
                                                    <>
                                                        <Link
                                                            href="/empresa"
                                                            class="text-primary underline font-semibold text-xs"
                                                        >
                                                            No ingresaste logo a
                                                            tu empresa
                                                        </Link>
                                                        <br />
                                                    </>
                                                ) : null}
                                                Cuando subes las imagenes a tus
                                                productos se agregará tu logo.
                                            </div>
                                        }
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
                                        class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                            type_cart === "fas fa-shopping-cart"
                                                ? "bg-paper-light dark:bg-admin-terciary"
                                                : ""
                                        }`}
                                        type="button"
                                        onClick={() =>
                                            settingsUpdateform.setValue(
                                                "type_cart",
                                                "fas fa-shopping-cart"
                                            )
                                        }
                                    >
                                        <i class="fas fa-shopping-cart text-lg dark:text-white" />
                                    </button>
                                    <button
                                        class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                            type_cart === "fas fa-shopping-bag"
                                                ? "bg-paper-light dark:bg-admin-terciary"
                                                : ""
                                        }`}
                                        type="button"
                                        onClick={() =>
                                            settingsUpdateform.setValue(
                                                "type_cart",
                                                "fas fa-shopping-bag"
                                            )
                                        }
                                    >
                                        <i class="fas fa-shopping-bag text-lg dark:text-white" />
                                    </button>
                                    <button
                                        class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                            type_cart ===
                                            "fas fa-shopping-basket"
                                                ? "bg-paper-light dark:bg-admin-terciary"
                                                : ""
                                        }`}
                                        type="button"
                                        onClick={() =>
                                            settingsUpdateform.setValue(
                                                "type_cart",
                                                "fas fa-shopping-basket"
                                            )
                                        }
                                    >
                                        <i class="fas fa-shopping-basket text-lg dark:text-white" />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-2 items-center">
                            <div>
                                <span class="text-xs dark:text-white font-semibold">
                                    Tipo Bars
                                </span>
                                <div class="flex gap-2 flex-wrap">
                                    {hamburgers.map((hbm) => (
                                        <button
                                            key={hbm}
                                            class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                hamburger === hbm
                                                    ? "bg-paper-light dark:bg-admin-terciary"
                                                    : ""
                                            }`}
                                            type="button"
                                            onClick={() =>
                                                settingsUpdateform.setValue(
                                                    "hamburger",
                                                    hbm
                                                )
                                            }
                                        >
                                            <i
                                                class={`${hbm} text-lg dark:text-white`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Form.control.area
                            name={"about" as keyof SettingsUpdateDto}
                            title="Acerca de la empresa"
                            placeholder={`Somos  ${storageEmpresa?.name_empresa} ...`}
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
                            ¿Deseas tu propio Dominio{" "}
                            {slug(state!.name_empresa)}
                            .com o similar?
                        </span>
                        <AlertInfo>
                            <span class="font-bold">
                                <b>Obligatorio:</b> tu dominio en 1 minuto{"  "}
                                <a
                                    href="https://youtu.be/S8uOVMGOleA"
                                    target="_blank"
                                    rel="noreferrer"
                                    class="text-primary underline "
                                >
                                    Ver video
                                </a>
                            </span>
                        </AlertInfo>
                        <div class="flex gap-2 items-center">
                            <Form.control
                                type="text"
                                ico={<i class="far fa-globe" />}
                                name={"host" as keyof SettingsUpdateDto}
                                title="Dominio web"
                                placeholder="tudominio.com"
                                question={
                                    <div class="w-[200px]">
                                        <b class="font-bold">1.</b> Necesitas
                                        tener un dominio, En internet hay muchos
                                        proveedores de dominios como Hostinger,
                                        GoDaddy, etc.
                                        <br />
                                        <span>Recomendamos el siguiente </span>
                                        <a
                                            href="https://www.hosting-ssd.com/hosting/cart.php?a=add&domain=register"
                                            target="_blank"
                                            class="font-bold text-primary"
                                            rel="noreferrer"
                                        >
                                            Ir a dominio recomendado
                                        </a>
                                        <br />
                                        <b class="font-bold">2.</b> Recomendamos
                                        que tu dominio debe ser parecido al
                                        nombre de tu empresa.
                                        <br />
                                        <b class="font-bold">3.</b> Agrega tu
                                        dominio en 1 minuto -{" "}
                                        <a
                                            href="https://youtu.be/S8uOVMGOleA"
                                            target="_blank"
                                            rel="noreferrer"
                                            class="text-primary hover:underline"
                                        >
                                            {" "}
                                            Ver video tutorial
                                        </a>
                                        <br />
                                        Recuerda que los dominios comprados
                                        tienen fecha de expiración - anualmente
                                        renovarlo.
                                    </div>
                                }
                            />
                            <Form.button.submit
                                title="Agregar Dominio"
                                className="py-4"
                                ico={null}
                                isLoading={
                                    settingsDominioUpdateMutation.isLoading ||
                                    false
                                }
                                disabled={
                                    settingsDominioUpdateMutation.isLoading ||
                                    false
                                }
                            />
                        </div>
                    </Form>
                    {state?.setting.host.nameserver_one &&
                    state?.setting.host.nameserver_two ? (
                        <div className="flex flex-col dark:text-white">
                            <span class="font-bold text-sm">NameServers</span>
                            <div>
                                <span class="font-semibold text-xs">
                                    NameServer1:{" "}
                                    <span class="text-sm ml-2 font-bold ">
                                        {state?.setting.host.nameserver_one}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            cp1(
                                                state?.setting.host
                                                    .nameserver_one
                                            ).then(() => {
                                                sweetAlert({
                                                    icon: "success",
                                                    title: "Copiado correctamente.",
                                                });
                                            });
                                        }}
                                        class="dark:text-white ml-2"
                                    >
                                        <i class="fa-solid fa-copy" />
                                    </button>
                                </span>
                                <br />
                                <span class="font-semibold text-xs">
                                    NameServer2:{" "}
                                    <span class="text-sm ml-2 font-bold">
                                        {state?.setting.host.nameserver_two}
                                    </span>{" "}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            cp2(
                                                state?.setting.host
                                                    .nameserver_two
                                            ).then(() => {
                                                sweetAlert({
                                                    icon: "success",
                                                    title: "Copiado correctamente.",
                                                });
                                            });
                                        }}
                                        class="dark:text-white ml-2"
                                    >
                                        <i class="fa-solid fa-copy" />
                                    </button>
                                </span>
                            </div>
                            <span class="text-xs font-semibold">
                                Debe haber uno o más registros ✔️ en tu dominio,
                                para activar tu dominio. <br />
                                Recuerda que puede tardar entre 1 minuto a 24
                                horas.
                                <br />
                                <a
                                    href="https://www.whatsmydns.net/#A"
                                    class="text-primary underline mt-2"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Ver el estado de mi dominio
                                </a>
                            </span>
                            <div>
                                <div class="  self-center mt-3 flex gap-2 items-center">
                                    <>
                                        {restarDays(
                                            NOW().toDate(),
                                            state!.setting.host.time as Date,
                                            "seconds"
                                        ) >= 0 ? (
                                            <>
                                                {(() => {
                                                    const countdown =
                                                        useCountDown(
                                                            state!.setting.host
                                                                .time as Date
                                                        );

                                                    return (
                                                        <span class="font-bold">
                                                            {countdown.minutes}:
                                                            {countdown.seconds}
                                                        </span>
                                                    );
                                                })()}
                                            </>
                                        ) : null}
                                    </>
                                    <button
                                        type="button"
                                        disabled={
                                            restarDays(
                                                NOW().toDate(),
                                                state!.setting.host
                                                    .time as Date,
                                                "seconds"
                                            ) >= 0
                                        }
                                        onClick={() => {
                                            sweetModal({
                                                icon: "info",
                                                title: "¿Ya tienes un registro ✔️ en tu dominio?",
                                                text: "",
                                                showCloseButton: true,
                                                showCancelButton: true,
                                            }).then(() => {
                                                settingsDominioNameServerUpdateMutation.mutate(
                                                    null,
                                                    {
                                                        onSuccess(data) {
                                                            sweetAlert({
                                                                icon: "success",
                                                                title: `Ya tienes tu propio dominio web. <b>${data.url}</b>`,
                                                            }).then(() => {
                                                                window.location.href = `https://www.${data.url}`;
                                                            });
                                                        },
                                                        onError(data) {
                                                            sweetAlert({
                                                                icon: "danger",
                                                                title: (
                                                                    data as Error
                                                                ).message,
                                                            });
                                                        },
                                                    }
                                                );
                                            });
                                        }}
                                        class="flex justify-center items-center text-white bg-primary text-xs px-4 py-2 rounded-md shadow font-semibold"
                                    >
                                        {settingsDominioNameServerUpdateMutation.isLoading ? (
                                            <LoaderSubmit />
                                        ) : (
                                            <>
                                                <i class="fa-solid fa-globe mr-2 " />{" "}
                                                Activar Dominio Web
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : null}
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
