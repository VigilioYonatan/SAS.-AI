import enviroments from "~/config";
import Hamburguer from "./Hamburguer";
import useEmpresastore from "@/empresas/stores/empresa.store";
import { type UseDropdown } from "~/hooks/useDropdown";
import { printFileWithDimension } from "~/libs/upload";
import useCartStore from "@/cart/stores/cart.store";
import CartAside from "@/cart/views/CartAside";
import useThemeStore from "~/stores/theme.store";
import SearchProducts from "@/products/views/ProductsSearch";

interface HeaderMobileProps {
	headerDropdown: UseDropdown;
}
function HeaderMobile({ headerDropdown }: HeaderMobileProps) {
	const empresaStore = useEmpresastore();
	const cartStore = useCartStore();
	const themeStore = useThemeStore();
	return (
		<header
			class={
				" w-full px-4    py-4 shadow  fixed z-[999] top-0 right-0 left-0 lg:hidden  delay-custom-1 "
			}
			style={{
				background: empresaStore.state!.setting.bg_color_responsive,
			}}
		>
			<div class=" max-w-6xl mx-auto">
				<div class="flex justify-between gap-2 items-center">
					<button
						type="button"
						aria-label="open aside"
						onClick={headerDropdown.onOpen}
					>
						<Hamburguer isOpen={headerDropdown.dropdownOpen} />
					</button>

					<a href={"/"} class="flex  items-center ml-12">
						{empresaStore.state!.logo ? (
							<img
								width={100}
								height={100}
								src={printFileWithDimension(empresaStore.state!.logo!, 100)[0]}
								class="w-[60px] h-[60px] object-contain"
								alt={empresaStore.state!.name_empresa}
							/>
						) : (
							<h2 class="text-2xl font-bold text-white uppercase">
								{empresaStore.state!.name_empresa[0]}
							</h2>
						)}
					</a>

					{/* cartaside */}
					<div
						class={`fixed inset-0 bg-opacity-70 bg-black z-[999] flex justify-end h-full ${
							cartStore.dropdown.value ? "visible" : "invisible"
						} delay-custom-1`}
						onClick={cartStore.dropdown.onClose}
					>
						<div
							class={`w-full delay-custom-1 md:w-[350px] bg-white dark:bg-paper-dark relative p-2 ${
								cartStore.dropdown.value ? "translate-x-0" : "translate-x-full"
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
					{/* endcartaside */}
					<div class="flex gap-3 items-center   text-xl  text-white">
						<SearchProducts />
						{empresaStore.state?.setting.isDark ? (
							<button
								type="button"
								aria-label="change theme"
								onClick={() => {
									themeStore.methods.changeThemeMode(
										themeStore.state === "dark" ? "light" : "dark",
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

						<button
							type="button"
							class=" text-xl  text-white relative"
							onClick={cartStore.dropdown.onOpen}
						>
							<i class={enviroments.TYPE_CART} />
							<span class="absolute -top-1 -right-2 bg-white text-xs font-bold flex justify-center items-center text-primary w-[20px] h-[20px] rounded-full">
								{cartStore.computed.showCartLength}
							</span>
						</button>
					</div>
				</div>
			</div>
		</header>
	);
}

export default HeaderMobile;
