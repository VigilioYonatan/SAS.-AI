import { GridBannerPageSchemaFromServer } from "@/empresas/schemas/grid-banner-page.schema";
import { GridBannerSchema } from "@/empresas/schemas/grid_banner.schema";
import AdminEdit from "@/web/components/AdminEdit";
import TitleSection from "@/web/components/TitleSection";

interface GridBanners {
    grid: GridBannerSchema[];
    i: number;
}
function GridBanners({ grid, i }: GridBanners) {
    const gr = grid[i];

    if (!gr?.enabled) return null;
    return (
        <section
            class={` grid-banner-${i}  max-w-6xl mx-auto my-4 md:my-8 relative `}
        >
            <AdminEdit uri={`/admin/banners?banner=${i}`} />
            {gr.title ? <TitleSection>{gr.title}</TitleSection> : null}
            {gr.html ? (
                <div
                    class={`w-full   banners-${i} relative`}
                    dangerouslySetInnerHTML={{ __html: gr.html }}
                />
            ) : null}
        </section>
    );
}
interface GridBannersPageProps {
    grid: GridBannerPageSchemaFromServer;
    i: number;
}
export function GridBannersPage({ grid, i }: GridBannersPageProps) {
    const gr = grid?.grid_banner_id ? grid.grid_banner : grid;
    if (!gr?.enabled) return null;
    const urlBase = window.location.href.split("?")[0];
    const segmentos = urlBase.split("/");
    const ultimoSegmento = segmentos[segmentos.length - 1];
    return (
        <section
            class={` grid-banner-${i}  max-w-6xl mx-auto my-4 md:my-8 relative`}
        >
            <AdminEdit
                uri={`/admin/banners?banner=${i}&type=${ultimoSegmento}`}
            />
            {gr.title ? <TitleSection>{gr.title}</TitleSection> : null}
            {gr.html ? (
                <div
                    class={`w-full   banners-${i} relative`}
                    dangerouslySetInnerHTML={{ __html: gr.html }}
                />
            ) : null}
        </section>
    );
}

export default GridBanners;
