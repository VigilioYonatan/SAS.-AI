import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import LatestProductSection from "./components/LatestProductSection";
import type { CategoriesSchemaFromServer } from "@/products/schemas/categories.schema";
import OfferSection from "../home/components/OfferSection";
import ProductsSectionRandom from "../home/components/ProductsSectionRandom";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import ServiciosSection from "../home/components/ServiciosSection";
import { GridBannersPage } from "../home/components/GridBanners";
import { GridBannerPageSchemaFromServer } from "@/empresas/schemas/grid-banner-page.schema";
import CategoriesSection from "../home/components/CategoriesSection";

interface ShopPageProps {
    categories: CategoriesSchemaFromServer[];
    productslatestmapped:
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
    productsoffertsmapped:
        | ProductsNormalSchemaFromServer[]
        | ProductsRestaurantSchemaFromServer[];
    productmostdiscountMapped:
        | ProductsNormalSchemaFromServer
        | ProductsRestaurantSchemaFromServer;

    header: HeaderType;
    grid_banner_pages: GridBannerPageSchemaFromServer[];
}
function ShopPage({
    categories,
    header,
    productslatestmapped,
    productsoffertsmapped,
    productlatestmapped,
    productmostdiscountmapped,
    grid_banner_pages,
}: ShopPageProps) {
    return (
        <WebLayout header={header}>
            <div class="mt-20 lg:mt-10">
                <GridBannersPage grid={grid_banner_pages[0]} i={0} />
                <CategoriesSection categories={categories} />
                <ServiciosSection servicios={header.categoriesServices} />
                <GridBannersPage grid={grid_banner_pages[1]} i={1} />
                <GridBannersPage grid={grid_banner_pages[2]} i={2} />
                <OfferSection
                    productlatestmapped={productlatestmapped}
                    productsoffert8mapped={productsoffertsmapped}
                />
                <GridBannersPage grid={grid_banner_pages[3]} i={3} />
                <ProductsSectionRandom
                    productlatestmapped={productlatestmapped}
                    productmostdiscountmapped={productmostdiscountmapped}
                />
                <GridBannersPage grid={grid_banner_pages[4]} i={4} />
                <LatestProductSection ultimosproducto={productslatestmapped} />
                <GridBannersPage grid={grid_banner_pages[5]} i={5} />
            </div>
        </WebLayout>
    );
}

export default ShopPage;
