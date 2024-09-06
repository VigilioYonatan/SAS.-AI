import { useContext } from "react";
import { productContext } from "./Product";

interface ProductHeaderProps {
	className?: string;
	children?: JSX.Element | JSX.Element[] | null;
}
function ProductHeader({
	className = "",
	children = null,
}: ProductHeaderProps) {
	const { product } = useContext(productContext);

	return (
		<header class={`relative group overflow-hidden ${className} group w-full`}>
			<img
				class="w-full h-full object-contain mx-auto group-hover:scale-105 delay-custom-1"
				width={500}
				height={500}
				src={product.images500[0]}
				alt={product.producto.value.name}
			/>

			{/* Se subio recien el producto 7 dias */}
			<div class="flex flex-col absolute top-0 m-1 right-0 gap-1 ">
				{product.producto.value.discount > 0 ? (
					<span class=" bg-danger text-white px-2 py-1 text-xs font-semibold rounded-md">
						<i class="fa-solid fa-up" /> % {product.producto.value.discount}
					</span>
				) : null}
				{product.isProductNew ? (
					<span class=" bg-primary text-white px-2 py-1 text-xs font-semibold rounded-md text-center">
						Nuevo
					</span>
				) : null}
			</div>

			{children ? children : null}
		</header>
	);
}

export default ProductHeader;
