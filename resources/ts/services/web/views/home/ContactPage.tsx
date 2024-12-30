import { GridBannerPageSchemaFromServer } from "@/empresas/schemas/grid-banner-page.schema";
import TitleSection from "@/web/components/TitleSection";
import WebLayout, { HeaderType } from "@/web/components/WebLayout";
import { Fragment } from "preact/jsx-runtime";
import { GridBannersPage } from "./components/GridBanners";
import EmailSection from "@/emails/views/EmailSection";
import FindSection from "./components/FindSection";
export interface ContactPageProps {
    header: HeaderType;

    grid_banner_pages: GridBannerPageSchemaFromServer[];
    title: string;
}
function ContactPage({ grid_banner_pages, header, title }: ContactPageProps) {
    return (
        <WebLayout header={header}>
            <div class="mt-20 lg:mt-10 max-w-6xl">
                <TitleSection>{title}</TitleSection>
            </div>
            <Fragment>
                <GridBannersPage grid={grid_banner_pages[0]} i={0} />
                <GridBannersPage grid={grid_banner_pages[1]} i={1} />
                <FindSection />
                <GridBannersPage grid={grid_banner_pages[2]} i={2} />
                <EmailSection />
                <GridBannersPage grid={grid_banner_pages[3]} i={3} />
                <GridBannersPage grid={grid_banner_pages[4]} i={4} />
            </Fragment>
        </WebLayout>
    );
}

export default ContactPage;
