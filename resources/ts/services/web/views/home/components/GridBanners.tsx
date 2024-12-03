import { BannerSchema } from "@/empresas/schemas/banner.schema";
import { GridBannerServicechemaFromServer } from "@/empresas/schemas/grid-banner-service.schema";
import { GridBannerSchema } from "@/empresas/schemas/grid_banner.schema";
import TitleSection from "@/web/components/TitleSection";
import useImageWithDimension from "~/hooks/useImageWithDimension";
import { printFileWithDimension } from "~/libs/upload";

interface GridBanners {
    grid: (GridBannerSchema & { banners: BannerSchema[] })[];
    i: number;
}
function GridBanners({ grid, i }: GridBanners) {
    const gr = grid[i];
    if (!gr?.banners.length || !gr.enabled) return null;
    return (
        <div
            class={`max-w-6xl mx-auto my-4 md:my-8 relative grid-banner-${i}  `}
        >
            {gr.title ? <TitleSection>{gr.title}</TitleSection> : null}
            <div class={`w-full  grid grid-banner-${i} relative`}>
                {gr.banners.map((banner, u) => {
                    if (!banner.enabled) return null;
                    let file = null;
                    // let script = null;
                    const [selectedSize, divRef] = useImageWithDimension([
                        300, 600, 800, 1200,
                    ]);
                    if (banner.file) {
                        file = printFileWithDimension(
                            banner.file,
                            selectedSize
                        )[0];
                    }

                    return (
                        <div
                            class={`w-full relative h-full group overflow-hidden grid-banner-${i}-${u}`}
                            ref={divRef}
                            key={banner.id}
                            onClick={() => {
                                if (banner.link && !banner.button) {
                                    window.location.href = banner.link;
                                }
                            }}
                            style={{
                                "grid-column": `span ${banner.col} / span ${banner.col}`,
                                "grid-row": `span ${banner.row} / span ${banner.row}`,
                                order:
                                    banner.order === 0 ? "auto" : banner.order,
                            }}
                        >
                            {banner.script ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: banner.script,
                                    }}
                                />
                            ) : null}
                            {file ? (
                                <>
                                    {" "}
                                    {file?.endsWith("mp4") ? (
                                        <div class="relative w-full h-full flex items-end">
                                            <video
                                                class="absolute top-0 left-0 w-full h-full object-cover  -z-10"
                                                autoplay
                                                muted
                                                loop
                                            >
                                                <source
                                                    src={file}
                                                    type="video/mp4"
                                                />
                                                Tu navegador no soporta el
                                                elemento video.
                                            </video>
                                            <div class="m-6 flex flex-col gap-4 self-start ">
                                                {banner.title ? (
                                                    <span class="font-bold text-3xl text-white">
                                                        {banner.title}
                                                    </span>
                                                ) : null}
                                                {banner.subtitle ? (
                                                    <span class="font-semibold  text-white">
                                                        {banner.subtitle}
                                                    </span>
                                                ) : null}
                                                {banner.button &&
                                                banner.link ? (
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
                                            class="w-full h-full   bg-cover bg-center group-hover:scale-105 delay-custom-1   bg-no-repeat -z-10 flex items-end"
                                            style={{
                                                backgroundImage: `url(${file})`,
                                            }}
                                        >
                                            <div class="m-6 flex flex-col gap-4 self-start ">
                                                {banner.title ? (
                                                    <span class="font-bold text-3xl text-white">
                                                        {banner.title}
                                                    </span>
                                                ) : null}
                                                {banner.subtitle ? (
                                                    <span class="font-semibold  text-white">
                                                        {banner.subtitle}
                                                    </span>
                                                ) : null}
                                                {banner.button &&
                                                banner.link ? (
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
                                </>
                            ) : null}
                        </div>
                    );
                })}
                <style jsx>{`
                    ${gr.responsive
                        .map(
                            (responsive) => `
                            @media screen and (min-width:${responsive.width}px){
                                .grid-banner-${i} .banner-${i}{
                                     height: ${
                                         responsive.height === 0
                                             ? "auto"
                                             : `${responsive.height}px`
                                     };
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
interface GridBannersServiciosProps {
    grid: GridBannerServicechemaFromServer;
    i: number;
}
export function GridBannersServicios({ grid, i }: GridBannersServiciosProps) {
    const gr = grid.grid_banner_id ? grid.grid_banner : grid;
    if (!gr?.banners.length || !gr.enabled) return null;
    return (
        <div
            class={`max-w-6xl mx-auto my-4 md:my-8 relative grid-banner-${i}  `}
        >
            {gr.title ? <TitleSection>{gr.title}</TitleSection> : null}
            <div class={"w-full  grid relative"}>
                {gr.banners.map((banner) => {
                    if (!banner.enabled) return null;
                    let file = null;
                    // let script = null;
                    const [selectedSize, divRef] = useImageWithDimension([
                        300, 600, 800, 1200,
                    ]);
                    if (banner.file) {
                        file = printFileWithDimension(
                            banner.file,
                            selectedSize
                        )[0];
                    }

                    return (
                        <div
                            class={`w-full relative h-full group overflow-hidden grid-banner-${i}-${banner.order}`}
                            style={{
                                "grid-column": `span ${banner.col} / span ${banner.col}`,
                                "grid-row": `span ${banner.col} / span ${banner.row}`,
                                order:
                                    banner.order === 0 ? "auto" : banner.order,
                            }}
                            ref={divRef}
                            key={banner.id}
                            onClick={() => {
                                if (banner.link && !banner.button) {
                                    window.location.href = banner.link;
                                }
                            }}
                        >
                            {banner.script ? (
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: banner.script,
                                    }}
                                />
                            ) : null}
                            {file ? (
                                <>
                                    {" "}
                                    {file?.endsWith("mp4") ? (
                                        <div class="relative w-full h-full flex items-end">
                                            <video
                                                class="absolute top-0 left-0 w-full h-full object-cover  -z-10"
                                                autoplay
                                                muted
                                                loop
                                            >
                                                <source
                                                    src={file}
                                                    type="video/mp4"
                                                />
                                                Tu navegador no soporta el
                                                elemento video.
                                            </video>
                                            <div class="m-6 flex flex-col gap-4 self-start ">
                                                {banner.title ? (
                                                    <span class="font-bold text-3xl text-white">
                                                        {banner.title}
                                                    </span>
                                                ) : null}
                                                {banner.subtitle ? (
                                                    <span class="font-semibold  text-white">
                                                        {banner.subtitle}
                                                    </span>
                                                ) : null}
                                                {banner.button &&
                                                banner.link ? (
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
                                            class="w-full h-full   bg-cover bg-center group-hover:scale-105 delay-custom-1   bg-no-repeat -z-10 flex items-end"
                                            style={{
                                                backgroundImage: `url(${file})`,
                                            }}
                                        >
                                            <div class="m-6 flex flex-col gap-4 self-start ">
                                                {banner.title ? (
                                                    <span class="font-bold text-3xl text-white">
                                                        {banner.title}
                                                    </span>
                                                ) : null}
                                                {banner.subtitle ? (
                                                    <span class="font-semibold  text-white">
                                                        {banner.subtitle}
                                                    </span>
                                                ) : null}
                                                {banner.button &&
                                                banner.link ? (
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
                                </>
                            ) : null}
                        </div>
                    );
                })}
                <style jsx>{`
                    ${gr.responsive
                        .map(
                            (responsive) => `
                            @media screen and (min-width:${responsive.width}px){
                                .grid-banner-${i} .banner-${i}{
                                     height: ${
                                         responsive.height === 0
                                             ? "auto"
                                             : `${responsive.height}px`
                                     };
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
