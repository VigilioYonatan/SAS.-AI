import Product from "./Product";
import ProductBody from "./Product.body";
import ProductButtons from "./Product.buttons";
import ProductFooter from "./Product.footer";
import ProductHeader from "./Product.header";

const ProductCard = Object.assign(Product, {
	header: ProductHeader,
	buttons: ProductButtons,
	body: ProductBody,
	footer: ProductFooter,
});
export default ProductCard;
