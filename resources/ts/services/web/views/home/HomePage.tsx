import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import FindSection from "./components/FindSection";
import Animations from "@/web/components/Animations";
import type { PostsSchemaFromServer } from "@/posts/schemas/posts.schema";
import OfferSection from "./components/OfferSection";
import type { NewSchema } from "@/empresas/schemas/new.schema";
import type { BackgroundSchemaFromServer } from "@/empresas/schemas/background.schema";
import ProductsSectionRandom from "./components/ProductsSectionRandom";
import PostsSection from "./components/PostsSection";
import BackgroundSection from "./components/BackgroundSection";
import type { CategoriesSchemaFromServer } from "@/products/schemas/categories.schema";
import CategoriesProductSection from "./components/CategoriesProductSection";
import Noticia from "./components/Noticia";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";

export interface HomePageProps {
    header: HeaderType;
    posts: PostsSchemaFromServer[];
    productsoffert6mapped:
        | ProductsNormalSchemaFromServer[]
        | ProductsRestaurantSchemaFromServer[];
    getproductsbycategories: (CategoriesSchemaFromServer & {
        products:
            | ProductsNormalSchemaFromServer[]
            | ProductsRestaurantSchemaFromServer[];
    })[];
    productslatest6mapped:
        | ProductsNormalSchemaFromServer[]
        | ProductsRestaurantSchemaFromServer[];
    productmostdiscountmapped:
        | ProductsNormalSchemaFromServer
        | ProductsRestaurantSchemaFromServer
        | null;
    productlatestmapped:
        | ProductsNormalSchemaFromServer
        | ProductsRestaurantSchemaFromServer
        | null;
    backgrounds: BackgroundSchemaFromServer[];
    noticia: NewSchema | null;
}
function HomePage({
    header,
    productsoffert6mapped,
    productmostdiscountmapped,
    productlatestmapped,
    posts,
    backgrounds,
    noticia,
    getproductsbycategories,
}: HomePageProps) {
    return (
        <>
            <WebLayout header={header}>
                <Animations />
                <Noticia noticia={noticia} />
                <BackgroundSection backgrounds={backgrounds} />
                <OfferSection
                    productlatestmapped={productlatestmapped}
                    productsoffert8mapped={productsoffert6mapped}
                />
                <CategoriesProductSection
                    getProductsByCategories={getproductsbycategories}
                />
                <ProductsSectionRandom
                    productlatestmapped={productlatestmapped}
                    productmostdiscountmapped={productmostdiscountmapped}
                />
                <PostsSection posts={posts} />
                <FindSection />
            </WebLayout>
        </>
    );
}

export default HomePage;
