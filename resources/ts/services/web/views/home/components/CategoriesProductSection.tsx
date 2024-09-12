import { printFileWithDimension } from "~/libs/upload";
import ProductCard from "@/web/components/product";
import enviroments from "~/config";
import type { HomePageProps } from "../HomePage";

interface CategoriesProductSectionProps {
    getProductsByCategories: HomePageProps["getproductsbycategories"];
}
function CategoriesProductSection({
    getProductsByCategories,
}: CategoriesProductSectionProps) {
    if (!getProductsByCategories.length) return null;
    return (
        <section class="max-w-6xl mx-auto  px-4 flex flex-col gap-8 my-12">
            {getProductsByCategories.map((category, i) => (
                <div
                    key={category.id}
                    class="flex flex-col lg:flex-row gap-4  overflow-hidden"
                >
                    <a
                        href={`/shop/${category.slug}`}
                        class={`h-[300px] lg:w-[300px] group lg:h-[500px] ${
                            enviroments.TYPE_BORDER === "square"
                                ? ""
                                : "rounded-md"
                        }  overflow-hidden relative ${
                            (i + 1) % 2 === 0 ? "lg:order-2" : ""
                        }`}
                    >
                        {category.image ? (
                            <img
                                src={
                                    printFileWithDimension(
                                        category.image,
                                        500
                                    )[0]
                                }
                                class="w-full h-full object-cover group-hover:scale-110 delay-custom-1"
                                width={500}
                                height={500}
                                alt={category.name}
                            />
                        ) : null}

                        <div class="absolute bottom-0 right-0 left-0 mb-2   flex flex-col gap-2">
                            <span class="uppercase text-center font-bold  text-white bg-black py-2 bg-opacity-60">
                                {category.name}
                            </span>
                        </div>
                    </a>
                    <div class="grid grid-cols-2 md:grid-cols-3 w-full gap-2 lg:gap-4 ">
                        {!category.products.length ? (
                            <span class="dark:text-white text-primary font-semibold text-lg">
                                No hay productos
                            </span>
                        ) : (
                            <>
                                {category.products.map((product) => (
                                    <ProductCard
                                        product={product}
                                        key={product.id}
                                    >
                                        <ProductCard.header>
                                            <ProductCard.buttons  isAbsolute />
                                        </ProductCard.header>
                                        <ProductCard.body
                                            showDescription={false}
                                        />
                                        <ProductCard.footer
                                            showButtonCart={true} 
                                        />
                                    </ProductCard>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            ))}
        </section>
    );
}

export default CategoriesProductSection;
