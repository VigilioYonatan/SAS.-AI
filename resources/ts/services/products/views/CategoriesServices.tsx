import { sweetModal } from "@vigilio/sweet";
import { categoriesPaginatorApi } from "@/common/paginator/categories.paginator.api";
import { useTable } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import categoriesColumns from "../libs/CategoriesColumns";
import VigilioTable from "~/components/table";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import CategoriesShow from "./CategoriesShow";
import CategoriesStore from "./CategoriesStore";
import useAuthStore from "@/auth/stores/auth.store";
import type { CategoriesSchemaFromServer } from "../schemas/categories.schema";

function CategoriesServices() {
	const table = useTable({
		columns: categoriesColumns,
	});
	const authStore = useAuthStore();
	const query = categoriesPaginatorApi(table, true);

	function handleOpenCategory(category: CategoriesSchemaFromServer) {
		sweetModal((onClose) => ({
			html: reactComponent(
				<CategoriesShow
					refetch={query.refetch}
					onClose={onClose}
					id={category.id}
				/>,
			),
			showCloseButton: true,
			sweetWidth: "800px",
			isCloseInBackground: false,
		}));
	}

	function onCategoriesStore() {
		sweetModal((onClose) => ({
			html: reactComponent(
				<CategoriesStore
					onClose={onClose}
					refetch={query.refetch}
					isService={true}
				/>,
			),
			sweetWidth: "700px",
			showCloseButton: true,
		}));
	}
	return (
		<Container className="p-2">
			<div className="flex flex-col gap-4 mx-1 ">
				<AdminBreadCrumb current="categorías" />
				{authStore.guards.permissionAdminGuard() ? (
					<div class="">
						<button
							type="button"
							class="bg-primary px-6 py-2 text-xs font-bold self-start rounded-md text-white"
							aria-label="button to open to create categories"
							onClick={onCategoriesStore}
						>
							<i class="fa-solid fa-layer-group" /> Agregar categoría
						</button>
					</div>
				) : null}
			</div>
			<div class="overflow-auto">
				<VigilioTable query={query} table={table}>
					<VigilioTable.header>
						<VigilioTable.header.tools hiddenDelete />
						<div className="flex items-center gap-1">
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
							<VigilioTable.tbody.row handleClick={handleOpenCategory}>
								{(data) => <VigilioTable.tbody.td data={data} />}
							</VigilioTable.tbody.row>
						</VigilioTable.tbody>
					</VigilioTable.table>
					<VigilioTable.footer>
						<div className="flex flex-col items-center justify-center gap-2">
							<VigilioTable.footer.paginator />
							<VigilioTable.footer.show />
						</div>
					</VigilioTable.footer>
				</VigilioTable>
			</div>
		</Container>
	);
}

export default CategoriesServices;
