import { type Columns } from "@vigilio/preact-table";
import type { CategoriesSchemaFromServer } from "../schemas/categories.schema";
import useAuthstore from "@/auth/stores/auth.store";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import CategoriesUpdate from "../views/CategoriesUpdate";
import CategoriesShow from "../views/CategoriesShow";
import { printFileWithDimension } from "~/libs/upload";

const categoriesColumns: Columns<CategoriesSchemaFromServer, "acciones"> = [
    { key: "id", isSort: true },
    { key: "category_code", header: "código", isSort: "id" },
    {
        key: "name",
        header: "nombre",
        cell: (props) => props.name,
        isSort: true,
    },
    {
        key: "image",
        header: "Imagen",
        cell: (props) => (
            <div class="flex justify-center">
                {props.image ? (
                    <img
                        src={printFileWithDimension(props.image, 100)[0]}
                        width={40}
                        alt={props.name}
                        class="object-contain"
                        height={40}
                    />
                ) : (
                    "No image"
                )}
            </div>
        ),
    },

    {
        key: "acciones",
        cell: (props, _index, methods) => {
            const { guards } = useAuthstore();
            function onCategoriesUpdate(e: Event) {
                e.stopPropagation();
                sweetModal((onClose) => ({
                    html: reactComponent(
                        <CategoriesUpdate
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
            function onCategoriesShow(e: Event) {
                e.stopPropagation();
                sweetModal((onClose) => ({
                    html: reactComponent(
                        <CategoriesShow
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
                        onClick={onCategoriesShow}
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
                            onClick={onCategoriesUpdate}
                        >
                            <i class="fa-solid text-sm fa-pen lg:mr-1" />
                        </button>
                    ) : null}
                </div>
            );
        },
    },
];
export default categoriesColumns;
