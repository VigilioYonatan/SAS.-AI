import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import { GridBannerServicechemaFromServer } from "@/empresas/schemas/grid-banner-service.schema";
import { GridBannersServicios } from "../home/components/GridBanners";
import TitleSection from "../../components/TitleSection";
import { Fragment } from "preact/jsx-runtime";

export interface HomePageProps {
    header: HeaderType;
    gridbannersservicios: GridBannerServicechemaFromServer[];
}
function HomePage({ header, gridbannersservicios }: HomePageProps) {
    return (
        <>
            <WebLayout header={header}>
                <div class="mt-20 lg:mt-10">
                    <TitleSection>Servicios</TitleSection>
                </div>
                <Fragment>
                    {gridbannersservicios.map((grid, i) => (
                        <GridBannersServicios
                            key={grid.id}
                            grid={grid}
                            i={i + 1}
                        />
                    ))}
                </Fragment>
            </WebLayout>
        </>
    );
}

export default HomePage;
