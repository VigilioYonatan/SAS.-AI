import { sweetModal } from "@vigilio/sweet";
import { useTable } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import type { UsersSchemaFromServer } from "@/users/schemas/users.schema";
import VigilioTable from "~/components/table";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import UsersShow from "./UsersShow";
import clientsColumns from "../libs/ClientsColumns";
import { clientsPaginatorApi } from "@/common/paginator/clients.paginator.api";

function ClientsIndex() {
	const table = useTable({
		columns: clientsColumns,
	});

	const query = clientsPaginatorApi(table);

	const handleOpenUser = (user: UsersSchemaFromServer) => {
		return sweetModal((onClose) => ({
			html: reactComponent(
				<UsersShow
					params={{ slug: user.slug }}
					refetch={query.refetch}
					onClose={onClose}
				/>,
			),
			showCloseButton: true,
			sweetWidth: "800px",
			position: "start",
			hiddeBackground: false,
		}));
	};

	return (
		<Container className="p-2">
			<div className="flex flex-col gap-4 mx-1 ">
				<AdminBreadCrumb current="Clientes" />
			</div>

			<div class="overflow-x-auto overflow-y-hidden">
				<VigilioTable query={query} table={table}>
					<VigilioTable.header>
						<VigilioTable.header.tools hiddenInput={false} hiddenDelete />
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
							<VigilioTable.tbody.row handleClick={handleOpenUser}>
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

export default ClientsIndex;
