import { FiltersKey } from "@/admin/views/Local";
import { formatMoney } from "@/cart/libs/helpers";
import { productsLocalsPaginatorApi } from "@/common/paginator/products.local.paginator.api";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { BrandsSchemaFromServer } from "@/products/schemas/brands.schema";
import { FeaturesSchema } from "@/products/schemas/options/features.schema";
import { OptionsSchema } from "@/products/schemas/options/options.schema";
import { SubcategoriesSchemaFromServer } from "@/products/schemas/subcategories.schema";
import ProductCard from "@/web/components/product";
import TitleSection from "@/web/components/TitleSection";
import TitleSectionTwo from "@/web/components/TitleSectionTwo";
import WebBreadCrumb from "@/web/components/WebBreadCrumb";
import type { HeaderType } from "@/web/components/WebLayout";
import WebLayout from "@/web/components/WebLayout";
import WebPaginationFooter from "@/web/components/WebPaginatorFooter";
import { Signal, useSignal } from "@preact/signals";
import usePaginator, { type UsePaginator } from "@vigilio/preact-paginator";
import { type ChangeEvent } from "preact/compat";
import { useEffect } from "preact/hooks";
import Loader from "~/components/Loader";
import enviroments from "~/config";
import useDropdown, { type UseDropdown } from "~/hooks/useDropdown";
import { deepEqual } from "~/libs/helpers";
import { printFileWithDimension } from "~/libs/upload";
import { initialTypeSection, ordenar } from "./CategoriesPage";
import { bgPrimaryHover } from "~/config/settings";

export interface Discounts {
	quantity: number;
	value: number;
}
interface SubCategoriesPageProps {
	header: HeaderType;
	subcategory: SubcategoriesSchemaFromServer;
	priceminmax: { min: number; max: number };
	discounts: Discounts[];
	optionsfeatures:
		| (OptionsSchema & {
				features: (FeaturesSchema & { quantity: number })[];
		  })[]
		| null;
	brands: (BrandsSchemaFromServer & { quantity: number })[] | null;
}
function SubCategoriesPage({
	header,
	subcategory,
	priceminmax,
	discounts,
	brands,
	optionsfeatures,
}: SubCategoriesPageProps) {
	const filters = useSignal<Record<FiltersKey, string | null>>({
		category: subcategory.category.slug,
		subcategory: subcategory.slug,
		min: null,
		max: null,
		discount: null,
		brand: null,
		estado: null,
		optionFeature: null,
	});
	const orderFilter = useSignal<[string, string][]>([]);
	const paginator = usePaginator({ limit: 28 }, true); // true. muestra url arriba pagina ?page=3
	const showFilter = useDropdown();
	const typeSection = useSignal(initialTypeSection());
	const isEccomerce = storageEmpresa?.setting.type_card === "eccomerce";

	const categoriesPaginator = productsLocalsPaginatorApi(
		paginator,
		filters,
		orderFilter.value,
	);

	useEffect(() => {
		categoriesPaginator.refetch(false);
	}, [
		paginator.pagination.page, // si cambia  las paginas
		orderFilter.value, // si cambia  los ordenes
		paginator.pagination.value.limit, // si cambia el limite
		filters.value, // si cambia el minimo
		paginator.search.debounceTerm, // cuando busca
	]);

	useEffect(() => {
		document.body.classList.toggle("overflow-hidden", showFilter.dropdownOpen);
	}, [showFilter.dropdownOpen]);

	function changeFilter(e: ChangeEvent) {
		const split = (e.target as HTMLSelectElement).value.split(" - ");
		orderFilter.value = [[split[0], split[1]]];
		paginator.pagination.onChangePage(1);
	}

	function onChangeValueMin(min: number) {
		filters.value = {
			...filters.value,
			min: min.toString(),
		};
		showFilter.onClose();
	}

	let component = null;
	if (categoriesPaginator.isLoading) {
		component = (
			<div class="w-full min-h-[500px] flex justify-center items-center">
				<Loader />
			</div>
		);
	}
	if (categoriesPaginator.isError) {
		component = <div>Error...</div>;
	}
	if (categoriesPaginator.isSuccess) {
		component = (
			<div
				class={`flex flex-col w-full  gap-4 delay-custom-1 ${
					categoriesPaginator.isFetching ? "opacity-70" : ""
				}`}
			>
				<div class="">
					<div class="flex items-center w-full justify-between mb-3 gap-2">
						<div class="flex items-center gap-2 justify-between w-full">
							<button
								class={`text-2xl hover:bg-primary  dark:bg-background-dark bg-background-light   ${bgPrimaryHover()} delay-custom-1 py-2 px-3 border border-gray-300 dark:text-white lg:hidden ${
									enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
								}`}
								type="button"
								aria-label="square"
								onClick={showFilter.onOpenClose}
							>
								<i class="far fa-filter" />
							</button>

							<div class="flex items-center justify-between gap-2">
								<button
									class={`text-2xl bg-background-light dark:bg-background-dark dark:text-white py-2 px-3 border   hover:bg-primary   ${bgPrimaryHover()} delay-custom-1  ${
										typeSection.value === "rows"
											? "bg-primary text-white dark:bg-primary "
											: "border-gray-300 dark:text-white"
									} ${
										enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
									}`}
									type="button"
									aria-label="square"
									onClick={() => {
										typeSection.value = "rows";
										localStorage.setItem("typeSection", "rows");
									}}
								>
									<i class="fa-thin fa-light fa-grid-2" />
								</button>
								<button
									class={`text-2xl bg-background-light dark:bg-background-dark dark:text-white py-2 px-3 border   hover:bg-primary   ${bgPrimaryHover()} delay-custom-1  ${
										typeSection.value === "cols"
											? "bg-primary text-white dark:bg-primary"
											: "border-gray-300 dark:text-white"
									} ${
										enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
									}`}
									type="button"
									aria-label="square"
									onClick={() => {
										typeSection.value = "cols";
										localStorage.setItem("typeSection", "cols");
									}}
								>
									<i class="fa-thin fa-bars" />
								</button>
							</div>
						</div>
						<select
							class={`py-3 px-4 text-sm outline-none border bg-background-light delay-custom-1 border-gray-200 dark:bg-background-dark dark:text-white hidden sm:block ${
								enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
							}`}
							onChange={changeFilter}
							name="orden"
							id="orden"
						>
							<option value="">Filtrar</option>
							{ordenar.map((orden) => (
								<option key={orden.key} value={orden.key}>
									{orden.value}
								</option>
							))}
						</select>
					</div>
					{categoriesPaginator.data!.results.length ? (
						<div class="flex flex-col gap-6 ">
							<div
								class={`    min-h-[500px] gap-4 grid ${
									typeSection.value === "rows"
										? isEccomerce
											? "grid-cols-3 md:grid-cols-4"
											: "grid-cols-2 md:grid-cols-3 "
										: ""
								}`}
							>
								{categoriesPaginator.data!.results.map((product) => (
									<ProductCard
										product={product}
										key={product.id}
										className={`self-start ${
											typeSection.value === "cols"
												? "flex flex-col sm:flex-row items-center gap-4"
												: "flex flex-col"
										}`}
									>
										<ProductCard.header
											className={`${
												typeSection.value === "cols"
													? "[&>img]:h-[300px] [&>img]:w-[300px]"
													: " [&>img]:w-[200px]"
											}`}
										>
											<ProductCard.buttons isAbsolute />
										</ProductCard.header>
										<div class="w-full">
											<ProductCard.body
												showDescription={typeSection.value === "cols"}
											/>
											<ProductCard.footer
												showButtonCart={typeSection.value === "rows"}
											/>
										</div>
									</ProductCard>
								))}
							</div>

							<div class="flex gap-2 items-center ">
								{paginator.pagination.totalPages > 1 ? (
									<WebPaginationFooter paginator={paginator} />
								) : null}
							</div>
						</div>
					) : (
						<span class="dark:text-white mt-4 font-semibold">
							No hay productos
						</span>
					)}
				</div>
			</div>
		);
	}

	return (
		<WebLayout header={header}>
			<section class="max-w-6xl mx-auto min-h-[600px] flex flex-col px-2  mt-28 lg:my-4">
				<div class="">
					<WebBreadCrumb
						current={subcategory.name}
						uris={[
							{
								title: "Tienda",
								uri: "/shop",
							},
						]}
					/>
				</div>
				<TitleSection>
					<span class="flex items-center gap-2 justify-center">
						{subcategory.name}
					</span>
				</TitleSection>
				<div class=" gap-4 w-full flex ">
					{/* aside filters desktop */}
					<div class="hidden lg:w-[300px] lg:block">
						<FiltersAside
							subcategory={subcategory}
							filters={filters}
							onChangeValue={onChangeValueMin}
							paginator={paginator}
							priceminmax={priceminmax}
							showFilter={showFilter}
							discounts={discounts}
							optionsfeatures={optionsfeatures}
							brands={brands}
						/>
					</div>
					{/* aside filters mobile */}
					<div
						class={`fixed inset-0 z-[9999] bg-black bg-opacity-60 lg:hidden delay-custom-1 ${
							showFilter.dropdownOpen ? "visible" : "invisible"
						}`}
					>
						<div
							class={`w-full p-4 sm:max-w-[350px] h-full dark:bg-background-dark bg-paper-light delay-custom-1 ${
								showFilter.dropdownOpen ? "translate-x-0" : "-translate-x-full"
							}`}
							ref={showFilter.dropdown}
						>
							<div class="py-3 text-xl font-bold dark:text-white flex justify-between items-center px-4">
								<h3 class="py-3 text-xl font-bold dark:text-white">Filtros</h3>
								<button
									type="button"
									aria-label="close"
									onClick={() => showFilter.onClose()}
								>
									X
								</button>
							</div>

							<div class="h-[1px] w-full bg-gray-300 mb-3" />
							<div class="h-[calc(100vh-150px)] overflow-auto">
								<FiltersAside
									paginator={paginator}
									showFilter={showFilter}
									filters={filters}
									priceminmax={priceminmax}
									onChangeValue={onChangeValueMin}
									subcategory={subcategory}
									onClose={() => showFilter.onClose()}
									discounts={discounts}
									brands={brands}
									optionsfeatures={optionsfeatures}
								/>
							</div>
						</div>
					</div>
					{component}
				</div>
			</section>
		</WebLayout>
	);
}

interface RangeComponentProps {
	onChangeValue: (value: number) => void;
	priceminmax: { min: number; max: number };
	initialValue?: number;
	onClose?: () => void;
}
export function RangeComponent({
	onChangeValue,
	priceminmax,
	initialValue = 0,
	onClose,
}: RangeComponentProps) {
	const rangeValue = useSignal<number>(initialValue); // Valor inicial del rango
	// si pasa mas de 10000 que sea menos de 10000
	const valueMax = priceminmax.max > 10000 ? 10000 : priceminmax.max;

	function handleRangeChange(e: ChangeEvent) {
		const value: number = Number.parseInt((e.target as HTMLInputElement).value);
		rangeValue.value = value;
	}

	function onSend() {
		onChangeValue(rangeValue.value);
		if (onClose) {
			onClose();
		}
	}
	return (
		<div class="">
			<label
				htmlFor="range"
				class="block text-sm font-medium  dark:text-gray-400"
			>
				Filtrar por valor:
			</label>
			<div class="flex gap-2 items-center w-full">
				<input
					type="range"
					class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer "
					min="0"
					max={valueMax ?? 0}
					value={rangeValue.value}
					onChange={handleRangeChange}
				/>
				<button
					type="button"
					class="bg-primary text-white rounded-md  px-2 py-0.5"
					onClick={onSend}
					aria-label="send"
				>
					<i class="fas fa-search text-xs" />
				</button>
			</div>

			<div class="flex justify-between mt-2  dark:text-gray-400">
				<span class="text-sm ">0</span>
				<span class="text-sm ">{formatMoney(valueMax ?? 0)}</span>
			</div>
			<p class="mt-2 text-sm  dark:text-gray-400">
				Valor seleccionado: {formatMoney(rangeValue.value)}
			</p>
		</div>
	);
}

interface FiltersAsideProps {
	showFilter: UseDropdown;
	filters: Signal<Record<FiltersKey, string | null>>;
	onChangeValue: (value: number) => void;
	priceminmax: { min: number; max: number };
	subcategory: SubcategoriesSchemaFromServer;
	onClose?: () => void;
	discounts: Discounts[];
	optionsfeatures:
		| (OptionsSchema & {
				features: (FeaturesSchema & { quantity: number })[];
		  })[]
		| null;
	paginator: UsePaginator;

	brands: (BrandsSchemaFromServer & { quantity: number })[] | null;
}
export function FiltersAside({
	filters,
	onChangeValue,
	priceminmax,
	subcategory,
	onClose,
	discounts,
	brands,
	optionsfeatures,
	paginator,
}: FiltersAsideProps) {
	return (
		<div class="w-full flex-col gap-4 flex">
			<div
				class={`${
					enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
				} overflow-hidden group h-[200px]`}
			>
				{subcategory.image ? (
					<img
						class="group-hover:scale-110 delay-custom-1 w-full h-full object-cover"
						src={printFileWithDimension(subcategory.image, 800)[0]}
						width={800}
						height={300}
						alt={subcategory.name}
					/>
				) : null}
			</div>
			<div
				class={`p-4  border border-gray-300 dark:bg-background-dark bg-background-light ${
					enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
				}`}
			>
				<TitleSectionTwo>Rango de Precio</TitleSectionTwo>
				<RangeComponent
					priceminmax={priceminmax}
					onChangeValue={onChangeValue}
					onClose={onClose}
				/>
			</div>
			{/*  */}
			{optionsfeatures
				?.filter((opt) => opt.features.some((opt) => opt.option_id !== 1))
				?.map((opt) => {
					const show = useSignal(false);
					return (
						<div
							class={`p-4 border border-gray-300 dark:bg-background-dark bg-background-light ${
								enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
							}`}
							key={opt.id}
						>
							<TitleSectionTwo>{opt.name}</TitleSectionTwo>
							<>
								{opt.type === 2 ? (
									<div class="flex flex-col">
										<div class="flex flex-wrap gap-1">
											{opt.features
												.filter((opt) => opt.option_id !== 1)
												.map((feature) => (
													<div
														type="button"
														aria-label="change color"
														onClick={() => {
															paginator.pagination.onChangePage(1);
															if (
																filters.value.optionFeature ===
																`{"option_id":${opt.id},"feature_id":${feature.id}}`
															) {
																filters.value = {
																	...filters.value,
																	optionFeature: null,
																};
															} else {
																filters.value = {
																	...filters.value,
																	optionFeature: `{"option_id":${opt.id},"feature_id":${feature.id}}`,
																};
															}

															if (onClose) {
																onClose();
															}
														}}
														key={feature.id}
														class={`${
															enviroments.TYPE_BORDER === "circle"
																? "rounded-full"
																: "rounded"
														}  w-[30px] h-[30px] shadow ${
															filters.value.optionFeature
																? deepEqual(
																		[JSON.parse(filters.value.optionFeature)],
																		[
																			{
																				option_id: opt.id,
																				feature_id: feature.id,
																			},
																		],
																	)
																	? "border-4 border-primary"
																	: ""
																: ""
														}`}
														style={{
															background: feature.value,
														}}
													/>
												))}
										</div>
									</div>
								) : (
									<>
										<div
											class={`flex flex-col ${
												show.value
													? "max-h-[500px]"
													: "max-h-[120px] overflow-hidden"
											}`}
										>
											{opt.features
												.filter((opt) => opt.option_id !== 1)
												.map((feature) => (
													<label
														htmlFor={feature.value}
														class="flex gap-2 text-sm "
														key={feature.value}
													>
														<input
															type="checkbox"
															id={feature.value}
															value={feature.value}
															checked={
																filters.value.optionFeature
																	? deepEqual(
																			[JSON.parse(filters.value.optionFeature)],
																			[
																				{
																					option_id: opt.id,
																					feature_id: feature.id,
																				},
																			],
																		)
																	: false
															}
															onChange={() => {
																paginator.pagination.onChangePage(1);
																if (onClose) {
																	onClose();
																}
																filters.value = {
																	...filters.value,
																	optionFeature: `{"option_id":${opt.id},"feature_id":${feature.id}}`,
																};
															}}
														/>
														<span class=" dark:text-gray-400 hover:text-primary">
															{feature.description} ({feature.quantity})
														</span>
													</label>
												))}
										</div>
										{opt.features.length > 6 ? (
											<button
												type="button"
												aria-label="more"
												class="text-xs"
												onClick={() => {
													show.value = !show.value;
												}}
											>
												{show.value ? "Ocultar" : "Ver más"}
											</button>
										) : null}
									</>
								)}
							</>
						</div>
					);
				})}

			{brands?.length ? (
				<div
					class={`p-4 border border-gray-300 dark:bg-background-dark bg-background-light $ {
                        enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
                    }`}
				>
					<TitleSectionTwo>Marcas</TitleSectionTwo>
					<div class="flex flex-col">
						{brands.map((brand) => (
							<label
								htmlFor={brand.slug}
								class="flex gap-2 text-sm"
								key={brand.id}
							>
								<input
									type="checkbox"
									id={brand.slug}
									value={brand.slug}
									onChange={() => {
										const existBrand = filters.value.brand === brand.slug;
										if (onClose) {
											onClose();
										}
										if (existBrand) {
											filters.value = {
												...filters.value,
												brand: null,
											};
											return;
										}
										filters.value = {
											...filters.value,
											brand: brand.slug,
										};
									}}
									checked={filters.value.brand === brand.slug}
								/>
								<span class=" dark:text-gray-400 hover:text-primary">
									{brand.name} <span class="text-xs">({brand.quantity})</span>
								</span>
							</label>
						))}
					</div>
				</div>
			) : null}
			<div
				class={`p-4 border border-gray-300 dark:bg-background-dark bg-background-light ${
					enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
				}`}
			>
				<TitleSectionTwo>Descuentos</TitleSectionTwo>
				<div class="flex flex-col">
					{discounts.map((discount, i) => (
						<label
							htmlFor={`${discount.value}${i + 1}`}
							class="flex gap-2 text-sm"
							key={`${discount.value}${i + 1}`}
						>
							<input
								type="checkbox"
								id={`${discount}${i + 1}`}
								value={discount.value}
								onChange={() => {
									const existBrand =
										filters.value.discount === discount.value.toString();
									if (onClose) {
										onClose();
									}
									if (existBrand) {
										filters.value = {
											...filters.value,
											discount: null,
										};
										return;
									}
									filters.value = {
										...filters.value,
										discount: discount.value.toString(),
									};
								}}
								checked={filters.value.discount === discount.value.toString()}
							/>
							<div class=" dark:text-gray-400 hover:text-primary flex  items-center gap-1">
								<span>Desde {discount.value}% OFF</span>
								<span class="text-xs">({discount.quantity})</span>
							</div>
						</label>
					))}
				</div>
			</div>
		</div>
	);
}
export function createIncrementArray(
	max: number,
	min: number,
	step: number,
): number[] {
	const originalArray = Array.from({ length: max }, (_, i) => i);
	const incrementArray = [];

	for (let i = min; i < originalArray.length; i += step) {
		incrementArray.push(originalArray[i]);
	}

	return incrementArray;
}
export default SubCategoriesPage;
