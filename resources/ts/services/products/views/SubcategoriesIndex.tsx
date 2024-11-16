import { sweetModal } from "@vigilio/sweet";
import { useTable } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import VigilioTable from "~/components/table";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import SubcategoriesShow from "./SubcategoriesShow";
import SubcategoriesStore from "./SubcategoriesStore";
import useAuthStore from "@/auth/stores/auth.store";
import type { SubcategoriesSchemaFromServer } from "../schemas/subcategories.schema";
import subcategoriesColumns from "../libs/SubcategoriesColumns";
import { subcategoriesPaginatorApi } from "@/common/paginator/subcategories.paginator.api";

function SubcategoriesIndex() {
    const table = useTable({
        columns: subcategoriesColumns,
    });
    const authStore = useAuthStore();
    const query = subcategoriesPaginatorApi(table);
    function handleOpenSubcategory(subcategory: SubcategoriesSchemaFromServer) {
        sweetModal((onClose) => ({
            html: reactComponent(
                <SubcategoriesShow
                    refetch={query.refetch}
                    onClose={onClose}
                    id={subcategory.id}
                />
            ),
            showCloseButton: true,
            sweetWidth: "800px",
        }));
    }

    function onSubcategoriesStore() {
        sweetModal((onClose) => ({
            html: reactComponent(
                <SubcategoriesStore onClose={onClose} refetch={query.refetch} />
            ),
            sweetWidth: "700px",
            showCloseButton: true,
            isCloseInBackground: false,
        }));
    }

    return (
        <Container className="p-2">
            <div className="flex flex-col gap-4 mx-1 ">
                <AdminBreadCrumb current="subcategorías" />
                {authStore.guards.permissionAdminGuard() ? (
                    <div class="">
                        <button
                            type="button"
                            class="bg-primary px-6 py-2 text-xs font-bold self-start rounded-md text-white"
                            aria-label="button to open to create subcategories"
                            onClick={onSubcategoriesStore}
                        >
                            <i class="fa-solid fa-table-cells-large" /> Agregar
                            subcategoría
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
                            <VigilioTable.tbody.row
                                handleClick={handleOpenSubcategory}
                            >
                                {(data) => (
                                    <VigilioTable.tbody.td data={data} />
                                )}
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

export default SubcategoriesIndex;
