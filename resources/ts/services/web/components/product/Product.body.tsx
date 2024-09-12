import { useContext } from "preact/hooks";
import { removeTextHTML } from "~/libs/helpers";
import { productContext } from "./Product";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";

interface ProductBodyProps {
    showDescription: boolean;
}
function ProductBody({ showDescription }: ProductBodyProps) {
    const { product } = useContext(productContext);

    return (
        <div class="flex flex-col gap-2 px-2 pt-2  w-full justify-center items-center">
            <style jsx>{`
                .slick-slide > div {
                    margin-inline: 4px;
                    outline: none;
                }
            `}</style>

            <div class="flex flex-col justify-center items-center">
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
                        storageEmpresa!.tipo_empresa.tipo_servicio_id === 1
                            ? (!product.varianteChoose!.ilimit &&
                                  product.varianteChoose!.stock! < 0) ||
                              !product.producto.value.enabled
                                ? "text-primary"
                                : "text-danger"
                            : ""
                    }  font-bold  py-1 rounded-md uppercase text-xs flex items-center gap-2`}
                >
                    {storageEmpresa!.tipo_empresa.tipo_servicio_id === 2 ? (
                        <>
                            {(
                                product.producto
                                    .value as ProductsRestaurantSchemaFromServer
                            ).ilimit
                                ? "En stock"
                                : `${
                                      (
                                          product.producto
                                              .value as ProductsRestaurantSchemaFromServer
                                      ).stock
                                  } unidades`}
                        </>
                    ) : null}
                    {storageEmpresa!.tipo_empresa.tipo_servicio_id === 1 ? (
                        <>
                            {product.varianteChoose!.ilimit
                                ? "En stock"
                                : `${
                                      product.varianteChoose!.stock! > 0
                                          ? `${
                                                product.varianteChoose!.stock
                                            } unidades`
                                          : "Agotado"
                                  } `}
                        </>
                    ) : null}
                </span>{" "}
                <a
                    href={`/${product.producto.value.slug}`}
                    class="line-clamp-2 text-sm h-[45px]  md:text-base font-semibold dark:text-white hover:text-primary dark:hover:text-primary delay-custom-1  text-center"
                >
                    {product.producto.value.name}
                </a>
            </div>

            {showDescription && product.producto.value.description ? (
                <p class="text-gray-400   line-clamp-3  h-[70px]  w-full">
                    {removeTextHTML(product.producto.value.description)}
                </p>
            ) : null}
        </div>
    );
}

export default ProductBody;
