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

interface HeaderMobileProps {
    headerDropdown: UseDropdown;
    totalProducts: number;
}
function HeaderMobile({ headerDropdown, totalProducts }: HeaderMobileProps) {
    const empresaStore = useEmpresastore();
    const cartStore = useCartStore();
    const themeStore = useThemeStore();
    const favoriteStore = useFavoriteStore();
    return (
        <header
            class={
                " w-full px-4    py-4 shadow  fixed z-[999] top-0 right-0 left-0 lg:hidden  delay-custom-1 "
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
                                        width={100}
                                        height={100}
                                        src={
                                            printFileWithDimension(
                                                empresaStore.state!.logo!,
                                                100
                                            )[0]
                                        }
                                        class="w-[50px] h-[50px] object-contain"
                                        alt={empresaStore.state!.name_empresa}
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
                                        width={100}
                                        height={100}
                                        src={
                                            printFileWithDimension(
                                                empresaStore.state!.logo!,
                                                100
                                            )[0]
                                        }
                                        class="w-[60px] h-[60px] object-contain"
                                        alt={empresaStore.state!.name_empresa}
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
                    <div class="flex gap-3 items-center   text-xl  ">
                        {totalProducts > 0 ? <SearchProducts /> : null}

                        <a
                            href="/auth/profile?type=favorites"
                            class="flex gap-2 items-center justify-center text-md relative"
                        >
                            <i class="far fa-heart text-lg" />{" "}
                            {favoriteStore.state > 0 ? (
                                <span class="border-2 absolute border-white rounded-full w-[22px] h-[22px] text-xs bg-danger -right-3 -top-2 flex justify-center items-center  text-white">
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
                                    <i class="fas fa-moon" />
                                ) : (
                                    <i class="far fa-sun" />
                                )}
                            </button>
                        ) : null}
                        {totalProducts > 0 ? (
                            <button
                                type="button"
                                class=" text-xl   relative"
                                onClick={cartStore.dropdown.onOpen}
                            >
                                <i class={enviroments.TYPE_CART} />
                                <span class="absolute -top-1 -right-2 bg-primary text-xs font-bold flex justify-center items-center text-white w-[20px] h-[20px] rounded-full">
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
                                ) : (
                                    <a
                                        href="#servicios"
                                        class=" text-xl   relative"
                                    >
                                        <i class={enviroments.TYPE_CART} />
                                    </a>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default HeaderMobile;
