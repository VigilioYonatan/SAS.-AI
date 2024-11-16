import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import ProductCard from "@/web/components/product";
import TitleSection from "@/web/components/TitleSection";

interface LatestProductSectionProps {
    ultimosproducto:
        | ProductsNormalSchemaFromServer[]
        | ProductsRestaurantSchemaFromServer[];
}
function LatestProductSection({ ultimosproducto }: LatestProductSectionProps) {
    if (!ultimosproducto.length) return null;
    return (
        <section
            class="max-w-6xl mx-auto my-6 px-2  flex flex-col gap-4"
            data-aos={`${
                storageEmpresa?.setting.isScrolling ? "fade-up" : ""
            } `}
        >
            <TitleSection>Nuestros ultimos productos agregados</TitleSection>
            <div
                class={`grid gap-4  grid-cols-2 ${
                    storageEmpresa?.setting.type_card === "eccomerce"
                        ? "md:grid-cols-5"
                        : "md:grid-cols-4"
                }  justify-center items-center`}
            >
                {ultimosproducto.map((product) => (
                    <ProductCard key={product.id} product={product}>
                        <ProductCard.header />
                        <ProductCard.body showDescription={false} />
                        <ProductCard.footer showButtonCart />
                    </ProductCard>
                ))}
            </div>
        </section>
    );
}

export default LatestProductSection;
