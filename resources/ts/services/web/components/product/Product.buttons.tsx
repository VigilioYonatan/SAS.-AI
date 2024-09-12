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
            class={`grid grid-cols-2 w-full delay-custom-1 ${
                isAbsolute
                    ? "absolute bottom-0 right-0 left-0 gap-1 md:translate-y-full md:group-hover:translate-y-0 "
                    : ""
            }`}
        >
            <button
                class={`border border-gray-400  ${
                    product.existProductInCart
                        ? "bg-primary text-white cursor-not-allowed "
                        : "bg-background-light  dark:bg-paper-dark   dark:text-white hover:text-primary border border-gray-400"
                }  p-2 ${
                    (
                        product.producto
                            .value as ProductsRestaurantSchemaFromServer
                    ).ilimit ||
                    (!(
                        product.producto
                            .value as ProductsRestaurantSchemaFromServer
                    ).ilimit &&
                        (
                            product.producto
                                .value as ProductsRestaurantSchemaFromServer
                        ).stock! > 0 &&
                        product.producto.value.enabled)
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
                class="bg-background-light dark:bg-paper-dark  dark:text-white border border-gray-400 p-2 hover:text-primary "
                type="button"
                aria-label="view"
                onClick={() => {
                    sweetModal({
                        html: reactComponent(
                            <ProductCardView product={product} />
                        ),
                        sweetWidth: "950px",
                        showCloseButton: true,
                        position: useMediaQueryNoReactive("(min-width: 900px)")
                            ? "center"
                            : "start",
                        isCloseInBackground: false,
                        
                    });
                }}
            >
                <i class="far fa-external-link-alt " />
            </button>
        </div>
    );
}

export default ProductButtons;
