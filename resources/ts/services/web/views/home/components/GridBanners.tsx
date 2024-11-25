import { BannerSchema } from "@/empresas/schemas/banner.schema";
import { GridBannerSchema } from "@/empresas/schemas/grid_banner.schema";
import TitleSection from "@/web/components/TitleSection";
import { useSignal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { printFileWithDimension } from "~/libs/upload";

interface GridBanners {
    grid: (GridBannerSchema & { banners: BannerSchema[] })[];
    i: number;
}
function GridBanners({ grid, i }: GridBanners) {
    if (!grid[i]?.banners.length || !grid[i].enabled) return null;
    return (
        <div
            class={`max-w-6xl mx-auto my-4 md:my-8 relative grid-banner-${i}  `}
        >
            {grid[i].title ? (
                <TitleSection>{grid[i].title}</TitleSection>
            ) : null}
            <div class={`w-full  grid banner-${i} relative`}>
                {grid[i].banners.map((banner) => {
                    const divRef = useRef<HTMLDivElement | null>(null);
                    const width = useSignal(0);

                    const selectedSize = [300, 600, 800, 1200].reduce(
                        (prev, curr) => {
                            return Math.abs(curr - width.value) <
                                Math.abs(prev - width.value)
                                ? curr
                                : prev;
                        }
                    );
                    const file = printFileWithDimension(
                        banner.file,
                        selectedSize
                    )[0];
                    useEffect(() => {
                        if (divRef.current) {
                            width.value = divRef.current.offsetWidth;
                        }
                        const handleResize = () => {
                            if (divRef.current) {
                                width.value = divRef.current.offsetWidth;
                            }
                        };
                        window.addEventListener("resize", handleResize);
                        return () => {
                            window.removeEventListener("resize", handleResize);
                        };
                    }, []);

                    return (
                        <div
                            class="w-full relative h-full group"
                            ref={divRef}
                            key={banner.id}
                            onClick={() => {
                                if (banner.link && !banner.button) {
                                    window.location.href = banner.link;
                                }
                            }}
                        >
                            {file?.endsWith("mp4") ? (
                                <div class="relative w-full h-full flex items-end">
                                    <video
                                        class="absolute top-0 left-0 w-full h-full object-cover  -z-10"
                                        autoplay
                                        muted
                                        loop
                                    >
                                        <source src={file} type="video/mp4" />
                                        Tu navegador no soporta el elemento
                                        video.
                                    </video>
                                    <div class="m-6 flex flex-col gap-4 self-start ">
                                        {banner.title ? (
                                            <span class="font-bold text-3xl text-white">
                                                Toy Story Toons Small Fry
                                            </span>
                                        ) : null}
                                        {banner.subtitle ? (
                                            <span class="font-semibold  text-white">
                                                Toy Story Toons Small Fry
                                            </span>
                                        ) : null}
                                        {banner.button && banner.link ? (
                                            <a
                                                href={banner.link}
                                                class="bg-primary px-7 py-2 mt-2  font-semibold  mb-2 hover:bg-black text-white delay-custom-1  self-start"
                                            >
                                                {banner.button}
                                            </a>
                                        ) : null}
                                    </div>
                                </div>
                            ) : (
                                <div
                                    class="w-full h-full   bg-cover bg-center group-hover:scale-110 delay-custom-1   bg-no-repeat -z-10 flex items-end"
                                    style={{
                                        backgroundImage: `url(${file})`,
                                    }}
                                >
                                    <div class="m-6 flex flex-col gap-4 self-start ">
                                        {banner.title ? (
                                            <span class="font-bold text-3xl text-white">
                                                Toy Story Toons Small Fry
                                            </span>
                                        ) : null}
                                        {banner.subtitle ? (
                                            <span class="font-semibold  text-white">
                                                Toy Story Toons Small Fry
                                            </span>
                                        ) : null}
                                        {banner.button && banner.link ? (
                                            <a
                                                href={banner.link}
                                                class="bg-primary px-7 py-2 mt-2  font-semibold  mb-2 hover:bg-black text-white delay-custom-1  self-start"
                                            >
                                                {banner.button}
                                            </a>
                                        ) : null}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
                <style jsx>{`
                    ${grid[i].responsive
                        .map(
                            (responsive) => `
                            @media screen and (min-width:${responsive.width}px){
                                .grid-banner-${i} .banner-${i}{
                                    height: ${responsive.height}px;
                                    grid-template-columns: repeat(${
                                        responsive.cols
                                    }, minmax(0, 1fr));
                                    ${
                                        responsive.rows
                                            ? `grid-template-rows: repeat(${responsive.rows}, minmax(0, 1fr));`
                                            : ""
                                    }
                                    
                                    gap: ${responsive.gap}rem;
                                }
                            }
                        `
                        )
                        .join("")}
                `}</style>
            </div>
        </div>
    );
}

export default GridBanners;
