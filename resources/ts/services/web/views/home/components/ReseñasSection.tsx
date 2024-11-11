import { storageEmpresa } from "@/empresas/stores/empresa.store";
import {
	SampleNextArrow,
	SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import TitleSection from "@/web/components/TitleSection";
import { useSignal } from "@preact/signals";
import Slider from "react-slick";

function ReseñasSection() {
	const currentIndex = useSignal(0);

	return (
		<section
			data-aos={`${storageEmpresa?.setting.isScrolling ? "fade-up" : ""} `}
			class="max-w-6xl mx-auto my-12 flex flex-col gap-4"
		>
			<TitleSection>Reseñas</TitleSection>
			<Slider
				{...{
					speed: 500,
					slidesToScroll: 3,
					slidesToShow: 3,
					focusOnSelect: false,
					nextArrow: <SampleNextArrow />,
					prevArrow: <SamplePrevArrow />,
					adaptiveHeight: true,

					responsive: [
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 3,
								slidesToScroll: 3,
							},
						},
						{
							breakpoint: 600,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1,
							},
						},
						{
							breakpoint: 480,
							settings: {
								slidesToShow: 1,
								slidesToScroll: 1,
							},
						},
					],
				}}
			>
				{Array.from({ length: 30 })
					.slice(currentIndex.value, currentIndex.value + 3)
					.map((_, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<div key={i}>
							<div
								class={` flex flex-col rounded-lg shadow p-6 gap-2 items-center justify-center ${
									i !== 1
										? "bg-primary text-white"
										: "dark:bg-paper-dark dark:text-white"
								} `}
							>
								<span class="font-bold text-2xl">Michale</span>
								<i class="fa-sharp fa-solid fa-comment-quote  mx-auto text-2xl" />
								<p class="text-center font-semibold">
									Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius
									dicta autem et deleniti hic impedit sed fuga praesentium,
									laboriosam repudiandae?
								</p>
							</div>
						</div>
					))}
			</Slider>
		</section>
	);
}

export default ReseñasSection;
