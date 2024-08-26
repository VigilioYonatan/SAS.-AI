import productsColumns from "../libs/ProductsColumns";
import Container from "@/admin/components/Container";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import ProductsStore from "./ProductsNormalStore";
import ProductsShow from "./ProductsShow";
import useAuthstore from "@/auth/stores/auth.store";
import VigilioTable from "~/components/table";
import { useEffect } from "preact/hooks";
import { productsPaginatorApi } from "@/common/paginator/products.paginator.api";
import { useSignal } from "@preact/signals";
import { Link } from "wouter-preact";
import { familiesIndexApi } from "../apis/families/families.index.api";
import { familiesCategoriesApi } from "../apis/families/families.categories.api";
import { categoriesSubcategoriesApi } from "../apis/categories/categories.subcategories.api";
import { sweetModal } from "@vigilio/sweet";
import { useTable } from "@vigilio/preact-table";
import { reactComponent } from "~/libs/preact";
import type { ProductsSchemaFromServer } from "../schemas/products.schema";

function ProductsIndex() {
    const { guards } = useAuthstore();
    type FiltersKey = "family" | "category" | "subcategory";

    const filters = useSignal<Record<FiltersKey, string | null>>({
        family: null,
        category: null,
        subcategory: null,
    });

    const familiesIndexQuery = familiesIndexApi();
    const familiesCategoriesQuery = familiesCategoriesApi(filters.value.family);
    const categoriesSubcategoriesQuery = categoriesSubcategoriesApi(
        filters.value.category
    );

    const table = useTable({
        columns: productsColumns,
    });
    const query = productsPaginatorApi(table, filters);

    function handleOpenProduct(product: ProductsSchemaFromServer) {
        return sweetModal((onClose) => ({
            html: reactComponent(
                <ProductsShow
                    id={product.id}
                    refetch={query.refetch}
                    onClose={onClose}
                />
            ),
            showCloseButton: true,
            position: "start",
            sweetWidth: "800px",
            isCloseInBackground: false,
        }));
    }

    function onProductsStore() {
        sweetModal((onClose) => ({
            html: reactComponent(
                <ProductsStore onClose={onClose} refetch={query.refetch} />
            ),
            sweetWidth: "800px",
            showCloseButton: true,
            position: "start",
            isCloseInBackground: false,
        }));
    }

    useEffect(() => {
        onChangeFilter({ category: null, subcategory: null });
        if (filters.value.family) {
            familiesCategoriesQuery.refetch();
        } else {
            familiesCategoriesQuery.transformData((data) => ({
                ...data,
                data: [],
            }));
            categoriesSubcategoriesQuery.transformData((data) => ({
                ...data,
                data: [],
            }));
        }
    }, [filters.value.family]);
    useEffect(() => {
        onChangeFilter({ subcategory: null });
        if (filters.value.category) {
            categoriesSubcategoriesQuery.refetch();
        } else {
            categoriesSubcategoriesQuery.transformData((data) => ({
                ...data,
                data: [],
            }));
        }
    }, [filters.value.category]);
    useEffect(() => {
        if (!filters.value.category) {
            categoriesSubcategoriesQuery.transformData((data) => ({
                ...data,
                data: [],
            }));
        }
    }, [filters.value.subcategory]);

    useEffect(() => {
        query.refetch(false);
    }, [filters.value]);

    function onChangeFilter(props: Partial<Record<FiltersKey, string | null>>) {
        filters.value = { ...filters.value, ...props };
    }

    return (
        <Container className="p-2">
            <div className="flex flex-col gap-4 mx-1">
                <AdminBreadCrumb current="productos" />
                {guards.permissionAdminGuard() ? (
                    <div class="flex justify-between items-center">
                        <button
                            type="button"
                            class="bg-primary px-6 py-2 text-xs font-bold self-start rounded-md text-white"
                            aria-label="button to open to create products"
                            onClick={onProductsStore}
                        >
                            <i class="fas fa-phone-laptop" /> Agregar
                        </button>
                        <Link
                            class="bg-blue-600 px-2 py-2  text-white rounded-md font-bold text-xs uppercase shadow"
                            href="/cupones"
                        >
                            <i class="fa-solid fa-ticket" /> Cupones
                        </Link>
                    </div>
                ) : null}
            </div>
            <div class="overflow-auto">
                <VigilioTable query={query} table={table}>
                    <VigilioTable.header className="flex flex-wrap justify-between items-center gap-3 mb-3">
                        <VigilioTable.header.tools hiddenDelete />
                        <div class="flex gap-2 items-center flex-wrap">
                            <div class="flex  gap-1 flex-col">
                                <span class="dark:text-white text-sm">
                                    Familias
                                </span>
                                <select
                                    name="families"
                                    onChange={(e) => {
                                        const slug = (
                                            e.target as HTMLSelectElement
                                        ).value;
                                        onChangeFilter({
                                            family: slug.length ? slug : null,
                                        });
                                    }}
                                    class="px-4 py-2 rounded-md font-semibold bg-paper-light dark:bg-admin-terciary  dark:text-white shadow min-w-[150px]"
                                >
                                    <option
                                        selected={
                                            filters.value.family
                                                ? !filters.value.family.length
                                                : false
                                        }
                                        value={""}
                                    >
                                        Todos
                                    </option>
                                    {familiesIndexQuery.data?.data.map(
                                        (fam) => (
                                            <option
                                                key={fam.id}
                                                selected={
                                                    filters.value.family ===
                                                    fam.slug
                                                }
                                                value={fam.slug}
                                            >
                                                {fam.name}
                                            </option>
                                        )
                                    )}
                                </select>
                            </div>
                            {/* categories */}
                            <div class="flex  gap-1 flex-col">
                                <span class="dark:text-white text-sm">
                                    Categorías
                                </span>
                                <select
                                    name="categorias"
                                    onChange={(e) => {
                                        const slug = (
                                            e.target as HTMLSelectElement
                                        ).value;

                                        onChangeFilter({
                                            category: slug.length ? slug : null,
                                        });
                                    }}
                                    class="px-4 py-2 rounded-md font-semibold bg-paper-light dark:bg-admin-terciary  dark:text-white shadow min-w-[150px]"
                                >
                                    <option
                                        selected={
                                            filters.value.category
                                                ? !filters.value.category.length
                                                : false
                                        }
                                        value={""}
                                    >
                                        Todos
                                    </option>
                                    <>
                                        {familiesCategoriesQuery.data?.data.map(
                                            (cat) => (
                                                <option
                                                    key={cat.id}
                                                    selected={
                                                        cat.slug ===
                                                        filters.value.category
                                                    }
                                                    value={cat.slug}
                                                >
                                                    {cat.name}
                                                </option>
                                            )
                                        )}
                                    </>
                                </select>
                            </div>

                            {/* subcategorias */}

                            <div class="flex  gap-1 flex-col">
                                <span class="dark:text-white text-sm">
                                    Subcategorías
                                </span>
                                <select
                                    name="subcategories"
                                    onChange={(e) => {
                                        const slug = (
                                            e.target as HTMLSelectElement
                                        ).value;
                                        onChangeFilter({
                                            subcategory: slug.length
                                                ? slug
                                                : null,
                                        });
                                    }}
                                    class="px-4 py-2 rounded-md font-semibold bg-paper-light dark:bg-admin-terciary  dark:text-white shadow min-w-[150px]"
                                >
                                    <option
                                        selected={
                                            filters.value.subcategory
                                                ? !filters.value.subcategory
                                                      .length
                                                : false
                                        }
                                        value={""}
                                    >
                                        Todos
                                    </option>
                                    <>
                                        {categoriesSubcategoriesQuery.data?.data.map(
                                            (sub) => (
                                                <option
                                                    key={sub.id}
                                                    selected={
                                                        sub.slug ===
                                                        filters.value
                                                            .subcategory
                                                    }
                                                    value={sub.slug}
                                                >
                                                    {sub.name}
                                                </option>
                                            )
                                        )}
                                    </>
                                </select>
                            </div>
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
                            <VigilioTable.tbody.row
                                handleClick={handleOpenProduct}
                            >
                                {(data) => (
                                    <VigilioTable.tbody.td data={data} />
                                )}
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

export default ProductsIndex;
