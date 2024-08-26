import { type Columns } from "@vigilio/preact-table";
import useAuthstore from "@/auth/stores/auth.store";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import BrandsUpdate from "../views/BrandsUpdate";
import BrandsShow from "../views/BrandsShow";
import { BrandsSchemaFromServer } from "../schemas/brands.schema";

const brandsColumns: Columns<BrandsSchemaFromServer, "acciones"> = [
    { key: "id", isSort: true },
    { key: "brand_code", header: "código", isSort: "id" },
    {
        key: "name",
        header: "nombre",
        cell: (props) => props.name,
        isSort: true,
    },
    {
        key: "acciones",
        cell: (props, _index, methods) => {
            const { guards } = useAuthstore();
            function onBrandsUpdate(e: Event) {
                e.stopPropagation();
                sweetModal((onClose) => ({
                    html: reactComponent(
                        <BrandsUpdate
                            onClose={onClose}
                            refetch={methods.refetch}
                            id={props.id}
                        />
                    ),
                    sweetWidth: "700px",
                    showCloseButton: true,
                    position: "start",
                }));
            }
            function onBrandsShow(e: Event) {
                e.stopPropagation();
                sweetModal((onClose) => ({
                    html: reactComponent(
                        <BrandsShow
                            refetch={methods.refetch}
                            onClose={onClose}
                            id={props.id}
                        />
                    ),
                    sweetWidth: "700px",
                    showCloseButton: true,
                    position: "start",
                }));
            }
            return (
                <div
                    class="flex items-center justify-center gap-1 text-white"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onBrandsShow}
                        aria-label="show brand"
                        class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-success"
                        type="button"
                    >
                        <i class="fa-solid text-sm fa-eye lg:mr-1" />
                    </button>
                    {guards.permissionAdminGuard() ? (
                        <button
                            aria-label="edit brand"
                            class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-orange-600"
                            type="button"
                            onClick={onBrandsUpdate}
                        >
                            <i class="fa-solid text-sm fa-pen lg:mr-1" />
                        </button>
                    ) : null}
                </div>
            );
        },
    },
];
export default brandsColumns;
