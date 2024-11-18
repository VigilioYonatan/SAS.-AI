import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { productsLocalsPaginatorApi } from "@/common/paginator/products.local.paginator.api";
import usePaginator from "@vigilio/preact-paginator";
import AdminBreadCrumb from "../components/AdminBreadCrumb";
import Container from "../components/Container";
import ProductCardAdmin from "@/products/components/ProductCardAdmin";
import PaginationFooter from "~/components/PaginationFooter";
import Loader from "~/components/Loader";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import OrdersIndex from "@/orders/views/OrdersIndex";
import { categoriesIndexApi } from "@/products/apis/categories/categories.index.api";
import { ProductsNormalSchemaFromServer } from "@/products/schemas/products_normal.schema";

export type FiltersKey =
	| "category"
	| "brand"
	| "max"
	| "min"
	| "optionFeature"
	| "estado"
	| "discount"
	| "subcategory";
function Local() {
	const filters = useSignal<Record<FiltersKey, string | null>>({
		category: null,
		brand: null,
		max: null,
		min: null,
		optionFeature: null,
		estado: null,
		discount: null,
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
			<div className="flex flex-col gap-4 mx-1">
				<AdminBreadCrumb current="local" />
			</div>
			<button
				type="button"
				aria-label="to open pedidos"
				class="flex justify-center gap-2 items-center p-1 rounded-md shadow dark:bg-admin-terciary dark:text-white  text-sm bg-paper-light self-start font-bold active:scale-110 px-2 py-2"
				onClick={() => {
					sweetModal({
						html: reactComponent(<OrdersIndex />),
						sweetWidth: "1250px",
						showCloseButton: true,
					});
				}}
			>
				<i class="fas fa-store" /> Ordenes en tu local
			</button>
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
							<i class="fas fa-sync-alt text-white" />
						</button>
					</div>
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
							class="px-4 py-2 rounded-md font-semibold bg-paper-light dark:bg-admin-terciary  dark:text-white shadow min-w-[150px] text-sm"
						>
							<option
								selected={
									filters.value.category
										? !filters.value.category.length
										: false
								}
								value={""}
							>
								Categorías
							</option>
							<>
								{categoriesIndexQuery.data?.data.map((cat) => (
									<option
										key={cat.id}
										selected={cat.slug === filters.value.category}
										value={cat.slug}
									>
										{cat.name}
									</option>
								))}
							</>
						</select>
					</div>
				</div>
			</div>
			<div class="my-6 grid grid-cols-2 gap-4 lg:grid-cols-4   ">
				<>
					{productsPaginator.isLoading || productsPaginator.isFetching ? (
						<div class="flex justify-center min-h-[450px] items-center w-full">
							<Loader />
						</div>
					) : (
						<>
							{productsPaginator.data?.results.length ? (
								<>
									{productsPaginator.data?.results.map((product) => (
										<ProductCardAdmin
											product={product as ProductsNormalSchemaFromServer}
											key={product.id}
											refetch={productsPaginator.refetch}
										/>
									))}
								</>
							) : (
								<span class="dark:text-white font-bold text-sm  ml-1">
									No hay productos{" "}
								</span>
							)}
						</>
					)}
				</>
			</div>
			{productsPaginator.data?.results.length ? (
				<PaginationFooter paginator={paginator} />
			) : (
				<></>
			)}
		</Container>
	);
}

export default Local;
