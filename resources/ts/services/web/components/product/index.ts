import Product from "./Product";
import ProductBody from "./Product.body";
import ProductFooter from "./Product.footer";
import ProductHeader from "./Product.header";
import ProductButtons2 from "./Product.button2";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import ProductButtons from "./Product.buttons";

const ProductCard = Object.assign(Product, {
	header: ProductHeader,
	buttons:
		storageEmpresa?.setting.type_product_buttons === "first"
			? ProductButtons
			: ProductButtons2,
	body: ProductBody,
	footer: ProductFooter,
});
export default ProductCard;
