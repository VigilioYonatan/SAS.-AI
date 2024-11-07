import { subtotalIgv } from "@/cart/libs/helpers";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { printImagesProduct } from "@/products/libs/helpers";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { formatMoney } from "@vigilio/express-core/helpers";
import enviroments from "~/config";

interface ProductsSectionRandomProps {
    productlatestmapped:
        | (ProductsNormalSchemaFromServer | ProductsRestaurantSchemaFromServer)
        | null;
    productmostdiscountmapped:
        | (ProductsNormalSchemaFromServer | ProductsRestaurantSchemaFromServer)
        | null;
}
function ProductsSectionRandom({
    productlatestmapped,
    productmostdiscountmapped,
}: ProductsSectionRandomProps) {
    return (
        <section
            data-aos={`${
                storageEmpresa?.setting.isScrolling ? "fade-up" : ""
            } `}
            class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 px-4 my-12  "
        >
            {productlatestmapped ? (
                <div
                    class={` bg-background-light dark:bg-background-dark p-4 md:p-6 group overflow-hidden shadow ${
                        enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
                    } `}
                >
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 group-hover:scale-105 delay-custom-1">
                        <div class="flex flex-col gap-4 ">
                            <span class="bg-primary text-xs text-white self-start px-2 py-1 rounded-sm font-semibold">
                                Nuevo
                            </span>
                            {(
                                productlatestmapped as ProductsNormalSchemaFromServer
                            )?.brand?.image ? (
                                <img
                                    src={
                                        printImagesProduct(
                                            (
                                                productlatestmapped as ProductsNormalSchemaFromServer
                                            ).brand.image,
                                            100
                                        )[0]
                                    }
                                    class="h-[30px] w-[30px] object-contain"
                                    width={100}
                                    height={100}
                                    alt={
                                        (
                                            productlatestmapped as ProductsNormalSchemaFromServer
                                        ).brand.name
                                    }
                                />
                            ) : null}
                            <span class="font-bold dark:text-gray-400 tracking-widest">
                                {productlatestmapped.name}
                            </span>
                        </div>
                        <div class="flex justify-center items-center">
                            <img
                                src={
                                    printImagesProduct(
                                        productlatestmapped.images,
                                        500
                                    )[0]
                                }
                                class="w-[300px] h-[200px] object-contain"
                                width={500}
                                height={500}
                                alt={productlatestmapped.name}
                            />
                        </div>
                    </div>
                </div>
            ) : null}
            {productmostdiscountmapped ? (
                <div
                    class={`group bg-background-light shadow dark:bg-background-dark p-4 md:p-6 ${
                        enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
                    }`}
                >
                    <div class="flex gap-6 items-center group-hover:scale-105 delay-custom-1">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="flex flex-col gap-2">
                                <span class="font-bold dark:text-gray-400 tracking-widest line-clamp-2 text-2xl">
                                    {productmostdiscountmapped.name}
                                </span>
                                <span class="font-bold text-2xl  tracking-widest text-primary">
                                    {formatMoney(
                                        subtotalIgv(productmostdiscountmapped)
                                    )}
                                </span>
                            </div>
                            <div class="flex justify-center items-center">
                                <img
                                    src={
                                        printImagesProduct(
                                            productmostdiscountmapped.images,
                                            500
                                        )[0]
                                    }
                                    class="w-[300px] h-[200px] object-contain"
                                    width={500}
                                    height={500}
                                    alt={productmostdiscountmapped.name}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
        </section>
    );
}

export default ProductsSectionRandom;
