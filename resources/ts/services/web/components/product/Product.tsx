import useProduct from "@/products/hooks/useProduct";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { createContext } from "preact";
import enviroments from "~/config";

export const productContext = createContext(
    {} as {
        product: ReturnType<typeof useProduct>;
    }
);

interface ProductProps {
    children: JSX.Element | JSX.Element[];
    product:
        | ProductsNormalSchemaFromServer
        | ProductsRestaurantSchemaFromServer;
    className?: string;
}
function Product({ children, product, className = "" }: ProductProps) {
    const producto = useProduct({ product });

    return (
        <productContext.Provider value={{ product: producto }}>
            <div
                class={`dark:bg-background-dark bg-background-light ${
                    enviroments.TYPE_BORDER === "square"
                        ? ""
                        : "rounded-md overflow-hidden"
                }   shadow-md ${className} w-full h-[428px]`}
            >
                {children}
            </div>
        </productContext.Provider>
    );
}

export default Product;
