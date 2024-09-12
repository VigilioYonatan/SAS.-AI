import { useContext } from "preact/hooks";
import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import LoaderSubmit from "~/components/LoaderSubmit";
import useThemeStore from "~/stores/theme.store";
import { productContext } from "./Product";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
interface ProductFooterProps {
    showButtonCart?: boolean;
}
function ProductFooter({ showButtonCart = false }: ProductFooterProps) {
    const { product } = useContext(productContext);

    return (
        <div class="flex gap-2 items-center  w-full pt-2 flex-col">
            <div class="flex gap-1  text-sm  items-center flex-col justify-center w-full">
                {product.producto.value.discount > 0 ? (
                    <span class="text-gray-400 line-through  font-semibold   text-xs  text-center">
                        {formatMoney(
                            subtotalIgv(product.producto.value, false)
                        )}
                    </span>
                ) : null}

                <p class="text-primary dark:text-white text-lg font-bold   leading-tight">
                    {formatMoney(subtotalIgv(product.producto.value))}
                </p>
            </div>
            {showButtonCart ? (
                <button
                    type="button"
                    aria-label="cart"
                    class={`${
                        product.existProductInCart ? "bg-black" : "bg-primary"
                    } text-white font-bold uppercase py-3 px-4 tracking-widest text-sm text-center w-full`}
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
                                    <span>
                                        <i
                                            class={`${storageEmpresa?.setting.type_cart} mr-2 text-md`}
                                        />
                                        Agregar carrito
                                    </span>
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
