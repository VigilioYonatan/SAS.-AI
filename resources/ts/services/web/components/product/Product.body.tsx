import { useContext } from "preact/hooks";
import { removeTextHTML } from "~/libs/helpers";
import { productContext } from "./Product";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { Rating } from "react-custom-rating-component";
import enviroments from "~/config";

interface ProductBodyProps {
    showDescription: boolean;
    isShowQuantity?: boolean;
    isShowRating?: boolean;
}
function ProductBody({
    showDescription,
    isShowQuantity = true,
    isShowRating = true,
}: ProductBodyProps) {
    const { product } = useContext(productContext);

    return (
        <div class="flex flex-col gap-2 px-2   w-full justify-center items-center  mt-1">
            <style jsx>{`
                .slick-slide > div {
                    margin-inline: 4px;
                    outline: none;
                }
            `}</style>

            <div class="flex flex-col justify-center items-center gap-1">
                {isShowQuantity ? (
                    <span
                        class={`${
                            storageEmpresa?.tipo_empresa.tipo_servicio_id === 2
                                ? (
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
                                      ).stock! > 0)
                                    ? "text-primary"
                                    : "text-danger"
                                : ""
                        } ${
                            [1, 3].includes(
                                storageEmpresa!.tipo_empresa.tipo_servicio_id
                            )
                                ? (!product.varianteChoose!.ilimit &&
                                      product.varianteChoose!.stock! > 0) ||
                                  product.varianteChoose!.ilimit
                                    ? "text-primary"
                                    : "text-danger"
                                : ""
                        }  font-bold  py-1 rounded-md uppercase text-xs flex  items-center gap-2`}
                    >
                        {storageEmpresa!.tipo_empresa.tipo_servicio_id === 2 ? (
                            <>
                                {(
                                    product.producto
                                        .value as ProductsRestaurantSchemaFromServer
                                ).ilimit
                                    ? storageEmpresa!.tipo_empresa
                                          .tipo_servicio_id === 2
                                        ? "Cantidad Ilimitada"
                                        : "En stock"
                                    : `${
                                          (
                                              product.producto
                                                  .value as ProductsRestaurantSchemaFromServer
                                          ).stock
                                      } unidades`}
                            </>
                        ) : null}
                        {[1, 3].includes(
                            storageEmpresa!.tipo_empresa.tipo_servicio_id
                        ) ? (
                            <>
                                {product.varianteChoose!.ilimit
                                    ? storageEmpresa!.tipo_empresa
                                          .tipo_servicio_id === 2
                                        ? "Cantidad Ilimitada"
                                        : "En stock"
                                    : `${
                                          product.varianteChoose!.stock! > 0
                                              ? `${
                                                    product.varianteChoose!
                                                        .stock
                                                } unidades`
                                              : "No disponible"
                                      } `}
                            </>
                        ) : null}
                    </span>
                ) : null}

                <a
                    href={`/${product.producto.value.slug}`}
                    aria-label={product.producto.value.name}
                    class="line-clamp-2 h-[40px] md:h-[46px]  text-sm   md:text-base font-semibold dark:text-white hover:text-primary dark:hover:text-primary delay-custom-1  text-center "
                >
                    {product.producto.value.name}
                </a>
                {isShowRating ? (
                    <Rating
                        defaultValue={product.producto.value.rating.promedio}
                        shape={enviroments.TYPE_START}
                        size="20px"
                        spacing="5px"
                        readOnly
                        activeColor="var(--primary)"
                    />
                ) : null}
            </div>
            {showDescription && product.producto.value.description ? (
                <p class="text-gray-500 dark:text-gray-300 font-semibold  line-clamp-3  h-[80px]  w-full text-sm">
                    {removeTextHTML(product.producto.value.description)}
                </p>
            ) : null}
        </div>
    );
}

export default ProductBody;
