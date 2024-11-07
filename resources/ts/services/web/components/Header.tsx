import useDropdown from "~/hooks/useDropdown";
import Aside from "./Aside";
import type { HeaderType } from "./WebLayout";
import HeaderMobile from "./HeaderMobile";
import { isActive } from "~/libs/helpers";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useThemeStore from "~/stores/theme.store";
import useAuthStore from "@/auth/stores/auth.store";
import { useSignal } from "@preact/signals";
import WebDropdown from "~/components/dropdown/WebDropdown";
import { printFileUser } from "@/users/libs/helpers";
import LogoImage from "~/components/LogoImage";
import useCartStore from "@/cart/stores/cart.store";
import { formatMoney } from "@/cart/libs/helpers";
import CartAside from "@/cart/views/CartAside";
import SearchProducts from "@/products/views/ProductsSearch";
import { printFileWithDimension } from "~/libs/upload";
import enviroments from "~/config";

interface HeaderProps {
    header: HeaderType;
}
function Header({ header }: HeaderProps) {
    const empresaStore = useEmpresastore();
    const themeStore = useThemeStore();
    const isOpen = useSignal(false);
    const isOpenCondiciones = useSignal(false);
    const headerDropdown = useDropdown();
    const authStore = useAuthStore();
    const cartStore = useCartStore();

    return (
        <>
            <div class="    text-white text-sm px-2 bg-white dark:bg-background-dark hidden lg:block">
                <div class="max-w-6xl  mx-auto justify-between py-2 flex font-semibold">
                    <div class="flex gap-3 items-center font-semibold">
                        <span class="dark:text-white text-black">
                            Teléfono:{" "}
                            <span class="text-primary font-semibold">
                                (+{empresaStore.state!.dial_code}){" "}
                                {empresaStore.state!.telephoneFirst}
                            </span>
                        </span>
                        {empresaStore.state!.email ? (
                            <span class="dark:text-white text-black">
                                Correo Electrónico:
                                <span class="text-primary font-semibold ml-2">
                                    {empresaStore.state!.email}
                                </span>
                            </span>
                        ) : null}
                    </div>
                    <div class="flex items-center gap-2  dark:text-white text-black">
                        <div class="w-[1px] bg-gray-600 h-[50%] mx-2" />
                        {authStore.state ? (
                            <WebDropdown
                                className="-bottom-30 z-[100]"
                                triggerChildren={({ trigger }) => (
                                    <button
                                        class="flex gap-2 items-center"
                                        type="button"
                                        ref={trigger}
                                    >
                                        <img
                                            src={
                                                printFileUser(
                                                    authStore.state!.photo
                                                )[0]
                                            }
                                            width={30}
                                            height={30}
                                            class="rounded-full"
                                            alt={authStore.state!.username}
                                        />
                                        <span class="font-semibold dark:text-white">
                                            {authStore.state!.username}
                                        </span>
                                    </button>
                                )}
                            >
                                <div class="flex flex-col dark:bg-background-dark">
                                    <a
                                        href={"/admin"}
                                        class="dark:text-white text-black py-2 text-center font-semibold"
                                    >
                                        <i class="fas fa-tachometer-alt" /> Ir
                                        al administrador
                                    </a>
                                    <a
                                        class="bg-danger text-center font-semibold py-2 text-white"
                                        href={"/auth/logout"}
                                    >
                                        <i class="fas fa-sign-out-alt" /> Salir
                                    </a>
                                </div>
                            </WebDropdown>
                        ) : (
                            <a href="/auth/login">
                                <i class="far fa-user mr-2" />
                                <span>Iniciar sesión</span>
                            </a>
                        )}
                    </div>
                </div>
            </div>
            <header class=" shadow  hidden lg:block bg-background-light z-[99] dark:bg-background-dark sticky top-0 right-0 left-0">
                <div class="bg-gray-600 h-[1px] max-w-6xl mx-auto" />
                <div class="max-w-6xl   mx-auto flex gap-4 justify-between items-center px-2 py-4 ">
                    <LogoImage width="60" height="60" />
                    <nav class=" gap-6 items-center hidden lg:flex  relative">
                        <a
                            class={` font-bold tracking-widest dark:hover:text-primary text-sm uppercase ${
                                isActive("/", false)
                                    ? "text-primary"
                                    : "text-black dark:text-white hover:text-primary"
                            }  relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`}
                            href={"/"}
                        >
                            Inicio
                        </a>
                        <div class="relative">
                            <a
                                href="/shop"
                                type="button"
                                class={`font-bold tracking-widest text-sm uppercase hover:text-primary dark:hover:text-primary delay-custom-1 ${
                                    isActive("/shop")
                                        ? "text-primary"
                                        : "text-black dark:text-white "
                                } relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`}
                                onBlur={() => {}}
                                onFocus={() => {}}
                                onMouseOver={() => {
                                    isOpen.value = !isOpen.value;
                                }}
                                onMouseOut={() => {
                                    isOpen.value = false;
                                }}
                            >
                                Shop
                            </a>
                            <div
                                onFocus={() => {}}
                                onBlur={() => {}}
                                onMouseOver={() => {
                                    isOpen.value = true;
                                }}
                                onMouseOut={() => {
                                    isOpen.value = false;
                                }}
                                class={`flex p-2 min-w-[300px]  bg-background-light dark:bg-paper-dark rounded-b-md flex-col  z-[99] absolute delay-custom-1  right-0 left-0 shadow-lg ${
                                    isOpen.value
                                        ? "max-h-[800px]  opacity-100"
                                        : "max-h-0 overflow-hidden opacity-0"
                                } `}
                            >
                                <div class="">
                                    {header.categories.map((category) => {
                                        const dropdown = useDropdown();
                                        return (
                                            <a
                                                href={`/shop/${category.slug}`}
                                                class="flex gap-2 items-center justify-between p-2 hover:bg-primary hover:text-white group w-full rounded-md"
                                                ref={dropdown.dropdown}
                                                key={category.id}
                                                aria-label="sho category"
                                            >
                                                <div class="flex gap-3 items-center dark:text-white">
                                                    {category.icon ? (
                                                        <div
                                                            dangerouslySetInnerHTML={{
                                                                __html: category.icon,
                                                            }}
                                                        />
                                                    ) : null}
                                                    <span class="font-semibold">
                                                        {category.name}
                                                    </span>
                                                </div>
                                            </a>
                                        );
                                    })}
                                </div>
                                {header.categoriesServices.length ? (
                                    <>
                                        {header.categoriesServices.map(
                                            (category) => (
                                                <>
                                                    <button
                                                        key={category.id}
                                                        type="button"
                                                        aria-label="marcas"
                                                        class="flex gap-2 items-center justify-between p-2 hover:bg-primary hover:text-white group w-full rounded-md  relative group "
                                                    >
                                                        <div class="flex gap-3 items-center dark:text-white">
                                                            {category.icon ? (
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: category.icon,
                                                                    }}
                                                                />
                                                            ) : null}
                                                            <span class="font-semibold">
                                                                {category.name}
                                                            </span>
                                                        </div>
                                                        <div class="absolute rounded-md right-[-312px] min-w-[300px]  p-2 bg-background-light dark:bg-paper-dark rounded-b-md flex-col hidden group-hover:flex">
                                                            {category.products.map(
                                                                (service) => (
                                                                    <a
                                                                        href={`/servicio/${service.slug}`}
                                                                        class="flex gap-2 items-center justify-between p-2   w-full rounded-md hover:text-white hover:bg-primary dark:text-white text-black"
                                                                        key={
                                                                            service.id
                                                                        }
                                                                        aria-label="show category"
                                                                    >
                                                                        <div class="flex gap-2 items-center ">
                                                                            <span class="font-semibold">
                                                                                {
                                                                                    service.name
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    </a>
                                                                )
                                                            )}
                                                        </div>
                                                    </button>
                                                </>
                                            )
                                        )}
                                    </>
                                ) : null}
                                {header.brands.length ? (
                                    <button
                                        type="button"
                                        aria-label="marcas"
                                        class="flex gap-2 items-center justify-between p-2 hover:bg-primary hover:text-white group w-full rounded-md  relative group "
                                    >
                                        <div class="flex gap-3 items-center dark:text-white">
                                            <i class="fas fa-tag" />
                                            <span class="font-semibold">
                                                Marcas
                                            </span>
                                        </div>
                                        <div class="absolute rounded-md right-[-312px] min-w-[300px]  p-2 bg-background-light dark:bg-paper-dark rounded-b-md flex-col hidden group-hover:flex">
                                            {header.brands.map((brand) => (
                                                <a
                                                    href={`/marcas/${brand.slug}`}
                                                    class="flex gap-2 items-center justify-between p-2   w-full rounded-md hover:text-white hover:bg-primary dark:text-white text-black"
                                                    key={brand.id}
                                                    aria-label="sho category"
                                                >
                                                    <div class="flex gap-2 items-center ">
                                                        {brand.image ? (
                                                            <img
                                                                class="object-contain w-[30px] h-[30px]"
                                                                width={100}
                                                                height={100}
                                                                alt={brand.name}
                                                                src={
                                                                    printFileWithDimension(
                                                                        brand.image,
                                                                        100
                                                                    )[0]
                                                                }
                                                            />
                                                        ) : null}
                                                        <span class="font-semibold">
                                                            {brand.name}
                                                        </span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </button>
                                ) : null}
                            </div>
                        </div>
                        {storageEmpresa?.setting.shows.about ? (
                            <a
                                class={` font-bold tracking-widest text-sm uppercase dark:hover:text-primary delay-custom-1 ${
                                    isActive("/nosotros")
                                        ? "text-primary"
                                        : "text-black dark:text-white hover:text-primary"
                                }  relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`}
                                href={"/nosotros"}
                            >
                                Nosotros
                            </a>
                        ) : null}

                        <a
                            class={` font-bold tracking-widest text-sm uppercase dark:hover:text-primary delay-custom-1 ${
                                isActive("/pedidos")
                                    ? "text-primary"
                                    : "text-black dark:text-white hover:text-primary"
                            }  relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`}
                            href={"/pedidos"}
                        >
                            Pedidos
                        </a>
                        {/*  */}
                        <div class="relative">
                            <button
                                type="button"
                                class={` font-bold tracking-widest text-sm uppercase dark:hover:text-primary delay-custom-1  hover:text-primary  delay-custom-1 ${
                                    isActive("/terminos-y-condiciones") ||
                                    isActive("/politica-de-privacidad") ||
                                    isActive("/libro-de-reclamaciones")
                                        ? "text-primary"
                                        : "text-black dark:text-white "
                                }  relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`}
                                onBlur={() => {}}
                                onFocus={() => {}}
                                onMouseOver={() => {
                                    isOpenCondiciones.value =
                                        !isOpenCondiciones.value;
                                }}
                                onMouseOut={() => {
                                    isOpenCondiciones.value = false;
                                }}
                            >
                                Condiciones de Uso
                            </button>
                            <div
                                onFocus={() => {}}
                                onBlur={() => {}}
                                onMouseOver={() => {
                                    isOpenCondiciones.value = true;
                                }}
                                onMouseOut={() => {
                                    isOpenCondiciones.value = false;
                                }}
                                class={`flex p-2 min-w-[240px] bg-background-light dark:bg-paper-dark rounded-b-md flex-col  z-[99] absolute delay-custom-1  right-0 left-0 shadow-lg ${
                                    isOpenCondiciones.value
                                        ? "max-h-[800px]  opacity-100"
                                        : "max-h-0 overflow-hidden opacity-0"
                                } `}
                            >
                                <div class="">
                                    <a
                                        href="/terminos-y-condiciones"
                                        class="flex gap-2 items-center justify-between p-2 hover:bg-primary hover:text-white group w-full rounded-md"
                                    >
                                        <div class="flex gap-3 items-center dark:text-white">
                                            <span class="font-semibold">
                                                Términos y Condiciones
                                            </span>
                                        </div>
                                    </a>
                                    <a
                                        href="/politica-de-privacidad"
                                        class="flex gap-2 items-center justify-between p-2 hover:bg-primary hover:text-white group w-full rounded-md"
                                    >
                                        <div class="flex gap-3 items-center dark:text-white">
                                            <span class="font-semibold">
                                                Política y Privacidad
                                            </span>
                                        </div>
                                    </a>
                                    <a
                                        href="/libro-de-reclamaciones"
                                        class="flex gap-2 items-center justify-between p-2 hover:bg-primary hover:text-white group w-full rounded-md"
                                    >
                                        <div class="flex gap-3 items-center dark:text-white">
                                            <span class="font-semibold">
                                                Libro de Reclamaciones
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div class="flex items-center gap-3">
                        {header.totalProducts > 0 ? <SearchProducts /> : null}

                        <div class="flex gap-3 items-center">
                            {storageEmpresa?.setting.isDark ? (
                                <button
                                    type="button"
                                    aria-label="change theme"
                                    class="flex gap-2 items-center justify-center text-md dark:text-white"
                                    onClick={() =>
                                        themeStore.methods.changeThemeMode(
                                            themeStore.state === "dark"
                                                ? "light"
                                                : "dark"
                                        )
                                    }
                                >
                                    {themeStore.state === "dark" ? (
                                        <>
                                            <i class="fa-solid fa-moon " />{" "}
                                        </>
                                    ) : (
                                        <>
                                            <i class="fa-solid fa-sun " />{" "}
                                        </>
                                    )}
                                </button>
                            ) : null}
                            {header.totalProducts > 0 ? (
                                <>
                                    <button
                                        type="button"
                                        class="bg-primary w-[30px] h-[30px] rounded-full text-white text-sm flex justify-center items-center relative"
                                        onClick={cartStore.dropdown.onOpen}
                                    >
                                        <i
                                            class={
                                                empresaStore.state!.setting
                                                    .type_cart
                                            }
                                        />
                                        <span class="border-2 absolute border-white rounded-full w-[20px] h-[20px] text-xs bg-red-500 -right-2 -top-2">
                                            {cartStore.computed.showCartLength}
                                        </span>
                                    </button>
                                    <div class="flex flex-col gap-1 ">
                                        <span class="font-bold tracking-wide text-xs   dark:text-white">
                                            TOTAL
                                        </span>
                                        <span class="font-semibold text-xs dark:text-white">
                                            {formatMoney(
                                                cartStore.methods.getTotal()
                                            )}
                                        </span>
                                    </div>
                                </>
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
                    {/* cart */}
                    {header.totalProducts > 0 ? (
                        <div
                            class={`fixed inset-0 bg-opacity-70 bg-black z-[999] hidden lg:flex  justify-end h-full ${
                                cartStore.dropdown.value
                                    ? "visible"
                                    : "invisible"
                            } delay-custom-1`}
                            onClick={cartStore.dropdown.onClose}
                        >
                            <div
                                class={`w-full delay-custom-1 md:w-[350px] bg-white dark:bg-paper-dark relative p-2 ${
                                    cartStore.dropdown.value
                                        ? "translate-x-0"
                                        : "translate-x-full"
                                }`}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <button
                                    class="text-end block dark:text-white text-primary absolute top-0 right-0 m-2"
                                    type="button"
                                    aria-label="close cart"
                                    onClick={cartStore.dropdown.onClose}
                                >
                                    <i class="fa-solid fa-x" />
                                </button>
                                <CartAside />
                            </div>
                        </div>
                    ) : null}
                </div>
            </header>
            {/* acá ira el header personalizado */}
            <HeaderMobile
                totalProducts={header.totalProducts}
                headerDropdown={headerDropdown}
            />
            <Aside
                brands={header.brands}
                headerDropdown={headerDropdown}
                categories={header.categories}
                categoriesServices={header.categoriesServices}
            />
        </>
    );
}

export default Header;
