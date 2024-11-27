import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { productsLocalsPaginatorApi } from "@/common/paginator/products.local.paginator.api";
import usePaginator from "@vigilio/preact-paginator";
import Container from "../components/Container";
import PaginationFooter from "~/components/PaginationFooter";
import Loader from "~/components/Loader";
import { categoriesIndexApi } from "@/products/apis/categories/categories.index.api";
import MesasIndex from "@/orders/views/MesasIndex";
import { FiltersKey } from "./Local";
import ProductCardRestaurant from "@/products/components/ProductCardRestaurant";
import { ProductsRestaurantSchemaFromServer } from "@/products/schemas/products_restaurant.schema";

function Local() {
	return <MesasIndex />;
}
export function ProductsLocal() {
	const filters = useSignal<Record<FiltersKey, string | null>>({
		category: null,
		max: null,
		min: null,
		discount: null,
		brand: null,
		estado: null,
		optionFeature: null,
		subcategory: null,
	});

	const paginator = usePaginator();

	const productsPaginator = productsLocalsPaginatorApi(paginator, filters);
	const categoriesIndexQuery = categoriesIndexApi(false);

	useEffect(() => {
		productsPaginator.refetch(false);
	}, [
		paginator.pagination.page,
		paginator.pagination.value.limit,
		paginator.search.debounceTerm,
	]);

	useEffect(() => {
		productsPaginator.refetch(false);
	}, [filters.value]);

	function onChangeFilter(props: Partial<Record<FiltersKey, string | null>>) {
		filters.value = { ...filters.value, ...props };
	}

	return (
		<Container className="p-2 ">
			<div class="">
				<div class="flex gap-2 items-center flex-wrap justify-between">
					<div class="flex  w-full items-center gap-2 ">
						<search class="w-full lg:w-[200px] h-[2.5rem] flex items-center gap-2 text-xs rounded-lg  overflow-hidden dark:text-secondary-light text-secondary-dark dark:bg-admin-terciary bg-paper-light my-1 shadow-sm border border-gray-200 dark:border-gray-600">
							<input
								class="outline-none bg-transparent  w-full px-2 sm:text-sm font-normal"
								onChange={(e) =>
									paginator.search.onSearchByName(
										(e.target as HTMLInputElement).value,
									)
								}
								value={paginator.search.value}
								id="table-search-users"
								placeholder={"Buscar..."}
							/>
						</search>
						<button
							aria-label="refetch"
							type="button"
							class="bg-primary p-2 flex justify-center items-center rounded-md"
							onClick={() => productsPaginator.refetch(true)}
						>
							<i class="fas fa-sync-alt " />
						</button>
					</div>
					<div class="flex gap-2 items-center flex-wrap justify-center">
						{/* categories */}
						<div class="flex w-full sm:w-auto  gap-1 flex-col">
							<select
								name="categorias"
								onChange={(e) => {
									const slug = (e.target as HTMLSelectElement).value;

									onChangeFilter({
										category: slug.length ? slug : null,
									});
								}}
								class="px-4 py-2 rounded-md font-semibold bg-paper-light dark:bg-admin-terciary  dark:text-white shadow min-w-[150px]"
							>
								<option
									selected={
										filters.value.category
											? !filters.value.category.length
											: false
									}
									value={""}
								>
									Todos
								</option>
								{categoriesIndexQuery.data?.data.map((cat) => (
									<option
										key={cat.id}
										selected={cat.slug === filters.value.category}
										value={cat.slug}
									>
										{cat.name}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
				<div class="my-6 grid grid-cols-2 justify-center items-center gap-4 md:grid-cols-3 lg:grid-cols-4   ">
					{productsPaginator.isLoading || productsPaginator.isFetching ? (
						<div class="flex justify-center min-h-[450px] items-center w-full">
							<Loader />
						</div>
					) : (
						<>
							{productsPaginator.data?.results.length ? (
								<>
									{productsPaginator.data?.results.map((product) => (
										<ProductCardRestaurant
											product={product as ProductsRestaurantSchemaFromServer}
											key={product.id}
											refetch={productsPaginator.refetch}
										/>
									))}
								</>
							) : (
								<span class="dark:text-white font-bold text-sm">
									No hay productos{" "}
									<a
										href="/admin/productos"
										class="bg-primary text-white px-4 py-2 rounded-md ml-2"
									>
										+
									</a>
								</span>
							)}
						</>
					)}
				</div>
				{productsPaginator.data?.results.length ? (
					<PaginationFooter paginator={paginator} />
				) : null}
			</div>
		</Container>
	);
}
export default Local;
