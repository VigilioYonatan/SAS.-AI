import { sweetModal } from "@vigilio/sweet";
import { brandsPaginatorApi } from "@/common/paginator/brands.paginator.api";
import { useTable } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import brandsColumns from "../libs/BrandsColumns";
import VigilioTable from "~/components/table";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import useAuthStore from "@/auth/stores/auth.store";
import BrandsShow from "./BrandsShow";
import type { BrandsSchemaFromServer } from "../schemas/brands.schema";
import BrandsStore from "./BrandsStore";

function BrandsIndex() {
    const table = useTable({
        columns: brandsColumns,
    });
    const authStore = useAuthStore();
    const query = brandsPaginatorApi(table);
    function handleOpenBrands(brand: BrandsSchemaFromServer) {
        sweetModal((onClose) => ({
            html: reactComponent(
                <BrandsShow
                    refetch={query.refetch}
                    onClose={onClose}
                    id={brand.id}
                />
            ),
            showCloseButton: true,
            sweetWidth: "800px",
            isCloseInBackground: false,
        }));
    }

    function onBrandsStore() {
        sweetModal((onClose) => ({
            html: reactComponent(
                <BrandsStore onClose={onClose} refetch={query.refetch} />
            ),
            sweetWidth: "700px",
            showCloseButton: true,
        }));
    }

    return (
        <Container className="p-2">
            <div className="flex flex-col gap-4 mx-1 ">
                <AdminBreadCrumb current="marcas" />
                {authStore.guards.permissionAdminGuard() ? (
                    <div class="">
                        <button
                            type="button"
                            class="bg-primary px-6 py-2 text-xs font-bold self-start rounded-md text-white"
                            aria-label="button to open to create brands"
                            onClick={onBrandsStore}
                        >
                            <i class="fas fa-tags" /> Agregar marcas
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
                                handleClick={handleOpenBrands}
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

export default BrandsIndex;
