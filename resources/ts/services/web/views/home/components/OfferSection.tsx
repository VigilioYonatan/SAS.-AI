import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import ProductCard from "@/web/components/product";
import TitleSection from "@/web/components/TitleSection";

interface OfferSectionProps {
    productsoffert8mapped:
        | ProductsNormalSchemaFromServer[]
        | ProductsRestaurantSchemaFromServer[];
    productlatestmapped:
        | ProductsNormalSchemaFromServer
        | ProductsRestaurantSchemaFromServer
        | null;
}
function OfferSection({
    productsoffert8mapped,
    productlatestmapped,
}: OfferSectionProps) {
    if (!storageEmpresa?.setting.isEccomerce) return null;
    if (!productsoffert8mapped) return null;
    if (!productlatestmapped) return null;
    if (!productlatestmapped) return null;
    const isEccomerce = storageEmpresa?.setting.type_card === "eccomerce";
    return (
        <section
            class={`offer-section max-w-6xl mx-auto px-4  flex flex-col gap-4 py-4  md:py-8 ${
                storageEmpresa.setting.isScrolling ? "animation-box" : ""
            } `}
        >
            <TitleSection>Nuestros Ultimas ofertas</TitleSection>{" "}
            <div class=" flex flex-col sm:flex-row gap-4 ">
                <div class="min-w-[300px]">
                    {productlatestmapped ? (
                        <ProductCard product={productlatestmapped}>
                            <ProductCard.header className="[&>img]:w-full [&>img]:h-[300px!important] [&>img]:object-cover">
                                <ProductCard.buttons isAbsolute />
                            </ProductCard.header>
                            <div class="product__container">
                                <ProductCard.body showDescription={false} />
                                <ProductCard.footer showButtonCart />
                            </div>
                        </ProductCard>
                    ) : null}
                </div>
                {productsoffert8mapped.length ? (
                    <div
                        class={`w-full grid ${
                            isEccomerce
                                ? "grid-cols-2 lg:grid-cols-4"
                                : "grid-cols-2 lg:grid-cols-3"
                        }  gap-4`}
                    >
                        {productsoffert8mapped.map((product) => (
                            <ProductCard product={product} key={product.id}>
                                <ProductCard.header>
                                    <ProductCard.buttons isAbsolute />
                                </ProductCard.header>
                                <ProductCard.body showDescription={false} />
                                <ProductCard.footer showButtonCart />
                            </ProductCard>
                        ))}
                    </div>
                ) : null}

                {/* <ProductCardAdmin product={} /> */}
            </div>
        </section>
    );
}

export default OfferSection;
