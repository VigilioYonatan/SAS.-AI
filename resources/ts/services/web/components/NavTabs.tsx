import useAuthStore from "@/auth/stores/auth.store";
import useCartStore from "@/cart/stores/cart.store";
import useEmpresastore from "@/empresas/stores/empresa.store";
import { printFileUser, ROLES } from "@/users/libs/helpers";
import enviroments from "~/config";
import { bgPrimaryHover } from "~/config/settings";
import { isActive, isColorLight } from "~/libs/helpers";

interface NavTabsProps {
    background?: string;
    totalProducts: number;
}
function NavTabs({ background, totalProducts }: NavTabsProps) {
    const cartStore = useCartStore();
    const empresaStore = useEmpresastore();
    const authStore = useAuthStore();

    const bg = background
        ? background
        : empresaStore.state!.setting.bg_color_responsive;

    return (
        <div
            style={{
                background: bg,
                color: isColorLight(bg) ? "#000000" : "#FFFFFF",
                position: background ? "relative" : "fixed",
            }}
            class={` z-[99] bottom-0 left-0 right-0 w-full ${
                background ? "" : "lg:hidden"
            }  shadow-lg`}
        >
            <div class="  w-full grid grid-cols-4">
                <a
                    class={`  py-4 flex flex-col justify-center items-center gap-1 ${
                        isActive("/", false)
                            ? "bg-primary bg-opacity-40 text-white"
                            : ""
                    }  hover:bg-opacity-40 hover:bg-primary ${bgPrimaryHover()} delay-custom-1`}
                    href="/"
                >
                    <i class="fas fa-home" />
                    <span class="text-xs font-semibold">Inicio</span>
                </a>
                <a
                    class={`  py-4 flex flex-col justify-center items-center gap-1 ${
                        isActive("/shop")
                            ? "bg-primary bg-opacity-40 text-white"
                            : ""
                    }   hover:bg-opacity-40 hover:bg-primary ${bgPrimaryHover()} delay-custom-1`}
                    href={"/shop"}
                >
                    <i class="fas fa-store" />
                    <span class="text-xs font-semibold">Tienda</span>
                </a>
                {totalProducts > 0 ? (
                    <a
                        class={`  py-4 flex flex-col justify-center items-center gap-1 ${
                            isActive("/cart")
                                ? "bg-primary bg-opacity-40 text-white"
                                : ""
                        } hover:bg-primary ${bgPrimaryHover()} hover:bg-opacity-40 delay-custom-1`}
                        href={"/cart"}
                    >
                        <i class={`${enviroments.TYPE_CART} relative`}>
                            {cartStore.computed.showCartLength ? (
                                <span class="absolute text-white bg-black  -top-3 w-[20px] h-[20px] flex justify-center items-center rounded-full font-bold text-xs -right-4">
                                    {cartStore.computed.showCartLength}
                                </span>
                            ) : null}
                        </i>
                        <span class="text-xs font-semibold">Carrito</span>
                    </a>
                ) : (
                    <a
                        class={`  py-4 flex flex-col justify-center items-center gap-1 ${
                            isActive("/pedidos")
                                ? "bg-primary bg-opacity-40 text-white"
                                : ""
                        } hover:bg-primary ${bgPrimaryHover()} hover:bg-opacity-40 delay-custom-1`}
                        href={"/pedidos"}
                    >
                        <i class="fas fa-box" />
                        <span class="text-xs font-semibold">Pedidos</span>
                    </a>
                )}

                <a
                    class={`  py-4 flex flex-col justify-center items-center gap-1 ${
                        isActive("/auth")
                            ? "bg-primary bg-opacity-40 text-white"
                            : ""
                    } hover:bg-primary ${bgPrimaryHover()} hover:bg-opacity-40 delay-custom-1`}
                    href={
                        authStore.state?.role_id !== ROLES.user
                            ? "/admin/perfil"
                            : "/auth/profile"
                    }
                >
                    {authStore.state ? (
                        <>
                            {" "}
                            <img
                                src={
                                    printFileUser(authStore.state.photo, 100)[0]
                                }
                                width={100}
                                height={100}
                                class="rounded-full w-[35px] h-[35px]"
                                alt={authStore.state.name}
                            />
                        </>
                    ) : (
                        <>
                            {" "}
                            <i class="fas fa-user" />
                            <span class="text-xs font-semibold">Mi Perfil</span>
                        </>
                    )}
                </a>
            </div>
        </div>
    );
}

export default NavTabs;
