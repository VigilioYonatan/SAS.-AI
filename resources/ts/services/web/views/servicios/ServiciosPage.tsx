import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import { GridBannerPageSchemaFromServer } from "@/empresas/schemas/grid-banner-page.schema";
import TitleSection from "../../components/TitleSection";
import { Fragment } from "preact/jsx-runtime";
import { GridBannersPage } from "../home/components/GridBanners";

export interface HomePageProps {
    header: HeaderType;
    grid_banner_pages: GridBannerPageSchemaFromServer[];
    title: string;
}
function ServiciosPage({ header, grid_banner_pages, title }: HomePageProps) {
    return (
        <>
            <WebLayout header={header}>
                <div class="mt-20 lg:mt-10">
                    <TitleSection>{title}</TitleSection>
                </div>
                <Fragment>
                    {grid_banner_pages.map((grid, i) => (
                        <GridBannersPage key={grid.id} grid={grid} i={i} />
                    ))}
                </Fragment>
            </WebLayout>
        </>
    );
}

export default ServiciosPage;
