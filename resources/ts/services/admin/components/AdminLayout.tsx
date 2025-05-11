import WebHookMessage from "@/empresas/components/WebHookMessage";
import Time from "./Time";
import Settings from "./Settings";
import NavLink, { type NavLinkChildProps } from "./NavLink";
import useAuthstore from "@/auth/stores/auth.store";
import AdminDropdown from "@/admin/components/AdminDropdown";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useThemeStore from "~/stores/theme.store";
import useCartStore from "@/cart/stores/cart.store";
import AdminCart from "@/cart/components/AdminCart";
import useNotifications from "@/notifications/hooks/useNotifications";
import UsersCount from "./UsersCount";
import AdminHr from "~/components/AdminHr";
import TimeSchedule from "./TimeSchedule";
import { useSignal } from "@preact/signals";
import { logoutUrl } from "@/auth/libs";
import { linkVigilio } from "~/config/settings";
import { printFileUser } from "@/users/libs/helpers";
import { printLogoempresa } from "@/empresas/libs/helpers";
import { Link, useRoute } from "wouter-preact";
import { sweetAlert } from "@vigilio/sweet";
import { mensual, subFacturacion } from "~/config/guards";
import { useEffect } from "preact/hooks";
import { driverInitial } from "../libs";
import { BASE_URL, fechasVencidas } from "~/config";
import { isColorLight, NOW } from "~/libs/helpers";
import useMoneyStore from "~/stores/money.store";

function initalState() {
    return localStorage.getItem(`${storageEmpresa!.slug}/tutorial`);
}

interface AdminLayoutProps {
    children: JSX.Element | JSX.Element[];
}
function AdminLayout({ children }: AdminLayoutProps) {
    const isOpen = useSignal(!!initalState());
    const themeState = useThemeStore();
    const authStore = useAuthstore();
    const empresaStore = useEmpresastore();
    const moneyStore = useMoneyStore();
    const cartStore = useCartStore();

    const { methods } = useNotifications();

    const startTour = () => {
        if (initalState() === "read") return;
        driverInitial();
        isOpen.value = true;
        localStorage.setItem(`${storageEmpresa!.slug}/tutorial`, "read");
    };

    useEffect(() => {
        startTour();
    }, []);
    function pathsSettings(): NavLinkChildProps["link"][] {
        const paths = [
            {
                title: (
                    <span>
                        <i class="far fa-building mr-1" /> Empresa
                    </span>
                ),
                to: "/empresa",
            },

            {
                title: (
                    <span>
                        <i class="fas fa-map-marker-alt mr-1" />
                        Dirección
                    </span>
                ),
                to: "/direccion",
            },
            {
                title: (
                    <span>
                        <i class="fas fa-calendar-alt mr-1" />
                        Horario de Atención
                    </span>
                ),
                to: "/horario",
            },
        ];
        if (empresaStore.state!.enable_sell_country) {
            paths.push({
                title: (
                    <span>
                        <i class="fas fa-shipping-fast" /> Precio de envio
                    </span>
                ),
                to: "/pricing-shipping",
            });
        }
        return paths;
    }
    function pathProducts() {
        return [
            {
                title: (
                    <span>
                        {[1, 3].includes(
                            empresaStore.state!.tipo_empresa.tipo_servicio_id
                        ) ? (
                            <i class="fas fa-phone-laptop" />
                        ) : (
                            <i class="fas fa-utensils" />
                        )}{" "}
                        Productos
                    </span>
                ),
                to: "/productos",
            },
            {
                title: (
                    <span>
                        <i class="far fa-boxes" /> Categorías
                    </span>
                ),
                to: "/categorias",
            },
            storageEmpresa?.setting.is_subcategory
                ? {
                      title: (
                          <span>
                              <i class="fa-solid fa-table-cells-large" />{" "}
                              Subcategorías
                          </span>
                      ),
                      to: "/subcategorias",
                  }
                : null,
            empresaStore.state?.tipo_empresa.tipo_servicio_id !== 2
                ? {
                      title: (
                          <span>
                              <i class="fa-solid fa-tag" /> Marcas
                          </span>
                      ),
                      to: "/marcas",
                  }
                : null,
            [1, 2].includes(empresaStore.state!.tipo_empresa.tipo_servicio_id)
                ? {
                      title: (
                          <span>
                              <i class="fas fa-ticket" /> Cupones
                          </span>
                      ),
                      to: "/cupones",
                  }
                : null,
        ].filter(Boolean);
    }

    function pathsWeb() {
        return [
            ...empresaStore.state!.cruds.map((crud) => ({
                title: (
                    <span class="flex gap-1 items-center">
                        <div dangerouslySetInnerHTML={{ __html: crud.icon }} />{" "}
                        {crud.name}
                    </span>
                ),
                to: `/crud/${crud.name}`,
            })),
            {
                title: (
                    <span>
                        <i class="fa-solid fa-tools" /> Configuración
                    </span>
                ),
                to: "/settings",
            },
            {
                title: (
                    <span>
                        <i class="fa-solid fa-image" /> Background
                    </span>
                ),
                to: "/background",
            },
            {
                title: (
                    <span>
                        <i class="fa-solid fa-files" /> Archivos
                    </span>
                ),
                to: "/files",
            },
            {
                title: (
                    <span>
                        <i class="fas fa-globe" /> Páginas
                    </span>
                ),
                to: "/banners",
            },

            {
                title: (
                    <span>
                        <i class="fas fa-newspaper" /> Posts
                    </span>
                ),
                to: "/posts",
            },
            {
                title: (
                    <span>
                        <i class="fas fa-link" /> ShortLinks
                    </span>
                ),
                to: "/short-links",
            },
            {
                title: (
                    <span>
                        <i class="fa-regular fa-users-rays" /> Reclamaciones
                    </span>
                ),
                to: "/reclamaciones",
            },
            {
                title: (
                    <span>
                        <i class="fas fa-rectangle-ad" /> Noticia
                    </span>
                ),
                to: "/noticia",
            },
        ].filter(Boolean);
    }
    function onCloseAside() {
        isOpen.value = false;
    }
    const [_, param] = useRoute("");
    return (
        <div
            class={
                // @ts-ignore
                ["", "roles", "facturacion", "finanzas"].includes(param["*"])
                    ? ""
                    : "bg-white dark:bg-admin-paper-dark"
            }
        >
            <style jsx>{`
                .bg-primary {
                    ${storageEmpresa!.setting.text_color !== "transparent"
                        ? `color: ${
                              storageEmpresa!.setting.text_color
                          } !important`
                        : isColorLight(storageEmpresa!.setting.bg_color)
                        ? "color: #000000 !important"
                        : "color: #FFFFFF !important"};
                }
            `}</style>
            <div class="flex relative   h-screen overflow-hidden">
                {!storageEmpresa!.payments.tienda.enabled &&
                storageEmpresa!.tipo_empresa.tipo_servicio_id !== 3 ? (
                    <a
                        href="/admin/plus"
                        class="fixed z-[99] top-36 right-0 bg-primary font-semibold text-white p-1 rounded-md m-2 text-xs w-[100px] text-center"
                    >
                        <i class="fa-sharp fa-solid fa-bag-shopping mr-2" />
                        Tienda Virtual con I.A Gratis
                    </a>
                ) : null}

                <div
                    class={`${
                        isOpen.value ? "block" : "hidden sm:block"
                    }  w-[60px] md:w-[320px] md:overflow-y-auto h-screen   relative dark:bg-admin-paper-dark bg-background-light shadow-sm  border border-gray-200 dark:border-gray-700`}
                >
                    <div class="p-2 flex justify-center items-center h-[70px] md:h-[100px]">
                        <a
                            href={"/"}
                            class="w-[80px] h-[80px] flex justify-center items-center"
                        >
                            {empresaStore.state?.logo ? (
                                <img
                                    class="w-full h-full object-contain  image-admin-logo "
                                    width={80}
                                    height={80}
                                    src={
                                        printLogoempresa(
                                            empresaStore.state.logo,
                                            100
                                        )[0]
                                    }
                                    alt="logo"
                                />
                            ) : (
                                <span class="dark:text-white text-4xl font-bold">
                                    {empresaStore.state?.name_empresa[0]}
                                </span>
                            )}{" "}
                            <style jsx>{`
                                .image-admin-logo {
                                    filter: drop-shadow(1px 1px black);
                                }
                            `}</style>
                        </a>
                        {/* logo */}
                    </div>
                    <div class="mt-3 px-2 flex flex-col gap-1 md:gap-2 ">
                        <NavLink
                            onClick={onCloseAside}
                            to="/"
                            title="Dashboard"
                            Icon={<i class="fas fa-tachometer-alt" />}
                        />
                        {empresaStore.state?.tipo_empresa.tipo_servicio_id ===
                        3 ? (
                            <NavLink
                                onClick={onCloseAside}
                                to="/servicios"
                                title="Servicios"
                                Icon={<i class="fa-regular fa-handshake" />}
                                uris={[
                                    {
                                        title: (
                                            <span>
                                                <i class="fa-regular fa-handshake" />{" "}
                                                Servicios
                                            </span>
                                        ),
                                        to: "/servicios",
                                    },
                                    {
                                        title: (
                                            <span>
                                                <i class="far fa-boxes" />{" "}
                                                Categorias
                                            </span>
                                        ),
                                        to: "/categorias_servicios",
                                    },
                                ]}
                            />
                        ) : null}
                        {storageEmpresa?.setting.isEccomerce ? (
                            <NavLink
                                onClick={onCloseAside}
                                to="/productos"
                                title="Productos"
                                Icon={
                                    [1, 3].includes(
                                        empresaStore.state!.tipo_empresa
                                            .tipo_servicio_id
                                    ) ? (
                                        <i class="fas fa-phone-laptop" />
                                    ) : (
                                        <i class="fas fa-utensils" />
                                    )
                                }
                                uris={pathProducts()}
                            />
                        ) : null}

                        {/* <NavLink
                            onClick={onCloseAside}
                            to="/reders"
                            title="Redes"
                            Icon={
                                <div class="grid grid-cols-2 gap-1">
                                    <i class="fa-brands fa-facebook-messenger" />
                                    <i class="fa-brands fa-whatsapp" />
                                    <i class="fa-brands fa-tiktok" />
                                    <i class="fa-brands fa-instagram" />
                                </div>
                            }
                            uris={[
                                {
                                    title: (
                                        <span class="relative block">
                                            <i class="fa-brands  fa-whatsapp" />{" "}
                                            Whatsapp
                                            <div
                                                class={`${
                                                    empresaStore.state
                                                        ?.enabledBot
                                                        ? "bg-success"
                                                        : "bg-danger"
                                                } w-[15px] h-[15px] rounded-full absolute right-0 top-1 `}
                                            />
                                        </span>
                                    ),
                                    to: "/whatsapp",
                                },
                                {
                                    title: (
                                        <span class="relative block">
                                            <i class="fa-brands fa-facebook-messenger" />{" "}
                                            messenger
                                            <div class=" absolute right-0 top-1  bg-orange-600 text-white text-[8px] rounded-md px-1">
                                                Muy Pronto
                                            </div>
                                        </span>
                                    ),
                                    to: "/messenger",
                                },
                                {
                                    title: (
                                        <span class="relative block">
                                            <i class="fa-brands fa-instagram" />{" "}
                                            Instagram
                                            <div class=" absolute right-0 top-1  bg-orange-600 text-white text-[8px] rounded-md px-1">
                                                Muy Pronto
                                            </div>
                                        </span>
                                    ),
                                    to: "/instagram",
                                },
                                {
                                    title: (
                                        <span class="relative block">
                                            <i class="fa-brands fa-tiktok" />{" "}
                                            Tik Tok
                                            <div class=" absolute right-0 top-1  bg-orange-600 text-white text-[8px] rounded-md px-1">
                                                Muy Pronto
                                            </div>
                                        </span>
                                    ),
                                    to: "/TikTok",
                                },
                            ]}
                        /> */}
                        {storageEmpresa?.tipo_empresa.tipo_servicio_id === 3 ? (
                            <NavLink
                                onClick={onCloseAside}
                                to="/cupones"
                                title="Cupones"
                                Icon={<i class="fas fa-ticket" />}
                            />
                        ) : null}

                        <NavLink
                            onClick={onCloseAside}
                            to="/local"
                            title="Local"
                            Icon={<i class="fas fa-store" />}
                        />
                        <NavLink
                            onClick={onCloseAside}
                            to="/delivery"
                            title="Delivery"
                            Icon={<i class="fas fa-motorcycle" />}
                        />
                        {authStore.guards.permissionAdminGuard() ? (
                            <div class="relative">
                                <NavLink
                                    onClick={onCloseAside}
                                    to="/web"
                                    title="Web"
                                    Icon={<i class="fa-solid fa-globe" />}
                                    uris={pathsWeb()}
                                />

                                {!empresaStore.state!.enabled_catalogo ? (
                                    <button
                                        class="absolute -top-3 right-0 bg-primary w-[30px] h-[30px] rounded-full flex justify-center items-center text-white"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            sweetAlert({
                                                icon: "danger",
                                                html: `<span class='p-2 text-sm dark:text-white'>Necesitas tener activar el catalago web <a href="/admin/empresa" class="text-primary hover:underline">Ir</a></span>`,
                                                showCloseButton: true,
                                            });
                                        }}
                                        type="button"
                                        aria-label="block"
                                    >
                                        <i class="fas fa-lock-alt" />
                                    </button>
                                ) : null}
                            </div>
                        ) : null}

                        {authStore.guards.permissionAdminGuard() ? (
                            <>
                                <NavLink
                                    onClick={onCloseAside}
                                    to="/payment"
                                    title="Metodos de  Pago"
                                    Icon={<i class="fab fa-cc-visa" />}
                                />
                                <div class="relative">
                                    <NavLink
                                        onClick={onCloseAside}
                                        to="/whatsapp"
                                        title="Whatsapp"
                                        Icon={<i class="fab fa-whatsapp" />}
                                    />
                                    <div
                                        class={`${
                                            empresaStore.state?.enabledBot
                                                ? "bg-success"
                                                : "bg-danger"
                                        } w-[15px] h-[15px] rounded-full absolute right-2 md:right-[30%] top-1 md:top-3`}
                                    />
                                </div>
                                <div class="relative">
                                    <NavLink
                                        onClick={onCloseAside}
                                        to="/ai"
                                        title="Inteligencia Artificial"
                                        Icon={<i class="fas fa-user-robot" />}
                                    />
                                    {/* solo que aparesca  nuevo solo este año */}{" "}
                                    {storageEmpresa!.questionCount &&
                                    storageEmpresa!.questionCount > 0 ? (
                                        <div class="w-[20px] h-[20px] bg-danger rounded-full flex justify-center items-center absolute right-0 md:right-[10%] top-1 md:top-3 text-white font-bold text-xs">
                                            {storageEmpresa!.questionCount}
                                        </div>
                                    ) : (
                                        <span class="absolute font-semibold -right-2 text-[8px] md:-right-2  top-0 md:top-0 bg-orange-600 text-white px-1 py-1 rounded-md md:text-xs">
                                            Nuevo
                                        </span>
                                    )}
                                    {!mensual() ? (
                                        <button
                                            class="absolute -top-3 right-0 bg-primary w-[30px] h-[30px] rounded-full flex justify-center items-center text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                sweetAlert({
                                                    icon: "danger",
                                                    html: `<span class='p-2 text-sm dark:text-white'>Necesitas tener plan de inteligencia Artificial <a href='${BASE_URL}/admin/plus' class='text-blue-600'>Más información</a></span>`,
                                                    showCloseButton: true,
                                                });
                                            }}
                                            type="button"
                                            aria-label="block"
                                        >
                                            <i class="fas fa-lock-alt" />
                                        </button>
                                    ) : null}
                                </div>{" "}
                                <div class="relative">
                                    {" "}
                                    <NavLink
                                        onClick={onCloseAside}
                                        to="/meeting"
                                        title="Citas/Meetings A.I"
                                        Icon={
                                            <i class="fas fa-handshake-alt" />
                                        }
                                    />
                                    {storageEmpresa!.citas[NOW().get("date")] >
                                    0 ? (
                                        <div class="w-[20px] h-[20px] bg-danger rounded-full flex justify-center items-center absolute right-0 md:right-[10%] top-1 md:top-3 text-white font-bold text-xs">
                                            {
                                                storageEmpresa?.citas[
                                                    NOW().get("date")
                                                ]
                                            }
                                        </div>
                                    ) : null}
                                </div>
                            </>
                        ) : null}
                        {storageEmpresa?.payments.finanza.enabled &&
                        authStore.guards.permissionAdminGuard() ? (
                            <NavLink
                                onClick={onCloseAside}
                                to="/finanzas"
                                title="Finanzas"
                                Icon={
                                    <i class="fa-solid fa-face-tongue-money" />
                                }
                            />
                        ) : null}
                        {authStore.guards.permissionAdminGuard() ? (
                            <NavLink
                                onClick={onCloseAside}
                                to="/emails"
                                title="Imbox"
                                Icon={<i class="fas fa-envelope-open" />}
                            />
                        ) : null}

                        <NavLink
                            onClick={onCloseAside}
                            to="/usuarios"
                            title="Usuarios"
                            Icon={<i class="fas fa-users" />}
                        />

                        {authStore.guards.permissionAdminGuard() &&
                        storageEmpresa?.dial_code === "51" ? (
                            <>
                                <NavLink
                                    onClick={onCloseAside}
                                    to="/suppliers"
                                    title="Proveedores"
                                    Icon={<i class="far fa-person-dolly" />}
                                />
                                <div class="relative">
                                    <NavLink
                                        onClick={onCloseAside}
                                        to="/facturacion"
                                        title="Facturación"
                                        Icon={
                                            <i class="fa-sharp fa-solid fa-ballot-check" />
                                        }
                                    />
                                    {!subFacturacion() ? (
                                        <button
                                            class="absolute -top-3 right-0 bg-primary w-[30px] h-[30px] rounded-full flex justify-center items-center text-white"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                sweetAlert({
                                                    icon: "danger",
                                                    html: `<span class='p-2 text-sm dark:text-white'>Necesitas tener plan de facturación electronica <a href='${BASE_URL}/admin/plus' class='text-blue-600'>Más información</a></span>`,
                                                    showCloseButton: true,
                                                });
                                            }}
                                            type="button"
                                            aria-label="block"
                                        >
                                            <i class="fas fa-lock-alt" />
                                        </button>
                                    ) : null}
                                </div>
                            </>
                        ) : null}
                        <NavLink
                            onClick={onCloseAside}
                            to="/perfil"
                            title="Perfil"
                            Icon={<i class="fas fa-user" />}
                        />
                        {authStore.guards.permissionAdminGuard() ? (
                            <NavLink
                                onClick={onCloseAside}
                                to="/settings"
                                title="Configuracion"
                                Icon={<i class="fas fa-tools" />}
                                uris={[...pathsSettings()]}
                            />
                        ) : null}
                        <div
                            class={`relative ${
                                fechasVencidas() ? "[&>div]:!bg-danger " : ""
                            }`}
                        >
                            <NavLink
                                onClick={onCloseAside}
                                to="/plus"
                                title="Plus"
                                Icon={<i class="fa-solid fa-star" />}
                            />
                            {/* solo que aparesca  nuevo solo este año */}
                            {fechasVencidas() ? (
                                <button
                                    type="button"
                                    aria-label="se vence"
                                    class="absolute font-semibold -right-2 text-[8px] md:-right-2  top-0 md:top-0 bg-danger text-white px-1 py-1 rounded-md md:text-xs group  z-[99]"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <i class="fas fa-exclamation-circle" />
                                    <div class="dark:bg-admin-paper-dark p-2 w-[200px] dark:text-white  group-hover:block hidden absolute top-1 -right-36 md:right-0 z-[99] rounded-md text-xs bg-white text-black">
                                        <span>
                                            {fechasVencidas()} está apunto de
                                            vencer.
                                        </span>
                                    </div>
                                </button>
                            ) : null}
                        </div>
                        <div class="flex flex-col items-center gap-2   dark:bg-admin-paper-dark bg-white w-full py-2">
                            <UsersCount />
                            <a
                                href={logoutUrl()}
                                class="text-white font-bold bg-red-600 w-full py-3 rounded-md text-center flex items-center justify-center gap-2"
                            >
                                <i class="fas fa-sign-out-alt" />
                                <span class="hidden lg:block">Salir</span>
                            </a>
                            <a
                                href={linkVigilio()}
                                target="_blank"
                                rel="noreferrer"
                                class="text-[7px] mt-2 opacity-70 md:text-xs text-terciary text-center"
                            >
                                Powered by{" "}
                                <b class="text-primary dark:text-white">
                                    Vigilio Services
                                </b>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="w-full overflow-auto ">
                    <header class=" z-[999] flex w-full items-center justify-between py-4 shadow-sm  border-b border-gray-200 dark:border-gray-700 px-4 dark:bg-admin-paper-dark bg-background-light">
                        <button
                            type="button"
                            onClick={() => {
                                isOpen.value = !isOpen.value;
                            }}
                            class="bg-black bg-opacity-70 px-4 rounded-full w-[40px] h-[40px] justify-center items-center  sm:hidden flex"
                            aria-label="button to change aside"
                        >
                            {isOpen.value ? (
                                <i class="fas fa-times text-white text-xl" />
                            ) : (
                                <i class="fas fa-bars text-white text-xl" />
                            )}
                        </button>
                        <Link
                            href=""
                            class="text-xs hidden sm:block font-bold uppercase dark:text-white text-secondary-dark"
                        >
                            {empresaStore.state!.name_empresa}
                        </Link>
                        <div class="flex gap-3 sm:gap-4 items-center">
                            <TimeSchedule />
                            <Time />
                            <WebHookMessage />
                            {storageEmpresa?.setting.isEccomerce ? (
                                <button
                                    class="relative dark:text-secondary-light text-secondary-dark"
                                    type="button"
                                    aria-label="to add Cart"
                                    onClick={cartStore.dropdown.onOpen}
                                >
                                    <i
                                        class={
                                            storageEmpresa?.setting.type_cart
                                        }
                                    />
                                    {cartStore.computed.showCartLength > 0 ? (
                                        <span class="absolute left-[10px] top-[-5px] text-xs bg-danger px-[.3rem] font-bold rounded-full text-white">
                                            {cartStore.computed.showCartLength}
                                        </span>
                                    ) : null}
                                </button>
                            ) : null}

                            <AdminCart />
                            <button
                                type="button"
                                aria-label="change theme"
                                onClick={() => {
                                    themeState.state === "dark"
                                        ? themeState.methods.changeThemeMode(
                                              "light"
                                          )
                                        : themeState.methods.changeThemeMode(
                                              "dark"
                                          );
                                }}
                                class={"dark:text-white"}
                            >
                                {themeState.state === "dark" ? (
                                    <i class="fa-solid fa-moon" />
                                ) : (
                                    <i class="fa-solid fa-sun" />
                                )}
                            </button>

                            {empresaStore.state!.isDolar ? (
                                <a
                                    class="dark:text-white"
                                    href={`/change-money/${
                                        moneyStore.state.money === "DOLARES"
                                            ? "LOCAL"
                                            : "DOLARES"
                                    }`}
                                >
                                    {moneyStore.state.money === "DOLARES" ? (
                                        <div class="flex  items-center flex-col justify-center">
                                            <i class="fas fa-dollar-sign text-sm" />
                                            <span class="text-[0.6rem] text-center">
                                                {storageEmpresa!.money.simbolo}{" "}
                                                {moneyStore.state.moneyValue.DOLARES.toFixed(
                                                    3
                                                )}
                                            </span>
                                        </div>
                                    ) : (
                                        <span class="font-semibold text-xs">
                                            {storageEmpresa!.money.simbolo}
                                        </span>
                                    )}
                                </a>
                            ) : null}
                            <AdminDropdown
                                className="top-4 absolute rounded-md shadow-md bg-background-light dark:bg-admin-paper-dark right-0 z-[19]"
                                triggerChildren={({ trigger, onOpen }) => (
                                    <button
                                        ref={trigger}
                                        type="button"
                                        aria-label="button to open user dropdown"
                                        class="relative dark:text-secondary-light text-secondary-dark"
                                        onClick={onOpen}
                                    >
                                        <i class="fa-solid fa-bell" />
                                        <methods.NotificationCountComponent />
                                    </button>
                                )}
                            >
                                {({ onClose }) => (
                                    <methods.Notifications
                                        isWeb={false}
                                        onClose={onClose}
                                    />
                                )}
                            </AdminDropdown>
                            <AdminDropdown
                                className="top-8 absolute rounded-md shadow-md bg-background-light dark:bg-admin-paper-dark right-0 z-[19]"
                                minWidth={170}
                                triggerChildren={({ trigger, onOpen }) => (
                                    <button
                                        ref={trigger}
                                        type="button"
                                        aria-label="button to open user dropdown"
                                        class="flex gap-4  p-1 active:bg-primary overflow-hidden rounded-full"
                                        onClick={onOpen}
                                    >
                                        <img
                                            class="min-w-[35px] min-h-[35px] max-w-[35px] max-h-[35px] rounded-full object-cover"
                                            width={50}
                                            height={50}
                                            src={
                                                printFileUser(
                                                    authStore.state!.photo,
                                                    100
                                                )[0]
                                            }
                                            alt={authStore.state!.username}
                                        />
                                    </button>
                                )}
                            >
                                <div class="flex flex-col justify-center items-center p-2 ">
                                    <p class="text-sm dark:text-secondary-light text-secondary-dark">
                                        Hola{" "}
                                        <span class="font-bold">
                                            {authStore.state!.username}
                                        </span>
                                    </p>
                                    <span class="flex gap-2 items-center dark:text-white text-xs">
                                        {authStore.state?.role_id === 1
                                            ? "Admin"
                                            : "Trabajador"}
                                    </span>
                                    <AdminHr spacing={0} />
                                    {storageEmpresa?.setting.isEccomerce ? (
                                        <Link
                                            to="/productos"
                                            class="dark:text-white text-sm hover:bg-paper-light font-normal hover:text-black w-full text-center py-1 dark:hover:bg-admin-terciary"
                                        >
                                            Productos
                                        </Link>
                                    ) : null}

                                    <Link
                                        to="/perfil"
                                        class="dark:text-white text-sm hover:bg-paper-light font-normal hover:text-black w-full text-center py-1 dark:hover:bg-admin-terciary"
                                    >
                                        Mi perfil
                                    </Link>
                                    {authStore.guards.permissionAdminGuard() ? (
                                        <>
                                            <Link
                                                to="/whatsapp"
                                                class="dark:text-white text-sm hover:bg-paper-light font-normal hover:text-black w-full text-center py-1 dark:hover:bg-admin-terciary"
                                            >
                                                Whatsapp
                                            </Link>
                                            <Link
                                                to="/plus"
                                                class="dark:text-white text-sm hover:bg-paper-light font-normal hover:text-black w-full text-center py-1 dark:hover:bg-admin-terciary"
                                            >
                                                Plus
                                            </Link>
                                        </>
                                    ) : null}

                                    <a
                                        href={logoutUrl()}
                                        class="text-white font-bold bg-red-600 w-full rounded-md text-center flex items-center justify-center gap-2 py-2"
                                    >
                                        <i class="fas fa-sign-out-alt" />
                                        <span class="hidden lg:block">
                                            Salir
                                        </span>
                                    </a>
                                </div>
                            </AdminDropdown>
                        </div>
                    </header>
                    <div class="">{children}</div>
                </div>
            </div>
            <Settings />
        </div>
    );
}

export default AdminLayout;
