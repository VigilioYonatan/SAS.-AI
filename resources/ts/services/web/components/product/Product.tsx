import { storageEmpresa } from "@/empresas/stores/empresa.store";
import useProduct from "@/products/hooks/useProduct";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";
import { createContext } from "preact";
import enviroments from "~/config";

export const productContext = createContext(
	{} as {
		product: ReturnType<typeof useProduct>;
	},
);

interface ProductProps {
	children: JSX.Element | JSX.Element[];
	product: ProductsNormalSchemaFromServer | ProductsRestaurantSchemaFromServer;
	className?: string;
	isScript?: boolean;
}
function Product({
	children,
	product,
	className = "",
	isScript = true,
}: ProductProps) {
	const producto = useProduct({ product, isService: false });
	const isEccomerce = storageEmpresa?.setting.type_card === "eccomerce";

	return (
		<productContext.Provider value={{ product: producto }}>
			<div
				class={`product-card gap-1 ${isScript ? "initial" : ""} ${
					isEccomerce
						? ""
						: `dark:bg-background-dark bg-background-light ${
								storageEmpresa!.setting.bg_color_paper !==
								storageEmpresa!.setting.bg_color_background
									? "shadow"
									: ""
							}`
				} ${
					enviroments.TYPE_BORDER === "square"
						? ""
						: "rounded-md overflow-hidden"
				}    ${className} w-full `}
			>
				{children}
			</div>
		</productContext.Provider>
	);
}

export default Product;
