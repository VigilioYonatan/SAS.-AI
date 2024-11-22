import { useContext } from "preact/hooks";
import LoaderSubmit from "~/components/LoaderSubmit";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { useMediaQueryNoReactive } from "~/hooks/useMediaQuery";
import { productContext } from "./Product";
import ProductCardView from "./ProductView";
import enviroments from "~/config";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { isColorLight } from "~/libs/helpers";
import useEmpresastore from "@/empresas/stores/empresa.store";

interface ProductsButtonProps {
    isAbsolute: boolean;
}
function ProductButtons2({ isAbsolute }: ProductsButtonProps) {
    const { product } = useContext(productContext);
    const empresaStore = useEmpresastore();
    return (
        <div
            class={` grid-cols-1 w-[40px] gap-1  delay-custom-1 hidden md:grid ${
                isAbsolute
                    ? "absolute top-2  left-2 flex flex-col scale-x-0 group-hover:scale-x-100"
                    : ""
            }`}
        >
            <button
                class={`border border-gray-200 rounded-md dark:border-gray-500  ${
                    product.existProductInCart
                        ? "bg-primary text-white cursor-not-allowed "
                        : `bg-background-light hover:bg-primary ${
                              isColorLight(empresaStore.state!.setting.bg_color)
                                  ? "hover:text-black"
                                  : "hover:!text-white "
                          }   dark:bg-paper-dark   dark:text-white  border border-gray-200 rounded-md dark:border-gray-500`
                }  p-2 ${
                    (!(
                        product.producto
                            .value as ProductsRestaurantSchemaFromServer
                    )?.ilimit &&
                        (
                            product.producto
                                .value as ProductsRestaurantSchemaFromServer
                        )?.stock! < 1) ||
                    (!product.varianteChoose?.ilimit &&
                        product.varianteChoose?.stock! < 1)
                        ? "cursor-not-allowed"
                        : ""
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
                        : "bg-background-light rounded-md dark:bg-paper-dark dark:text-white   "
                }  p-2 border hover:bg-primary ${
                    isColorLight(empresaStore.state!.setting.bg_color)
                        ? "hover:text-black"
                        : "hover:!text-white "
                }  border-gray-200   `}
                type="button"
                aria-label="favorite"
            >
                <i class="fas fa-heart" />
            </button>
            <a
                href={`/${product.producto.value.slug}`}
                class={`bg-background-light dark:bg-paper-dark  dark:text-white border border-gray-200 rounded-md dark:border-gray-500 p-2   flex justify-center items-center hover:bg-primary ${
                    isColorLight(empresaStore.state!.setting.bg_color)
                        ? "hover:text-black"
                        : " hover:!text-white"
                } `}
            >
                <i class="fas fa-eye " />
            </a>
            <button
                class={`bg-background-light dark:bg-paper-dark  dark:text-white border border-gray-200 rounded-md dark:border-gray-500 p-2 hover:bg-primary ${
                    isColorLight(empresaStore.state!.setting.bg_color)
                        ? "hover:text-black"
                        : "hover:!text-white "
                } `}
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
                <i class="fas fa-external-link-alt " />
            </button>
        </div>
    );
}

export default ProductButtons2;
