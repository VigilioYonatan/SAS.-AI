import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import ProductCard from "@/web/components/product";
import TitleSection from "@/web/components/TitleSection";

interface ProductsRatingsSectionProps {
	productsratingsmapped:
		| ProductsNormalSchemaFromServer[]
		| ProductsRestaurantSchemaFromServer[];
}
function ProductsRatingsSection({
	productsratingsmapped,
}: ProductsRatingsSectionProps) {
	return (
		<section class="max-w-6xl mx-auto my-12 px-2">
			<TitleSection>Nuestros clientes prefieren</TitleSection>
			<div class="grid gap-4 grid-cols-2 sm:grid-cols-4 xl:grid-cols-5 justify-center items-center">
				{productsratingsmapped.map((product) => (
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

export default ProductsRatingsSection;
