import { type Columns } from "@vigilio/preact-table";
import type { SubcategoriesSchemaFromServer } from "../schemas/subcategories.schema";
import useAuthstore from "@/auth/stores/auth.store";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import SubcategoriesUpdate from "../views/SubcategoriesUpdate";
import SubcategoriesShow from "../views/SubcategoriesShow";
import { printFileWithDimension } from "~/libs/upload";

const subcategoriesColumns: Columns<SubcategoriesSchemaFromServer, "acciones"> =
    [
        { key: "id", cell: (_, i) => i + 1, isSort: true },
        { key: "subcategory_code", header: "código", isSort: "id" },
        {
            key: "name",
            header: "nombre",
            isSort: true,
        },
        {
            key: "image",
            header: "imagen",
            cell: (props) => {
                const images = printFileWithDimension(props.image, 100);
                return (
                    <img
                        class="mx-auto"
                        width={50}
                        height={50}
                        src={images[0]}
                        alt={props.name}
                    />
                );
            },
        },
        {
            key: "category_id",
            header: "Categoria",
            isSort: true,
            cell: (props) => props.category.name,
        },
        {
            key: "acciones",
            cell: (props, _index, methods) => {
                const { guards } = useAuthstore();
                function onSubcategoriesUpdate(e: Event) {
                    e.stopPropagation();
                    sweetModal((onClose) => ({
                        html: reactComponent(
                            <SubcategoriesUpdate
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
                function onSubcategoriesShow(e: Event) {
                    e.stopPropagation();
                    sweetModal((onClose) => ({
                        html: reactComponent(
                            <SubcategoriesShow
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
                            onClick={onSubcategoriesShow}
                            aria-label="show category"
                            class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-success"
                            type="button"
                        >
                            <i class="fa-solid text-sm fa-eye lg:mr-1" />
                        </button>
                        {guards.permissionAdminGuard() ? (
                            <button
                                aria-label="edit category"
                                class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-orange-600"
                                type="button"
                                onClick={onSubcategoriesUpdate}
                            >
                                <i class="fa-solid text-sm fa-pen lg:mr-1" />
                            </button>
                        ) : null}
                    </div>
                );
            },
        },
    ];
export default subcategoriesColumns;
