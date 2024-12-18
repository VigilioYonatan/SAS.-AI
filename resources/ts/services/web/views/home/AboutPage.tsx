import type { HeaderType } from "@/web/components/WebLayout";
import WebLayout from "@/web/components/WebLayout";
import PostsSection from "./components/PostsSection";
import UsersSection from "./components/UsersSection";
import { PostsSchemaFromServer } from "@/posts/schemas/posts.schema";
import { UsersSchema } from "@/users/schemas/users.schema";
import TitleSection from "@/web/components/TitleSection";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import IsTemplate from "./components/IsTemplate";

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
function AboutPage({ header, posts, users }: AboutPageProps) {
    return (
        <>
            <WebLayout header={header}>
                {storageEmpresa?.isTemplate ? (
                    <IsTemplate />
                ) : (
                    <>
                        <div class="mt-20 lg:mt-10">
                            <TitleSection>Nosotros</TitleSection>
                        </div>
                        <PostsSection posts={posts} />
                        <UsersSection users={users} />
                    </>
                )}
            </WebLayout>
        </>
    );
}

export default AboutPage;
