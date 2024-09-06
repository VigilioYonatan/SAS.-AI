import { useTable } from "@vigilio/preact-table";
import VigilioTable from "~/components/table";
import type { ComplaintsSchemaFromServer } from "../schemas/complaints.schema";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { complaintsPaginatorApi } from "@/common/paginator/complaints.paginator.api";
import complaintsColumns from "../libs/complaintsColumns";
import ComplaintsShow from "./ComplaintsShow";

function ComplaintsIndex() {
	const table = useTable({
		columns: complaintsColumns,
	});
	const query = complaintsPaginatorApi(table);

	function onShowPost(complaint: ComplaintsSchemaFromServer) {
		sweetModal({
			html: reactComponent(<ComplaintsShow id={complaint.id} />),
			showCloseButton: true,
			sweetWidth: "700px",
			isCloseInBackground: false,
		});
	}

	return (
		<Container className="p-2">
			<div className="flex flex-col gap-4 mx-1 ">
				<AdminBreadCrumb current="Complaints" />
			</div>
			<div class="overflow-auto">
				<VigilioTable query={query} table={table}>
					<VigilioTable.header className="p-0 mb-2 flex justify-between items-center">
						<VigilioTable.header.tools
							hiddenDelete
							hiddenFetching
							hiddenInput
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
							<VigilioTable.tbody.row handleClick={onShowPost}>
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

export default ComplaintsIndex;
