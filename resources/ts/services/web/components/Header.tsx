import useDropdown from "~/hooks/useDropdown";
import Aside from "./Aside";
import type { HeaderType } from "./WebLayout";
import HeaderMobile from "./HeaderMobile";
import { delay, isActive, isColorLight } from "~/libs/helpers";
import useEmpresastore, {
	storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useThemeStore from "~/stores/theme.store";
import useAuthStore from "@/auth/stores/auth.store";
import { useSignal } from "@preact/signals";
import WebDropdown from "~/components/dropdown/WebDropdown";
import { printFileUser, ROLES } from "@/users/libs/helpers";
import LogoImage from "~/components/LogoImage";
import useCartStore from "@/cart/stores/cart.store";
import { formatMoney } from "@/cart/libs/helpers";
import CartAside from "@/cart/views/CartAside";
import SearchProducts from "@/products/views/ProductsSearch";
import useFavoriteStore from "@/favorites/stores/favorites.store";
import Hamburguer from "./Hamburguer";
import ProductsSearch2 from "@/products/views/ProductSearch2";
import { printFileWithDimension } from "~/libs/upload";
import { useEffect } from "preact/hooks";
import { bgPrimaryHover } from "~/config/settings";
import WebNotificacion from "./WebNotificacion";
import useMediaQuery from "~/hooks/useMediaQuery";
import { iconCart, typeIcon1 } from "@/empresas/schemas/settings.schema";

interface HeaderProps {
	header: HeaderType;
}
function Header({ header }: HeaderProps) {
	const empresaStore = useEmpresastore();
	const themeStore = useThemeStore();
	const isOpen = useSignal(false);
	const isOpenCondiciones = useSignal(false);
	const headerDropdown = useDropdown();
	const cartStore = useCartStore();
	const favoriteStore = useFavoriteStore();
	const isTop = useSignal(true);

	useEffect(() => {
		async function handleScroll() {
			// Si la posición del scroll es 0, estamos en el top de la página
			if (window.scrollY < 10) {
				await delay(0.1);
				isTop.value = true;
			} else {
				await delay(0.1);

				isTop.value = false;
			}
		}
		if (
			storageEmpresa!.setting.header_type === "transparent" &&
			isActive("/", false)
		) {
			// Agregar el listener para el evento scroll
			window.addEventListener("scroll", handleScroll);

			// Limpiar el listener cuando el componente se desmonte
			return () => {
				window.removeEventListener("scroll", handleScroll);
			};
		}
		if (storageEmpresa!.setting.header_type === "search") {
			// Agregar el listener para el evento scroll
			window.addEventListener("scroll", handleScroll);

			// Limpiar el listener cuando el componente se desmonte
			return () => {
				window.removeEventListener("scroll", handleScroll);
			};
		}
	}, []);

	return (
		<>
			<style jsx>{`
                .vigilio-modal .modal {
                    ${
											themeStore.state === "dark"
												? "color: #FFFFFF !important"
												: isColorLight(storageEmpresa!.setting.bg_color_paper)
													? "color: #000000 !important"
													: "color: #FFFFFF !important"
										};
                }
                .bg-background-light {
                    ${
											themeStore.state === "dark"
												? "color: #FFFFFF !important"
												: isColorLight(
															storageEmpresa!.setting.bg_color_background,
														)
													? "color: #000000 !important"
													: "color: #FFFFFF !important"
										};
                }
                .bg-paper-light {
                    ${
											themeStore.state === "dark"
												? "color: #FFFFFF !important"
												: isColorLight(storageEmpresa!.setting.bg_color_paper)
													? "color: #000000 !important"
													: "color: #FFFFFF !important"
										};
                }
                .bg-primary {
                    ${
											isColorLight(empresaStore.state!.setting.bg_color)
												? "color: #000000 !important"
												: "color: #FFFFFF !important"
										};
                }
            `}</style>
			{storageEmpresa?.setting.header_type !== "transparent" ? (
				<>
					<div class="     text-sm px-2  dark:bg-background-dark hidden lg:block bg-background-light">
						<div class="max-w-6xl  mx-auto justify-between py-2 flex font-semibold">
							<div class="flex gap-3 items-center font-semibold">
								<span class="dark:text-white">
									Teléfono:{" "}
									<span class="text-primary font-semibold ml-1">
										(+{empresaStore.state!.dial_code}){" "}
										{empresaStore.state!.telephoneFirst.replace(
											/(\d{3})(\d{3})(\d{3})/,
											"$1 $2 $3",
										)}
									</span>
								</span>
								{empresaStore.state!.email ? (
									<span class="dark:text-white">
										Correo Electrónico:
										<span class="text-primary font-semibold ml-1">
											{empresaStore.state!.email}
										</span>
									</span>
								) : null}
							</div>
							<div class="flex items-center gap-2  dark:text-white ">
								<div class="w-[1px] bg-gray-600 h-[50%] mx-2" />
								<AuthUserIcon hiddenName={false} />
							</div>
						</div>
					</div>
					<div class="h-[1px] w-full bg-gray-300 dark:bg-gray-500" />
				</>
			) : null}

			<header
				class={`  hidden lg:block z-[99]   top-0 right-0 left-0 ${
					storageEmpresa?.setting.header_type !== "transparent"
						? "bg-background-light dark:bg-background-dark sticky shadow"
						: `  ${
								!isTop.value
									? "sticky bg-background-light dark:bg-background-dark"
									: ` ${
											isActive("/", false)
												? "absolute"
												: "sticky bg-background-light dark:bg-background-dark"
										}`
							}`
				}`}
			>
				<div class="max-w-6xl   mx-auto flex gap-4 justify-between items-center px-2 py-4 ">
					<div
						style={{
							order: storageEmpresa?.setting.header_position.logo,
						}}
					>
						<LogoImage width={storageEmpresa?.setting.logo_width} height="60" />
					</div>

					<nav
						class={`gap-6 items-center hidden lg:flex  relative ${
							storageEmpresa?.setting.header_type === "transparent" &&
							isActive("/", false)
								? `${isTop.value ? "text-white" : ""}`
								: ""
						} `}
						style={{
							order: storageEmpresa?.setting.header_position.navbar,
						}}
					>
						{storageEmpresa?.setting.header.home ? (
							<a
								class={` font-bold tracking-widest dark:hover:text-primary text-sm uppercase ${
									isActive("/", false)
										? "text-primary after:scale-x-100 "
										: " dark:text-white hover:text-primary"
								}  relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`}
								href={"/"}
							>
								Inicio
							</a>
						) : null}

						{storageEmpresa?.setting.header_type !== "search" &&
						storageEmpresa?.setting.header.shop ? (
							<div class="relative">
								<a
									href="/shop"
									type="button"
									class={`font-bold tracking-widest text-sm uppercase hover:text-primary dark:hover:text-primary delay-custom-1 ${
										isActive("/shop")
											? "text-primary after:scale-x-100"
											: " dark:text-white "
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
								{storageEmpresa.setting.header.categories ? (
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
												const isOpen = useSignal(false);
												return (
													<button
														type="button"
														onClick={() => {
															window.location.href = `/shop/${category.slug}`;
														}}
														class={`flex gap-2 items-center justify-between p-2   group w-full rounded-md hover:bg-primary ${bgPrimaryHover()}`}
														onFocus={() => {}}
														onBlur={() => {}}
														ref={dropdown.dropdown}
														key={category.id}
														aria-label="sho category"
														onMouseOver={() => {
															isOpen.value = !isOpen.value;
														}}
														onMouseOut={() => {
															isOpen.value = false;
														}}
													>
														<div class="flex gap-3 items-center dark:text-white justify-between w-full">
															<div class="flex gap-2 w-full">
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
															{category.subcategories.length &&
															storageEmpresa?.setting.is_subcategory ? (
																<button
																	type="button"
																	aria-label="on subcategory"
																>
																	<i class="far fa-chevron-right" />
																</button>
															) : null}
															{category.subcategories.length &&
															storageEmpresa?.setting.is_subcategory ? (
																<div
																	class={`flex p-2 min-w-[300px]  bg-background-light dark:bg-paper-dark rounded-b-md flex-col  z-[99] absolute delay-custom-1  left-[19rem]  shadow-lg ${
																		isOpen.value
																			? "max-h-[800px]  opacity-100"
																			: "max-h-0 overflow-hidden opacity-0"
																	}`}
																>
																	{category.subcategories.map((sub) => {
																		const dropdown = useDropdown();
																		return (
																			<a
																				href={`/shop/${category.slug}/${sub.slug}`}
																				class={`flex gap-2 items-center justify-between p-2   group w-full rounded-md hover:bg-primary ${bgPrimaryHover()}`}
																				ref={dropdown.dropdown}
																				key={sub.id}
																				aria-label="sho category"
																			>
																				<div class="flex gap-3 items-center dark:text-white justify-between w-full">
																					<span class="font-semibold">
																						{sub.name}
																					</span>
																				</div>
																			</a>
																		);
																	})}
																</div>
															) : null}
														</div>
													</button>
												);
											})}
										</div>
										{header.categoriesServices.length ? (
											<>
												{header.categoriesServices.map((category) => (
													<>
														<button
															key={category.id}
															type="button"
															aria-label="marcas"
															class={`flex gap-2 items-center justify-between p-2 hover:bg-primary  ${bgPrimaryHover()}  group w-full rounded-md  relative group `}
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
																{category.products.map((service) => (
																	<a
																		href={`/servicio/${service.slug}`}
																		class={`flex gap-2 items-center justify-between p-2   w-full rounded-md hover:bg-primary ${bgPrimaryHover()} `}
																		key={service.id}
																		aria-label="show category"
																	>
																		<div class="flex gap-2 items-center ">
																			<span class="font-semibold">
																				{service.name}
																			</span>
																		</div>
																	</a>
																))}
															</div>
														</button>
													</>
												))}
											</>
										) : null}
										{header.brands.length ? (
											<button
												type="button"
												aria-label="marcas"
												class={`flex gap-2 items-center justify-between p-2 hover:bg-primary ${bgPrimaryHover()} group w-full rounded-md  relative group  `}
											>
												<div class="flex gap-3 items-center dark:text-white">
													<i
														class={`fa${
															storageEmpresa?.setting.type_icons_bars ===
															"normal"
																? "s"
																: "r"
														} fa-tag`}
													/>
													<span class="font-semibold">Marcas</span>
												</div>
												<div class="absolute rounded-md right-[-312px] min-w-[300px]  p-2 bg-background-light dark:bg-paper-dark rounded-b-md flex-col hidden group-hover:flex">
													{header.brands.map((brand) => (
														<a
															href={`/marcas/${brand.slug}`}
															class={`flex gap-2 items-center justify-between p-2   w-full rounded-md hover:bg-primary  ${bgPrimaryHover()}`}
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
																				100,
																			)[0]
																		}
																	/>
																) : null}
																<span class="font-semibold">{brand.name}</span>
															</div>
														</a>
													))}
												</div>
											</button>
										) : null}
									</div>
								) : null}
							</div>
						) : null}

						{storageEmpresa?.setting.shows.about &&
						storageEmpresa?.setting.header.about ? (
							<a
								class={` font-bold tracking-widest text-sm uppercase dark:hover:text-primary delay-custom-1 ${
									isActive("/nosotros")
										? "text-primary after:scale-x-100"
										: " dark:text-white hover:text-primary"
								}  relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`}
								href={"/nosotros"}
							>
								Nosotros
							</a>
						) : null}
						{storageEmpresa?.setting.header.profile ? (
							<a
								class={` font-bold tracking-widest text-sm uppercase dark:hover:text-primary delay-custom-1 ${
									isActive("/auth/profile", true)
										? "text-primary after:scale-x-100"
										: " dark:text-white hover:text-primary"
								}  relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`}
								href={"/auth/profile"}
							>
								Mi Perfil
							</a>
						) : null}
						{storageEmpresa?.setting.header.pedidos ? (
							<a
								class={` font-bold tracking-widest text-sm uppercase dark:hover:text-primary delay-custom-1 ${
									isActive("/pedidos")
										? "text-primary after:scale-x-100"
										: " dark:text-white hover:text-primary "
								}  relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`}
								href={"/pedidos"}
							>
								Pedidos
							</a>
						) : null}

						{storageEmpresa?.setting.header.condiciones ? (
							<div class="relative">
								<button
									type="button"
									class={` font-bold tracking-widest text-sm uppercase dark:hover:text-primary delay-custom-1  hover:text-primary  delay-custom-1 ${
										isActive("/terminos-y-condiciones") ||
										isActive("/politica-de-privacidad") ||
										isActive("/libro-de-reclamaciones")
											? "text-primary after:scale-x-100"
											: " dark:text-white "
									}  relative after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-primary after:left-0 after:-bottom-1 after:scale-x-0 after:origin-center after:transition-transform after:duration-300 hover:after:scale-x-100`}
									onBlur={() => {}}
									onFocus={() => {}}
									onMouseOver={() => {
										isOpenCondiciones.value = !isOpenCondiciones.value;
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
											class={`flex gap-2 items-center justify-between p-2 hover:bg-primary  ${bgPrimaryHover()} group w-full rounded-md`}
										>
											<div class="flex gap-3 items-center dark:text-white">
												<span class="font-semibold">
													Términos y Condiciones
												</span>
											</div>
										</a>
										<a
											href="/politica-de-privacidad"
											class={`flex gap-2 items-center justify-between p-2  hover:bg-primary ${bgPrimaryHover()} group w-full rounded-md `}
										>
											<div class="flex gap-3 items-center dark:text-white">
												<span class="font-semibold">Política y Privacidad</span>
											</div>
										</a>
										<a
											href="/libro-de-reclamaciones"
											class={`flex gap-2 items-center  hover:bg-primary justify-between p-2  ${bgPrimaryHover()} group w-full rounded-md`}
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
						) : null}
					</nav>
					<div
						class={`flex items-center gap-3 ${
							storageEmpresa?.setting.header_type === "transparent" &&
							isActive("/", false)
								? `${isTop.value ? "text-white " : ""}`
								: ""
						}`}
						style={{
							order: storageEmpresa?.setting.header_position.icons,
						}}
					>
						{header.totalProducts > 0 ? <SearchProducts /> : null}
						<a
							href="/auth/profile?type=favorites"
							class=" text-sm flex justify-center items-center relative"
						>
							<i class={`fa${typeIcon1} fa-heart text-lg  dark:text-white`} />{" "}
							<span
								style={{
									backgroundColor:
										empresaStore.state!.setting.bg_color_secondary,
									color: isColorLight(
										empresaStore.state!.setting.bg_color_secondary,
									)
										? "#000000"
										: "#ffffff",
								}}
								class="border-2 absolute border-white rounded-full w-[20px] h-[20px] text-xs  -right-3 -top-2 flex justify-center items-center  font-semibold"
							>
								{favoriteStore.state}
							</span>
						</a>
						<div class="flex gap-3 items-center">
							{storageEmpresa?.setting.isDark ? (
								<button
									type="button"
									aria-label="change theme"
									class="flex gap-2 items-center justify-center text-md dark:text-white"
									onClick={() =>
										themeStore.methods.changeThemeMode(
											themeStore.state === "dark" ? "light" : "dark",
										)
									}
								>
									{themeStore.state === "dark" ? (
										<>
											<i
												class={`fa${typeIcon1} fa-moon  dark:text-white`}
											/>{" "}
										</>
									) : (
										<>
											<i
												class={`fa${typeIcon1} fa-sun  dark:text-white`}
											/>{" "}
										</>
									)}
								</button>
							) : null}
							{header.totalProducts > 0 ? (
								<>
									<button
										type="button"
										class=" text-sm flex justify-center items-center relative"
										onClick={cartStore.dropdown.onOpen}
									>
										<i class={`${iconCart} text-lg  dark:text-white`} />
										<span
											class="border-2 absolute border-white rounded-full w-[20px] h-[20px] text-xs -right-2 -top-2  font-semibold"
											style={{
												backgroundColor:
													empresaStore.state!.setting.bg_color_secondary,
												color: isColorLight(
													empresaStore.state!.setting.bg_color_secondary,
												)
													? "#000000"
													: "#ffffff",
											}}
										>
											{cartStore.computed.showCartLength}
										</span>
									</button>{" "}
									{useMediaQuery("(min-width:1025px)") ? (
										<WebNotificacion />
									) : null}
									{storageEmpresa?.setting.header_type === "transparent" ? (
										<AuthUserIcon hiddenName={true} />
									) : (
										""
									)}
									{storageEmpresa?.setting.is_hidde_total_cart ? (
										<div class="flex flex-col gap-1 ">
											<span class="font-bold tracking-wide text-xs   dark:text-white">
												TOTAL
											</span>
											<span class="font-semibold text-xs dark:text-white">
												{formatMoney(cartStore.methods.getTotal())}
											</span>
										</div>
									) : null}
								</>
							) : (
								<>
									{!isActive("/", false) ? (
										<button
											onClick={() => {
												window.location.href = "/#servicios";
											}}
											aria-label={"change servicios page"}
											type={"button"}
											class=" text-xl   relative dark:text-white"
										>
											<i class={iconCart} />
										</button>
									) : (
										<a
											href="#servicios"
											class=" text-xl   relative  dark:text-white"
										>
											<i class={iconCart} />
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
									class="text-end block dark:text-white text-primary absolute top-0 right-0 m-2"
									type="button"
									aria-label="close cart"
									onClick={cartStore.dropdown.onClose}
								>
									<i class={`fa${typeIcon1} fa-x  dark:text-white`} />
								</button>
								<CartAside />
							</div>
						</div>
					) : null}
				</div>
				<div
					class={`${
						storageEmpresa?.setting.header_type === "search" && isTop.value
							? "hidden lg:flex"
							: "hidden"
					}  gap-6 items-center  py-2  max-w-6xl mx-auto  px-2`}
				>
					<div class="relative ">
						<button
							class="flex gap-4 text-md tracking-wider  items-center  px-4 py-2 w-[250px] bg-hamburger-linear font-bold text-white [&>div>i]:dark:!text-white bg-primary"
							type="button"
							aria-label="categories"
							onClick={() => {
								isOpen.value = !isOpen.value;
							}}
						>
							<Hamburguer isOpen={false} />
							Shop
						</button>
						<HeaderAside header={header} isOpen={isOpen.value} />
					</div>
					<div class="flex gap-6 items-center w-full relative border dark:border-gray-600">
						<ProductsSearch2 />
					</div>
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
// this ia a second header aside
interface HeaderAsideProps {
	header: HeaderType;
	isOpen: boolean;
}
function HeaderAside({ header, isOpen }: HeaderAsideProps) {
	const empresaStore = useEmpresastore();
	return (
		<div
			class={`flex absolute right-0 dark:bg-paper-dark dark:text-white z-[99] delay-custom-1 left-0 flex-col ${
				storageEmpresa?.setting.is_block_aside && isActive("/", false)
					? "max-h-[450px]"
					: isOpen
						? "max-h-[450px]"
						: "max-h-[0px] overflow-hidden"
			} `}
		>
			{header.categories.map((category) => {
				const dropdown = useDropdown();
				const dropdown2 = useDropdown();

				return (
					<div
						ref={dropdown.dropdown}
						key={category.id}
						class={`bg-background-light dark:bg-paper-dark  dark:border-gray-600 py-2 font-semibold  px-3 w-full border-gray-1 flex justify-between items-center border-b border-gray-100 dark:!text-white dark:hover:!text-primary hover:bg-primary ${
							isColorLight(empresaStore.state!.setting.bg_color)
								? "hover:!text-black"
								: "hover:!text-white"
						} `}
					>
						<div class="w-full flex gap-2 items-center justify-between">
							<a
								href={`/shop/${category.slug}`}
								class="flex  gap-2 items-center w-full  "
							>
								{category.icon ? (
									<div
										class="w-[20px] flex justify-center items-center"
										dangerouslySetInnerHTML={{
											__html: category.icon,
										}}
									/>
								) : null}
								<span>{category.name}</span>
							</a>
							{category.subcategories.length ? (
								<button
									onClick={(e) => {
										e.stopPropagation();
										dropdown2.onOpenClose();
									}}
									type="button"
									class="w-[20px]"
								>
									<i class="fas fa-caret-right" />
								</button>
							) : null}
						</div>{" "}
						{dropdown2.dropdownOpen && category.subcategories.length ? (
							<div
								class="absolute bg-background-dark w-[250px] left-[250px]"
								ref={dropdown2.dropdown}
							>
								{category.subcategories.map((sub) => {
									return (
										<a
											href={`/shop/${sub.category.slug}/${sub.slug}`}
											class={`text-sm text-white hover:bg-primary ${bgPrimaryHover()} py-2.5 px-2 w-full block dark:border-gray-600 border-gray-1 border-b border-gray-100 bg-background-light dark:bg-paper-dark hover:bg-primary  dark:hover:!text-primary relative`}
											key={sub.id}
										>
											{sub.name}{" "}
										</a>
									);
								})}
							</div>
						) : null}
					</div>
				);
			})}
			{header.categoriesServices.map((category) => {
				const dropdown = useDropdown();
				const dropdown2 = useDropdown();
				return (
					<div
						ref={dropdown.dropdown}
						key={category.id}
						class="bg-background-light dark:bg-paper-dark  dark:border-gray-600 py-2 font-semibold  px-5 w-full border-gray-1 flex justify-between items-center border-b border-gray-100 dark:!text-white hover:text-primary dark:hover:!text-primary  relative"
					>
						<button
							type="button"
							class="w-full flex gap-2 items-center justify-between "
							ref={dropdown2.trigger}
							onClick={() => {
								dropdown2.onOpenClose();
							}}
						>
							<div class="flex items-center gap-2">
								{category.icon ? (
									<div
										class="w-[20px] flex justify-center items-center"
										dangerouslySetInnerHTML={{
											__html: category.icon,
										}}
									/>
								) : null}{" "}
								{category.name}
							</div>
							<span>
								<i class={`fa${typeIcon1} fa-caret-right`} />
							</span>
						</button>{" "}
						{dropdown2.dropdownOpen && category.products.length ? (
							<div
								class="absolute bg-background-dark w-[250px] left-[250px]"
								ref={dropdown2.dropdown}
							>
								{category.products.map((pr) => {
									return (
										<a
											href={`/servicio/${pr.slug}`}
											class="text-sm text-white py-2.5 px-2 w-full block dark:border-gray-600 border-gray-1 border-b border-gray-100 bg-background-light dark:bg-paper-dark hover:text-primary dark:hover:!text-primary"
											key={pr.id}
										>
											{pr.name}
										</a>
									);
								})}
							</div>
						) : null}
					</div>
				);
			})}
		</div>
	);
}

interface AuthUserIconProps {
	hiddenName: boolean;
}
function AuthUserIcon({ hiddenName }: AuthUserIconProps) {
	const authStore = useAuthStore();

	return (
		<>
			{" "}
			{authStore.state ? (
				<WebDropdown
					className="-bottom-30 z-[100] p-0"
					triggerChildren={({ trigger }) => (
						<button class="flex gap-2 items-center" type="button" ref={trigger}>
							<img
								src={printFileUser(authStore.state!.photo)[0]}
								width={30}
								height={30}
								class="rounded-full"
								alt={authStore.state!.username}
							/>
							{hiddenName ? (
								<span class="font-semibold dark:text-white">
									{authStore.state!.username}
								</span>
							) : null}
						</button>
					)}
				>
					<div class="flex flex-col dark:bg-background-dark">
						{!hiddenName ? (
							<span class="font-semibold dark:text-white mx-auto text-sm mt-2 line-clamp-1">
								{authStore.state!.username}
							</span>
						) : null}
						{authStore.state.role_id !== ROLES.user ? (
							<a
								href={"/admin"}
								class="dark:text-white dark:hover:bg-paper-dark hover:bg-paper-light px-4  py-2 font-semibold flex justify-between gap-2 items-center"
							>
								<i
									class={`fa${
										storageEmpresa?.setting.type_icons_bars === "normal"
											? "s"
											: "r"
									} fa-tachometer-alt w-[20px]`}
								/>{" "}
								<span class="text-center w-full">Dashboard</span>
							</a>
						) : null}
						<a
							href={"/auth/profile"}
							class="dark:text-white dark:hover:bg-paper-dark hover:bg-paper-light px-4  py-2 font-semibold   flex justify-between gap-2 items-center"
						>
							<i class={`fa${typeIcon1} fa-user w-[20px]`} />
							<span class="text-center w-full">Mi perfil</span>
						</a>
						<a
							href={"/auth/profile?type=favorites"}
							class="dark:text-white dark:hover:bg-paper-dark hover:bg-paper-light px-4  py-2  font-semibold flex justify-between gap-2 items-center"
						>
							<i class={`fa${typeIcon1} fa-heart w-[20px]`} />{" "}
							<span class="text-center w-full">Favoritos</span>
						</a>
						<a
							href={"/auth/profile?type=orders"}
							class="dark:text-white dark:hover:bg-paper-dark hover:bg-paper-light px-4  py-2  font-semibold  flex justify-between gap-2 items-center"
						>
							<i class={`fa${typeIcon1} fa-box w-[20px]  dark:text-white`} />{" "}
							<span class="text-center w-full">Mis pedidos</span>
						</a>
						<a
							class="bg-danger  font-semibold py-2 text-white flex justify-between  px-4 items-center"
							href={"/auth/logout"}
						>
							<i
								class={`fa${typeIcon1} fa-sign-out-alt w-[20px]  dark:text-white `}
							/>{" "}
							<span class="text-center w-full">Salir</span>
						</a>
					</div>
				</WebDropdown>
			) : (
				<a href="/auth/login" class="flex gap-1 items-center justify-center">
					<i
						class={`fa${typeIcon1} fa-user-circle  ${
							hiddenName ? "text-xl" : "text-xl mr-2"
						}  dark:text-white `}
					/>
					{hiddenName ? null : <span>Iniciar sesión</span>}
				</a>
			)}
		</>
	);
}
export default Header;
