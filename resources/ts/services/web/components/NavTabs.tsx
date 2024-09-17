import useCartStore from "@/cart/stores/cart.store";
import useEmpresastore from "@/empresas/stores/empresa.store";
import enviroments from "~/config";
import { isActive } from "~/libs/helpers";

function NavTabs() {
	const cartStore = useCartStore();
	const empresaStore = useEmpresastore();

	return (
		<div
			style={{
				background: empresaStore.state!.setting.bg_color_responsive,
			}}
			class={
				"fixed   z-[99] bottom-0 left-0 right-0 w-full  lg:hidden shadow-lg"
			}
		>
			<div class="  w-full grid grid-cols-4">
				<a
					class={`text-gray-200  py-4 flex flex-col justify-center items-center gap-1 ${
						isActive("/", false) ? "bg-black bg-opacity-40" : ""
					} hover:bg-black hover:bg-opacity-40 delay-custom-1`}
					href="/"
				>
					<i class="fas fa-home" />
					<span class="text-xs font-semibold">Inicio</span>
				</a>
				<a
					class={`text-gray-200  py-4 flex flex-col justify-center items-center gap-1 ${
						isActive("/shop") ? "bg-black bg-opacity-40" : ""
					}  hover:bg-black hover:bg-opacity-40 delay-custom-1`}
					href={"/shop"}
				>
					<i class="fas fa-store" />
					<span class="text-xs font-semibold">Tienda</span>
				</a>
				<a
					class={`text-gray-200  py-4 flex flex-col justify-center items-center gap-1 ${
						isActive("/cart") ? "bg-black bg-opacity-40" : ""
					} hover:bg-black hover:bg-opacity-40 delay-custom-1`}
					href={"/cart"}
				>
					<i class={`${enviroments.TYPE_CART} relative`}>
						{cartStore.computed.showCartLength ? (
							<span class="absolute text-primary bg-white  -top-3 w-[20px] h-[20px] flex justify-center items-center rounded-full font-bold text-xs -right-4">
								{cartStore.computed.showCartLength}
							</span>
						) : null}
					</i>
					<span class="text-xs font-semibold">Carrito</span>
				</a>
				<a
					class={`text-gray-200  py-4 flex flex-col justify-center items-center gap-1 ${
						isActive("/auth") ? "bg-black bg-opacity-40" : ""
					} hover:bg-black hover:bg-opacity-40 delay-custom-1`}
					href={"/admin/perfil"}
				>
					<i class="fas fa-user" />
					<span class="text-xs font-semibold">Mi Perfil</span>
				</a>
			</div>
		</div>
	);
}

export default NavTabs;
