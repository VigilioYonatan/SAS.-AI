import enviroments from "~/config";
import Hamburguer from "./Hamburguer";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import { type UseDropdown } from "~/hooks/useDropdown";
import { printFileWithDimension } from "~/libs/upload";
import useCartStore from "@/cart/stores/cart.store";
import CartAside from "@/cart/views/CartAside";
import useThemeStore from "~/stores/theme.store";
import SearchProducts from "@/products/views/ProductsSearch";
import { isActive, isColorLight } from "~/libs/helpers";
import useFavoriteStore from "@/favorites/stores/favorites.store";
import WebNotificacion from "./WebNotificacion";
import useMediaQuery from "~/hooks/useMediaQuery";
import { iconCart, typeIcon1 } from "@/empresas/schemas/settings.schema";
import MoneyChange from "./MoneyChange";
import useAuthStore from "@/auth/stores/auth.store";

interface HeaderMobileProps {
    headerDropdown: UseDropdown;
    totalProducts: number;
}
function HeaderMobile({ headerDropdown, totalProducts }: HeaderMobileProps) {
    const empresaStore = useEmpresastore();
    const cartStore = useCartStore();
    const themeStore = useThemeStore();
    const favoriteStore = useFavoriteStore();
    const authStore = useAuthStore();
    return (
        <header
            class={
                "header-mobile w-full px-4    py-4 shadow  fixed z-[999] top-0 right-0 left-0 lg:hidden  delay-custom-1 "
            }
            style={{
                background: empresaStore.state!.setting.bg_color_responsive,
                color: isColorLight(
                    empresaStore.state!.setting.bg_color_responsive
                )
                    ? "#000000"
                    : "#FFFFFF",
            }}
        >
            <div class=" max-w-6xl mx-auto">
                <div class="flex justify-between gap-2 items-center">
                    {!storageEmpresa?.setting.position_header ? (
                        <div class="flex items-center gap-2">
                            <button
                                type="button"
                                aria-label="open aside"
                                onClick={headerDropdown.onOpen}
                            >
                                <Hamburguer
                                    isOpen={headerDropdown.dropdownOpen}
                                />
                            </button>
                            <a href={"/"} class="flex  items-center">
                                {empresaStore.state!.logo ? (
                                    <img
                                        width={300}
                                        height={300}
                                        src={
                                            printFileWithDimension(
                                                empresaStore.state!.logo!,
                                                300
                                            )[0]
                                        }
                                        class="w-[50px] h-[50px] object-contain"
                                        alt={empresaStore.state!.name_empresa}
                                        title={empresaStore.state!.name_empresa}
                                        loading="lazy"
                                    />
                                ) : (
                                    <h2 class="text-2xl font-bold  uppercase">
                                        {empresaStore.state!.name_empresa[0]}
                                    </h2>
                                )}
                            </a>
                        </div>
                    ) : (
                        <>
                            <button
                                type="button"
                                aria-label="open aside"
                                onClick={headerDropdown.onOpen}
                            >
                                <Hamburguer
                                    isOpen={headerDropdown.dropdownOpen}
                                />
                            </button>

                            <a href={"/"} class="flex  items-center  ml-12">
                                {empresaStore.state!.logo ? (
                                    <img
                                        width={
                                            empresaStore.state?.setting
                                                .logo_width
                                        }
                                        height={300}
                                        src={
                                            printFileWithDimension(
                                                empresaStore.state!.logo!,
                                                300
                                            )[0]
                                        }
                                        class=" object-contain"
                                        alt={empresaStore.state!.name_empresa}
                                        title={empresaStore.state!.name_empresa}
                                    />
                                ) : (
                                    <h2 class="text-2xl font-bold  uppercase">
                                        {empresaStore.state!.name_empresa[0]}
                                    </h2>
                                )}
                            </a>
                        </>
                    )}
                    {/* cartaside */}
                    <div
                        class={`fixed inset-0 bg-opacity-70 bg-black z-[999] flex justify-end h-full ${
                            cartStore.dropdown.value ? "visible" : "invisible"
                        } delay-custom-1`}
                        onClick={cartStore.dropdown.onClose}
                    >
                        <div
                            class={`w-full delay-custom-1 md:w-[350px] bg-background-light dark:bg-paper-dark relative p-2 ${
                                cartStore.dropdown.value
                                    ? "translate-x-0"
                                    : "translate-x-full"
                            }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                class="text-end block dark: text-primary absolute top-0 right-0 m-2"
                                type="button"
                                aria-label="close cart"
                                onClick={cartStore.dropdown.onClose}
                            >
                                <i class="fa-solid fa-x" />
                            </button>
                            <CartAside />
                        </div>
                    </div>
                    {/* endcartaside */}
                    <div class="flex gap-2 items-center   text-xl  ">
                        {totalProducts > 0 ? <SearchProducts /> : null}
                        <MoneyChange />
                        {useMediaQuery("(max-width:1025px)") &&
                        authStore.state ? (
                            <WebNotificacion />
                        ) : null}

                        <a
                            href="/auth/profile?type=favorites"
                            class="header-icon-favorites flex gap-2 items-center justify-center text-md relative"
                        >
                            <i class={`fa${typeIcon1} fa-heart text-lg`} />{" "}
                            {favoriteStore.state > 0 ? (
                                <span
                                    class="header-icon-favorites-span border-2 absolute border-white rounded-full w-[20px] h-[20px] font-semibold text-[0.7rem]   -right-3 -top-1 flex justify-center items-center   "
                                    style={{
                                        backgroundColor:
                                            empresaStore.state?.setting
                                                .bg_color_secondary,
                                        color: isColorLight(
                                            empresaStore.state!.setting
                                                .bg_color_secondary
                                        )
                                            ? "#000000"
                                            : "#ffffff",
                                    }}
                                >
                                    {favoriteStore.state}
                                </span>
                            ) : null}
                        </a>
                        {empresaStore.state?.setting.isDark ? (
                            <button
                                type="button"
                                aria-label="change theme"
                                onClick={() => {
                                    themeStore.methods.changeThemeMode(
                                        themeStore.state === "dark"
                                            ? "light"
                                            : "dark"
                                    );
                                }}
                            >
                                {themeStore.state! === "dark" ? (
                                    <i
                                        class={`fa${
                                            storageEmpresa?.setting
                                                .type_icons_bars === "normal"
                                                ? "s"
                                                : "r"
                                        } fa-moon`}
                                    />
                                ) : (
                                    <i
                                        class={`fa${
                                            storageEmpresa?.setting
                                                .type_icons_bars === "normal"
                                                ? "s"
                                                : "r"
                                        } fa-sun`}
                                    />
                                )}
                            </button>
                        ) : null}
                        {totalProducts > 0 &&
                        storageEmpresa?.setting.isEccomerce ? (
                            <button
                                type="button"
                                class=" text-xl   relative header-icon-cart"
                                onClick={cartStore.dropdown.onOpen}
                            >
                                <i class={iconCart} />
                                <span
                                    class="header-icon-cart-span absolute -top-1 -right-2  border-2 text-xs font-bold flex justify-center items-center  w-[20px] h-[20px] rounded-full"
                                    style={{
                                        backgroundColor:
                                            empresaStore.state?.setting
                                                .bg_color_secondary,
                                        color: isColorLight(
                                            empresaStore.state!.setting
                                                .bg_color_secondary
                                        )
                                            ? "#000000"
                                            : "#ffffff",
                                    }}
                                >
                                    {cartStore.computed.showCartLength}
                                </span>
                            </button>
                        ) : (
                            <>
                                {!isActive("/", false) ? (
                                    <button
                                        onClick={() => {
                                            window.location.href =
                                                "/#servicios";
                                        }}
                                        aria-label={"change servicios page"}
                                        type={"button"}
                                        class=" text-xl   relative"
                                    >
                                        <i class={enviroments.TYPE_CART} />
                                    </button>
                                ) : null}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default HeaderMobile;
