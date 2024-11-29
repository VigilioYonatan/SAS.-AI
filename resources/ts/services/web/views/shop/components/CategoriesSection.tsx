import { storageEmpresa } from "@/empresas/stores/empresa.store";
import type { CategoriesSchema } from "@/products/schemas/categories.schema";
import {
    SampleNextArrow,
    SamplePrevArrow,
} from "@/web/components/ArrowsSlider";
import TitleSection from "@/web/components/TitleSection";
import Slider from "react-slick";
import enviroments from "~/config";
import { printFileWithDimension } from "~/libs/upload";

interface categoriesSectionProps {
    categories: CategoriesSchema[];
}
function CategoriesSection({ categories }: categoriesSectionProps) {
    if (!categories.length) return null;
    return (
        <section
            class="max-w-6xl mx-auto px-4 my-2 categories-section flex flex-col gap-4 group"
            data-aos={`${
                storageEmpresa?.setting.isScrolling ? "fade-up" : ""
            } `}
        >
            <TitleSection>Nuestros Productos</TitleSection>
            <Slider
                className="w-full rounded-lg categories-section.slide"
                {...{
                    dots: false,
                    infinite: true,
                    speed: 500,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    autoplay: true,
                    adaptiveHeight: true,
                    nextArrow: <SampleNextArrow />,
                    prevArrow: <SamplePrevArrow />,
                    responsive: [
                        {
                            breakpoint: 1024,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1,

                                infinite: true,
                                dots: true,
                            },
                        },
                        {
                            breakpoint: 600,
                            settings: {
                                slidesToShow: 2,
                                slidesToScroll: 1,

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
                }}
            >
                {categories.map((category) => (
                    <a
                        href={`/shop/${category.slug}`}
                        class={`flex flex-col justify-center items-center overflow-hidden group delay-custom-1  dark:text-white ${
                            enviroments.TYPE_BORDER === "circle"
                                ? "rounded-md "
                                : ""
                        }   shadow  dark:bg-background-dark bg-background-light`}
                        key={category.id}
                    >
                        <div class="w-full h-[200px]  overflow-hidden">
                            {category.image ? (
                                <img
                                    class="w-full h-full object-cover group-hover:scale-110 delay-custom-1"
                                    width={300}
                                    height={300}
                                    src={
                                        printFileWithDimension(
                                            category.image,
                                            800
                                        )[0]
                                    }
                                    alt={category.name}
                                />
                            ) : null}
                        </div>
                        <span class="py-3 font-bold block text-center text-primary dark:text-white">
                            {category.name}
                        </span>
                    </a>
                ))}
            </Slider>
            <style jsx>{`
                .categories-section .slick-slide > div {
                    margin-inline: 8px;
                    outline: none;
                }
            `}</style>
        </section>
    );
}

export default CategoriesSection;
