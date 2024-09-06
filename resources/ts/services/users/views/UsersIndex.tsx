import { sweetModal } from "@vigilio/sweet";
import { useTable } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import { usersPaginatorApi } from "@/common/paginator/users.paginator.api";
import type { UsersSchemaFromServer } from "@/users/schemas/users.schema";
import VigilioTable from "~/components/table";
import usersColumns from "../libs/UsersColumns";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import useAuthstore from "@/auth/stores/auth.store";
import UsersShow from "./UsersShow";
import UsersStore from "./UsersStore";

function UsersIndex() {
	const table = useTable({
		columns: usersColumns,
	});

	const query = usersPaginatorApi(table);
	const { guards } = useAuthstore();

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

	function onUsersStore() {
		sweetModal((onClose) => ({
			html: reactComponent(
				<UsersStore onClose={onClose} refetch={query.refetch} />,
			),
			sweetWidth: "1000px",
			showCloseButton: true,
			position: "start",
			hiddeBackground: false,
		}));
	}

	return (
		<Container className="p-2">
			<div className="flex flex-col gap-4 mx-1 ">
				<AdminBreadCrumb current="usuarios" />
				<div class="flex  items-center justify-between gap-2">
					{guards.permissionAdminGuard() ? (
						<button
							type="button"
							class="bg-primary px-6 py-2 text-xs font-bold self-start rounded-md text-white flex justify-center items-center gap-2"
							aria-label="button to open create new user"
							onClick={onUsersStore}
						>
							<i class="fas fa-user" /> Agregar Usuario
						</button>
					) : null}
				</div>
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

export default UsersIndex;
