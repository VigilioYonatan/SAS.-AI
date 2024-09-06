import { useTable } from "@vigilio/preact-table";
import Container from "@/admin/components/Container";
import VigilioTable from "~/components/table";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import regionsColumns from "../libs/RegionsColumns";
import { regionsPaginatorApi } from "@/common/paginator/regions.paginator.api";

function RegionsIndex() {
	const table = useTable({
		columns: regionsColumns,
	});
	const regionsPaginatorQuery = regionsPaginatorApi(table);

	return (
		<Container className="p-2">
			<AdminBreadCrumb current="precio de envio" />
			<div class="supplier-container ">
				<div class="overflow-auto">
					<VigilioTable query={regionsPaginatorQuery} table={table}>
						<VigilioTable.header className="p-0 mb-2 flex justify-between items-center gap-2">
							<VigilioTable.header.tools hiddenDelete hiddenFetching />
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
								<VigilioTable.tbody.row>
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

export default RegionsIndex;
