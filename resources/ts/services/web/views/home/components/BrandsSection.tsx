import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { BrandsSchemaFromServer } from "@/products/schemas/brands.schema";
import TitleSection from "@/web/components/TitleSection";
import Slider from "react-slick";
import useMediaQuery from "~/hooks/useMediaQuery";
import { printFileWithDimension } from "~/libs/upload";

interface BrandsSectionProps {
    brands: Pick<BrandsSchemaFromServer, "id" | "image">[];
}
function BrandsSection({ brands }: BrandsSectionProps) {
    if (!brands.length || !storageEmpresa?.setting.shows.brands) return null;
    return (
        <>
            <section
                class={`brand-section max-w-6xl mx-auto py-4  md:py-8 px-4 flex flex-col  group ${
                    storageEmpresa.setting.isScrolling ? "animation-box" : ""
                } `}
            >
                <div class="flex justify-center items-center">
                    <TitleSection>Nuestras Marcas</TitleSection>
                </div>
                <div class="">
                    <Slider
                        {...{
                            dots: false,
                            infinite: true,
                            slidesToShow: useMediaQuery("(min-width: 600px)")
                                ? 6
                                : 4,
                            slidesToScroll: 1,
                            autoplay: true,
                            speed: 2000,
                            autoplaySpeed: 2000,
                            cssEase: "linear",
                            arrows: false,
                            focusOnSelect: false,
                            adaptiveHeight: true,
                            className: "brand-section-slide",
                        }}
                    >
                        {brands
                            .filter((brand) => brand.image)
                            .map((brand) => (
                                <div
                                    key={brand.id}
                                    class="w-[80px] h-[80px] flex justify-center items-center hover:grayscale-0 grayscale"
                                >
                                    <img
                                        src={
                                            printFileWithDimension(
                                                brand.image!,
                                                500
                                            )[0]
                                        }
                                        width="100"
                                        height="100"
                                        alt={String(brand.id)}
                                        title={String(brand.id)}
                                        class="mx-4 rounded-md object-contain w-[80px] h-full"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                    </Slider>
                    <style>{`
                           .brand-section &  .slick-list { margin: 0 -7px; & .slick-slide > div { padding: 0 10px; } }
                    `}</style>
                </div>
            </section>
        </>
    );
}

export default BrandsSection;
