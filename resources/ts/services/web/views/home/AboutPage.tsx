import type { HeaderType } from "@/web/components/WebLayout";
import WebLayout from "@/web/components/WebLayout";
import PostsSection from "./components/PostsSection";
import UsersSection from "./components/UsersSection";
import { PostsSchemaFromServer } from "@/posts/schemas/posts.schema";
import { UsersSchema } from "@/users/schemas/users.schema";
import TitleSection from "@/web/components/TitleSection";
import { Fragment } from "preact/jsx-runtime";
import { GridBannersPage } from "./components/GridBanners";
import { GridBannerPageSchemaFromServer } from "@/empresas/schemas/grid-banner-page.schema";

export interface AboutPageProps {
    header: HeaderType;
    posts: PostsSchemaFromServer[];
    productsquantity: number;
    productservicesquantity: number;
    users: Pick<
        UsersSchema,
        "id" | "name" | "speciality" | "photo" | "birthday"
    >[];
    grid_banner_pages: GridBannerPageSchemaFromServer[];
    title: string;
}
function AboutPage({
    header,
    posts,
    users,
    grid_banner_pages,
    title,
}: AboutPageProps) {
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
                <PostsSection posts={posts} />
                <UsersSection users={users} />
            </WebLayout>
        </>
    );
}

export default AboutPage;
