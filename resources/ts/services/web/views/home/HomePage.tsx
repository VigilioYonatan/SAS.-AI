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
import UsersSection from "./components/UsersSection";
import { UsersSchema } from "@/users/schemas/users.schema";
import CategoriesSection from "./components/CategoriesSection";
import BrandsSection from "./components/BrandsSection";
import { BrandsSchemaFromServer } from "@/products/schemas/brands.schema";
import ProductsUsers from "./components/ProductsUsers";
import { GridBannerSchema } from "@/empresas/schemas/grid_banner.schema";
import GridBanners from "./components/GridBanners";
import EmailsPromocionesStore from "@/emails/views/EmailsPromocionesStore";
import EmailSection2 from "@/emails/views/EmailSection2";

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
    productsmostreactionmapped:
        | (ProductsNormalSchemaFromServer & { favoritescount: string })[]
        | (ProductsRestaurantSchemaFromServer & { favoritescount: string })[];
    productsmostcommentsmapped:
        | (ProductsNormalSchemaFromServer & { quantity: string })[]
        | (ProductsRestaurantSchemaFromServer & { quantity: string })[];
    productsmostratingmapped:
        | ProductsNormalSchemaFromServer[]
        | ProductsRestaurantSchemaFromServer[];
    backgrounds: BackgroundSchemaFromServer[];
    noticia: NewSchema | null;
    productsquantity: number;
    productservicesquantity: number;
    users: Pick<
        UsersSchema,
        "id" | "name" | "speciality" | "photo" | "birthday"
    >[];
    brands: Pick<BrandsSchemaFromServer, "id" | "image">[];
    gridbanners: GridBannerSchema[];
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    queries: any;
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
    users,
    brands,
    productsmostreactionmapped,
    productsmostratingmapped,
    productsmostcommentsmapped,
    gridbanners,
}: HomePageProps) {
    return (
        <>
            <WebLayout header={header}>
                <Animations />
                <Noticia noticia={noticia} />
                <BackgroundSection backgrounds={backgrounds} />
                <GridBanners grid={gridbanners} i={0} />
                <GridBanners grid={gridbanners} i={1} />
                <OfferSection
                    productlatestmapped={productlatestmapped}
                    productsoffert8mapped={productsoffert6mapped}
                />
                <GridBanners grid={gridbanners} i={2} />
                <GridBanners grid={gridbanners} i={3} />
                <CategoriesSection categories={header.categories} />
                <ProductsSectionRandom
                    productlatestmapped={productlatestmapped}
                    productmostdiscountmapped={productmostdiscountmapped}
                />
                <GridBanners grid={gridbanners} i={4} />
                <GridBanners grid={gridbanners} i={5} />
                <CategoriesProductSection
                    getProductsByCategories={getproductsbycategories}
                />
                <GridBanners grid={gridbanners} i={6} />
                <GridBanners grid={gridbanners} i={7} />
                <ProductsUsers
                    productsmostreactionmapped={productsmostreactionmapped}
                    productsmostratingmapped={productsmostratingmapped}
                    productsmostcommentsmapped={productsmostcommentsmapped}
                />
                <BrandsSection brands={brands} />
                <GridBanners grid={gridbanners} i={8} />
                <PostsSection posts={posts} />
                <GridBanners grid={gridbanners} i={9} />
                <UsersSection users={users} />
                <EmailSection2 />
                <FindSection />
                <EmailsPromocionesStore />
            </WebLayout>
        </>
    );
}

export default HomePage;
