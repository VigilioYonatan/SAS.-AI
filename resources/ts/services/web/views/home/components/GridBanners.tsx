import { GridBannerServicechemaFromServer } from "@/empresas/schemas/grid-banner-service.schema";
import { GridBannerSchema } from "@/empresas/schemas/grid_banner.schema";
import AdminEdit from "@/web/components/AdminEdit";
import TitleSection from "@/web/components/TitleSection";

interface GridBanners {
    grid: GridBannerSchema[];
    i: number;
}
function GridBanners({ grid, i }: GridBanners) {
    const gr = grid[i];
    console.log({ grid });
    console.log({ gr });

    if (!gr.enabled) return null;
    return (
        <section
            class={` grid-banner-${i}  max-w-6xl mx-auto my-4 md:my-8 relative `}
        >
            <AdminEdit uri={`/admin/banners?banner=${i}`} />
            {gr.title ? <TitleSection>{gr.title}</TitleSection> : null}
            {gr.html ? (
                <div
                    class={`w-full  grid banners-${i} relative`}
                    dangerouslySetInnerHTML={{ __html: gr.html }}
                />
            ) : null}
        </section>
    );
}
interface GridBannersServiciosProps {
    grid: GridBannerServicechemaFromServer;
    i: number;
}
export function GridBannersServicios({ grid, i }: GridBannersServiciosProps) {
    const gr = grid.grid_banner_id ? grid.grid_banner : grid;
    if (!gr.enabled) return null;

    return (
        <section
            class={` grid-banner-${i}  max-w-6xl mx-auto my-4 md:my-8 relative`}
        >
            <AdminEdit uri={`/admin/banners?banner=${i}`} />
            {gr.title ? <TitleSection>{gr.title}</TitleSection> : null}
            {gr.html ? (
                <div
                    class={`w-full  grid banners-${i} relative`}
                    dangerouslySetInnerHTML={{ __html: gr.html }}
                />
            ) : null}
        </section>
    );
}

export default GridBanners;
