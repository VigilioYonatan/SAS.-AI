import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import { settingsIndexApi } from "../apis/settings/settings.index.api";
import Loading from "@/admin/components/Loading";
import Form from "~/components/form";
import { useEffect, useMemo } from "preact/hooks";
import { handlerError, isColorLight, NOW, restarDays } from "~/libs/helpers";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import useEmpresastore, { storageEmpresa } from "../stores/empresa.store";
import { useForm } from "react-hook-form";
import {
    settingsBackgrounAuthUpdateDto,
    SettingsBackgrounAuthUpdateDto,
    SettingsUpdateDto,
    settingsUpdateDto,
} from "../dtos/settings.update.dto";
import { valibotVigilio } from "~/libs/valibot";
import { getFilesEdit, printFileWithDimension } from "~/libs/upload";
import {
    settingsBackgroundAuthUpdateApi,
    settingsUpdateApi,
} from "../apis/settings/settings.update.api";
import Hr from "@/web/components/Hr";
import {
    settingsDominioDeleteServerUpdateApi,
    settingsDominioNameServerUpdateApi,
    settingsDominioUpdateApi,
} from "../apis/settings/dominio.update.api";
import { Input, pick } from "@vigilio/valibot";
import {
    hamburgers,
    hostSchema,
    SettingsSchema,
} from "../schemas/settings.schema";
import useAuthStore from "@/auth/stores/auth.store";
import { Link } from "wouter-preact";
import LogoImage from "~/components/LogoImage";
import AlertInfo from "~/components/Alerts/AlertInfo";
import { slug } from "@vigilio/express-core/helpers";
import useCountDown from "~/hooks/useCountDown";
import LoaderSubmit from "~/components/LoaderSubmit";
import useCopyToClipboard from "~/hooks/useCopyToClipboard";
import Hamburguer from "@/web/components/Hamburguer";
import useCartStore from "@/cart/stores/cart.store";
import useDropdown from "~/hooks/useDropdown";
import useThemeStore from "~/stores/theme.store";
import CartAside from "@/cart/views/CartAside";
import SearchProducts from "@/products/views/ProductsSearch";
import TitleSection from "@/web/components/TitleSection";
import { icons } from "@/web/views/home/components/BackgroundSection";
import NavTabs from "@/web/components/NavTabs";
import MapValue, { typeMap } from "~/components/MapValue";
import AlertWarning from "~/components/Alerts/AlertWarning";
import { BASE_URL } from "~/config";
import { SamplePrevArrow } from "@/web/components/ArrowsSlider";
import {
    LoaderFour,
    LoaderOne,
    LoaderThree,
    LoaderTwo,
} from "../components/LoaderCharging";

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

        const settingsDominioUpdateMutation = settingsDominioUpdateApi();
        const settingsBackgroundAuthUpdateMutation =
            settingsBackgroundAuthUpdateApi();
        const settingsDominioNameServerUpdateMutation =
            settingsDominioNameServerUpdateApi();
        const settingsDominioDeleteServerUpdateMutation =
            settingsDominioDeleteServerUpdateApi();
        const { state, methods } = useEmpresastore();
        const settingsUpdateform = useForm<SettingsUpdateDto>({
            resolver: valibotVigilio(settingsUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                const { ...rest } = setting;
                return {
                    ...rest,
                };
            }, []),
        });

        const formBackgroundUpdateImage =
            useForm<SettingsBackgrounAuthUpdateDto>({
                mode: "all",
                resolver: valibotVigilio(settingsBackgrounAuthUpdateDto),
            });
        function onUpdateBackgroundAuth(body: SettingsBackgrounAuthUpdateDto) {
            settingsBackgroundAuthUpdateMutation.mutate(body, {
                onSuccess() {
                    sweetAlert({
                        icon: "success",
                        title: "Se actualizó image correctamente",
                    });
                },
                onError(error) {
                    handlerError(formBackgroundUpdateImage, error);
                },
            });
        }
        async function initialUpdateImage() {
            const files = await getFilesEdit(
                setting.background_auth
                    ? setting.background_auth
                    : [
                          {
                              file: `${BASE_URL}/images/settings/others/portada.jpeg`,
                              dimension: 1600,
                          },
                      ],
                1600
            );

            formBackgroundUpdateImage.setValue("background_auth", files);
        }

        useEffect(() => {
            initialUpdateImage();
        }, []);
        const position_header = settingsUpdateform.watch("position_header");
        const isDark = settingsUpdateform.watch("isDark");
        const isCoverImage = settingsUpdateform.watch("isCoverImage");
        const type_border = settingsUpdateform.watch("type_border");
        const type_cart = settingsUpdateform.watch("type_cart");
        const hamburger = settingsUpdateform.watch("hamburger");
        const isLogoImage = settingsUpdateform.watch("isLogoImage");
        const bg_color = settingsUpdateform.watch("bg_color");
        const type_arrow = settingsUpdateform.watch("type_arrow");
        const type_loader = settingsUpdateform.watch("type_loader");
        const bg_color_background = settingsUpdateform.watch(
            "bg_color_background"
        );
        const background_position = settingsUpdateform.watch(
            "background_position"
        );
        const type_animation = settingsUpdateform.watch("type_animation");
        const type_icons_bars = settingsUpdateform.watch("type_icons_bars");
        const background_type = settingsUpdateform.watch("background_type");
        const bg_color_footer = settingsUpdateform.watch("bg_color_footer");
        const bg_color_paper = settingsUpdateform.watch("bg_color_paper");

        const bg_color_responsive = settingsUpdateform.watch(
            "bg_color_responsive"
        );
        const type_product_buttons = settingsUpdateform.watch(
            "type_product_buttons"
        );
        const header_position = settingsUpdateform.watch("header_position");
        const header_type = settingsUpdateform.watch("header_type");
        const border_title_type = settingsUpdateform.watch("border_title_type");
        const font_face = settingsUpdateform.watch("font_face");
        const type_icons = settingsUpdateform.watch("type_icons");
        const type_map = settingsUpdateform.watch("type_map");
        const type_star = settingsUpdateform.watch("type_star");
        const type_card = settingsUpdateform.watch("type_card");
        const themeStore = useThemeStore();
        const cartStore = useCartStore();
        const headerDropdown = useDropdown();
        const [cp1] = useCopyToClipboard();
        const [cp2] = useCopyToClipboard();

        const settingsPhotoDominioform = useForm<DominioUpdate>({
            resolver: valibotVigilio(dominioUpdate),
            mode: "all",
            defaultValues: { host: setting.host.host },
        });

        function onUpdateempresa(body: SettingsUpdateDto) {
            sweetModal({
                title: "¿Estas seguro de realizar estos cambios en tu web?",
                isCloseInBackground: false,
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
            sweetModal({
                title: "¿Estas seguro de agregar un dominio?",
                text: "",
                isCloseInBackground: false,
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
                            sweetAlert({
                                icon: "danger",
                                title: `Error ${data.message}`,
                            });
                        },
                    });
                }
            });
        }

        component = (
            <>
                <div class="p-4 max-w-3xl">
                    <h3 class="dark:text-white lg:text-2xl  font-bold uppercase text-center flex gap-2  w-full mb-4">
                        <i class="fa-solid fa-tools" />
                        Configuración de tu Tienda Virtual
                    </h3>

                    <br />
                    <Form
                        className="flex gap-4  flex-col"
                        {...settingsPhotoDominioform}
                        onSubmit={onUpdateHost}
                    >
                        <span class="font-semibold dark:text-secondary-light">
                            ¿Deseas tu propio Dominio{" "}
                            <b class="font-semibold">
                                {slug(state!.name_empresa)}
                                .com{" "}
                            </b>{" "}
                            o similar?
                        </span>
                        <AlertInfo>
                            <span class="font-bold">
                                <b>Obligatorio:</b>
                                <br />
                                1. Registrar y Comprar dominio{" "}
                                <em>(en Internet hay muchos proveedores)</em> -
                                Recomendamos:{" "}
                                {storageEmpresa?.dial_code === "51"
                                    ? "HostingSSD"
                                    : "Hostinger"}{" "}
                                {storageEmpresa?.dial_code === "51" ? (
                                    <a
                                        href="https://www.hosting-ssd.com/hosting/cart.php?a=add&domain=register"
                                        class="underline font-semibold text-primary"
                                    >
                                        Ir a proveedor
                                    </a>
                                ) : (
                                    <a
                                        href="https://www.hostinger.es/comprar-dominio"
                                        class="underline font-semibold  text-primary"
                                    >
                                        Ir a proveedor
                                    </a>
                                )}
                                <br />
                                2. Si deseas hacerlo tu mismo en 1 minuto{" "}
                                <a
                                    href="https://youtu.be/S8uOVMGOleA"
                                    target="_blank"
                                    rel="noreferrer"
                                    class="text-primary underline "
                                >
                                    Ver video
                                </a>{" "}
                                y si no deseas hacerlo usted mismo, podemos
                                hacerlo por ti. Envianos un mensaje a{" "}
                                <b>soporte@vigilio-services.com</b>, "Nombre de
                                tu empresa, tu dominio.com y tu cuenta de
                                dominio del proveedor comprado para acceder a
                                ello ". Se le enviará un mensaje en su numero de
                                Whatsapp cuando se culmine.
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
                                        {storageEmpresa?.dial_code === "51" ? (
                                            <a
                                                href="https://www.hosting-ssd.com/hosting/cart.php?a=add&domain=register"
                                                target="_blank"
                                                class="font-bold text-primary"
                                                rel="noreferrer"
                                            >
                                                Ir a dominio recomendado
                                            </a>
                                        ) : (
                                            <a
                                                href="https://www.hostinger.es/comprar-dominio"
                                                target="_blank"
                                                class="font-bold text-primary"
                                                rel="noreferrer"
                                            >
                                                Ir a dominio recomendado
                                            </a>
                                        )}
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
                            <br />
                            <div>
                                <div class="  self-center mt-3 flex gap-2 items-center">
                                    {restarDays(
                                        NOW().toDate(),
                                        state!.setting.host.time as Date,
                                        "seconds"
                                    ) >= 0 ? (
                                        <>
                                            {(() => {
                                                const countdown = useCountDown(
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
                                    {storageEmpresa?.setting.host.enabled ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                sweetModal({
                                                    icon: "info",
                                                    title: "¿Estas seguro eliminar tu dominio?",
                                                    text: "",
                                                    isCloseInBackground: false,
                                                    showCancelButton: true,
                                                    showCloseButton: true,
                                                }).then(({ isConfirmed }) => {
                                                    if (isConfirmed) {
                                                        settingsDominioDeleteServerUpdateMutation.mutate(
                                                            null,
                                                            {
                                                                onSuccess() {
                                                                    sweetAlert({
                                                                        icon: "success",
                                                                        title: "Se quito dominio correctamente",
                                                                    }).then(
                                                                        () => {
                                                                            window.location.href = `https://www.${storageEmpresa?.slug}.vigilio-services.com`;
                                                                        }
                                                                    );
                                                                },
                                                                onError(data) {
                                                                    sweetAlert({
                                                                        icon: "danger",
                                                                        title: `${
                                                                            (
                                                                                data as Error
                                                                            )
                                                                                .message
                                                                        } o intentálo de nuevo más tarde.`,
                                                                    });
                                                                },
                                                            }
                                                        );
                                                    }
                                                });
                                            }}
                                            disabled={
                                                settingsDominioDeleteServerUpdateMutation.isLoading ||
                                                false
                                            }
                                            class="flex justify-center items-center text-white bg-primary text-xs px-4 py-2 rounded-md shadow font-semibold"
                                        >
                                            {settingsDominioNameServerUpdateMutation.isLoading ? (
                                                <LoaderSubmit />
                                            ) : (
                                                <>
                                                    <i class="fa-solid fa-globe mr-2 " />{" "}
                                                    Eliminar Dominio
                                                </>
                                            )}
                                        </button>
                                    ) : (
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
                                                }).then(({ isConfirmed }) => {
                                                    if (isConfirmed) {
                                                        settingsDominioNameServerUpdateMutation.mutate(
                                                            null,
                                                            {
                                                                onSuccess(
                                                                    data
                                                                ) {
                                                                    sweetAlert({
                                                                        icon: "success",
                                                                        title: `Ya tienes tu propio dominio web. <b>${data.url}</b>`,
                                                                    }).then(
                                                                        () => {
                                                                            window.location.href = `https://www.${data.url}`;
                                                                        }
                                                                    );
                                                                },
                                                                onError(data) {
                                                                    sweetAlert({
                                                                        icon: "danger",
                                                                        title: `${
                                                                            (
                                                                                data as Error
                                                                            )
                                                                                .message
                                                                        } o intentálo de nuevo más tarde.`,
                                                                    });
                                                                },
                                                            }
                                                        );
                                                    }
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
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : null}
                    <br />
                </div>{" "}
                <br />
                <Form
                    {...formBackgroundUpdateImage}
                    onSubmit={onUpdateBackgroundAuth}
                >
                    <Form.control.file
                        name={
                            "background_auth" as keyof SettingsBackgrounAuthUpdateDto
                        }
                        title="Imagen de portada - Autenticación"
                        accept="image/*"
                        multiple={false}
                        showButonCopy
                        typeFile="image"
                    />
                    <Form.button.submit
                        disabled={
                            settingsBackgroundAuthUpdateMutation.isLoading ||
                            false
                        }
                        isLoading={
                            settingsBackgroundAuthUpdateMutation.isLoading ||
                            false
                        }
                        title="Guardar Cambios"
                    />
                </Form>
                <br />
                {!storageEmpresa?.isProduction ? (
                    <Form
                        className="flex gap-4 flex-col"
                        {...settingsUpdateform}
                        onSubmit={onUpdateempresa}
                    >
                        <div class="grid grid-cols-2 md:grid-cols-3">
                            <div class="w-[120px]">
                                <Form.control.color
                                    name={"bg_color" as keyof SettingsUpdateDto}
                                    title="color de tu web"
                                    question="Color de tu web"
                                />
                            </div>
                            <div class="w-[120px]">
                                <Form.control.color
                                    name={
                                        "bg_color_responsive" as keyof SettingsUpdateDto
                                    }
                                    title="color responsive"
                                    question="Color de tu web en modo responsive"
                                />
                            </div>
                            <div class="w-[120px]">
                                <Form.control.color
                                    name={
                                        "bg_color_background" as keyof SettingsUpdateDto
                                    }
                                    title="color de fondo"
                                    question="Color de fondo de tu web"
                                />
                            </div>
                            <div class="w-[120px]">
                                <Form.control.color
                                    name={
                                        "bg_color_paper" as keyof SettingsUpdateDto
                                    }
                                    title="color de fondo2 "
                                    question="Color de fondo2 de tu web"
                                />
                            </div>
                            <div class="w-[120px]">
                                <Form.control.color
                                    name={
                                        "bg_color_footer" as keyof SettingsUpdateDto
                                    }
                                    title="color del footer "
                                    question="Color de fondo2 de tu web"
                                />
                            </div>
                            <div class="w-[120px]">
                                <Form.control.color
                                    name={
                                        "bg_color_button" as keyof SettingsUpdateDto
                                    }
                                    title="color del boton carrito"
                                />
                            </div>
                            <div class="w-[120px]">
                                <Form.control.color
                                    name={
                                        "bg_color_secondary" as keyof SettingsUpdateDto
                                    }
                                    title="Color Secundario"
                                />
                            </div>
                            <div class="w-[120px]">
                                <Form.control.color
                                    name={
                                        "bg_color_header" as keyof SettingsUpdateDto
                                    }
                                    title="Color Header Background"
                                />
                            </div>
                            <div class="w-[120px]">
                                <Form.control.color
                                    name={
                                        "bg_color_aside" as keyof SettingsUpdateDto
                                    }
                                    title="Color Aside Responsive"
                                />
                            </div>
                            <div class="w-[120px]">
                                <Form.control.color
                                    name={
                                        "text_color" as keyof SettingsUpdateDto
                                    }
                                    title="Forzar color texto"
                                />
                            </div>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-4">
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
                            <Form.control.toggle
                                title="Bloquear Aside"
                                name={
                                    "is_block_aside" as keyof SettingsUpdateDto
                                }
                                question="Bloquear Aside"
                            />
                            <Form.control.toggle
                                title="Pagina de Servicios"
                                name={
                                    "is_service_page" as keyof SettingsUpdateDto
                                }
                                question={
                                    <span class="">
                                        Agregar página servicios.
                                        <br />
                                        No activar si no eres desarrollador.
                                    </span>
                                }
                            />
                            <Form.control.toggle
                                title="Web Eccomerce?"
                                name={"isEccomerce" as keyof SettingsUpdateDto}
                                question={
                                    <span class="block w-[200px]">
                                        No se venderá productos, no tendra
                                        carrito de compras, etc.
                                        <br />
                                        Solo será landing page o venderas
                                        servicios?
                                    </span>
                                }
                            />
                            <Form.control.toggle
                                title="¿Registrar?"
                                name={"isLogin" as keyof SettingsUpdateDto}
                                question={
                                    <span class="block w-[200px]">
                                        No se podrán registrar clientes si está
                                        desactivado
                                    </span>
                                }
                            />
                            <Form.control.toggle
                                title="¿Agregar subcategorias"
                                name={
                                    "is_subcategory" as keyof SettingsUpdateDto
                                }
                                question={
                                    <span class="block w-[200px]">
                                        ¿Tu web solo permite categorías a tus
                                        productos?
                                        <br />
                                        Con esto activado, podrás agregar
                                        subcategorías.
                                        <br />
                                        Ejemplo 1:
                                        <br />
                                        <b class="font-bold">Categoría</b>:
                                        Tecnología <br />{" "}
                                        <b class="font-bold">Subcategorias</b> :
                                        Televisores, Celulares, Laptops, etc.
                                        <br />
                                        Ejemplo 2:
                                        <br />
                                        <b class="font-bold">Categoría</b>:
                                        Calzados
                                        <br />{" "}
                                        <b class="font-bold">Subcategorias</b> :
                                        Zapatillas, Zapatos, Zandalias, etc.
                                        <br />
                                        <div class="[&>div]:p-0 [&>div>i]:me-0">
                                            <AlertWarning>
                                                <span class="text-xs">
                                                    Si ya tiene productos
                                                    agregados, Agregar
                                                    subcategorías a esos
                                                    productos.
                                                </span>
                                            </AlertWarning>
                                        </div>
                                    </span>
                                }
                            />
                            <Form.control.toggle
                                title="¿Tendrá cuotas los productos?"
                                name={"isCuota" as keyof SettingsUpdateDto}
                                question="Los productos tendrán un campo más para agregar cuotas. Solo esta disponible para productos normal"
                            />
                        </div>
                        <div class="grid grid-cols-2 lg:grid-cols-4">
                            <Form.control.toggle
                                name="position_header"
                                title="Header Mobile"
                            />
                            <Form.control.toggle
                                name="is_hidde_total_cart"
                                title="Ocultar carrito Total"
                                question="Ocultar total en el header"
                            />
                            <div class="w-[120px]">
                                <Form.control
                                    name="logo_width"
                                    type="number"
                                    title="Tamaño de logo"
                                    placeholder={"80"}
                                    question="Tamaño de tu logo en pixeles"
                                    options={{ setValueAs: Number }}
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor=""
                                    class="text-xs font-semibold  dark:text-white"
                                >
                                    Posición del header [1, 2, 3]
                                </label>
                                <div class="grid grid-cols-3">
                                    <div class="w-[60px]">
                                        <Form.control
                                            title="logo"
                                            name={"header_position.logo"}
                                            type="number"
                                            min={1}
                                            max={3}
                                            options={{ setValueAs: Number }}
                                        />
                                    </div>
                                    <div class="w-[60px]">
                                        <Form.control
                                            title="Navbar"
                                            name={"header_position.navbar"}
                                            type="number"
                                            min={1}
                                            max={3}
                                            options={{ setValueAs: Number }}
                                        />
                                    </div>
                                    <div class="w-[60px]">
                                        <Form.control
                                            title="Iconoes"
                                            name={"header_position.icons"}
                                            type="number"
                                            min={1}
                                            max={3}
                                            options={{ setValueAs: Number }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2 items-center w-full">
                            <div class="w-full">
                                <div
                                    style={{
                                        backgroundColor: bg_color_paper,
                                    }}
                                >
                                    <div class="flex gap-2 flex-wrap w-full">
                                        <header
                                            class={
                                                " w-full px-4    py-4 shadow    delay-custom-1 "
                                            }
                                            style={{
                                                background: bg_color_background,
                                                color: isColorLight(
                                                    bg_color_background
                                                )
                                                    ? "#000000"
                                                    : "#FFFFFF",
                                            }}
                                        >
                                            <div class=" max-w-6xl mx-auto">
                                                <div class="flex justify-between gap-2 items-center">
                                                    {!position_header ? (
                                                        <div
                                                            class="flex items-center gap-2"
                                                            style={{
                                                                order:
                                                                    header_position?.logo ??
                                                                    1,
                                                            }}
                                                        >
                                                            <button
                                                                type="button"
                                                                aria-label="open aside"
                                                                onClick={
                                                                    headerDropdown.onOpen
                                                                }
                                                            >
                                                                <Hamburguer
                                                                    isOpen={
                                                                        headerDropdown.dropdownOpen
                                                                    }
                                                                />
                                                            </button>
                                                            <a
                                                                href={"/"}
                                                                class="flex  items-center "
                                                            >
                                                                {empresaStore.state!
                                                                    .logo ? (
                                                                    <img
                                                                        width={
                                                                            100
                                                                        }
                                                                        height={
                                                                            100
                                                                        }
                                                                        src={
                                                                            printFileWithDimension(
                                                                                empresaStore.state!
                                                                                    .logo!,
                                                                                100
                                                                            )[0]
                                                                        }
                                                                        class="w-[50px] h-[50px] object-contain"
                                                                        alt={
                                                                            empresaStore.state!
                                                                                .name_empresa
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <h2 class="text-2xl font-bold  uppercase">
                                                                        {
                                                                            empresaStore.state!
                                                                                .name_empresa[0]
                                                                        }
                                                                    </h2>
                                                                )}
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button
                                                                type="button"
                                                                aria-label="open aside"
                                                                onClick={
                                                                    headerDropdown.onOpen
                                                                }
                                                                style={{
                                                                    order:
                                                                        header_position?.logo ??
                                                                        1,
                                                                }}
                                                            >
                                                                <div
                                                                    class={
                                                                        "hamburger hamburger--collapse"
                                                                    }
                                                                >
                                                                    <i
                                                                        class={`${hamburger} ${
                                                                            hamburger ===
                                                                            "fas pizza-slice"
                                                                                ? "rotate-[250deg]"
                                                                                : ""
                                                                        } text-3xl `}
                                                                    />
                                                                </div>
                                                            </button>

                                                            <a
                                                                href={"/"}
                                                                class="flex  items-center ml-12"
                                                                style={{
                                                                    order:
                                                                        header_position?.logo ??
                                                                        1,
                                                                }}
                                                            >
                                                                {empresaStore.state!
                                                                    .logo ? (
                                                                    <img
                                                                        width={
                                                                            100
                                                                        }
                                                                        height={
                                                                            100
                                                                        }
                                                                        src={
                                                                            printFileWithDimension(
                                                                                empresaStore.state!
                                                                                    .logo!,
                                                                                100
                                                                            )[0]
                                                                        }
                                                                        class="w-[60px] h-[60px] object-contain"
                                                                        alt={
                                                                            empresaStore.state!
                                                                                .name_empresa
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <h2 class="text-2xl font-bold  uppercase">
                                                                        {
                                                                            empresaStore.state!
                                                                                .name_empresa[0]
                                                                        }
                                                                    </h2>
                                                                )}
                                                            </a>
                                                        </>
                                                    )}
                                                    {/* cartaside */}
                                                    <div
                                                        class={`fixed inset-0 bg-opacity-70 bg-black z-[999] flex justify-end h-full ${
                                                            cartStore.dropdown
                                                                .value
                                                                ? "visible"
                                                                : "invisible"
                                                        } delay-custom-1`}
                                                        onClick={
                                                            cartStore.dropdown
                                                                .onClose
                                                        }
                                                        style={{
                                                            order:
                                                                header_position?.navbar ??
                                                                2,
                                                        }}
                                                    >
                                                        <div
                                                            class={`w-full delay-custom-1 md:w-[350px] bg-white dark:bg-paper-dark relative p-2 ${
                                                                cartStore
                                                                    .dropdown
                                                                    .value
                                                                    ? "translate-x-0"
                                                                    : "translate-x-full"
                                                            }`}
                                                            onClick={(e) =>
                                                                e.stopPropagation()
                                                            }
                                                        >
                                                            <button
                                                                class="text-end block  text-primary absolute top-0 right-0 m-2"
                                                                type="button"
                                                                aria-label="close cart"
                                                                onClick={
                                                                    cartStore
                                                                        .dropdown
                                                                        .onClose
                                                                }
                                                            >
                                                                <i class="fa-solid fa-x" />
                                                            </button>
                                                            <CartAside />
                                                        </div>
                                                    </div>

                                                    {/* endcartaside */}
                                                    <div
                                                        class="flex gap-3 items-center   text-xl "
                                                        style={{
                                                            order:
                                                                header_position?.icons ??
                                                                3,
                                                        }}
                                                    >
                                                        <SearchProducts />
                                                        <button
                                                            type="button"
                                                            aria-label="btn"
                                                            class="text-white px-4 py-2 rounded-md text-xs font-semibold"
                                                            style={{
                                                                backgroundColor:
                                                                    bg_color,
                                                            }}
                                                        >
                                                            Sign In
                                                        </button>
                                                        {isDark ? (
                                                            <button
                                                                type="button"
                                                                aria-label="change theme"
                                                                onClick={() => {
                                                                    themeStore.methods.changeThemeMode(
                                                                        themeStore.state ===
                                                                            "dark"
                                                                            ? "light"
                                                                            : "dark"
                                                                    );
                                                                }}
                                                            >
                                                                {themeStore.state! ===
                                                                "dark" ? (
                                                                    <i class="fas fa-moon" />
                                                                ) : (
                                                                    <i class="far fa-sun" />
                                                                )}
                                                            </button>
                                                        ) : null}

                                                        <button
                                                            type="button"
                                                            class=" text-xl   relative"
                                                            onClick={
                                                                cartStore
                                                                    .dropdown
                                                                    .onOpen
                                                            }
                                                        >
                                                            <i
                                                                class={
                                                                    type_cart
                                                                }
                                                            />
                                                            <span class="absolute -top-1 -right-2 bg-primary text-xs font-bold flex justify-center items-center text-white w-[20px] h-[20px] rounded-full">
                                                                {
                                                                    cartStore
                                                                        .computed
                                                                        .showCartLength
                                                                }
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </header>
                                    </div>
                                    <br />{" "}
                                    <TitleSection
                                        titleExample={border_title_type}
                                    >
                                        Esto es un titulo
                                    </TitleSection>{" "}
                                    <div
                                        class="flex flex-col gap-2 self-start p-2 md:w-[500px] rounded-md shadow-md mx-2"
                                        style={{
                                            color: isColorLight(
                                                bg_color_background
                                            )
                                                ? "#000000 !important"
                                                : "#FFFFFF !important",
                                            backgroundColor:
                                                bg_color_background,
                                        }}
                                    >
                                        <div class="flex flex-col md:flex-row gap-4 items-center">
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
                                            <div
                                                class={`${
                                                    isColorLight(
                                                        bg_color_background
                                                    )
                                                        ? "parent_form"
                                                        : ""
                                                }`}
                                            >
                                                <style jsx>{`
                                                    .parent_form label {
                                                        ${isColorLight(
                                                            bg_color_background
                                                        )
                                                            ? "color: #000000 !important"
                                                            : "color: #FFFFFF !important"};
                                                    }
                                                `}</style>
                                                <Form.control.select
                                                    name={
                                                        "type_border" as keyof SettingsUpdateDto
                                                    }
                                                    title="Borde"
                                                    array={[
                                                        {
                                                            key: "circle",
                                                            value: "Redondo",
                                                        },
                                                        {
                                                            key: "square",
                                                            value: "Rectangular",
                                                        },
                                                    ]}
                                                    placeholder="Escoger tipo de border"
                                                />
                                                <div class="grid gap-2 grid-cols-2">
                                                    <Form.control.toggle
                                                        name={
                                                            "isCoverImage" as keyof SettingsUpdateDto
                                                        }
                                                        title="¿Cover Imagen?"
                                                    />
                                                    <Form.control.toggle
                                                        name={
                                                            "is_hover_product" as keyof SettingsUpdateDto
                                                        }
                                                        title="Hover Imagen?"
                                                    />
                                                    <Form.control
                                                        type="number"
                                                        name={
                                                            "products_limit" as keyof SettingsUpdateDto
                                                        }
                                                        title="Limite de Productos"
                                                        options={{
                                                            setValueAs: Number,
                                                        }}
                                                        question="Limite de Productos por categoria en Home Product Category Seccion"
                                                    />
                                                    <Form.control
                                                        type="number"
                                                        name={
                                                            "products_limit_offer" as keyof SettingsUpdateDto
                                                        }
                                                        title="Limite de Productos Oferta"
                                                        options={{
                                                            setValueAs: Number,
                                                        }}
                                                        question="Limite de Productos de ofertas en Home Product Category Seccion"
                                                    />
                                                </div>

                                                <div>
                                                    <span class="text-xs dark:text-white font-semibold">
                                                        Tipo de Card
                                                    </span>
                                                    <div class="flex gap-2 flex-wrap">
                                                        <div class="flex flex-col gap-1">
                                                            <div class="flex gap-1">
                                                                <button
                                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                                        type_card ===
                                                                        "normal"
                                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                                            : ""
                                                                    } font-semibold text-xs dark:text-white`}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        settingsUpdateform.setValue(
                                                                            "type_card",
                                                                            "normal"
                                                                        );
                                                                    }}
                                                                >
                                                                    Normal
                                                                </button>
                                                                <button
                                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                                        type_card ===
                                                                        "eccomerce"
                                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                                            : ""
                                                                    } font-semibold text-xs dark:text-white`}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        settingsUpdateform.setValue(
                                                                            "type_card",
                                                                            "eccomerce"
                                                                        );
                                                                    }}
                                                                >
                                                                    Eccomerce
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <span class="text-xs dark:text-white font-semibold">
                                                        Tipo de Boton Product
                                                    </span>
                                                    <div class="flex gap-2 flex-wrap">
                                                        <div class="flex flex-col gap-1">
                                                            <div class="flex gap-1">
                                                                <button
                                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                                        type_product_buttons ===
                                                                        "first"
                                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                                            : ""
                                                                    } font-semibold text-xs dark:text-white`}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        settingsUpdateform.setValue(
                                                                            "type_product_buttons",
                                                                            "first"
                                                                        );
                                                                    }}
                                                                >
                                                                    Primer
                                                                </button>
                                                                <button
                                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                                        type_product_buttons ===
                                                                        "second"
                                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                                            : ""
                                                                    } font-semibold text-xs dark:text-white`}
                                                                    type="button"
                                                                    onClick={() => {
                                                                        settingsUpdateform.setValue(
                                                                            "type_product_buttons",
                                                                            "second"
                                                                        );
                                                                    }}
                                                                >
                                                                    Segundo
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="grid grid-cols-2 gap-2">
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
                                                                            No
                                                                            ingresaste
                                                                            logo
                                                                            a tu
                                                                            empresa
                                                                        </Link>
                                                                        <br />
                                                                    </>
                                                                ) : null}
                                                                Cuando subes las
                                                                imagenes a tus
                                                                productos se
                                                                agregará tu
                                                                logo.
                                                            </div>
                                                        }
                                                    />
                                                    <Form.control.toggle
                                                        name={
                                                            "isProductWallpaper" as keyof SettingsUpdateDto
                                                        }
                                                        title="Se agregará wallpaper para la categorías."
                                                        question={
                                                            <div class="w-[150px]">
                                                                Solo activar
                                                                para negocios
                                                                que quieren
                                                                mostrar
                                                                wallpaper en la
                                                                seccion de
                                                                productos home.
                                                            </div>
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <br />
                                    <footer
                                        class="flex gap-2 px-4 shadow-md items-center text-xs justify-between font-semibold parent_footer"
                                        style={{
                                            backgroundColor: bg_color_footer,
                                        }}
                                    >
                                        <style jsx>{`
                                            .parent_footer span {
                                                ${isColorLight(bg_color_footer)
                                                    ? "color: #000000 !important"
                                                    : "color: #FFFFFF !important"};
                                            }
                                        `}</style>
                                        <span class="text-center">
                                            All right Copyrigther{" "}
                                            {new Date().getFullYear()}
                                        </span>
                                        <a
                                            href="#start"
                                            type="button"
                                            class="py-4 px-6 text-white"
                                            aria-label="up"
                                            style={{
                                                backgroundColor: bg_color,
                                            }}
                                        >
                                            <i class="fa-solid fa-caret-up" />
                                        </a>
                                        <span class="text-center">
                                            Este es el pie de página
                                        </span>
                                    </footer>
                                    <NavTabs
                                        totalProducts={1}
                                        background={bg_color_responsive}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-2 items-center">
                            <div class="flex flex-col gap-2">
                                <div>
                                    <span class="text-xs dark:text-white font-semibold">
                                        Tipo de Icono Weight
                                    </span>
                                    <div class="flex gap-2">
                                        <button
                                            class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                type_icons_bars === "normal"
                                                    ? "bg-paper-light dark:bg-admin-terciary"
                                                    : ""
                                            }`}
                                            type="button"
                                            onClick={() =>
                                                settingsUpdateform.setValue(
                                                    "type_icons_bars",
                                                    "normal"
                                                )
                                            }
                                        >
                                            <i class="fas fa-shopping-cart text-lg dark:text-white" />
                                        </button>
                                        <button
                                            class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                type_icons_bars === "light"
                                                    ? "bg-paper-light dark:bg-admin-terciary"
                                                    : ""
                                            }`}
                                            type="button"
                                            onClick={() =>
                                                settingsUpdateform.setValue(
                                                    "type_icons_bars",
                                                    "light"
                                                )
                                            }
                                        >
                                            <i class="far fa-shopping-cart text-lg dark:text-white" />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <span class="text-xs dark:text-white font-semibold">
                                        Tipo de Icono
                                    </span>
                                    <div class="flex gap-2">
                                        <button
                                            class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                type_cart ===
                                                "fas fa-shopping-cart"
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
                                            <i
                                                class={`fa${
                                                    type_icons_bars === "normal"
                                                        ? "s"
                                                        : "r"
                                                } fa-shopping-cart text-lg dark:text-white`}
                                            />
                                        </button>
                                        <button
                                            class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                type_cart ===
                                                "fas fa-shopping-bag"
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
                                            <i
                                                class={`fa${
                                                    type_icons_bars === "normal"
                                                        ? "s"
                                                        : "r"
                                                } fa-shopping-bag text-lg dark:text-white`}
                                            />
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
                                            <i
                                                class={`fa${
                                                    type_icons_bars === "normal"
                                                        ? "s"
                                                        : "r"
                                                } fa-shopping-basket text-lg dark:text-white`}
                                            />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <span class="text-xs dark:text-white font-semibold">
                                        Tipo de Estrella
                                    </span>
                                    <div class="flex gap-2">
                                        <button
                                            class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                type_star === "star"
                                                    ? "bg-paper-light dark:bg-admin-terciary"
                                                    : ""
                                            }`}
                                            type="button"
                                            onClick={() =>
                                                settingsUpdateform.setValue(
                                                    "type_star",
                                                    "star"
                                                )
                                            }
                                        >
                                            <i
                                                class={`fa${
                                                    type_icons_bars === "normal"
                                                        ? "s"
                                                        : "r"
                                                } fa-star text-lg dark:text-white`}
                                            />
                                        </button>
                                        <button
                                            class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                type_star === "heart"
                                                    ? "bg-paper-light dark:bg-admin-terciary"
                                                    : ""
                                            }`}
                                            type="button"
                                            onClick={() =>
                                                settingsUpdateform.setValue(
                                                    "type_star",
                                                    "heart"
                                                )
                                            }
                                        >
                                            <i
                                                class={`fa${
                                                    type_icons_bars === "normal"
                                                        ? "s"
                                                        : "r"
                                                } fa-heart text-lg dark:text-white`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="flex flex-col gap-2">
                                <div>
                                    <span class="text-xs dark:text-white font-semibold">
                                        Tipo de Fuente
                                    </span>
                                    <div class="flex gap-2 flex-wrap">
                                        <div class="flex flex-col gap-1">
                                            <div class="flex gap-1">
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        font_face === "Exo"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "font_face",
                                                            "Exo"
                                                        );
                                                    }}
                                                >
                                                    Exo
                                                </button>
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        font_face === "Poppins"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "font_face",
                                                            "Poppins"
                                                        );
                                                    }}
                                                >
                                                    Poppins
                                                </button>
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        font_face === "Barlow"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "font_face",
                                                            "Barlow"
                                                        );
                                                    }}
                                                >
                                                    Barlow
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span class="text-xs dark:text-white font-semibold">
                                        Tipo de Animacion Scroll
                                    </span>
                                    <div class="flex gap-2 flex-wrap">
                                        <div class="flex flex-col gap-1">
                                            <div class="flex gap-1">
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        type_animation ===
                                                        "fade-up"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "type_animation",
                                                            "fade-up"
                                                        );
                                                    }}
                                                >
                                                    Fade Up
                                                </button>
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        type_animation ===
                                                        "zoom-in"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "type_animation",
                                                            "zoom-in"
                                                        );
                                                    }}
                                                >
                                                    Zoom In
                                                </button>
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        type_animation ===
                                                        "flip-left"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "type_animation",
                                                            "flip-left"
                                                        );
                                                    }}
                                                >
                                                    Flip Left
                                                </button>
                                            </div>
                                        </div>
                                    </div>
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
                                                class={`${hbm.replace(
                                                    "fas",
                                                    type_icons_bars === "normal"
                                                        ? "fas"
                                                        : "far"
                                                )} text-lg dark:text-white`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span class="text-xs dark:text-white font-semibold">
                                    Tipo Arrow
                                </span>
                                <div class="flex gap-2 flex-wrap">
                                    {(
                                        [
                                            "first",
                                            "second",
                                            "third",
                                        ] as (typeof type_arrow)[]
                                    ).map((arrow) => (
                                        <button
                                            key={arrow}
                                            class={`min-w-[60px] h-[60px]  rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                type_arrow === arrow
                                                    ? "bg-paper-light dark:bg-admin-terciary"
                                                    : ""
                                            }`}
                                            type="button"
                                            onClick={() =>
                                                settingsUpdateform.setValue(
                                                    "type_arrow",
                                                    arrow
                                                )
                                            }
                                        >
                                            <SamplePrevArrow
                                                isSetting={arrow}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div class="flex flex-col">
                                <div>
                                    <span class="text-xs dark:text-white font-semibold">
                                        Tipo de Header
                                    </span>
                                    <div class="flex gap-2 flex-wrap">
                                        <div class="flex flex-col gap-1">
                                            <div class="flex gap-1">
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        header_type === "normal"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "header_type",
                                                            "normal"
                                                        );
                                                    }}
                                                >
                                                    Normal
                                                </button>
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        header_type === "search"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "header_type",
                                                            "search"
                                                        );
                                                    }}
                                                >
                                                    Search
                                                </button>
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        header_type ===
                                                        "search2"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "header_type",
                                                            "search2"
                                                        );
                                                    }}
                                                >
                                                    Search 2
                                                </button>
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        header_type ===
                                                        "transparent"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "header_type",
                                                            "transparent"
                                                        );
                                                    }}
                                                >
                                                    Transparent
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span class="text-xs dark:text-white font-semibold">
                                        Tipo de Background
                                    </span>
                                    <div class="flex gap-2 flex-wrap">
                                        <div class="flex flex-col gap-1">
                                            <div class="flex gap-1">
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        background_type ===
                                                        "first"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "background_type",
                                                            "first"
                                                        );
                                                    }}
                                                >
                                                    First
                                                </button>
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        background_type ===
                                                        "second"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "background_type",
                                                            "second"
                                                        );
                                                    }}
                                                >
                                                    Second
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <span class="text-xs dark:text-white font-semibold">
                                        Background Position
                                    </span>
                                    <div class="flex gap-2 flex-wrap">
                                        <div class="flex flex-col gap-1">
                                            <div class="flex gap-1">
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        background_position ===
                                                        "start"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "background_position",
                                                            "start"
                                                        );
                                                    }}
                                                >
                                                    Start
                                                </button>
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        background_position ===
                                                        "center"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "background_position",
                                                            "center"
                                                        );
                                                    }}
                                                >
                                                    Center
                                                </button>
                                                <button
                                                    class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        background_position ===
                                                        "end"
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "background_position",
                                                            "end"
                                                        );
                                                    }}
                                                >
                                                    End
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-2 items-center">
                            <div class="flex flex-col">
                                <div>
                                    <span class="text-xs dark:text-white font-semibold">
                                        Border de los titulos
                                    </span>
                                    <div class="flex gap-2 flex-wrap">
                                        <div class="flex flex-col gap-1">
                                            <div class="flex gap-1">
                                                {(
                                                    [
                                                        "normal",
                                                        "circle",
                                                        "border",
                                                        "null",
                                                    ] as (typeof border_title_type)[]
                                                ).map((border) => (
                                                    <button
                                                        key={border}
                                                        class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                            border_title_type ===
                                                            border
                                                                ? "bg-paper-light dark:bg-admin-terciary"
                                                                : ""
                                                        } font-semibold text-xs dark:text-white`}
                                                        type="button"
                                                        onClick={() => {
                                                            settingsUpdateform.setValue(
                                                                "border_title_type",
                                                                border
                                                            );
                                                        }}
                                                    >
                                                        {border}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <span class="text-xs dark:text-white font-semibold">
                                        Tipo de Mapa
                                    </span>
                                    <div class="flex gap-2 flex-wrap overflow-auto">
                                        <div class="flex flex-col gap-1">
                                            <div class="grid grid-cols-3 gap-1">
                                                {Object.entries(typeMap).map(
                                                    ([key, val]) => (
                                                        <button
                                                            key={key}
                                                            class={`w-[120px] h-[120px]  justify-center items-center rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                                type_map === key
                                                                    ? "bg-paper-light dark:bg-admin-terciary"
                                                                    : ""
                                                            } font-semibold text-xs dark:text-white relative  p-2`}
                                                            type="button"
                                                            onClick={() => {
                                                                settingsUpdateform.setValue(
                                                                    "type_map",
                                                                    key as typeof type_map
                                                                );
                                                            }}
                                                        >
                                                            <MapValue
                                                                url={val.url}
                                                                attribution={
                                                                    val.attribution
                                                                }
                                                                value={
                                                                    storageEmpresa!
                                                                        .map_marker
                                                                }
                                                                zoomControl={
                                                                    false
                                                                }
                                                                height="100%"
                                                            />

                                                            <span class="absolute top-[40%] px-2 py-1 rounded-md right-[25%] bg-black bg-opacity-60 text-white">
                                                                {key}
                                                            </span>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <span class="text-xs dark:text-white font-semibold">
                                    Iconos
                                </span>
                                <div class="flex gap-2 flex-wrap overflow-auto">
                                    <div class="flex flex-col gap-1">
                                        <div class="grid grid-cols-3 gap-1">
                                            {Object.entries(
                                                icons() as Record<
                                                    typeof type_icons,
                                                    string[]
                                                >
                                            ).map(([key, val]) => (
                                                <button
                                                    key={key}
                                                    class={`min-w-[120px] h-[120px] grid grid-cols-2 justify-center items-center rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        type_icons === key
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white relative  p-2`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "type_icons",
                                                            key as typeof type_icons
                                                        );
                                                    }}
                                                >
                                                    {val.map((ic) => (
                                                        <div
                                                            key={ic}
                                                            dangerouslySetInnerHTML={{
                                                                __html: ic,
                                                            }}
                                                            class=" flex justify-center items-center"
                                                        />
                                                    ))}

                                                    <span class="absolute top-[40%] px-2 py-1 rounded-md right-[25%] bg-black bg-opacity-60 text-white">
                                                        {key}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span class="text-xs dark:text-white font-semibold">
                                    Loading
                                </span>
                                <div class="flex gap-2 flex-wrap">
                                    <div class="flex flex-col gap-1">
                                        <div class="grid grid-cols-3 gap-1">
                                            {(
                                                [
                                                    "one",
                                                    "two",
                                                    "three",
                                                    "four",
                                                    "null",
                                                ] as SettingsSchema["type_loader"][]
                                            ).map((val) => (
                                                <button
                                                    key={val}
                                                    class={`flex justify-center items-center min-w-[70px] h-[70px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                        type_loader === val
                                                            ? "bg-paper-light dark:bg-admin-terciary"
                                                            : ""
                                                    } font-semibold text-xs dark:text-white`}
                                                    type="button"
                                                    onClick={() => {
                                                        settingsUpdateform.setValue(
                                                            "type_loader",
                                                            val
                                                        );
                                                    }}
                                                >
                                                    {val === "one" ? (
                                                        <LoaderOne />
                                                    ) : val === "two" ? (
                                                        <LoaderTwo />
                                                    ) : val === "three" ? (
                                                        <LoaderThree />
                                                    ) : val === "four" ? (
                                                        <LoaderFour />
                                                    ) : (
                                                        "null"
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <span class="dark:text-white text-xs font-semibold">
                                Header
                            </span>
                            <div class="grid grid-cols-3 md:grid-cols-3">
                                <Form.control.toggle
                                    name={
                                        "header.home" as keyof SettingsUpdateDto
                                    }
                                    title="Mostrar Home"
                                />
                                <Form.control.toggle
                                    name={
                                        "header.shop" as keyof SettingsUpdateDto
                                    }
                                    title="Mostrar Shop"
                                />
                                <Form.control.toggle
                                    name={
                                        "header.about" as keyof SettingsUpdateDto
                                    }
                                    title="Mostrar Nosotros"
                                />
                                <Form.control.toggle
                                    name={
                                        "header.profile" as keyof SettingsUpdateDto
                                    }
                                    title="Mostrar Perfil"
                                />
                                <Form.control.toggle
                                    name={
                                        "header.pedidos" as keyof SettingsUpdateDto
                                    }
                                    title="Mostrar Pedidos"
                                />
                                <Form.control.toggle
                                    name={
                                        "header.condiciones" as keyof SettingsUpdateDto
                                    }
                                    title="Mostrar Condiciones"
                                />
                                <Form.control.toggle
                                    name={
                                        "header.categories" as keyof SettingsUpdateDto
                                    }
                                    title="Mostrar Categorias"
                                />
                                <Form.control.toggle
                                    name={
                                        "header.subcategories" as keyof SettingsUpdateDto
                                    }
                                    title="Mostrar Subcategorías"
                                />
                                <Form.control.toggle
                                    name={
                                        "header.services" as keyof SettingsUpdateDto
                                    }
                                    title="Mostrar Servicios"
                                />
                            </div>
                        </div>
                        <div>
                            <span class="dark:text-white text-xs font-semibold">
                                Mostrar
                            </span>
                            <div class="grid grid-cols-3 md:grid-cols-3">
                                <Form.control.toggle
                                    name={
                                        "shows.cards" as keyof SettingsUpdateDto
                                    }
                                    title="Sección Iconos"
                                />
                                <Form.control.toggle
                                    name={
                                        "shows.map" as keyof SettingsUpdateDto
                                    }
                                    title="Sección Mapa"
                                />
                                <Form.control.toggle
                                    name={
                                        "shows.brands" as keyof SettingsUpdateDto
                                    }
                                    title="Slider Marcas"
                                />
                                <Form.control.toggle
                                    name={
                                        "shows.categories_slider" as keyof SettingsUpdateDto
                                    }
                                    title="Categorias Slider"
                                />
                                <Form.control.toggle
                                    name={
                                        "shows.about" as keyof SettingsUpdateDto
                                    }
                                    title="Sección Nosotros"
                                />
                                <Form.control.toggle
                                    name={
                                        "shows.android" as keyof SettingsUpdateDto
                                    }
                                    title="Tarjeta Android"
                                />
                                <Form.control.toggle
                                    name={
                                        "shows.offers_section" as keyof SettingsUpdateDto
                                    }
                                    title="Seccion Ofertas"
                                />
                                <Form.control.toggle
                                    name={
                                        "shows.users" as keyof SettingsUpdateDto
                                    }
                                    title="Seccion Usuarios Cards"
                                />
                                <Form.control.toggle
                                    name={
                                        "shows.offers_user" as keyof SettingsUpdateDto
                                    }
                                    title="Seccion Ofertas Usuarios"
                                />
                            </div>
                        </div>
                        {!storageEmpresa?.isProduction ? (
                            <Form.control.editorJS
                                name={"web_script" as keyof SettingsUpdateDto}
                                title="Personalización html script "
                            />
                        ) : (
                            <></>
                        )}

                        <Form.button.submit
                            title="Actualizar"
                            className="self-start"
                            isLoading={empresaUpdateMutation.isLoading || false}
                            disabled={empresaUpdateMutation.isLoading || false}
                        />
                    </Form>
                ) : null}
                <Hr spacing={13} />
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
