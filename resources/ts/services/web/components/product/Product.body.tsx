import { useContext } from "preact/hooks";
import { removeTextHTML } from "~/libs/helpers";
import { productContext } from "./Product";
import { storageInformation } from "@/information/stores/information.store";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";

interface ProductBodyProps {
	showDescription: boolean;
}
function ProductBody({ showDescription }: ProductBodyProps) {
	const { product } = useContext(productContext);

	return (
		<div class="flex flex-col gap-2 py-2  w-full">
			<style jsx>{`
                .slick-slide > div {
                    margin-inline: 4px;
                    outline: none;
                }
            `}</style>
			{storageInformation?.tipo_empresa.tipo_servicio_id === 2 ? (
				<div>
					{(product.producto.value as ProductsRestaurantSchemaFromServer)
						.ilimit ? (
						<span class="font-semibold dark:text-white text-xs">En stock</span>
					) : (product.producto.value! as ProductsRestaurantSchemaFromServer)
							.stock! > 0 ? (
						<span class="font-semibold dark:text-white text-xs">
							{
								(product.producto.value! as ProductsRestaurantSchemaFromServer)
									.stock
							}{" "}
							unidades
						</span>
					) : (
						<span class="text-danger font-semibold text-xs">Agotado</span>
					)}
				</div>
			) : null}
			<a
				href={`/${product.producto.value.slug}`}
				class="line-clamp-2 text-sm  md:text-base font-semibold dark:text-white hover:text-primary dark:hover:text-primary delay-custom-1 "
			>
				{product.producto.value.name}
			</a>
			{showDescription && product.producto.value.description ? (
				<p class="text-gray-400   line-clamp-3  h-[70px]  w-full">
					{removeTextHTML(product.producto.value.description)}
				</p>
			) : null}
		</div>
	);
}

export default ProductBody;
