import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import ProductsShow from "./ProductsShow";
import useAuthstore from "@/auth/stores/auth.store";
import VigilioTable from "~/components/table";
import { useEffect } from "preact/hooks";
import { productsPaginatorApi } from "@/common/paginator/products.paginator.api";
import { useSignal } from "@preact/signals";
import { sweetModal } from "@vigilio/sweet";
import { useTable } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import ProductsServicioStore from "./ProductsServicioStore";
import { ProductsServicioSchemaFromServer } from "../schemas/products_servicio.schema";
import { categoriesIndexApi } from "../apis/categories/categories.index.api";
import serviciosColumns from "../libs/ServiciosColumns";

function ServiciosIndex() {
	const { guards } = useAuthstore();
	type FiltersKey = "category";

	const filters = useSignal<Record<FiltersKey, string | null>>({
		category: null,
	});

	const categoriesIndexQuery = categoriesIndexApi(true);

	const table = useTable({
		columns: serviciosColumns,
	});
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const query = productsPaginatorApi(table as any, filters, true);

	function handleOpenProduct(product: ProductsServicioSchemaFromServer) {
		return sweetModal((onClose) => ({
			html: reactComponent(
				<ProductsShow
					id={product.id}
					refetch={query.refetch}
					onClose={onClose}
					isService
				/>,
			),
			showCloseButton: true,
			position: "start",
			sweetWidth: "800px",
			isCloseInBackground: false,
		}));
	}

	function onProductsStore() {
		sweetModal((onClose) => ({
			html: reactComponent(
				<ProductsServicioStore onClose={onClose} refetch={query.refetch} />,
			),
			sweetWidth: "800px",
			showCloseButton: true,
			position: "start",
			isCloseInBackground: false,
		}));
	}

	useEffect(() => {
		if (filters.value.category) {
			query.refetch(false);
		}
	}, [filters.value.category]);

	useEffect(() => {
		query.refetch(false);
	}, [filters.value]);

	function onChangeFilter(props: Partial<Record<FiltersKey, string | null>>) {
		filters.value = { ...filters.value, ...props };
	}

	return (
		<Container className="p-2">
			<div className="flex flex-col gap-4 mx-1">
				<AdminBreadCrumb current="servicios" />
				{guards.permissionAdminGuard() ? (
					<div class="flex justify-between items-center">
						<div class="flex items-center gap-2">
							<button
								type="button"
								class="bg-primary px-6 py-2 text-xs font-bold self-start rounded-md text-white "
								aria-label="button to open to create products"
								onClick={onProductsStore}
							>
								<i class="fa-regular fa-handshake" /> Agregar
							</button>
						</div>
					</div>
				) : null}
			</div>
			<div class="overflow-auto">
				<VigilioTable query={query} table={table}>
					<VigilioTable.header className="flex flex-wrap justify-between items-center gap-3 mb-3">
						<div class="flex gap-2 items-center flex-wrap">
							{/* subcategorias */}

							<div class="flex  gap-1 flex-col">
								<select
									name="categories"
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
										Todas las categorías
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
						<VigilioTable.header.tools hiddenDelete />

						<div class="flex items-center gap-1">
							<VigilioTable.header.limit />
							<VigilioTable.header.refetch />
						</div>
					</VigilioTable.header>
					<VigilioTable.table>
						<VigilioTable.thead>
							<VigilioTable.thead.row>
								<VigilioTable.thead.th />
							</VigilioTable.thead.row>
						</VigilioTable.thead>
						<VigilioTable.tbody>
							<VigilioTable.tbody.row handleClick={handleOpenProduct}>
								{(data) => <VigilioTable.tbody.td data={data} />}
							</VigilioTable.tbody.row>
						</VigilioTable.tbody>
					</VigilioTable.table>
					<VigilioTable.footer>
						<VigilioTable.footer.paginator />
						<VigilioTable.footer.show />
					</VigilioTable.footer>
				</VigilioTable>
			</div>
		</Container>
	);
}

export default ServiciosIndex;
