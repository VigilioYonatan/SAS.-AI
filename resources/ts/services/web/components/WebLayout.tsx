import Footer from "./Footer";
import Header from "./Header";
import type { CategoriesSchema } from "@/products/schemas/categories.schema";
import useEmpresastore, {
    storageEmpresa,
} from "@/empresas/stores/empresa.store";
import CookiesMessage from "./CookiesMessage";
import ChatAi from "./ChatAi";
import NavTabs from "./NavTabs";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { BrandsSchema } from "@/products/schemas/brands.schema";
import MessageNew from "../views/home/components/MessageNew";
import MessagePWA from "../views/home/components/MessagePWA";
import { ProductsServicioSchemaFromServer } from "@/products/schemas/products_servicio.schema";
import { SubcategoriesSchemaFromServer } from "@/products/schemas/subcategories.schema";
import { useEffect } from "preact/hooks";
import { ColorResult, SketchPicker } from "react-color";
import { useSignal } from "@preact/signals";
import { getColorPrimary } from "~/libs/helpers";

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
    const color = useSignal(getColorPrimary());
    const showPallete = useSignal(false);
    function handleChangeComplete(newColor: ColorResult) {
        color.value = newColor.hex;
    }
    useEffect(() => {
        document.documentElement.style.setProperty("--primary", color.value); // Cambia el color a rojo
    }, [color.value]);
    useEffect(() => {
        if (storageEmpresa?.setting.web_script) {
            const script = document.createElement("script");
            const div = document.querySelector("body");
            script.innerHTML = storageEmpresa.setting.web_script;
            div?.appendChild(script);
            // Limpieza del script para evitar problemas
            return () => {
                document.body.removeChild(script);
            };
        }
    }, []);
    return (
        <>
            <MessagePWA />

            <MessageNew />
            <Header header={header} />
            {children}
            <div>
                {storageEmpresa?.isTemplate ? (
                    <div class="">
                        <button
                            class="fixed bottom-44 right-10 z-[99]  bg-white shadow dark:bg-background-dark w-[50px] h-[50px] flex justify-center items-center rounded-full text-black"
                            type="button"
                            aria-label="open chat ai"
                            onClick={() => {
                                showPallete.value = !showPallete.value;
                            }}
                        >
                            <i class="fa-sharp fa-regular fa-palette" />
                        </button>
                        {showPallete.value ? (
                            <div class="  bottom-56 right-10 fixed">
                                <SketchPicker
                                    color={color.value}
                                    onChangeComplete={handleChangeComplete}
                                />
                            </div>
                        ) : null}
                    </div>
                ) : null}
                <a
                    href={`https://wa.me/${empresaStore.state!.dial_code}${
                        empresaStore.state!.telephoneFirst
                    }`}
                    class="fixed bottom-16 right-10 z-[99] bg-green-600 w-[50px] h-[50px] flex justify-center items-center rounded-full text-white animate-bounce"
                >
                    <i class="fa-brands fa-whatsapp text-2xl" />
                </a>
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
