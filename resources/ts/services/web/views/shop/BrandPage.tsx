import { BrandsSchemaFromServer } from "@/products/schemas/brands.schema";
import TitleSection from "@/web/components/TitleSection";
import WebBreadCrumb from "@/web/components/WebBreadCrumb";
import WebLayout, { HeaderType } from "@/web/components/WebLayout";
import {
    Discounts,
    initialTypeSection,
    ordenar,
    RangeComponent,
} from "./CategoriesPage";
import ProductCard from "@/web/components/product";
import { Signal, useSignal } from "@preact/signals";
import { FiltersKey } from "@/admin/views/Local";
import usePaginator, { UsePaginator } from "@vigilio/preact-paginator";
import useDropdown, { UseDropdown } from "~/hooks/useDropdown";
import { productsLocalsPaginatorApi } from "@/common/paginator/products.local.paginator.api";
import { useEffect } from "preact/hooks";
import Loader from "../../../../components/Loader";
import { ChangeEvent } from "preact/compat";
import enviroments from "~/config";
import { OptionsSchema } from "@/products/schemas/options/options.schema";
import { FeaturesSchema } from "@/products/schemas/options/features.schema";
import WebPaginationFooter from "@/web/components/WebPaginatorFooter";
import TitleSectionTwo from "@/web/components/TitleSectionTwo";
import { deepEqual } from "~/libs/helpers";
import { printFileWithDimension } from "~/libs/upload";

interface BrandPageProps {
    header: HeaderType;
    brand: BrandsSchemaFromServer;
    priceminmax: { min: number; max: number };
    discounts: Discounts[];
    optionsfeatures:
        | (OptionsSchema & {
              features: (FeaturesSchema & { quantity: number })[];
          })[]
        | null;
}
function BrandPage({
    brand,
    header,
    discounts,
    optionsfeatures,
    priceminmax,
}: BrandPageProps) {
    const filters = useSignal<Record<FiltersKey, string | null>>({
        category: null,
        min: null,
        max: null,
        discount: null,
        brand: brand.slug,
        estado: null,
        optionFeature: null,
    });
    const orderFilter = useSignal<[string, string][]>([]);
    const paginator = usePaginator({ limit: 28 }, true); // true. muestra url arriba pagina ?page=3
    const showFilter = useDropdown();
    const typeSection = useSignal(initialTypeSection());

    const categoriesPaginator = productsLocalsPaginatorApi(
        paginator,
        filters,
        orderFilter.value
    );

    useEffect(() => {
        categoriesPaginator.refetch(false);
    }, [
        paginator.pagination.page, // si cambia  las paginas
        orderFilter.value, // si cambia  los ordenes
        paginator.pagination.value.limit, // si cambia el limite
        filters.value, // si cambia el minimo
        paginator.search.debounceTerm, // cuando busca
    ]);

    useEffect(() => {
        document.body.classList.toggle(
            "overflow-hidden",
            showFilter.dropdownOpen
        );
    }, [showFilter.dropdownOpen]);

    function changeFilter(e: ChangeEvent) {
        const split = (e.target as HTMLSelectElement).value.split(" - ");
        orderFilter.value = [[split[0], split[1]]];
        paginator.pagination.onChangePage(1);
    }

    function onChangeValueMin(min: number) {
        filters.value = {
            ...filters.value,
            min: min.toString(),
        };
        showFilter.onClose();
    }

    let component = null;
    if (categoriesPaginator.isLoading) {
        component = (
            <div class="w-full min-h-[500px] flex justify-center items-center">
                <Loader />
            </div>
        );
    }
    if (categoriesPaginator.isError) {
        component = <div>Error...</div>;
    }
    if (categoriesPaginator.isSuccess) {
        component = (
            <div
                class={`flex flex-col w-full  gap-4 delay-custom-1 ${
                    categoriesPaginator.isFetching ? "opacity-70" : ""
                }`}
            >
                <div class="">
                    <div class="flex items-center w-full justify-between mb-3 gap-2">
                        <div class="flex items-center gap-2 justify-between w-full">
                            <button
                                class={`text-2xl hover:bg-primary dark:hover:bg-primary dark:bg-background-dark bg-background-light  hover:text-white delay-custom-1 py-2 px-3 border border-gray-300 dark:text-white lg:hidden ${
                                    enviroments.TYPE_BORDER === "circle"
                                        ? "rounded-md"
                                        : ""
                                }`}
                                type="button"
                                aria-label="square"
                                onClick={showFilter.onOpenClose}
                            >
                                <i class="far fa-filter" />
                            </button>

                            <div class="flex items-center justify-between gap-2">
                                <button
                                    class={`text-2xl py-2 px-3 border bg-background-light dark:bg-background-dark dark:text-white  hover:bg-primary  dark:hover:bg-primary hover:text-white delay-custom-1  ${
                                        typeSection.value === "rows"
                                            ? "bg-primary text-white dark:bg-primary "
                                            : "border-gray-300 dark:text-white"
                                    } ${
                                        enviroments.TYPE_BORDER === "circle"
                                            ? "rounded-md"
                                            : ""
                                    }`}
                                    type="button"
                                    aria-label="square"
                                    onClick={() => {
                                        typeSection.value = "rows";
                                        localStorage.setItem(
                                            "typeSection",
                                            "rows"
                                        );
                                    }}
                                >
                                    <i class="fa-thin fa-light fa-grid-2" />
                                </button>
                                <button
                                    class={`text-2xl bg-background-light dark:bg-background-dark dark:text-white py-2 px-3 border   hover:bg-primary  dark:hover:bg-primary hover:text-white delay-custom-1 ${
                                        typeSection.value === "cols"
                                            ? "bg-primary text-white dark:bg-primary"
                                            : "border-gray-300 dark:text-white"
                                    } ${
                                        enviroments.TYPE_BORDER === "circle"
                                            ? "rounded-md"
                                            : ""
                                    }`}
                                    type="button"
                                    aria-label="square"
                                    onClick={() => {
                                        typeSection.value = "cols";
                                        localStorage.setItem(
                                            "typeSection",
                                            "cols"
                                        );
                                    }}
                                >
                                    <i class="fa-thin fa-bars" />
                                </button>
                            </div>
                        </div>
                        <select
                            class={`py-3 px-4 text-sm outline-none border  hover:bg-white  delay-custom-1 border-gray-200 dark:bg-background-dark dark:text-white hidden sm:block ${
                                enviroments.TYPE_BORDER === "circle"
                                    ? "rounded-md"
                                    : ""
                            }`}
                            onChange={changeFilter}
                            name="orden"
                            id="orden"
                        >
                            <option value="">Filtrar</option>
                            {ordenar.map((orden) => (
                                <option key={orden.key} value={orden.key}>
                                    {orden.value}
                                </option>
                            ))}
                        </select>
                    </div>
                    {categoriesPaginator.data!.results.length ? (
                        <div class="flex flex-col gap-6 ">
                            <div
                                class={`    min-h-[500px] gap-4 grid ${
                                    typeSection.value === "rows"
                                        ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                                        : ""
                                }`}
                            >
                                {categoriesPaginator.data!.results.map(
                                    (product) => (
                                        <ProductCard
                                            product={product}
                                            key={product.id}
                                            className={`self-start ${
                                                typeSection.value === "cols"
                                                    ? "flex flex-col sm:flex-row items-center gap-4"
                                                    : "flex flex-col"
                                            }`}
                                        >
                                            <ProductCard.header
                                                className={`${
                                                    typeSection.value === "cols"
                                                        ? "[&>img]:h-[300px] [&>img]:w-[300px]"
                                                        : "[&>img]:h-[200px] [&>img]:w-[200px]"
                                                }`}
                                            >
                                                <ProductCard.buttons
                                                    isAbsolute
                                                />
                                            </ProductCard.header>
                                            <div class="w-full">
                                                <ProductCard.body
                                                    showDescription={
                                                        typeSection.value ===
                                                        "cols"
                                                    }
                                                />
                                                <ProductCard.footer />
                                            </div>
                                        </ProductCard>
                                    )
                                )}
                            </div>

                            <div class="flex gap-2 items-center ">
                                {paginator.pagination.totalPages > 1 ? (
                                    <WebPaginationFooter
                                        paginator={paginator}
                                    />
                                ) : null}
                            </div>
                        </div>
                    ) : (
                        <span class="dark:text-white mt-4 font-semibold">
                            No hay productos
                        </span>
                    )}
                </div>
            </div>
        );
    }
    return (
        <WebLayout header={header}>
            <section class="max-w-6xl mx-auto min-h-[600px] flex flex-col px-2  mt-28 lg:my-4">
                <div class="">
                    <WebBreadCrumb
                        current={brand.name}
                        uris={[
                            {
                                title: "Tienda",
                                uri: "/shop",
                            },
                        ]}
                    />
                </div>
                <TitleSection>
                    <span class="flex items-center gap-2 justify-center">
                        {brand.name}
                    </span>
                </TitleSection>
                <div class=" gap-4 w-full flex ">
                    {/* aside filters desktop */}
                    <div class="hidden lg:w-[300px] lg:block">
                        <FiltersAside
                            brand={brand}
                            filters={filters}
                            onChangeValue={onChangeValueMin}
                            paginator={paginator}
                            priceminmax={priceminmax}
                            showFilter={showFilter}
                            discounts={discounts}
                            optionsfeatures={optionsfeatures}
                        />
                    </div>
                    {/* aside filters mobile */}
                    <div
                        class={`fixed inset-0 z-[9999] bg-black bg-opacity-60 lg:hidden delay-custom-1 ${
                            showFilter.dropdownOpen ? "visible" : "invisible"
                        }`}
                    >
                        <div
                            class={`w-full p-4 sm:max-w-[350px] h-full dark:bg-background-dark bg-background-light delay-custom-1 ${
                                showFilter.dropdownOpen
                                    ? "translate-x-0"
                                    : "-translate-x-full"
                            }`}
                            ref={showFilter.dropdown}
                        >
                            <div class="py-3 text-xl font-bold dark:text-white flex justify-between items-center px-4">
                                <h3 class="py-3 text-xl font-bold dark:text-white">
                                    Filtros
                                </h3>
                                <button
                                    type="button"
                                    aria-label="close"
                                    onClick={() => showFilter.onClose()}
                                >
                                    X
                                </button>
                            </div>

                            <div class="h-[1px] w-full bg-gray-300 mb-3" />
                            <div class="h-[calc(100vh-150px)] overflow-auto">
                                <FiltersAside
                                    paginator={paginator}
                                    showFilter={showFilter}
                                    filters={filters}
                                    priceminmax={priceminmax}
                                    onChangeValue={onChangeValueMin}
                                    brand={brand}
                                    onClose={() => showFilter.onClose()}
                                    discounts={discounts}
                                    optionsfeatures={optionsfeatures}
                                />
                            </div>
                        </div>
                    </div>
                    {component}
                </div>
            </section>
        </WebLayout>
    );
}
interface FiltersAsideProps {
    showFilter: UseDropdown;
    filters: Signal<Record<FiltersKey, string | null>>;
    onChangeValue: (value: number) => void;
    priceminmax: { min: number; max: number };
    brand: BrandsSchemaFromServer;
    onClose?: () => void;
    discounts: Discounts[];
    optionsfeatures:
        | (OptionsSchema & {
              features: (FeaturesSchema & { quantity: number })[];
          })[]
        | null;
    paginator: UsePaginator;
}
export function FiltersAside({
    filters,
    onChangeValue,
    priceminmax,
    brand,
    onClose,
    discounts,
    optionsfeatures,
    paginator,
}: FiltersAsideProps) {
    return (
        <div class="w-full flex-col gap-4 flex">
            <div
                class={`${
                    enviroments.TYPE_BORDER === "circle" ? "rounded-md" : ""
                } overflow-hidden group `}
            >
                {brand.image ? (
                    <img
                        class="group-hover:scale-110 delay-custom-1 object-contain mx-auto w-[100px] h-[100px]"
                        src={printFileWithDimension(brand.image, 500)[0]}
                        width={500}
                        height={300}
                        alt={brand.name}
                    />
                ) : null}
            </div>
            <div class="p-4  border border-gray-300 dark:bg-background-dark bg-background-light">
                <TitleSectionTwo>Rango de Precio</TitleSectionTwo>
                <RangeComponent
                    priceminmax={priceminmax}
                    onChangeValue={onChangeValue}
                    onClose={onClose}
                />
            </div>
            {/*  */}
            {optionsfeatures?.map((opt) => {
                const show = useSignal(false);
                return (
                    <div
                        class="p-4 border border-gray-300 dark:bg-background-dark bg-background-light"
                        key={opt.id}
                    >
                        <TitleSectionTwo>{opt.name}</TitleSectionTwo>
                        <>
                            {opt.type === 2 ? (
                                <div class="flex flex-col">
                                    <div class="flex flex-wrap gap-1">
                                        {opt.features.map((feature) => (
                                            <div
                                                type="button"
                                                aria-label="change color"
                                                onClick={() => {
                                                    paginator.pagination.onChangePage(
                                                        1
                                                    );
                                                    if (
                                                        filters.value
                                                            .optionFeature ===
                                                        `{"option_id":${opt.id},"feature_id":${feature.id}}`
                                                    ) {
                                                        filters.value = {
                                                            ...filters.value,
                                                            optionFeature: null,
                                                        };
                                                    } else {
                                                        filters.value = {
                                                            ...filters.value,
                                                            optionFeature: `{"option_id":${opt.id},"feature_id":${feature.id}}`,
                                                        };
                                                    }

                                                    if (onClose) {
                                                        onClose();
                                                    }
                                                }}
                                                key={feature.id}
                                                class={`${
                                                    enviroments.TYPE_BORDER ===
                                                    "circle"
                                                        ? "rounded-full"
                                                        : "rounded"
                                                }  w-[30px] h-[30px] shadow ${
                                                    filters.value.optionFeature
                                                        ? deepEqual(
                                                              JSON.parse(
                                                                  filters.value
                                                                      .optionFeature
                                                              ),
                                                              {
                                                                  option_id:
                                                                      opt.id,
                                                                  id: feature.id,
                                                              }
                                                          )
                                                            ? "border-4 border-primary"
                                                            : ""
                                                        : ""
                                                }`}
                                                style={{
                                                    background: feature.value,
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div
                                        class={`flex flex-col ${
                                            show.value
                                                ? "max-h-[500px]"
                                                : "max-h-[120px] overflow-hidden"
                                        }`}
                                    >
                                        {opt.features.map((feature) => (
                                            <label
                                                htmlFor={feature.value}
                                                class="flex gap-2 text-sm "
                                                key={feature.value}
                                            >
                                                <input
                                                    type="checkbox"
                                                    id={feature.value}
                                                    value={feature.value}
                                                    checked={
                                                        filters.value
                                                            .optionFeature
                                                            ? deepEqual(
                                                                  JSON.parse(
                                                                      filters
                                                                          .value
                                                                          .optionFeature
                                                                  ),
                                                                  {
                                                                      option_id:
                                                                          opt.id,
                                                                      id: feature.id,
                                                                  }
                                                              )
                                                            : false
                                                    }
                                                    onChange={() => {
                                                        paginator.pagination.onChangePage(
                                                            1
                                                        );
                                                        if (onClose) {
                                                            onClose();
                                                        }
                                                        filters.value = {
                                                            ...filters.value,
                                                            optionFeature: `{"option_id":${opt.id},"feature_id":${feature.id}}`,
                                                        };
                                                    }}
                                                />
                                                <span class="text-gray-500 dark:text-gray-400 hover:text-principal-primary">
                                                    {feature.description} (
                                                    {feature.quantity})
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    {opt.features.length > 6 ? (
                                        <button
                                            type="button"
                                            aria-label="more"
                                            class="text-xs"
                                            onClick={() => {
                                                show.value = !show.value;
                                            }}
                                        >
                                            {show.value ? "Ocultar" : "Ver más"}
                                        </button>
                                    ) : null}
                                </>
                            )}
                        </>
                    </div>
                );
            })}

            <div class="p-4 border border-gray-300 dark:bg-background-dark bg-background-light">
                <TitleSectionTwo>Descuentos</TitleSectionTwo>
                <div class="flex flex-col">
                    {discounts.map((discount, i) => (
                        <label
                            htmlFor={`${discount.value}${i + 1}`}
                            class="flex gap-2 text-sm"
                            key={`${discount.value}${i + 1}`}
                        >
                            <input
                                type="checkbox"
                                id={`${discount}${i + 1}`}
                                value={discount.value}
                                onChange={() => {
                                    const existBrand =
                                        filters.value.discount ===
                                        discount.value.toString();
                                    if (onClose) {
                                        onClose();
                                    }
                                    if (existBrand) {
                                        filters.value = {
                                            ...filters.value,
                                            discount: null,
                                        };
                                        return;
                                    }
                                    filters.value = {
                                        ...filters.value,
                                        discount: discount.value.toString(),
                                    };
                                }}
                                checked={
                                    filters.value.discount ===
                                    discount.value.toString()
                                }
                            />
                            <div class="text-gray-500 dark:text-gray-400 hover:text-principal-primary flex  items-center gap-1">
                                <span>Desde {discount.value}% OFF</span>
                                <span class="text-xs">
                                    ({discount.quantity})
                                </span>
                            </div>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default BrandPage;
