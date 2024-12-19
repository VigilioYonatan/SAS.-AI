import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import LatestProductSection from "./components/LatestProductSection";
import type { CategoriesSchemaFromServer } from "@/products/schemas/categories.schema";
import CategoriesSection from "./components/CategoriesSection";
import OfferSection from "../home/components/OfferSection";
import ProductsSectionRandom from "../home/components/ProductsSectionRandom";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import ServiciosSection from "../home/components/ServiciosSection";
import { GridBannerShopSchemaFromServer } from "@/empresas/schemas/grid-banner-shop.schema";
import { GridBannersServicios } from "../home/components/GridBanners";

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
    gridbannersshop: GridBannerShopSchemaFromServer[];
}
function ShopPage({
    categories,
    header,
    productslatestmapped,
    productsoffertsmapped,
    productlatestmapped,
    productmostdiscountmapped,
    gridbannersshop,
}: ShopPageProps) {
    return (
        <WebLayout header={header}>
            <div class="mt-20 lg:mt-10">
                <GridBannersServicios grid={gridbannersshop[0]} i={0} />
                <CategoriesSection categories={categories} />
                <ServiciosSection servicios={header.categoriesServices} />
                <GridBannersServicios grid={gridbannersshop[1]} i={1} />
                <OfferSection
                    productlatestmapped={productlatestmapped}
                    productsoffert8mapped={productsoffertsmapped}
                />
                <GridBannersServicios grid={gridbannersshop[2]} i={2} />
                <ProductsSectionRandom
                    productlatestmapped={productlatestmapped}
                    productmostdiscountmapped={productmostdiscountmapped}
                />
                <GridBannersServicios grid={gridbannersshop[3]} i={3} />
                <LatestProductSection ultimosproducto={productslatestmapped} />
                <GridBannersServicios grid={gridbannersshop[4]} i={4} />
                <GridBannersServicios grid={gridbannersshop[5]} i={5} />
            </div>
        </WebLayout>
    );
}

export default ShopPage;
