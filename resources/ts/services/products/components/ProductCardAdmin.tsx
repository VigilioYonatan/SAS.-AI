import { useSignal } from "@preact/signals";
import { printImagesProduct, productOBJ } from "@/products/libs/helpers";
import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import useCartStore from "@/cart/stores/cart.store";
import { cartStoreApi } from "@/cart/apis/cart.store.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import ProductsShow from "../views/ProductsShow";
import LoaderSubmit from "~/components/LoaderSubmit";
import { deepEqual } from "~/libs/helpers";
import ProductNotification from "./ProductNotification";
import { ProductsNormalSchemaFromServer } from "../schemas/products_normal.schema";
interface ProductCardAdminProps {
	product: ProductsNormalSchemaFromServer;
	refetch: (clean?: boolean) => void;
}
function ProductCardAdmin({ product, refetch }: ProductCardAdminProps) {
	interface VariantFeature {
		option_id: number;
		feature_id: number;
	}

	const variant = useSignal<VariantFeature[] | null>(
		product.variants.length ? product.variants[0].features : null,
	);

	const cartStore = useCartStore();
	const cartStoreMutation = cartStoreApi();

	function handleOpenProduct(product: ProductsNormalSchemaFromServer) {
		return sweetModal((onClose) => ({
			html: reactComponent(
				<ProductsShow id={product.id} refetch={refetch} onClose={onClose} />,
			),
			showCloseButton: true,
			position: "start",
			sweetWidth: "800px",
			isCloseInBackground: false,
		}));
	}
	const varianteChoose = product.variants.find((vari) =>
		deepEqual(vari.features, variant.value),
	);
	function changeVariant(body: VariantFeature) {
		variant.value = variant.value
			? variant.value.map((variant) =>
					variant.option_id === body.option_id
						? {
								...variant,
								feature_id: body.feature_id,
							}
						: variant,
				)
			: null;
	}
	// function
	async function onCart() {
		cartStoreMutation.mutate(
			{
				...productOBJ(product.id),
				variant_id: varianteChoose!.id,
				quantity: 1,
				coupon: null,
			},
			{
				onSuccess() {
					cartStore.methods.onInsertProduct({
						...product,
						variant: varianteChoose ? varianteChoose : null,
						subtotal: subtotalIgv(product),
						quantity: 1,
						coupon: null,
					});
					sweetAlert({
						showCloseButton: true,
						html: reactComponent(<ProductNotification product={product} />),
						height: 100,
						width: 300,
						timer: 2,
					});
				},
				onError(error) {
					sweetAlert({
						icon: "danger",
						title: `Hubo un error al agregar ${error.message}`,
					});
				},
			},
		);
	}
	const existProductInCart = cartStore.methods.isAlreadyExistProductToCart(
		product.id,
		varianteChoose!.id,
	);
	return (
		<div
			class="shadow rounded-md overflow-hidden dark:bg-admin-terciary"
			key={product.id}
		>
			<div class="w-full relative">
				<img
					class="w-full h-[250px] object-contain"
					src={printImagesProduct(product.images, 500)[0]}
					width={100}
					height={100}
					alt=""
				/>
			</div>
			<div class=" justify-center items-center mt-2 flex flex-col gap-2">
				<button
					type="button"
					aria-label="to open oproduct"
					onClick={() => handleOpenProduct(product)}
					class="text-primary dark:text-white font-semibold text-xs md:text-base text-wrap line-clamp-3"
				>
					{product.name}
				</button>
				<b class="dark:text-white block">
					<span>{formatMoney(subtotalIgv(product))}</span>
				</b>
				{product.variants.length ? (
					<>
						<div class="flex flex-col gap-2  items-center w-full  h-[90px] overflow-auto">
							<>
								{product.options.map((opt) => (
									<div key={opt.id} class="flex gap-1 w-full   flex-col">
										<span class="dark:text-white text-xs font-bold text-center">
											{opt.name}:
										</span>
										<div class="flex gap-2 justify-center flex-wrap w-full items-center">
											{opt.features.length ? (
												<>
													{opt.features.length >= 4 ? (
														<select
															onChange={(e) => {
																changeVariant({
																	option_id: opt.id,
																	feature_id: Number(
																		(e.target as HTMLInputElement).value,
																	),
																});
															}}
															class="bg-white dark:bg-admin-paper-dark text-xs dark:text-white p-1 rounded-md shadow"
														>
															{opt.features.map((feature) => (
																<option
																	value={feature.id}
																	class="font-bold text-xs rounded-md "
																	key={feature.id}
																>
																	{feature.value}
																	{" | "}
																	{feature.description}
																</option>
															))}
														</select>
													) : (
														<>
															{" "}
															{opt.features.map((feature) => {
																// para checar el boton segun variante
																const existFeature = variant
																	.value!.map((feat) => feat.feature_id)
																	.includes(feature.id)
																	? "border-2 border-primary"
																	: "";

																return (
																	<button
																		type="button"
																		aria-label="change button"
																		key={feature?.id}
																		onClick={() =>
																			changeVariant({
																				option_id: opt.id,
																				feature_id: feature.id,
																			})
																		}
																	>
																		{opt.type === 1 ? (
																			<div
																				class={`px-3 py-1 text-center rounded-md  bg-white dark:bg-admin-paper-dark dark:text-white text-xs font-bold flex items-center gap-2 shadow ${existFeature}`}
																			>
																				{feature?.value}
																			</div>
																		) : (
																			<div
																				class={`relative w-[30px] h-[30px] rounded-full shadow  flex justify-center items-center group ${existFeature}`}
																				style={{
																					backgroundColor: feature?.value,
																				}}
																			>
																				<span class="absolute -bottom-2 left-2 z-10 dark:bg-admin-background-dark shadow dark:text-white bg-white text-[10px] px-2 rounded-md py-1 hidden group-hover:block">
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
							</>
						</div>
						<div>
							{varianteChoose!.ilimit ? (
								<span class="dark:text-white font-bold">En stock</span>
							) : varianteChoose!.stock! > 0 ? (
								<span class="dark:text-white font-bold">
									{varianteChoose?.stock} unidades
								</span>
							) : (
								<span class="text-danger font-bold">Agotado</span>
							)}
						</div>
						{!product.enabled ||
						(!varianteChoose!.ilimit && varianteChoose!.stock! < 1) ? (
							<span class="text-white flex gap-2 items-center justify-center w-full bg-danger border-r border-primary py-1 font-bold">
								<span>{!product.enabled ? "Desabilitado" : "Agotado"} </span>
							</span>
						) : (
							<>
								{existProductInCart ? (
									<span class="bg-black py-3  w-full text-white text-xs font-bold  flex justify-center">
										<i class="fa-solid fa-cart-shopping mr-2" />
										Añadido
									</span>
								) : (
									<button
										type="button"
										aria-label="to send"
										onClick={onCart}
										class="bg-primary py-3 flex justify-center items-center  w-full text-white text-xs font-bold"
									>
										{cartStoreMutation.isLoading ? (
											<LoaderSubmit />
										) : (
											<>
												<i class="fa-solid fa-cart-shopping mr-2" />
												Agregar Carrito
											</>
										)}
									</button>
								)}
							</>
						)}
					</>
				) : (
					<span class="dark:text-white">No hay variantes</span>
				)}
			</div>
		</div>
	);
}

export default ProductCardAdmin;
