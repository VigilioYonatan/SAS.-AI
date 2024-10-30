import type { HeaderType } from "@/web/components/WebLayout";
import WebLayout from "@/web/components/WebLayout";
import AboutSection from "./components/AboutSection";
import PostsSection from "./components/PostsSection";
import UsersSection from "./components/UsersSection";
import { PostsSchemaFromServer } from "@/posts/schemas/posts.schema";
import { UsersSchema } from "@/users/schemas/users.schema";
import TitleSection from "@/web/components/TitleSection";

export interface AboutPageProps {
    header: HeaderType;
    posts: PostsSchemaFromServer[];
    productsquantity: number;
    productservicesquantity: number;
    users: Pick<
        UsersSchema,
        "id" | "name" | "speciality" | "photo" | "birthday"
    >[];
}
function AboutPage({
    header,
    posts,
    productsquantity,
    users,
    productservicesquantity,
}: AboutPageProps) {
    return (
        <>
            <WebLayout header={header}>
                <div class="mt-28 lg:mt-10">
                    <TitleSection>Nosotros</TitleSection>
                </div>
                <AboutSection
                    productservicesquantity={productservicesquantity}
                    productsquantity={productsquantity}
                />
                <PostsSection posts={posts} />
                <UsersSection users={users} />
            </WebLayout>
        </>
    );
}

export default AboutPage;
