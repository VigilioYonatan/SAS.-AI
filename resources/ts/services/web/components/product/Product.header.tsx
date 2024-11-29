import { useContext } from "react";
import { productContext } from "./Product";
import useEmpresastore, {
	storageEmpresa,
} from "@/empresas/stores/empresa.store";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";
import { isColorLight } from "~/libs/helpers";

interface ProductHeaderProps {
	className?: string;
	children?: JSX.Element | JSX.Element[] | null;
	isShowVariants?: boolean;
	isShowOffer?: boolean;
}
function ProductHeader({
	className = "",
	children = null,
	isShowVariants = true,
	isShowOffer = true,
}: ProductHeaderProps) {
	const { product } = useContext(productContext);
	const empresaStore = useEmpresastore();
	const isEccomerce = storageEmpresa?.setting.type_card === "eccomerce";
	const isHover = storageEmpresa?.setting.is_hover_product;

	return (
		<header class={`relative group overflow-hidden ${className} group w-full `}>
			{product.images500Variant.length &&
			[1, 3].includes(storageEmpresa!.tipo_empresa.tipo_servicio_id) ? (
				<>
					{product.images500Variant.length > 1 ? (
						<>
							<img
								class={`w-full ${
									isHover ? "block group-hover:hidden " : ""
								}   mx-auto group-hover:scale-105 delay-custom-1 ${
									isEccomerce
										? "h-[140px] md:h-[180px]"
										: "h-[180px] md:h-[250px]"
								}  ${
									storageEmpresa?.setting.isCoverImage
										? "object-cover"
										: "object-contain"
								}`}
								width={500}
								height={500}
								src={product.images500Variant[0]}
								alt={product.producto.value.name}
								title={product.producto.value.name}
							/>
							{isHover && product.images500Variant[1] ? (
								<img
									class={`w-full  hidden group-hover:block   mx-auto group-hover:scale-105 delay-custom-1 ${
										isEccomerce
											? "h-[140px] md:h-[180px]"
											: "h-[180px] md:h-[250px]"
									}  ${
										storageEmpresa?.setting.isCoverImage
											? "object-cover"
											: "object-contain"
									}`}
									width={500}
									height={500}
									src={product.images500[1]}
									alt={product.producto.value.name}
									title={product.producto.value.name}
								/>
							) : null}
						</>
					) : (
						<img
							class={`w-full   mx-auto group-hover:scale-105 delay-custom-1 ${
								isEccomerce
									? "h-[140px] md:h-[180px]"
									: "h-[180px] md:h-[250px]"
							}  ${
								storageEmpresa?.setting.isCoverImage
									? "object-cover"
									: "object-contain"
							}`}
							width={500}
							height={500}
							src={product.images500Variant[0]}
							alt={product.producto.value.name}
							title={product.producto.value.name}
						/>
					)}
				</>
			) : (
				<>
					{product.images500.length > 1 ? (
						<>
							<img
								class={`w-full ${
									isHover ? "block group-hover:hidden" : ""
								}   mx-auto group-hover:scale-105 delay-custom-1   ${
									isEccomerce
										? "h-[140px] md:h-[180px]"
										: "h-[180px] md:h-[250px]"
								}  ${
									storageEmpresa?.setting.isCoverImage
										? "object-cover"
										: "object-contain"
								}`}
								width={500}
								height={500}
								src={product.images500[0]}
								alt={product.producto.value.name}
								title={product.producto.value.name}
							/>
							{isHover && product.images500[1] ? (
								<img
									class={`w-full   hidden group-hover:block  mx-auto group-hover:scale-105 delay-custom-1   ${
										isEccomerce
											? "h-[140px] md:h-[180px]"
											: "h-[180px] md:h-[250px]"
									}  ${
										storageEmpresa?.setting.isCoverImage
											? "object-cover"
											: "object-contain"
									}`}
									width={500}
									height={500}
									src={product.images500[1]}
									alt={product.producto.value.name}
									title={product.producto.value.name}
								/>
							) : null}
						</>
					) : (
						<img
							class={`w-full   mx-auto group-hover:scale-105 delay-custom-1   ${
								isEccomerce
									? "h-[140px] md:h-[180px]"
									: "h-[180px] md:h-[250px]"
							}  ${
								storageEmpresa?.setting.isCoverImage
									? "object-cover"
									: "object-contain"
							}`}
							width={500}
							height={500}
							src={product.images500[0]}
							alt={product.producto.value.name}
							title={product.producto.value.name}
						/>
					)}
				</>
			)}

			{/* Se subio recien el producto 7 dias */}
			{isShowOffer ? (
				<div class="flex flex-col absolute top-0 m-1 right-0 gap-1 ">
					{product.producto.value.discount > 0 ? (
						<span
							style={{
								backgroundColor: empresaStore.state?.setting.bg_color_secondary,
								color: isColorLight(
									empresaStore.state!.setting.bg_color_secondary,
								)
									? "#000000"
									: "#ffffff",
							}}
							class=" text-white px-2 py-1 text-xs font-semibold rounded-md"
						>
							<i class="fa-solid fa-up" /> % {product.producto.value.discount}
						</span>
					) : null}
					{product.isProductNew ? (
						<span class=" bg-primary text-white px-2 py-1 text-xs font-semibold rounded-md text-center">
							Nuevo
						</span>
					) : null}{" "}
					{isShowVariants ? (
						<>
							{(
								product.producto.value as ProductsNormalSchemaFromServer
							)?.options?.map((option) => (
								<>
									{option.type === 2 ? (
										<div
											class=" flex-col  mx-2 h-[140px] gap-1 hidden md:flex  overflow-auto"
											key={option.id}
										>
											{option.features.map((feature) => {
												const existFeature = product
													.variant!.value!.map((feat) => feat.id)
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
														} shadow-lg min-w-[25px] max-w-[25px] min-h-[25px] max-h-[25px]  ${
															existFeature ? "border-2 border-black" : ""
														} `}
														style={{
															backgroundColor: feature.value,
														}}
														onClick={() =>
															product.changeVariant({
																option_id: option.id,
																id: feature.id,
															})
														}
													/>
												);
											})}
										</div>
									) : null}
								</>
							))}
						</>
					) : null}
				</div>
			) : null}

			{children ? children : null}
		</header>
	);
}

export default ProductHeader;
