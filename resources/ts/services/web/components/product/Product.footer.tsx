import { useContext } from "preact/hooks";
import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import LoaderSubmit from "~/components/LoaderSubmit";
import useThemeStore from "~/stores/theme.store";
import { productContext } from "./Product";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { isColorLight } from "~/libs/helpers";
interface ProductFooterProps {
    showButtonCart?: boolean;
    className?: string;
}
function ProductFooter({
    showButtonCart = false,
    className = "",
}: ProductFooterProps) {
    const { product } = useContext(productContext);

    const isEccomerce = storageEmpresa?.setting.type_card === "eccomerce";
    return (
        <div
            class={`flex gap-2 items-center  w-full pt-2 flex-col ${className} relative h-[100px]`}
        >
            <div class="flex gap-1  text-sm  items-center flex-col justify-center w-full">
                {product.producto.value.discount > 0 ? (
                    <span class="text-gray-400 line-through   font-semibold   text-xs  text-center  h-[15px]">
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
                <>
                    {(storageEmpresa?.tipo_empresa.tipo_servicio_id === 2 &&
                        (
                            product.producto
                                .value as ProductsRestaurantSchemaFromServer
                        ).ilimit) ||
                    (!(
                        product.producto
                            .value as ProductsRestaurantSchemaFromServer
                    ).ilimit &&
                        (
                            product.producto
                                .value as ProductsRestaurantSchemaFromServer
                        ).stock! > 0) ||
                    ((product.producto.value as ProductsNormalSchemaFromServer)
                        .variants &&
                        ((!product.varianteChoose!.ilimit &&
                            product.varianteChoose!.stock! > 0) ||
                            product.varianteChoose!.ilimit)) ? (
                        <button
                            type="button"
                            aria-label="cart"
                            className={`
                                ${
                                    isEccomerce
                                        ? `  px-6 py-2 rounded-md  ${
                                              product.existProductInCart
                                                  ? " text-white"
                                                  : ""
                                          }`
                                        : `   py-2 md:py-3   px-4 md:text-sm ${
                                              product.existProductInCart
                                                  ? " text-white"
                                                  : ""
                                          }`
                                }      
                              font-bold uppercase  tracking-widest text-sm  text-center ${
                                  isEccomerce ? "px-3" : "w-full"
                              }  flex justify-center items-center absolute bottom-0
                              ${
                                  storageEmpresa?.setting.bg_color_button ===
                                  "transparent"
                                      ? ""
                                      : "shadow"
                              }
                              `}
                            style={{
                                backgroundColor: product.existProductInCart
                                    ? "black"
                                    : storageEmpresa?.setting.bg_color_button,
                                color: isColorLight(
                                    storageEmpresa!.setting.bg_color_button
                                        ? storageEmpresa!.setting
                                              .bg_color_button
                                        : "black"
                                )
                                    ? "#000"
                                    : "#fff",
                            }}
                            disabled={
                                product.cartStoreMutation.isLoading || false
                            }
                            onClick={async () => {
                                await product.handleInsertProduct(false);
                            }}
                        >
                            <>
                                {product.existProductInCart ? (
                                    <span>
                                        {!isEccomerce ? (
                                            <i
                                                className={`${storageEmpresa?.setting.type_cart} mr-2 text-md`}
                                            />
                                        ) : null}
                                        Añadido
                                    </span>
                                ) : (
                                    <>
                                        {product.cartStoreMutation.isLoading ? (
                                            <LoaderSubmit
                                                color={
                                                    useThemeStore().state ===
                                                    "dark"
                                                        ? "#fff"
                                                        : "var(--primary)"
                                                }
                                            />
                                        ) : (
                                            <span>
                                                {!isEccomerce ? (
                                                    <i
                                                        className={`${storageEmpresa?.setting.type_cart} mr-2 text-md`}
                                                    />
                                                ) : null}
                                                Agregar
                                            </span>
                                        )}
                                    </>
                                )}
                            </>
                        </button>
                    ) : (
                        <span class=" font-bold uppercase py-3 px-4 tracking-widest text-sm text-center w-full  dark:text-white absolute bottom-0">
                            Agotado
                        </span>
                    )}
                </>
            ) : null}
        </div>
    );
}

export default ProductFooter;
