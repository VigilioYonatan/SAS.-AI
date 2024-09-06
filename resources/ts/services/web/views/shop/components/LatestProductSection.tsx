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
	return (
		<section class="max-w-6xl mx-auto my-6 px-2">
			<TitleSection>Nuestros ultimos productos agregados</TitleSection>
			<div class="grid gap-4 grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 justify-center items-center">
				{ultimosproducto.map((product) => (
					<ProductCard key={product.id} product={product}>
						<ProductCard.header />
						<ProductCard.body showDescription={false} />
						<ProductCard.footer />
					</ProductCard>
				))}
			</div>
		</section>
	);
}

export default LatestProductSection;
