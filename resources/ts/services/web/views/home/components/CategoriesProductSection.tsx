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
	if (!getProductsByCategories.length) return null;
	const isEccomerce = storageEmpresa?.setting.type_card === "eccomerce";

	return (
		<section
			class="max-w-6xl mx-auto  px-4 flex flex-col gap-4  my-4 md:my-8  categories-products-section"
			data-aos={`${
				storageEmpresa?.setting.isScrolling
					? storageEmpresa.setting.type_animation
					: ""
			} `}
		>
			<TitleSection>Nuestros Productos</TitleSection>
			{getProductsByCategories.map((category) => (
				<div
					key={category.id}
					class="flex lg:flex-row gap-6  overflow-hidden"
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
						>
							<img
								class="w-[150px] object-cover lg:w-[300px] h-full  group-hover:scale-105 delay-custom-1"
								width={300}
								height={1200}
								src={printFileWithDimension(category.wallpaper, 1200)[0]}
								alt=""
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
						}  w-full gap-2 lg:gap-6 `}
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
											class="w-full h-[400px] object-contain lg:w-[300px] lg:h-[700px] group-hover:scale-105 delay-custom-1"
											width={300}
											height={1200}
											src={printFileWithDimension(category.wallpaper, 1200)[0]}
											alt=""
										/>
									</a>
								) : null}

								{category.products.map((product) => (
									<ProductCard product={product} key={product.id}>
										<ProductCard.header>
											<ProductCard.buttons isAbsolute />
										</ProductCard.header>
										<ProductCard.body showDescription={false} />
										<ProductCard.footer showButtonCart={true} />
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
