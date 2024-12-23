import type { HeaderType } from "@/web/components/WebLayout";
import WebLayout from "@/web/components/WebLayout";
import PostsSection from "./components/PostsSection";
import UsersSection from "./components/UsersSection";
import { PostsSchemaFromServer } from "@/posts/schemas/posts.schema";
import { UsersSchema } from "@/users/schemas/users.schema";
import TitleSection from "@/web/components/TitleSection";
import { GridBannersPage } from "./components/GridBanners";
import { GridBannerPageSchemaFromServer } from "@/empresas/schemas/grid-banner-page.schema";
import FindSection from "./components/FindSection";
import EmailSection from "@/emails/views/EmailSection";

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
                <GridBannersPage grid={grid_banner_pages[0]} i={0} />
                <PostsSection posts={posts} />
                <GridBannersPage grid={grid_banner_pages[1]} i={1} />
                <UsersSection users={users} />
                <GridBannersPage grid={grid_banner_pages[2]} i={2} />
                <EmailSection />
                <GridBannersPage grid={grid_banner_pages[3]} i={3} />
                <FindSection />
                <GridBannersPage grid={grid_banner_pages[4]} i={4} />
            </WebLayout>
        </>
    );
}

export default AboutPage;
