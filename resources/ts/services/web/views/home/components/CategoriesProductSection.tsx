import ProductCard from "@/web/components/product";
import type { HomePageProps } from "../HomePage";
import TitleSection from "@/web/components/TitleSection";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { printFileWithDimension } from "~/libs/upload";
import useMediaQuery from "~/hooks/useMediaQuery";

interface CategoriesProductSectionProps {
    getProductsByCategories: HomePageProps["getproductsbycategories"];
}
function CategoriesProductSection({
    getProductsByCategories,
}: CategoriesProductSectionProps) {
    if (!storageEmpresa?.setting.isEccomerce) return null;
    if (!getProductsByCategories.length) return null;
    const isEccomerce = storageEmpresa?.setting.type_card === "eccomerce";

    return (
        <section
            class="categories-products-section max-w-6xl mx-auto  px-4 flex flex-col gap-4   py-4 md:py-8  "
            data-aos={`${
                storageEmpresa?.setting.isScrolling
                    ? storageEmpresa.setting.type_animation
                    : ""
            } `}
        >
            <TitleSection>Nuestros Productos</TitleSection>
            {getProductsByCategories.map((category, i) => (
                <div
                    key={category.id}
                    class={`product-${category.slug} flex lg:flex-row gap-6  overflow-hidden  `}
                    data-aos={`${
                        storageEmpresa?.setting.isScrolling
                            ? storageEmpresa.setting.type_animation
                            : ""
                    } `}
                >
                    {category.wallpaper &&
                    storageEmpresa?.setting.isProductWallpaper &&
                    useMediaQuery("(min-width: 1024px)") ? (
                        <a
                            href={`/shop/${category.slug}`}
                            class={`lg:h-[700px] overflow-hidden group ${
                                storageEmpresa?.setting.type_border === "square"
                                    ? ""
                                    : "rounded-md"
                            } `}
                            style={{
                                order: i % 2 === 0 ? 0 : 1,
                            }}
                        >
                            <img
                                class="w-[150px] object-cover lg:w-[300px] h-full  group-hover:scale-105 delay-custom-1"
                                width={300}
                                height={1200}
                                loading="lazy"
                                src={
                                    printFileWithDimension(
                                        category.wallpaper,
                                        1200
                                    )[0]
                                }
                                alt={category.name}
                                title={category.name}
                            />
                        </a>
                    ) : null}
                    <div
                        class={`grid ${
                            isEccomerce
                                ? `grid-cols-2 ${
                                      storageEmpresa?.setting.isProductWallpaper
                                          ? "md:grid-cols-3 lg:grid-cols-4"
                                          : "md:grid-cols-4 lg:grid-cols-5"
                                  } `
                                : `grid-cols-2 ${
                                      storageEmpresa?.setting.isProductWallpaper
                                          ? "md:grid-cols-2 lg:grid-cols-3"
                                          : "md:grid-cols-3 lg:grid-cols-4"
                                  }`
                        }  w-full gap-4 lg:gap-6 `}
                    >
                        {!category.products.length ? null : (
                            <>
                                {category.wallpaper &&
                                storageEmpresa?.setting.isProductWallpaper &&
                                useMediaQuery("(max-width: 1024px)") ? (
                                    <a
                                        href={`/shop/${category.slug}`}
                                        class="overflow-hidden group"
                                    >
                                        <img
                                            class="w-full h-[400px] object-cover md:object-contain lg:w-[300px] lg:h-[700px] group-hover:scale-105 delay-custom-1"
                                            width={300}
                                            height={1200}
                                            src={
                                                printFileWithDimension(
                                                    category.wallpaper,
                                                    1200
                                                )[0]
                                            }
                                            alt={category.name}
                                            title={category.name}
                                            loading="lazy"
                                        />
                                    </a>
                                ) : null}

                                {category.products.map((product, i) => (
                                    <ProductCard
                                        product={product}
                                        key={product.id}
                                        className={`${
                                            category.products.length % 2 === 0
                                                ? ""
                                                : ` ${
                                                      i + 1 ===
                                                      category.products.length
                                                          ? "last-child "
                                                          : ""
                                                  }`
                                        }`}
                                    >
                                        <ProductCard.header>
                                            <ProductCard.buttons isAbsolute />
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
            <a
                href="/shop"
                class="bg-primary p-[0.5rem_1rem] py-[0.8rem] text-[0.9rem] rounded-md border-2 border-primary hover:bg-white self-center mt-4  hover:!text-primary   font-semibold"
            >
                Ver Todos los Productos
            </a>
        </section>
    );
}

export default CategoriesProductSection;
