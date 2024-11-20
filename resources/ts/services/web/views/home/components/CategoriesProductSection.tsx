import ProductCard from "@/web/components/product";
import type { HomePageProps } from "../HomePage";
import TitleSection from "@/web/components/TitleSection";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface CategoriesProductSectionProps {
    getProductsByCategories: HomePageProps["getproductsbycategories"];
}
function CategoriesProductSection({
    getProductsByCategories,
}: CategoriesProductSectionProps) {
    if (!getProductsByCategories.length) return null;
    const isEccomerce = storageEmpresa?.setting.type_card === "eccomerce";

    return (
        <section class="max-w-6xl mx-auto  px-4 flex flex-col gap-4  my-4 md:my-8  categories-products-section">
            <TitleSection>Nuestros Productos</TitleSection>
            {getProductsByCategories.map((category) => (
                <div
                    key={category.id}
                    class="flex flex-col lg:flex-row gap-6  overflow-hidden"
                    data-aos={`${
                        storageEmpresa?.setting.isScrolling
                            ? storageEmpresa.setting.type_animation
                            : ""
                    } `}
                >
                    <div
                        class={`grid ${
                            isEccomerce
                                ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
                                : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                        }  w-full gap-2 lg:gap-6 `}
                    >
                        {!category.products.length ? null : (
                            <>
                                {category.products.map((product) => (
                                    <ProductCard
                                        product={product}
                                        key={product.id}
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
        </section>
    );
}

export default CategoriesProductSection;
