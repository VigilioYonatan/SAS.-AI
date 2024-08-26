import { useTable } from "@vigilio/preact-table";
import VigilioTable from "~/components/table";
import SuppliersStore from "./SuppliersStore";
import type { SuppliersSchemaFromServer } from "../schemas/suppliers.schema";
import Container from "@/admin/components/Container";
import { reactComponent } from "~/libs/preact";
import { suppliersPaginatorApi } from "@/common/paginator/suppliers.paginator.api";
import { sweetModal } from "@vigilio/sweet";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import SuppliersShow from "./SuppliersShow";
import suppliersColumns from "../libs/SuppliersColumns";
import useAuthStore from "@/auth/stores/auth.store";

function SuppliersIndex() {
	if (!useAuthStore().guards.permissionAdminGuard) {
		window.history.back();
		return null;
	}
	const table = useTable({
		columns: suppliersColumns,
	});
	const query = suppliersPaginatorApi(table);
	function onShowSupplier(supplier: SuppliersSchemaFromServer) {
		sweetModal((onClose) => ({
			html: reactComponent(
				<SuppliersShow
					onClose={onClose}
					refetch={query.refetch}
					supplier={supplier.supplier_code}
				/>,
			),
			sweetWidth: "750px",
			showCloseButton: true,
		}));
	}
	function onSuppliserStore() {
		sweetModal({
			html: reactComponent(<SuppliersStore refetch={query.refetch} />),
			showCloseButton: true,
			position: "start",
			sweetWidth: "800px",
		});
	}
	return (
		<Container className="p-2">
			<div className="flex flex-col gap-4 mx-1 ">
				<AdminBreadCrumb current="Proveedores" />
				<div class="">
					<button
						type="button"
						class="bg-primary px-2 py-2   text-white rounded-md font-bold text-xs uppercase shadow"
						aria-label="button to open create new proveedor"
						onClick={onSuppliserStore}
					>
						<i class="far fa-person-dolly" /> Agregar Proveedor
					</button>
				</div>
			</div>
			<div class="supplier-container ">
				<div class="overflow-auto">
					<VigilioTable query={query} table={table}>
						<VigilioTable.header className="p-0 mb-2 flex justify-between items-center">
							<VigilioTable.header.tools
								hiddenDelete
								hiddenFetching
								placeholderSearch="Buscar por RUC"
							/>
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
								<VigilioTable.tbody.row handleClick={onShowSupplier}>
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
			</div>
		</Container>
	);
}

export default SuppliersIndex;
