import WebLayout, { type HeaderType } from "@/web/components/WebLayout";
import LatestProductSection from "./components/LatestProductSection";
import type { CategoriesSchemaFromServer } from "@/products/schemas/categories.schema";
import CategoriesSection from "./components/CategoriesSection";
import OfferSection from "../home/components/OfferSection";
import ProductsSectionRandom from "../home/components/ProductsSectionRandom";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import ServiciosSection from "../home/components/ServiciosSection";

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
}
function ShopPage({
    categories,
    header,
    productslatestmapped,
    productsoffertsmapped,
    productlatestmapped,
    productmostdiscountmapped,
}: ShopPageProps) {
    return (
        <WebLayout header={header}>
            <div class="mt-20 lg:mt-10">
                <CategoriesSection categories={categories} />
                <ServiciosSection servicios={header.categoriesServices} />
                <OfferSection
                    productlatestmapped={productlatestmapped}
                    productsoffert8mapped={productsoffertsmapped}
                />

                <ProductsSectionRandom
                    productlatestmapped={productlatestmapped}
                    productmostdiscountmapped={productmostdiscountmapped}
                />
                <LatestProductSection ultimosproducto={productslatestmapped} />
            </div>
        </WebLayout>
    );
}

export default ShopPage;
