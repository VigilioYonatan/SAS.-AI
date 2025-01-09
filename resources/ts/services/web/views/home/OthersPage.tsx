import type { HeaderType } from "@/web/components/WebLayout";
import WebLayout from "@/web/components/WebLayout";
import TitleSection from "@/web/components/TitleSection";
import { Fragment } from "preact/jsx-runtime";
import { GridBannersPage } from "./components/GridBanners";
import { GridBannerPageSchemaFromServer } from "@/empresas/schemas/grid-banner-page.schema";

export interface AboutPageProps {
    header: HeaderType;
    grid_banner_pages: GridBannerPageSchemaFromServer[];
    title: string;
    paginator: unknown | null;
    data: unknown[] | null;
}
function AboutPage({ header, grid_banner_pages, title }: AboutPageProps) {
    return (
        <>
            <WebLayout header={header}>
                <div class="mt-20 lg:mt-10 max-w-6xl mx-auto">
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

export default AboutPage;
