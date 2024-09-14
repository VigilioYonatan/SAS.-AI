import Footer from "./Footer";
import Header from "./Header";
import type { CategoriesSchema } from "@/products/schemas/categories.schema";
import useEmpresastore from "@/empresas/stores/empresa.store";
import CookiesMessage from "./CookiesMessage";
import ChatAi from "./ChatAi";
import NavTabs from "./NavTabs";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import useAuthStore from "@/auth/stores/auth.store";
const hiStorage = localStorage.getItem("use_hi");

export interface HeaderType {
    categories: (CategoriesSchema & {
        productNew:
            | ProductsNormalSchemaFromServer
            | ProductsRestaurantSchemaFromServer;
    })[];
}
interface WebLayoutProps {
    children: JSX.Element | JSX.Element[];
    header: HeaderType;
}
function WebLayout({ children, header }: WebLayoutProps) {
    const empresaStore = useEmpresastore();
    const authStore = useAuthStore();

    return (
        <>
            {authStore.state?.role_id === 1 && hiStorage !== "ok" ? (
                <div class="fixed top-20 right-4 w-[200px] dark:bg-background-dark bg-white  shadow p-2 rounded-md z-[999] ">
                    <span class="dark:text-white  text-center font-semibold text-xs  tracking-widest">
                        Agrega productos y categorías, Personaliza tu web para
                        que se vea mejor tu tienda virtual en{" "}
                        <i class="fa-solid fa-face-smile-wink text-yellow-400" />
                        .
                        <a
                            href="/admin/settings"
                            type="button"
                            class="bg-primary px-6 py-2 rounded-lg font-bold text-white mt-2 block"
                            aria-label="OK"
                            onClick={() => {
                                localStorage.setItem("use_hi", "ok");
                            }}
                        >
                            VAMOS
                        </a>
                    </span>
                </div>
            ) : null}

            <Header header={header} />
            {children}
            <div>
                <a
                    href={`https://wa.me/51${
                        empresaStore.state!.telephoneFirst
                    }`}
                    class="fixed bottom-16 right-10 z-[99] bg-green-600 w-[50px] h-[50px] flex justify-center items-center rounded-full text-white animate-bounce"
                >
                    <i class="fa-brands fa-whatsapp text-2xl" />
                </a>
                <ChatAi />
                <CookiesMessage />
            </div>
            <NavTabs />
            <Footer categories={header.categories} />
        </>
    );
}

export default WebLayout;
