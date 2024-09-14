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
    if (!productsoffert8mapped) return null;
    if (!productlatestmapped) return null;
    if (!productlatestmapped) return null;
    return (
        <section
            class="max-w-6xl mx-auto px-4  flex flex-col gap-4"
            data-aos={`${
                storageEmpresa?.setting.isScrolling ? "fade-up" : ""
            } `}
        >
            <TitleSection>Nuestros Ultimas ofertas</TitleSection>{" "}
            <div class=" flex flex-col sm:flex-row gap-4 ">
                <div>
                    {productlatestmapped ? (
                        <ProductCard product={productlatestmapped}>
                            <ProductCard.header className="[&>img]:w-full [&>img]:h-[300px!important] [&>img]:object-cover">
                                <ProductCard.buttons isAbsolute />
                            </ProductCard.header>
                            <ProductCard.body showDescription={false} />
                            <ProductCard.footer showButtonCart />
                        </ProductCard>
                    ) : null}
                </div>
                <div class="w-full grid grid-cols-2 lg:grid-cols-3 gap-4">
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
                {/* <ProductCardAdmin product={} /> */}
            </div>
        </section>
    );
}

export default OfferSection;
