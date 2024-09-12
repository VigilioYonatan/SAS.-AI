import useDropdown from "~/hooks/useDropdown";
import Aside from "./Aside";
import type { HeaderType } from "./WebLayout";
import HeaderMobile from "./HeaderMobile";
import { isActive } from "~/libs/helpers";
import Hamburguer from "./Hamburguer";
import useEmpresastore from "@/empresas/stores/empresa.store";
import useThemeStore from "~/stores/theme.store";
import useAuthStore from "@/auth/stores/auth.store";
import { useSignal } from "@preact/signals";
import WebDropdown from "~/components/dropdown/WebDropdown";
import { printFileUser } from "@/users/libs/helpers";
import LogoImage from "~/components/LogoImage";
import useCartStore from "@/cart/stores/cart.store";
import { formatMoney } from "@/cart/libs/helpers";
import CartAside from "@/cart/views/CartAside";

interface HeaderProps {
    header: HeaderType;
}
function Header({ header }: HeaderProps) {
    const empresaStore = useEmpresastore();
    const themeStore = useThemeStore();
    const isOpen = useSignal(false);
    const headerDropdown = useDropdown();
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    return (
        <>
            <header class=" shadow  hidden lg:block bg-background-light dark:bg-background-dark">
                <div class="max-w-6xl py-2 mx-auto flex justify-between text-white text-sm px-2">
                    <div class="flex gap-3 items-center font-semibold">
                        <span class="dark:text-white text-black">
                            LLámanos:
                            <span class="text-primary font-semibold">
                                (+51) {empresaStore.state!.telephoneFirst}
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
                                className="-bottom-30 z-[99]"
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
                                        class="dark:text-white text-black py-2 text-center"
                                    >
                                        Ir al administrador
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
                <div class="bg-gray-600 h-[1px] max-w-6xl mx-auto" />
                <div class="max-w-6xl   mx-auto flex gap-4 justify-between items-center px-2 py-4 ">
                    <LogoImage />

                    <div class="bg-white max-w-[400px] w-full flex gap-2  p-1 h-[45px] rounded-3xl border-2 border-primary dark:bg-paper-dark">
                        <input
                            type="text"
                            class="w-full outline-none font-semibold text-sm bg-transparent  pl-2"
                            placeholder="Buscar Producto..."
                        />
                        <button
                            class="bg-primary flex justify-center items-center text-white px-3 py-2 text-xs rounded-full"
                            type="submit"
                            aria-label="search product"
                        >
                            <i class="far fa-search" />
                        </button>
                    </div>
                    <div class="flex items-center gap-3">
                        <div class="flex gap-3 items-center">
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
                            <button
                                type="button"
                                class="bg-primary w-[30px] h-[30px] rounded-full text-white text-sm flex justify-center items-center relative"
                                onClick={cartStore.dropdown.onOpen}
                            >
                                <i
                                    class={
                                        empresaStore.state!.setting.type_cart
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
                                    {formatMoney(cartStore.methods.getTotal())}
                                </span>
                            </div>
                        </div>
                    </div>
                    {/* cart */}
                    <div
                        class={`fixed inset-0 bg-opacity-70 bg-black z-[999] hidden lg:flex  justify-end h-full ${
                            cartStore.dropdown.value ? "visible" : "invisible"
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
                    {/* input responsive */}
                    {/* <div class="block py-2 lg:hidden w-full ">
			<ProductsSearch />
		</div> */}
                </div>
                <div class="  gap-6  items-center  flex max-w-6xl mx-auto justify-between lg:justify-start ">
                    <div class="relative ">
                        <button
                            class="flex justify-between gap-4 text-sm tracking-wider items-center  px-4 py-3 w-[250px] bg-hamburger-linear font-bold text-white bg-primary "
                            type="button"
                            aria-label="categories"
                            onClick={() => {
                                isOpen.value = !isOpen.value;
                            }}
                        >
                            CATEGORIAS{" "}
                            <button
                                type="button"
                                aria-label="open menu"
                                class=""
                            >
                                <i class="fa-regular fa-bars " />
                            </button>
                        </button>
                        <div
                            class={`flex p-2 bg-background-light dark:bg-background-dark rounded-b-md flex-col  z-[99] absolute delay-custom-1  right-0 left-0 shadow-lg ${
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
                        </div>
                    </div>
                    <nav class=" gap-6 items-center hidden lg:flex ">
                        <a
                            class={` font-bold tracking-widest dark:hover:text-primary text-sm uppercase ${
                                isActive("/", false)
                                    ? "text-primary"
                                    : "text-black dark:text-white hover:text-primary"
                            }`}
                            href={"/"}
                        >
                            Inicio
                        </a>
                        <a
                            class={`font-bold tracking-widest text-sm uppercase  dark:hover:text-primary delay-custom-1 ${
                                isActive("/shop")
                                    ? "text-primary"
                                    : "text-black dark:text-white hover:text-primary"
                            }`}
                            href={"/shop"}
                        >
                            Shop
                        </a>
                        <a
                            class={` font-bold tracking-widest text-sm uppercase dark:hover:text-primary delay-custom-1 ${
                                isActive("/blog")
                                    ? "text-primary"
                                    : "text-black dark:text-white hover:text-primary"
                            }`}
                            href={"/blog"}
                        >
                            Blog
                        </a>
                        <a
                            class={` font-bold tracking-widest text-sm uppercase dark:hover:text-primary delay-custom-1 ${
                                isActive("/nosotros")
                                    ? "text-primary"
                                    : "text-black dark:text-white hover:text-primary"
                            }`}
                            href={"/nosotros"}
                        >
                            Nosotros
                        </a>
                        <a
                            class={` font-bold tracking-widest text-sm uppercase dark:hover:text-primary delay-custom-1 ${
                                isActive("/contactanos")
                                    ? "text-primary"
                                    : "text-black dark:text-white hover:text-primary"
                            }`}
                            href={"/contactanos"}
                        >
                            Contactanos
                        </a>
                    </nav>
                    <div class="lg:hidden mr-4 flex gap-4 items-center font-semibold text-white">
                        <Hamburguer isOpen={false} />
                        <span class="text-sm tracking-widest">MENU</span>
                    </div>
                </div>
            </header>

            {/* acá ira el header personalizado */}
            <HeaderMobile headerDropdown={headerDropdown} />
            <Aside
                headerDropdown={headerDropdown}
                categories={header.categories}
            />
        </>
    );
}

export default Header;
