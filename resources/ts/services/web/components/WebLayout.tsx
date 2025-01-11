import Footer from "./Footer";
import Header from "./Header";
import type { CategoriesSchema } from "@/products/schemas/categories.schema";
import useEmpresastore from "@/empresas/stores/empresa.store";
import CookiesMessage from "./CookiesMessage";
import ChatAi from "./ChatAi";
import NavTabs from "./NavTabs";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { BrandsSchema } from "@/products/schemas/brands.schema";
import MessagePWA from "../views/home/components/MessagePWA";
import { ProductsServicioSchemaFromServer } from "@/products/schemas/products_servicio.schema";
import { SubcategoriesSchemaFromServer } from "@/products/schemas/subcategories.schema";
import PalleteCustom from "./PalleteCustom";

export interface HeaderType {
    categories: (CategoriesSchema & {
        productNew:
            | ProductsNormalSchemaFromServer
            | ProductsRestaurantSchemaFromServer;
        subcategories: SubcategoriesSchemaFromServer[];
    })[];
    categoriesServices: (CategoriesSchema & {
        products: ProductsServicioSchemaFromServer[];
    })[];
    brands: Pick<BrandsSchema, "id" | "name" | "image" | "slug">[];
    totalProducts: number;
}
interface WebLayoutProps {
    children: JSX.Element | JSX.Element[];
    header: HeaderType;
}

function WebLayout({ children, header }: WebLayoutProps) {
    const empresaStore = useEmpresastore();

    return (
        <>
            <MessagePWA />
            {/* <LoaderCharging /> */}
            {/* <MessageNew /> */}
            <Header header={header} />
            {children}
            <div>
                <a
                    aria-label="Más información sobre nuestros servicios en whatsapp"
                    href={`https://wa.me/${empresaStore.state!.dial_code}${
                        empresaStore.state!.telephoneFirst
                    }`}
                    class="fixed bottom-16 right-10 z-[99] bg-green-600 w-[50px] h-[50px] flex justify-center items-center rounded-full text-white animate-bounce"
                >
                    <i class="fa-brands fa-whatsapp text-2xl" />
                </a>
                <PalleteCustom />
                <ChatAi />
                <CookiesMessage />
            </div>
            <NavTabs totalProducts={header.totalProducts} />
            <Footer
                categories={header.categories}
                categoriesServices={header.categoriesServices}
            />
        </>
    );
}

export default WebLayout;
