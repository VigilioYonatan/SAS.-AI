import VigilioTable from "~/components/table";
import { sweetModal } from "@vigilio/sweet";
import { useTable } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import { urlsColumns } from "../libs/UrlsColumns";
import UrlsStore from "./UrlsStore";
import { urlsPaginatorApi } from "@/common/paginator/urls.paginator.api";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";

function UrlsIndex() {
	const table = useTable({ columns: urlsColumns });

	const query = urlsPaginatorApi(table);

	function onUrlsStore() {
		sweetModal((onClose) => ({
			html: reactComponent(
				<UrlsStore onClose={onClose} refetch={query.refetch} />,
			),
			sweetWidth: "500px",
			showCloseButton: true,
			isCloseInBackground: false,
		}));
	}

	return (
		<Container className="p-2">
			<AdminBreadCrumb current="Acortador de links" />
			<div class="overflow-x-auto overflow-y-hidden mt-6">
				<VigilioTable query={query} table={table}>
					<VigilioTable.header className="flex gap-2 items-center pb-2">
						<div>
							<button
								type="button"
								aria-label="store urls"
								onClick={onUrlsStore}
								class="bg-orange-500 text-white px-4 text-sm font-bold  py-1 rounded-md"
							>
								<i class="fa-solid fa-link" /> Agregar
							</button>
						</div>
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
						<VigilioTable.footer.show />
						<VigilioTable.footer.paginator />
					</VigilioTable.footer>
				</VigilioTable>
			</div>
		</Container>
	);
}

export default UrlsIndex;
