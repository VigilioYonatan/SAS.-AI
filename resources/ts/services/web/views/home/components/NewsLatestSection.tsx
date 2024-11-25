import { storageEmpresa } from "@/empresas/stores/empresa.store";
import type { PostsSchemaFromServer } from "@/posts/schemas/posts.schema";
import {
    SampleNextArrow,
    SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import TitleSection from "@/web/components/TitleSection";
import Slider from "react-slick";
import { showTime } from "~/libs/helpers";

interface NewsLatestProps {
    posts: PostsSchemaFromServer[];
}
function NewsLatestSection({ posts }: NewsLatestProps) {
    return (
        <section
            class="max-w-6xl px-2 mx-auto my-12 flex flex-col gap-4 group"
            data-aos={`${
                storageEmpresa?.setting.isScrolling ? "fade-up" : ""
            } `}
        >
            <TitleSection>Ultimas noticias</TitleSection>
            <Slider
                {...{
                    dots: true,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 3,
                    slidesToScroll: 1,
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
                    adaptiveHeight: true,
                }}
            >
                {posts.map((post) => (
                    <div
                        class="flex flex-col gap-2 text-primary dark:text-white items-center justify-center group overflow-hidden w-full  p-2"
                        key={post.id}
                    >
                        <div class="rounded-md w-full  delay-custom-1 bg-secondary dark:bg-paper-dark p-2">
                            <img
                                class="w-full h-full group-hover:scale-110 delay-custom-1"
                                width={500}
                                height={500}
                                src="https://www.pedigree.com.mx/cdn-cgi/image/format=auto,q=90/sites/g/files/fnmzdf1501/files/2022-08/product-landing-hero-allBreeds.png"
                                alt=""
                            />
                        </div>
                        <div class="flex flex-col p-2 gap-1">
                            <h4 class="font-bold text-md text-center">
                                {post.title}
                            </h4>
                            <span class="text-xs font-semibold text-end">
                                {showTime(post.createdAt!)}
                            </span>
                        </div>
                    </div>
                ))}
            </Slider>
        </section>
    );
}

export default NewsLatestSection;
