import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import useEmpresastore, {
	storageEmpresa,
} from "@/empresas/stores/empresa.store";
import useProduct, { type CouponStore } from "@/products/hooks/useProduct";
import { useSignal } from "@preact/signals";
import Slider from "react-slick";
import enviroments, { BASE_URL } from "~/config";
import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import Form from "~/components/form";
import ProductCard from "@/web/components/product";
import useThemeStore from "~/stores/theme.store";
import {
	SampleNextArrow,
	SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import WebBreadCrumb from "@/web/components/WebBreadCrumb";
import useShowImage from "~/hooks/useShowImage";
import TitleSectionTwo from "@/web/components/TitleSectionTwo";
import { printFileWithDimension } from "~/libs/upload";
import { MetodosDePago } from "@/web/components/product/ProductView";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";

export interface VariantFeature {
	option_id: number;
	feature_id: number;
}
interface ProductPageProps {
	product: ProductsNormalSchemaFromServer | ProductsRestaurantSchemaFromServer;
	categoriesproductsrandom:
		| ProductsNormalSchemaFromServer[]
		| ProductsRestaurantSchemaFromServer[];
	productbybrands:
		| ProductsNormalSchemaFromServer[]
		| ProductsRestaurantSchemaFromServer[];
	category_name: string;
	header: HeaderType;
}

function ProductPage({
	product,
	categoriesproductsrandom,
	category_name,
	productbybrands,
	header,
}: ProductPageProps) {
	// description
	const isOpenDescription = useSignal(false);
	const empresaStore = useEmpresastore();
	const themeStore = useThemeStore();
	const { ShowImage, changeShowImage, state } = useShowImage();
	const {
		isImagesLength,
		handleInsertProduct,
		onCoupon,
		onDecrementCart,
		onIncrementCart,
		producto,
		existProductInCart,
		cartStoreMutation,
		couponForm,
		discount,
		productCouponMutation,
		zoom,
		images500Variant,
		varianteChoose,
		changeVariant,
		variant,
	} = useProduct({ product });

	return (
		<WebLayout header={header}>
			<section class="max-w-6xl gap-6 mx-auto mb-6 mt-28  lg:mt-6 lg:flex-row px-4">
				<div class="my-2 md:my-6 overflow-auto">
					<WebBreadCrumb
						current={product.name}
						uris={[
							{
								title: "Tienda",
								uri: "/shop",
							},
							{
								title: category_name,
								uri: `/shop/${product.category.slug}`,
							},
						]}
					/>
				</div>
				<div class="flex gap-6 flex-col md:flex-row  product-card p-2">
					<Slider
						{...{
							customPaging: (i) => {
								return (
									<div class="w-full h-full dark:bg-paper-dark bg-paper-light">
										<img
											width={100}
											height={100}
											class="w-full h-full object-contain"
											alt={product.name}
											src={isImagesLength[i]}
										/>
									</div>
								);
							},
							dots: images500Variant.length > 1,
							arrows: images500Variant.length > 1,
							dotsClass: "slick-dots slick-thumb",
							infinite: false,
							speed: 500,
							slidesToShow: 1,
							slidesToScroll: 1,
							adaptiveHeight: true,
							className: "w-full  md:w-7/12 relative self-start",
							nextArrow: <SampleNextArrow />,
							prevArrow: <SamplePrevArrow />,
						}}
					>
						{isImagesLength.map((img, i) => (
							<div
								class="rounded-md  h-[300px] md:h-[500px]   relative overflow-hidden "
								key={img}
								onMouseMove={zoom.handleMouseMove}
								onMouseLeave={zoom.handleMouseLeave}
							>
								{images500Variant.length ? (
									<button
										class="absolute right-0 m-2 dark:text-white z-10"
										type="button"
										aria-label="show image"
										onClick={() => {
											changeShowImage(i + 1);
										}}
									>
										<i class="fa-light fa-magnifying-glass-plus" />
									</button>
								) : null}

								<img
									alt={product.name}
									class={`h-full object-contain w-full ${
										zoom ? "zoom-image" : ""
									}`}
									width={800}
									height={800}
									src={img}
									style={{
										transformOrigin: `${zoom.position.x} ${zoom.position.y}`,
									}}
								/>
							</div>
						))}
					</Slider>
					<ShowImage length={images500Variant.length}>
						<Slider
							className="w-full"
							{...{
								dots: true,
								speed: 500,
								slidesToShow: 1,
								slidesToScroll: 1,
								arrows: false,
								adaptiveHeight: true,
								initialSlide: state! - 1,
								afterChange(currentSlide) {
									changeShowImage(currentSlide + 1);
								},
							}}
						>
							{images500Variant.map((image) => (
								<div class="h-[800px] " key={image}>
									<img
										class="w-full h-full object-contain"
										src={image}
										width={800}
										height={800}
										alt=""
									/>
								</div>
							))}
						</Slider>
					</ShowImage>
					<style jsx>{`
                        .product-card .slick-dots li {
                            min-width: 50px !important;
                            min-height: 50px !important;
                            border: 1px solid
                                ${
																	themeStore.state === "dark"
																		? "rgba(192, 192, 192, 0.2)"
																		: "rgba(0, 0, 0, 0.2)"
																};
                            bottom: -36px;
                        }
                        .product-card .slick-dots .slick-active {
                            border: 2px solid var(--primary);
                        }
                        .product-card .slick-slide div {
                            margin-inline: 8px;
                            outline: none;
                        }
                        .zoom-image {
                            transition: transform 0.5s ease;
                        }
                        .zoom-image:hover {
                            transform: scale(1.5);
                        }
                    `}</style>
					<div class="flex flex-col gap-2 md:w-5/12 mt-8 ">
						{varianteChoose?.sku ? (
							<span class="text-terciary text-xs">
								SKU: {varianteChoose?.sku}
							</span>
						) : null}
						<div class="flex gap-2 text-gray-600 dark:text-gray-300 text-xs font-semibold">
							{product.category?.icon ? (
								<div
									dangerouslySetInnerHTML={{
										__html: product.category.icon,
									}}
								/>
							) : null}

							<span>{product.category.name}</span>
						</div>
						<h3 class="text-primary font-bold dark:text-white line-clamp-2 text-lg">
							{product.name}
						</h3>
						{(product as ProductsNormalSchemaFromServer).brand?.image ? (
							<img
								src={
									printFileWithDimension(
										(product as ProductsNormalSchemaFromServer).brand.image!,
										100,
									)[0]
								}
								alt={(product as ProductsNormalSchemaFromServer).brand.name}
								width={40}
								class="object-contain w-[40px] "
								height={40}
							/>
						) : null}
						<div class="flex flex-col">
							<div class="flex gap-2">
								{product.discount > 0 ? (
									<span
										class="text-sm text-gray-400 line-through"
										itemprop={formatMoney(subtotalIgv(product, false))}
										content={formatMoney(subtotalIgv(product, false))}
									>
										{formatMoney(subtotalIgv(product, false))}
									</span>
								) : null}
								{discount.value ? (
									<span class="text-sm text-gray-400 line-through">
										-{discount.value}%
									</span>
								) : null}
							</div>

							<span
								class="text-primary font-bold dark:text-white text-xl"
								itemprop="price"
								content={formatMoney(subtotalIgv(product, true))}
							>
								{formatMoney(subtotalIgv(product, true, discount.value))}
							</span>
						</div>{" "}
						<span
							class={`${
								storageEmpresa?.tipo_empresa.tipo_servicio_id === 2
									? (producto.value as ProductsRestaurantSchemaFromServer)
											.ilimit ||
										(!(producto.value as ProductsRestaurantSchemaFromServer)
											.ilimit &&
											(producto.value as ProductsRestaurantSchemaFromServer)
												.stock! > 0)
										? "text-success"
										: "text-danger"
									: ""
							} ${
								storageEmpresa!.tipo_empresa.tipo_servicio_id === 1
									? (!varianteChoose!.ilimit && varianteChoose!.stock! > 0) ||
										varianteChoose!.ilimit
										? "text-primary"
										: "text-danger"
									: ""
							}  font-bold text-sm flex items-center gap-2`}
						>
							{storageEmpresa!.tipo_empresa.tipo_servicio_id === 2 ? (
								<>
									{(producto.value as ProductsRestaurantSchemaFromServer).ilimit
										? "En stock"
										: `${
												(producto.value as ProductsRestaurantSchemaFromServer)
													.stock
											} unidades`}
								</>
							) : null}
							{storageEmpresa!.tipo_empresa.tipo_servicio_id === 1 ? (
								<>
									{varianteChoose!.ilimit
										? "En stock"
										: `${varianteChoose!.stock} unidades`}
								</>
							) : null}
						</span>
						<div class="my-2">
							{/* aaaaaaaaaaaaaaaaca variante */}
							{(producto.value as ProductsNormalSchemaFromServer)?.variants ? (
								<>
									{" "}
									<div class="flex flex-col gap-3">
										{(
											producto.value as ProductsNormalSchemaFromServer
										)?.options.map((option) => (
											<div key={option.id}>
												<span class="dark:text-white text-xs font-bold text-black">
													{option.name}
												</span>
												<div class="flex gap-2 flex-wrap">
													{option.features.length ? (
														<>
															{option.features.length >= 4 ? (
																<select
																	onChange={(e) => {
																		changeVariant({
																			option_id: option.id,
																			feature_id: Number(
																				(e.target as HTMLInputElement).value,
																			),
																		});
																	}}
																	class="bg-white  dark:bg-background-dark text-xs dark:text-white w-full py-3 rounded-md shadow"
																>
																	{option.features.map((feature) => (
																		<option
																			value={feature.id}
																			class="font-bold  rounded-md  text-sm"
																			key={feature.id}
																		>
																			{feature.description}
																		</option>
																	))}
																</select>
															) : (
																<>
																	{option.features.map((feature) => {
																		// para checar el boton segun variante
																		const existFeature = variant
																			.value!.map((feat) => feat.feature_id)
																			.includes(feature.id);

																		return (
																			<button
																				type="button"
																				aria-label="change button"
																				key={feature?.id}
																				onClick={() =>
																					changeVariant({
																						option_id: option.id,
																						feature_id: feature.id,
																					})
																				}
																			>
																				{option.type === 1 ? (
																					<div
																						class={`shadow font-bold ${
																							enviroments.TYPE_BORDER ===
																							"square"
																								? "rounded-sm"
																								: "rounded-md"
																						}  flex text-primary py-2  text-sm min-w-[100px] px-2  justify-center items-center hover:bg-primary hover:text-white ${
																							existFeature
																								? "bg-primary text-white border-2 border-primary"
																								: "bg-white"
																						}`}
																					>
																						{feature?.value}
																					</div>
																				) : (
																					<div
																						class={`w-[35px] h-[35px] ${
																							enviroments.TYPE_BORDER ===
																							"square"
																								? ""
																								: "rounded-full"
																						}  relative ${
																							existFeature
																								? "border-4 border-primary"
																								: ""
																						}`}
																						style={{
																							backgroundColor: feature?.value,
																						}}
																					>
																						<span class="absolute -bottom-2 left-2 z-10 dark:bg-admin-background-dark shadow dark:text-white bg-white text-[10px] px-2 rounded-md py-1 hidden group-hover:block ">
																							{feature?.description}
																						</span>
																					</div>
																				)}
																			</button>
																		);
																	})}
																</>
															)}
														</>
													) : null}
												</div>
											</div>
										))}
									</div>
								</>
							) : null}
						</div>
						{/* coupon form  si  esta en el carrito que no se vea el formulario de cupon */}
						{(!existProductInCart &&
							(varianteChoose?.ilimit ||
								(!varianteChoose?.ilimit && varianteChoose?.stock! > 0))) ||
						(producto.value as ProductsRestaurantSchemaFromServer)?.ilimit ||
						(!(producto.value as ProductsRestaurantSchemaFromServer)?.ilimit &&
							(producto.value! as ProductsRestaurantSchemaFromServer).stock! >
								0) ? (
							<Form
								{...couponForm}
								onSubmit={onCoupon}
								className="flex gap-2 items-center"
							>
								<div class="w-full flex-col [&>div>div>div>input]:bg-white dark:[&>div>div>div>input]:bg-background-dark">
									{discount.value ? (
										<p class="text-xs text-primary">
											Se agregó {discount.value}% de descuento
										</p>
									) : null}
									<Form.control.web
										type="text"
										title="¿Tienes un cupón de descuento?"
										placeholder="XXXXX-XXXXX-XXXXX"
										name={"coupon" as keyof CouponStore}
										disabled={!!discount.value}
									/>
								</div>

								<Form.button.submit
									disabled={productCouponMutation.isLoading || false}
									isLoading={productCouponMutation.isLoading || false}
									title=""
									className="w-[40px] h-[40px] flex justify-center items-center"
									ico={
										discount.value ? (
											<span>x</span>
										) : (
											<i class="fa-solid fa-magnifying-glass text-base" />
										)
									}
								/>
							</Form>
						) : null}
						<div class="flex gap-2">
							{(!(producto.value as ProductsRestaurantSchemaFromServer)
								?.ilimit &&
								(producto.value as ProductsRestaurantSchemaFromServer)?.stock! <
									1) ||
							(!varianteChoose?.ilimit && varianteChoose?.stock! < 1) ? (
								<span
									class={`bg-danger py-3 w-full text-center ${
										enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
									} shadow text-white font-semibold`}
								>
									{!producto.value.enabled ? "No disponible" : "Agotado"}
								</span>
							) : (
								<>
									{!existProductInCart ? (
										<div
											class={`flex items-center bg-secondary ${
												enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
											} group hover:outline-2 hover:outline-primary shadow `}
										>
											<button
												type="button"
												class="px-4 py-2 text-xl text-white font-bold"
												aria-label="increase quantity"
												onClick={onDecrementCart}
											>
												-
											</button>
											<span class="px-4 py-2  block text-white font-bold">
												{producto.value.quantity}
											</span>
											<button
												type="button"
												class="px-4 py-2 text-xl text-white font-bold"
												aria-label="decrease quantity"
												onClick={onIncrementCart}
											>
												+
											</button>
										</div>
									) : null}

									{!existProductInCart ? (
										<button
											class={`bg-primary text-white px-6 py-2 ${
												enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
											} text-primary font-bold shadow  w-full`}
											type="button"
											aria-label="add cart"
											onClick={async () => {
												await handleInsertProduct(false);
											}}
											disabled={cartStoreMutation.isLoading || false}
										>
											{cartStoreMutation.isLoading ? (
												<span>cargando...</span>
											) : (
												<>
													<i class={enviroments.TYPE_CART} /> Agregar Carrito
												</>
											)}
										</button>
									) : (
										<span class=" flex gap-2 items-center justify-center w-full bg-secondary border-r border-primary  font-bold  py-3 text-white shadow rounded-md">
											<span> Añadido </span>
										</span>
									)}
								</>
							)}
						</div>
						<div class="flex  flex-col gap-1">
							<span class=" dark:text-white text-xs font-bold text-black">
								Compartir
							</span>
							<div class="flex gap-2 items-center dark:text-white text-primary">
								<a
									target="_self"
									rel="noreferrer"
									href={`mailto:?subject=${encodeURIComponent(
										`Más información de ${product.name}`,
									)}&amp;body=${BASE_URL}/${product.slug}`}
								>
									<i class="fas fa-envelope" />
								</a>
								<a
									target="_blank"
									rel="noreferrer"
									href={`https://x.com/share?url=${BASE_URL}/${
										product.slug
									}&amp;text=${encodeURIComponent(
										`Más información de ${product.name}`,
									)}`}
								>
									<i class="fab fa-twitter" />
								</a>
								<a
									target="_blank"
									rel="noreferrer"
									href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(
										`${BASE_URL}/${product.slug}`,
									)}`}
								>
									<i class="fab fa-facebook" />
								</a>
								<a
									target="_blank"
									rel="noreferrer"
									href={`https://wa.me/${empresaStore.state!.dial_code}${
										empresaStore.state!.telephoneFirst
									}?text=Hola, estoy interesado en ${product.name}`}
								>
									<i class="fab fa-whatsapp" />
								</a>
							</div>
						</div>
						<MetodosDePago />
					</div>
				</div>
				<div class="flex flex-col lg:flex-row gap-4 mt-16">
					<div class="flex flex-col gap-8 w-full">
						<div class="w-full">
							<h2 class="font-bold dark:text-white text-primary ">
								Características
							</h2>
							<div>
								{product.characteristics.length ? (
									<table
										class={`text-lg  font-medium w-full  overflow-hidden shadow ${
											enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
										}`}
									>
										<thead>
											<tr class="h-[30px]">
												<th class="text-sm bg-primary text-white font-semibold">
													Nombre
												</th>
												<th class="text-sm bg-primary text-white font-semibold">
													Valor
												</th>
											</tr>
										</thead>
										<tbody>
											{product.characteristics.map((characteristic) => (
												<tr
													class="text-[12px] odd:bg-white dark:odd:bg-background-dark"
													key={characteristic.name}
												>
													<td>
														<span class="font-semibold px-2 dark:text-white ">
															{characteristic.name}
														</span>
													</td>
													<td>
														<span class="font-normal dark:text-white px-2">
															{characteristic.value}
														</span>
													</td>
												</tr>
											))}
										</tbody>
									</table>
								) : (
									<span class="dark:text-white text-sm">
										No se insertó caracteristicas a este producto
									</span>
								)}
							</div>
						</div>
						<div class="">
							<h2 class="font-bold dark:text-white text-primary">
								Descripción
							</h2>
							{product.description ? (
								<>
									<div
										class={`${
											isOpenDescription.value
												? "max-h-[1800px]"
												: "max-h-[200px] overflow-hidden"
										} delay-custom-1`}
									>
										<div
											class="dark:text-secondary-light text-sm font-normal"
											dangerouslySetInnerHTML={{
												__html: product.description,
											}}
										/>
									</div>
									<button
										class={`${
											product.description.length < 1200 ? "hidden" : ""
										} text-xs bg-primary px-4 py-1 rounded-md font-bold text-white my-2`}
										type="button"
										aria-label="open to description"
										onClick={() => {
											isOpenDescription.value = !isOpenDescription.value;
										}}
									>
										<span>
											Ver más <i class="fas fa-chevron-down" />
										</span>
									</button>
								</>
							) : (
								<p class="dark:text-white text-sm"> No hay descripcion</p>
							)}
						</div>
						{/* si el usuario esta logueado que pueda loguear */}
					</div>
					<div class="lg:w-[400px]">
						<TitleSectionTwo>
							<>Más de {category_name}</>
						</TitleSectionTwo>
						<div class="gap-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 justify-center lg:h-[800px] p-2 overflow-y-auto">
							{categoriesproductsrandom.map((product) => (
								<ProductCard product={product} key={product.id}>
									<ProductCard.header>
										<ProductCard.buttons isAbsolute />
									</ProductCard.header>
									<ProductCard.body showDescription={false} />
									<ProductCard.footer />
								</ProductCard>
							))}
						</div>
					</div>
				</div>
			</section>
			<>
				{productbybrands?.length &&
				(product as ProductsNormalSchemaFromServer).brand?.name ? (
					<section class="max-w-6xl gap-6 mx-auto px-4 my-12">
						<TitleSectionTwo>
							<>
								Más de {(product as ProductsNormalSchemaFromServer).brand.name}
							</>
						</TitleSectionTwo>
						<div class="w-full">
							<Slider
								{...{
									adaptiveHeight: true,
									focusOnSelect: true,
									infinite: true,
									slidesToShow: 4,
									slidesToScroll: 1,
									speed: 500,
									nextArrow: <SampleNextArrow />,
									prevArrow: <SamplePrevArrow />,
									responsive: [
										{
											breakpoint: 1024,
											settings: {
												slidesToShow: 3,
											},
										},
										{
											breakpoint: 600,
											settings: {
												slidesToShow: 2,
											},
										},
										{
											breakpoint: 480,
											settings: {
												slidesToShow: 1,
											},
										},
									],
								}}
								className="w-full brands-section"
							>
								{productbybrands.map((product) => (
									<ProductCard product={product} key={product.id}>
										<ProductCard.header>
											<ProductCard.buttons isAbsolute />
										</ProductCard.header>
										<ProductCard.body showDescription={false} />
										<ProductCard.footer />
									</ProductCard>
								))}
							</Slider>
							<style jsx>{`
                                .brands-section .slick-slide > div {
                                    margin-inline: 8px;
                                    outline: none;
                                }
                            `}</style>
						</div>
					</section>
				) : null}
			</>
		</WebLayout>
	);
}

export default ProductPage;
