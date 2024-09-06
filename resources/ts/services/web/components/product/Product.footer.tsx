import { useContext } from "preact/hooks";
import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import LoaderSubmit from "~/components/LoaderSubmit";
import useThemeStore from "~/stores/theme.store";
import { productContext } from "./Product";
interface ProductFooterProps {
    showButtonCart?: boolean;
}
function ProductFooter({ showButtonCart }: ProductFooterProps) {
    const { product } = useContext(productContext);

    return (
        <div class="flex gap-4 items-center justify-between w-full">
            <div class="flex gap-4 justify-between">
                <div class="flex gap-2  text-sm md:text-base items-center">
                    {product.producto.value.discount > 0 ? (
                        <span class="text-gray-400 line-through  font-semibold  self-end  text-xs  ">
                            {formatMoney(
                                subtotalIgv(product.producto.value, false)
                            )}
                        </span>
                    ) : null}

                    <p class="text-primary dark:text-white text-lg font-bold  self-end leading-tight">
                        {formatMoney(subtotalIgv(product.producto.value))}
                    </p>
                </div>
            </div>

            {showButtonCart ? (
                <button
                    type="button"
                    aria-label="cart"
                    class={`${
                        product.existProductInCart ? "bg-black" : "bg-primary"
                    } text-white font-bold uppercase py-3 px-4 tracking-widest text-sm text-center`}
                    disabled={product.cartStoreMutation.isLoading || false}
                    onClick={async () => {
                        await product.handleInsertProduct(false);
                    }}
                >
                    <>
                        {product.existProductInCart ? (
                            "Añadido"
                        ) : (
                            <>
                                {product.cartStoreMutation.isLoading ? (
                                    <LoaderSubmit
                                        color={
                                            useThemeStore().state === "dark"
                                                ? "#fff"
                                                : "var(--primary)"
                                        }
                                    />
                                ) : (
                                    "Agregar carrito"
                                )}
                            </>
                        )}
                    </>
                </button>
            ) : null}
        </div>
    );
}

export default ProductFooter;
