import { useContext } from "react";
import { productContext } from "./Product";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";

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
				class={`w-full   mx-auto group-hover:scale-105 delay-custom-1 h-[180px] md:h-[250px] ${
					storageEmpresa?.setting.isCoverImage
						? "object-cover"
						: "object-contain"
				}`}
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
			{(product.producto.value as ProductsNormalSchemaFromServer)?.options?.map(
				(option) => (
					<>
						{option.type === 2 ? (
							<div
								class="flex flex-col absolute top-0 m-2 gap-2"
								key={option.id}
							>
								{option.features.map((feature) => {
									const existFeature = product
										.variant!.value!.map((feat) => feat.feature_id)
										.includes(feature.id);

									return (
										<button
											key={feature.id}
											type="button"
											aria-label="change"
											class={`${
												storageEmpresa?.setting.type_border === "square"
													? ""
													: "rounded-full"
											} shadow-lg w-[25px] h-[25px]  ${
												existFeature ? "border-2 border-black" : ""
											} `}
											style={{
												backgroundColor: feature.value,
											}}
											onClick={() =>
												product.changeVariant({
													option_id: option.id,
													feature_id: feature.id,
												})
											}
										>
											<span class="text-white hidden">
												{feature.description}
											</span>
										</button>
									);
								})}
							</div>
						) : null}
					</>
				),
			)}
			{children ? children : null}
		</header>
	);
}

export default ProductHeader;
