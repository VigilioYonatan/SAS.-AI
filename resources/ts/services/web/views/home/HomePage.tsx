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
import AboutSection from "./components/AboutSection";
import UsersSection from "./components/UsersSection";
import { UsersSchema } from "@/users/schemas/users.schema";
import CategoriesSection from "./components/CategoriesSection";
import BrandsSection from "./components/BrandsSection";
import { BrandsSchemaFromServer } from "@/products/schemas/brands.schema";
import ServiciosSection from "./components/ServiciosSection";
import ProductsUsers from "./components/ProductsUsers";
import { GridBannerSchema } from "@/empresas/schemas/grid_banner.schema";
import { BannerSchema } from "@/empresas/schemas/banner.schema";
import GridBanners from "./components/GridBanners";

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
    gridbanners: (GridBannerSchema & { banners: BannerSchema[] })[];
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
    productsquantity,
    users,
    brands,
    productservicesquantity,
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
                <OfferSection
                    productlatestmapped={productlatestmapped}
                    productsoffert8mapped={productsoffert6mapped}
                />
                <AboutSection
                    productservicesquantity={productservicesquantity}
                    productsquantity={productsquantity}
                />
                <GridBanners grid={gridbanners} i={1} />
                <CategoriesSection categories={header.categories} />
                <ProductsSectionRandom
                    productlatestmapped={productlatestmapped}
                    productmostdiscountmapped={productmostdiscountmapped}
                />
                <ServiciosSection servicios={header.categoriesServices} />
                <CategoriesProductSection
                    getProductsByCategories={getproductsbycategories}
                />
                <GridBanners grid={gridbanners} i={2} />
                <ProductsUsers
                    productsmostreactionmapped={productsmostreactionmapped}
                    productsmostratingmapped={productsmostratingmapped}
                    productsmostcommentsmapped={productsmostcommentsmapped}
                />
                <BrandsSection brands={brands} />
                <PostsSection posts={posts} />
                <UsersSection users={users} />
                <GridBanners grid={gridbanners} i={3} />
                <FindSection />
            </WebLayout>
        </>
    );
}

export default HomePage;
