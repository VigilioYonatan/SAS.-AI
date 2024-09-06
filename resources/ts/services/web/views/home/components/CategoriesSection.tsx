import type { CategoriesSchema } from "@/products/schemas/categories.schema";
import {
	SampleNextArrow,
	SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import TitleSection from "@/web/components/TitleSection";
import Slider from "react-slick";
import { printFileWithDimension } from "~/libs/upload";

interface categoriesSectionProps {
	categories: CategoriesSchema[];
}
function CategoriesSection({ categories }: categoriesSectionProps) {
	return (
		<section class="max-w-6xl mx-auto px-2 my-12">
			<TitleSection>Nuestras Categorías</TitleSection>
			<Slider
				className="w-full rounded-lg  overflow-hidden"
				{...{
					dots: false,
					infinite: true,
					speed: 500,
					slidesToShow: 3,
					slidesToScroll: 1,
					autoplay: true,
					adaptiveHeight: true,
					nextArrow: <SampleNextArrow />,
					prevArrow: <SamplePrevArrow />,
					responsive: [
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 3,
							},
						},
						{
							breakpoint: 600,
							settings: {
								slidesToShow: 2,
							},
						},
						{
							breakpoint: 480,
							settings: {
								slidesToShow: 1,
							},
						},
					],
				}}
			>
				{categories.map((category) => (
					<a
						href={`/shop/${category.slug}`}
						class="flex flex-col justify-center items-center  delay-custom-1  rounded-md  shadow  bg-background-light dark:bg-background-dark"
						key={category.id}
					>
						<div class="w-full h-[200px]  overflow-hidden group ">
							{category.image ? (
								<img
									class="w-full h-full object-cover group-hover:scale-110 delay-custom-1"
									width={300}
									height={300}
									src={printFileWithDimension(category.image, 500)[0]}
									alt={category.name}
								/>
							) : null}
						</div>
						<span class="py-3 font-bold block text-center">
							{category.name}
						</span>
					</a>
				))}
			</Slider>
		</section>
	);
}

export default CategoriesSection;
