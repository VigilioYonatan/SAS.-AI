import { useContext } from "preact/hooks";
import LoaderSubmit from "~/components/LoaderSubmit";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { useMediaQueryNoReactive } from "~/hooks/useMediaQuery";
import { productContext } from "./Product";
import ProductCardView from "./ProductView";
import enviroments from "~/config";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";

interface ProductsButtonProps {
	isAbsolute: boolean;
}
function ProductButtons({ isAbsolute }: ProductsButtonProps) {
	const { product } = useContext(productContext);
	return (
		<div
			class={` grid-cols-4 w-full delay-custom-1 hidden md:grid ${
				isAbsolute
					? "absolute bottom-0 right-0 left-0  md:translate-y-full md:group-hover:translate-y-0 "
					: ""
			}`}
		>
			<button
				class={`border border-gray-200 dark:border-gray-500  ${
					product.existProductInCart
						? "bg-primary text-white cursor-not-allowed "
						: "bg-background-light  dark:bg-paper-dark   dark:text-white hover:text-primary border border-gray-200 dark:border-gray-500"
				}  p-2 ${
					(product.producto.value as ProductsRestaurantSchemaFromServer)
						.ilimit ||
					(!(product.producto.value as ProductsRestaurantSchemaFromServer)
						.ilimit &&
						(product.producto.value as ProductsRestaurantSchemaFromServer)
							.stock! > 0)
						? ""
						: "cursor-not-allowed"
				}
				`}
				type="button"
				aria-label="cart"
				onClick={async () => {
					await product.handleInsertProduct(false);
				}}
				disabled={product.cartStoreMutation.isLoading || false}
			>
				{product.cartStoreMutation.isLoading ? (
					<LoaderSubmit />
				) : (
					<>
						<i class={enviroments.TYPE_CART} />
					</>
				)}
			</button>
			<button
				onClick={product.onFavorite}
				disabled={
					product.favoritesDestroyMutation.isLoading ||
					product.favoritesStoreMutation.isLoading ||
					false
				}
				class={`${
					product.producto.value.user?.isFavorite
						? "bg-primary text-white "
						: "bg-background-light  dark:bg-paper-dark dark:text-white  hover:text-primary "
				}  p-2 border border-gray-300   `}
				type="button"
				aria-label="favorite"
			>
				<i class="fas fa-heart" />
			</button>
			<a
				href={`/${product.producto.value.slug}`}
				class="bg-background-light dark:bg-paper-dark  dark:text-white border border-gray-200 dark:border-gray-500 p-2 hover:text-primary  flex justify-center items-center"
			>
				<i class="fas fa-eye " />
			</a>
			<button
				class="bg-background-light dark:bg-paper-dark  dark:text-white border border-gray-200 dark:border-gray-500 p-2 hover:text-primary "
				type="button"
				aria-label="view"
				onClick={() => {
					sweetModal({
						html: reactComponent(<ProductCardView product={product} />),
						sweetWidth: "950px",
						showCloseButton: true,
						position: useMediaQueryNoReactive("(min-width: 900px)")
							? "center"
							: "start",
						isCloseInBackground: false,
					});
				}}
			>
				<i class="fas fa-external-link-alt " />
			</button>
		</div>
	);
}

export default ProductButtons;
