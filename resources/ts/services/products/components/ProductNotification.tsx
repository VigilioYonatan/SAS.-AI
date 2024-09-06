import { printImagesProduct } from "../libs/helpers";
import { ProductsNormalSchemaFromServer } from "../schemas/products_normal.schema";
import { ProductsRestaurantSchemaFromServer } from "../schemas/products_restaurant.schema";
import { ProductsServicioSchemaFromServer } from "../schemas/products_servicio.schema";
interface ProductNotificationProps {
	product:
		| ProductsNormalSchemaFromServer
		| ProductsRestaurantSchemaFromServer
		| ProductsServicioSchemaFromServer;
}
function ProductNotification({ product }: ProductNotificationProps) {
	return (
		<div class="flex gap-4 items-center">
			<img
				width={100}
				height={100}
				src={printImagesProduct(product.images, 100)[0]}
				alt={product.name}
			/>
			<div class="flex flex-col  gap-2">
				<span class="dark:text-secondary-light text-secondary-dark text-xs font-bold">
					{product.name}
				</span>
				<p class="dark:text-secondary-light text-secondary-dark text-xs">
					Añadido correctamente
				</p>
				<div class="flex gap-2 items-center dark:text-white text-xs">
					<i class="fas fa-shopping-cart" />1 unidad añadido.
				</div>
			</div>
		</div>
	);
}

export default ProductNotification;
