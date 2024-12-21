import { GridBannerPageSchemaFromServer } from "@/empresas/schemas/grid-banner-page.schema";
import TitleSection from "@/web/components/TitleSection";
import WebLayout, { HeaderType } from "@/web/components/WebLayout";
import { Fragment } from "preact/jsx-runtime";
import { GridBannersPage } from "./components/GridBanners";
export interface ContactPageProps {
    header: HeaderType;

    grid_banner_pages: GridBannerPageSchemaFromServer[];
    title: string;
}
function ContactPage({ grid_banner_pages, header, title }: ContactPageProps) {
    return (
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
    );
}

export default ContactPage;
