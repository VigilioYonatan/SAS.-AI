import type { HeaderType } from "@/web/components/WebLayout";
import WebLayout from "@/web/components/WebLayout";
import PostsSection from "./components/PostsSection";
import UsersSection from "./components/UsersSection";
import { PostsSchemaFromServer } from "@/posts/schemas/posts.schema";
import { UsersSchema } from "@/users/schemas/users.schema";
import TitleSection from "@/web/components/TitleSection";
import { GridBannersServicios } from "./components/GridBanners";
import { GridBannerAboutSchemaFromServer } from "@/empresas/schemas/grid-banner-about.schema";
import { Fragment } from "preact/jsx-runtime";

export interface AboutPageProps {
    header: HeaderType;
    posts: PostsSchemaFromServer[];
    productsquantity: number;
    productservicesquantity: number;
    users: Pick<
        UsersSchema,
        "id" | "name" | "speciality" | "photo" | "birthday"
    >[];
    gridbannersabout: GridBannerAboutSchemaFromServer[];
}
function AboutPage({ header, posts, users, gridbannersabout }: AboutPageProps) {
    return (
        <>
            <WebLayout header={header}>
                <div class="mt-20 lg:mt-10">
                    <TitleSection>Nosotros</TitleSection>
                </div>
                <Fragment>
                    {gridbannersabout.map((grid, i) => (
                        <GridBannersServicios key={grid.id} grid={grid} i={i} />
                    ))}
                </Fragment>
                <PostsSection posts={posts} />
                <UsersSection users={users} />
            </WebLayout>
        </>
    );
}

export default AboutPage;
