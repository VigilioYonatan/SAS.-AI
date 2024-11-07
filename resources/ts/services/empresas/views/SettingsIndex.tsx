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
    settingsIconUpdateDto,
    SettingsIconUpdateDto,
    SettingsPhotoUpdateDto,
    SettingsUpdateDto,
    settingsUpdateDto,
    settingsPhotoUpdateDto,
} from "../dtos/settings.update.dto";
import { valibotVigilio } from "~/libs/valibot";
import { getFilesEdit, printFileWithDimension } from "~/libs/upload";
import {
    settingsUpdateApi,
    settingsUpdateIconApi,
    settingsUpdatePhotoApi,
} from "../apis/settings/settings.update.api";
import Hr from "@/web/components/Hr";
import {
    settingsDominioDeleteServerUpdateApi,
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
import Hamburguer from "@/web/components/Hamburguer";
import useCartStore from "@/cart/stores/cart.store";
import useDropdown from "~/hooks/useDropdown";
import useThemeStore from "~/stores/theme.store";
import CartAside from "@/cart/views/CartAside";
import SearchProducts from "@/products/views/ProductsSearch";
import TitleSection from "@/web/components/TitleSection";
import { icons } from "@/web/views/home/components/BackgroundSection";
import NavTabs from "@/web/components/NavTabs";

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
        const settingsDominioDeleteServerUpdateMutation =
            settingsDominioDeleteServerUpdateApi();
        const { state, methods } = useEmpresastore();
        const settingsUpdateform = useForm<SettingsUpdateDto>({
            resolver: valibotVigilio(settingsUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                const { photo, icon, ...rest } = setting;
                return rest;
            }, []),
        });
        const position_header = settingsUpdateform.watch("position_header");
        const isDark = settingsUpdateform.watch("isDark");
        const isCoverImage = settingsUpdateform.watch("isCoverImage");
        const type_border = settingsUpdateform.watch("type_border");
        const type_cart = settingsUpdateform.watch("type_cart");
        const hamburger = settingsUpdateform.watch("hamburger");
        const isLogoImage = settingsUpdateform.watch("isLogoImage");
        const bg_color = settingsUpdateform.watch("bg_color");
        const bg_color_background = settingsUpdateform.watch(
            "bg_color_background"
        );
        const bg_color_footer = settingsUpdateform.watch("bg_color_footer");
        const bg_color_paper = settingsUpdateform.watch("bg_color_paper");
        const bg_color_responsive = settingsUpdateform.watch(
            "bg_color_responsive"
        );
        const border_title_type = settingsUpdateform.watch("border_title_type");
        const type_icons = settingsUpdateform.watch("type_icons");
        const themeStore = useThemeStore();
        const cartStore = useCartStore();
        const headerDropdown = useDropdown();
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
            defaultValues: { host: setting.host.host },
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
                            sweetAlert({
                                icon: "danger",
                                title: `Error ${data.message}`,
                            });
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
                        </div>
                        <div class="flex gap-2 items-center w-full">
                            <div class="w-full">
                                <Form.control.toggle
                                    name="position_header"
                                    title="Header Mobile"
                                />
                                {/* bg_color_background
bg_color_footer
bg_color_paper */}
                                <div
                                    style={{
                                        backgroundColor: bg_color_background,
                                    }}
                                >
                                    <div class="flex gap-2 flex-wrap w-full">
                                        <header
                                            class={
                                                " w-full px-4    py-4 shadow    delay-custom-1 "
                                            }
                                            style={{
                                                background: bg_color_responsive,
                                                color: isColorLight(
                                                    bg_color_responsive
                                                )
                                                    ? "#000000"
                                                    : "#FFFFFF",
                                            }}
                                        >
                                            <div class=" max-w-6xl mx-auto">
                                                <div class="flex justify-between gap-2 items-center">
                                                    {!position_header ? (
                                                        <div class="flex items-center gap-2">
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
                                                            >
                                                                <div
                                                                    class={
                                                                        "hamburger hamburger--collapse"
                                                                    }
                                                                    type="button"
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
                                                    <div class="flex gap-3 items-center   text-xl  ">
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
                                            color: isColorLight(bg_color_paper)
                                                ? "#000000 !important"
                                                : "#FFFFFF !important",
                                            backgroundColor: bg_color_paper,
                                        }}
                                    >
                                        <span class="text-xs font-semibold ">
                                            Producto
                                        </span>
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
                                                    isColorLight(bg_color_paper)
                                                        ? "parent_form"
                                                        : ""
                                                }`}
                                            >
                                                <style jsx>{`
                                                    .parent_form label {
                                                        ${isColorLight(
                                                            bg_color_paper
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
                                                                        No
                                                                        ingresaste
                                                                        logo a
                                                                        tu
                                                                        empresa
                                                                    </Link>
                                                                    <br />
                                                                </>
                                                            ) : null}
                                                            Cuando subes las
                                                            imagenes a tus
                                                            productos se
                                                            agregará tu logo.
                                                        </div>
                                                    }
                                                />
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
                        <div class="grid grid-cols-1 md:grid-cols-2 md:gap-2 items-center">
                            <div>
                                <span class="text-xs dark:text-white font-semibold">
                                    Border de los titulos
                                </span>
                                <div class="flex gap-2 flex-wrap">
                                    <div class="flex flex-col gap-1">
                                        <div class="flex gap-1">
                                            <button
                                                class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                    border_title_type ===
                                                    "normal"
                                                        ? "bg-paper-light dark:bg-admin-terciary"
                                                        : ""
                                                } font-semibold text-xs dark:text-white`}
                                                type="button"
                                                onClick={() => {
                                                    settingsUpdateform.setValue(
                                                        "border_title_type",
                                                        "normal"
                                                    );
                                                }}
                                            >
                                                Normal
                                            </button>
                                            <button
                                                class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                    border_title_type ===
                                                    "circle"
                                                        ? "bg-paper-light dark:bg-admin-terciary"
                                                        : ""
                                                } font-semibold text-xs dark:text-white`}
                                                type="button"
                                                onClick={() => {
                                                    settingsUpdateform.setValue(
                                                        "border_title_type",
                                                        "circle"
                                                    );
                                                }}
                                            >
                                                Circulares
                                            </button>
                                            <button
                                                class={`min-w-[60px] h-[60px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                    border_title_type ===
                                                    "ninguno"
                                                        ? "bg-paper-light dark:bg-admin-terciary"
                                                        : ""
                                                } font-semibold text-xs dark:text-white`}
                                                type="button"
                                                onClick={() => {
                                                    settingsUpdateform.setValue(
                                                        "border_title_type",
                                                        "ninguno"
                                                    );
                                                }}
                                            >
                                                Ninguno
                                            </button>
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
                                        <div class="flex gap-1">
                                            <button
                                                class={`min-w-[120px] h-[120px] grid grid-cols-2 justify-center items-center rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary border border-gray-300 ${
                                                    type_icons === "normal"
                                                        ? "bg-paper-light dark:bg-admin-terciary"
                                                        : ""
                                                } font-semibold text-xs dark:text-white relative  p-2`}
                                                type="button"
                                                onClick={() => {
                                                    settingsUpdateform.setValue(
                                                        "type_icons",
                                                        "normal"
                                                    );
                                                }}
                                            >
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons.normal[0],
                                                    }}
                                                    class=" flex justify-center items-center"
                                                />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons.normal[1],
                                                    }}
                                                    class=" flex justify-center items-center"
                                                />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons.normal[2],
                                                    }}
                                                    class=" flex justify-center items-center"
                                                />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons.normal[3],
                                                    }}
                                                    class=" flex justify-center items-center"
                                                />
                                                <span class="absolute top-[40%] px-2 py-1 rounded-md right-[25%] bg-black bg-opacity-60 text-white">
                                                    Pack 1
                                                </span>
                                            </button>
                                            <button
                                                class={`min-w-[120px] h-[120px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary  grid grid-cols-2  border border-gray-300 ${
                                                    type_icons === "circle"
                                                        ? "bg-paper-light dark:bg-admin-terciary"
                                                        : ""
                                                } font-semibold text-xs dark:text-white relative p-2`}
                                                type="button"
                                                onClick={() => {
                                                    settingsUpdateform.setValue(
                                                        "type_icons",
                                                        "icons"
                                                    );
                                                }}
                                            >
                                                {" "}
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons.icons[0],
                                                    }}
                                                />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons.icons[1],
                                                    }}
                                                />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons.icons[2],
                                                    }}
                                                />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons.icons[3],
                                                    }}
                                                />
                                                <span class="absolute top-[40%] right-[25%] px-2 py-1 rounded-md  bg-black bg-opacity-60  text-white">
                                                    Pack 2
                                                </span>
                                            </button>
                                            <button
                                                class={`min-w-[120px] h-[120px] rounded-md hover:bg-paper-light hover:dark:bg-admin-terciary  grid grid-cols-2  border border-gray-300 ${
                                                    type_icons === "premium"
                                                        ? "bg-paper-light dark:bg-admin-terciary"
                                                        : ""
                                                } font-semibold text-xs dark:text-white relative p-2`}
                                                type="button"
                                                onClick={() => {
                                                    settingsUpdateform.setValue(
                                                        "type_icons",
                                                        "premium"
                                                    );
                                                }}
                                            >
                                                {" "}
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons
                                                            .premium[0],
                                                    }}
                                                />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons
                                                            .premium[1],
                                                    }}
                                                />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons
                                                            .premium[2],
                                                    }}
                                                />
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: icons
                                                            .premium[3],
                                                    }}
                                                />
                                                <span class="absolute top-[40%] right-[25%] px-2 py-1 rounded-md  bg-black bg-opacity-60  text-white">
                                                    Pack 3
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
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
                                    {storageEmpresa?.setting.host.enabled ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                sweetModal({
                                                    icon: "info",
                                                    title: "¿Estas seguro eliminar tu dominio?",
                                                    text: "",
                                                    showCloseButton: true,
                                                    showCancelButton: true,
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
                    <br id="#foto_empresa" />
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
                </div>{" "}
                <AlertInfo>
                    <span class="font-semibold">
                        <b class="font-bold">¿Sabias que?</b> El 90% de los
                        usuarios, usan un dispositivo móvil para realizar
                        compras por internet.
                    </span>
                </AlertInfo>
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
