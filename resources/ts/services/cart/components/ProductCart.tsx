import useCartStore from "../stores/cart.store.ts";
import {
    printImagesProduct,
    printProductVariant,
} from "@/products/libs/helpers.ts";
import {
    calculatePorcentajeDiscount,
    formatMoney,
    subtotalIgv,
} from "../libs/helpers";
import type { CartProductSchema } from "../schemas/index.ts";
import { Fragment } from "preact/jsx-runtime";
import { NoImage } from "~/config/settings.ts";
import Hr from "@/web/components/Hr.tsx";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema.ts";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema.ts";
import { storageEmpresa } from "@/empresas/stores/empresa.store.ts";

interface ProductCartProps {
    product: CartProductSchema;
}
function ProductCart({ product }: ProductCartProps) {
    const { methods } = useCartStore();
    const discountCoupon = calculatePorcentajeDiscount(
        subtotalIgv(product),
        product.subtotal / product.quantity
    );
    const images500 = product.variant
        ? printImagesProduct(product.images, 500).filter((_, i) => {
              return product.variant?.images.some((img) => img === i + 1);
          })
        : printImagesProduct(product.images, 500);

    const isImagesLength = images500.length ? images500 : [NoImage()];

    return (
        <>
            <div class="flex gap-2 items-center justify-center h-[120px] w-full">
                <img
                    class={`min-w-[150px] max-w-[150px] h-[120px] ${
                        storageEmpresa?.setting.isCoverImage
                            ? "object-cover"
                            : "object-contain"
                    } ml-2 rounded-lg`}
                    width={200}
                    height={200}
                    src={isImagesLength[0]}
                    alt={product.name}
                />

                <div class="flex flex-col justify-between w-full gap-1">
                    <div class="flex justify-between w-full">
                        <a
                            href={`/${product.slug}`}
                            class=" dark:text-paper-light font-bold line-clamp-2  text-sm "
                        >
                            {product.name}
                        </a>
                        <button
                            class="mr-2"
                            type="button"
                            onClick={() =>
                                methods.onRemoveProductToCart(
                                    product.id,
                                    product.variant ? product.variant.id : null
                                )
                            }
                        >
                            <i class="fas fa-trash text-primary dark:text-white" />
                        </button>
                    </div>

                    {product.variant?.sku ? (
                        <span class="text-xs text-terciary">
                            {product.variant.sku}
                        </span>
                    ) : null}

                    <div class="flex gap-3 items-center justify-between">
                        {!product.enabled ||
                        (!(product as ProductsRestaurantSchemaFromServer)
                            .ilimit &&
                            (product as ProductsRestaurantSchemaFromServer)
                                ?.stock! < 1) ||
                        (!product.variant?.ilimit &&
                            product.variant?.stock! < 1) ? (
                            <span class="dark:text-secondary-light  text-sm text-center">
                                Este producto está agotado
                            </span>
                        ) : (
                            <>
                                <div class="flex flex-col gap-1">
                                    {product.variant ? (
                                        <>
                                            {product.variant?.ilimit ? (
                                                <span class="text-xs  dark:text-white whitespace-nowrap ">
                                                    En Stock
                                                </span>
                                            ) : (
                                                <span class="text-sm  text-primary dark:text-white whitespace-nowrap">
                                                    {product.variant?.stock ===
                                                    1
                                                        ? "1 unidad "
                                                        : `${product.variant?.stock} unidades`}
                                                </span>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {(
                                                product as ProductsRestaurantSchemaFromServer
                                            ).ilimit ? (
                                                <span class="text-xs  dark:text-white  whitespace-nowrap ">
                                                    En Stock
                                                </span>
                                            ) : (
                                                <span class="text-sm  text-primary dark:text-white whitespace-nowrap">
                                                    {(
                                                        product as ProductsRestaurantSchemaFromServer
                                                    ).stock === 1
                                                        ? "1 unidad "
                                                        : `${
                                                              (
                                                                  product as ProductsRestaurantSchemaFromServer
                                                              ).stock
                                                          } unidades`}
                                                </span>
                                            )}
                                        </>
                                    )}

                                    <span class="text-xs  dark:text-paper-light">
                                        {product.discount > 0 ? (
                                            <> +{product.discount}% de desc. </>
                                        ) : null}
                                        {discountCoupon > 0
                                            ? `+${discountCoupon}% cupón`
                                            : null}
                                    </span>
                                    <span class="text-sm dark:text-secondary-light font-bold ">
                                        {formatMoney(product.subtotal)}
                                    </span>
                                </div>
                                <div>
                                    {product.variant ? (
                                        <div class="flex gap-2 items-center mb-2 max-w-[170px] md:max-w-[120px] overflow-auto py-1">
                                            {printProductVariant(
                                                product as ProductsNormalSchemaFromServer,
                                                product.variant
                                            ).map((opt) => (
                                                <div key={opt?.id}>
                                                    <div class="flex gap-1">
                                                        {opt?.features
                                                            .filter(
                                                                (val) =>
                                                                    val.option_id !==
                                                                    1
                                                            )
                                                            .map((feature) => (
                                                                <Fragment
                                                                    key={
                                                                        feature?.id
                                                                    }
                                                                >
                                                                    {opt.type ===
                                                                    1 ? (
                                                                        <div class="text-center min-w-[50px] px-2 py-1 rounded-md justify-center  bg-white dark:bg-admin-terciary dark:text-white text-xs font-bold flex items-center gap-2 shadow">
                                                                            {
                                                                                feature?.value
                                                                            }
                                                                        </div>
                                                                    ) : (
                                                                        <div
                                                                            class="relative w-[30px] h-[30px] rounded-full shadow  flex justify-center items-center group"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    feature?.value,
                                                                            }}
                                                                        >
                                                                            <span class="absolute -bottom-2 left-2 z-10 dark:bg-admin-background-dark shadow dark:text-white bg-white text-[10px] px-2 rounded-md py-1 hidden group-hover:block">
                                                                                {
                                                                                    feature?.description
                                                                                }
                                                                            </span>
                                                                        </div>
                                                                    )}
                                                                </Fragment>
                                                            ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}

                                    <div class="flex gap-3 items-center justify-between mr-2  overflow-hidden">
                                        <button
                                            aria-label="to increment to cart"
                                            type="button"
                                            class="w-[25px] h-[25px] dark:bg-white bg-primary dark:text-black text-white font-bold text-xl hover:bg-opacity-80 rounded-md shadow"
                                            onClick={() =>
                                                methods.onIncrementProductToCart(
                                                    product
                                                )
                                            }
                                        >
                                            +
                                        </button>
                                        <span class="font-bold dark:text-white  w-[10px] flex justify-center items-center">
                                            {product.quantity}
                                        </span>
                                        <button
                                            onClick={() =>
                                                methods.onDecrementProductToCart(
                                                    product
                                                )
                                            }
                                            aria-label="to decrement to cart"
                                            type="button"
                                            class="w-[25px] h-[25px] dark:bg-white bg-primary dark:text-black text-white font-bold text-xl hover:bg-opacity-80 rounded-md shadow"
                                        >
                                            -
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <Hr />
        </>
    );
}

export default ProductCart;
