import { storageEmpresa } from "@/empresas/stores/empresa.store";
import type { PostsSchemaFromServer } from "@/posts/schemas/posts.schema";
import {
	SampleNextArrow,
	SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import TitleSection from "@/web/components/TitleSection";
import Slider from "react-slick";
import enviroments from "~/config";
import useShowImage from "~/hooks/useShowImage";
import { showTime } from "~/libs/helpers";
import { printFileWithDimension } from "~/libs/upload";

interface PostsSectionProps {
	posts: PostsSchemaFromServer[];
}
function PostsSection({ posts }: PostsSectionProps) {
	if (!posts.length) return null;
	const { ShowImage, state, changeShowImage } = useShowImage();
	return (
		<section
			data-aos={`${storageEmpresa?.setting.isScrolling ? "fade-up" : ""} `}
			class="max-w-6xl mx-auto my-12 px-4 flex flex-col gap-4"
		>
			<div class="flex justify-center items-center mb-4">
				<TitleSection>Novedades</TitleSection>
			</div>
			<div class="">
				{posts.length ? (
					<Slider
						className="posts"
						{...{
							dots: false,
							arrows: true,
							infinite: false,
							speed: 500,
							slidesToShow: 3,
							slidesToScroll: 1,
							responsive: [
								{
									breakpoint: 1024,
									settings: {
										slidesToShow: 3,
										slidesToScroll: 3,
										infinite: true,
									},
								},
								{
									breakpoint: 600,
									settings: {
										slidesToShow: 2,
										slidesToScroll: 2,
										initialSlide: 2,
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
							nextArrow: <SampleNextArrow />,
							prevArrow: <SamplePrevArrow />,
						}}
					>
						{posts.map((post, i) => (
							<div
								key={post.id}
								class={`group overflow-hidden shadow ${
									enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
								} bg-background-light dark:bg-background-dark`}
								onClick={() => {
									changeShowImage(i + 1);
								}}
							>
								<div class="flex flex-col gap-2 ">
									<div class="overflow-hidden">
										<img
											src={printFileWithDimension(post.image, 500)[0]}
											class="group-hover:scale-110 delay-custom-1 h-full"
											width={500}
											height={500}
											alt={post.title}
										/>
									</div>

									<div class=" p-2">
										<h4 class="line-clamp-2 font-bold  dark:text-white ">
											{post.title}
										</h4>
										<div class="font-thin text-sm flex flex-col gap-1 ">
											<p class="line-clamp-5 text-gray-400 font-normal h-[80px]">
												{post.content}
											</p>
											<span class="self-end  dark:text-white text-primary font-bold">
												{showTime(post.createdAt!)}
											</span>
										</div>
									</div>
								</div>
							</div>
						))}
					</Slider>
				) : (
					<span class="text-primary dark:text-white block text-center font-bold">
						No hay posts
					</span>
				)}{" "}
				<style jsx>{`
                    .posts .slick-slide > div {
                        padding: 0 10px;
                    }
                `}</style>
				<ShowImage length={posts.length}>
					<Slider
						className="md:w-[800px] w-full "
						{...{
							dots: true,
							speed: 500,
							slidesToShow: 1,
							slidesToScroll: 1,
							arrows: false,
							adaptiveHeight: true,
							initialSlide: state! - 1,
							afterChange(currentSlide) {
								changeShowImage(currentSlide + 1);
							},
						}}
					>
						{posts.map((post) => (
							<div
								class="flex-col dark:bg-paper-dark bg-white "
								key={post.title}
							>
								<img
									class="object-contain w-full h-full"
									src={printFileWithDimension(post.image, 500)[0]}
									width={800}
									height={800}
									alt={post.title}
								/>
								<div class="flex flex-col gap-2 p-4">
									<span class="font-bold text-primary dark:text-white text-center">
										{post.title}
									</span>
									<p class="dark:text-white  text-center font-semibold">
										{post.content}
									</p>
									<span class="text-xs justify-end text-end dark:text-white">
										{showTime(post.createdAt!)}
									</span>
								</div>
							</div>
						))}
					</Slider>
				</ShowImage>
			</div>
		</section>
	);
}

export default PostsSection;
