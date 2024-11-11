import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import { printImagesProduct } from "@/products/libs/helpers";
import { useSignal } from "@preact/signals";
import { useDebounce } from "@vigilio/preact-paginator";
import { useEffect } from "preact/hooks";
import { useRef } from "react";
import { productsSearchApi } from "../apis/products/products.search.api";
import LoaderSubmit from "~/components/LoaderSubmit";
import useDropdown from "~/hooks/useDropdown";

function ProductsSearch2() {
    const value = useSignal("");
    const debounce = useDebounce(value.value);
    const productsPaginatorApiQuery = productsSearchApi(debounce);
    const dropdown = useDropdown();

    const inputSearchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (debounce.length) {
            productsPaginatorApiQuery.refetch();
        }
    }, [debounce]);

    useEffect(() => {
        if (dropdown.dropdownOpen) {
            inputSearchRef.current?.focus();
        }
    }, [dropdown.dropdownOpen]);

    let component = null;

    if (
        productsPaginatorApiQuery.isLoading ||
        productsPaginatorApiQuery.isFetching
    ) {
        component = <LoaderSubmit />;
    }
    if (productsPaginatorApiQuery.isSuccess) {
        component = (
            <>
                {!productsPaginatorApiQuery.data!.results.length ? (
                    <span class=" dark:text-white  text-center text-sm py-12">
                        No se encontró ningun producto con {value.value}
                    </span>
                ) : (
                    <>
                        {productsPaginatorApiQuery.data!.results.map(
                            (product) => (
                                <button
                                    type="button"
                                    onClick={() => {
                                        window.location.href = `/${product.slug}`;
                                    }}
                                    key={product.id}
                                    class=" block p-3 dark:text-gray-300  duration-200 cursor-default select-none hover:text-primary group  hover:bg-white/5"
                                    tabindex={-1}
                                >
                                    <div class="flex items-center justify-between my-1 w-full">
                                        <div className="flex items-center gap-2">
                                            <img
                                                class="w-[80px]"
                                                width={100}
                                                height={100}
                                                src={
                                                    printImagesProduct(
                                                        product.images,
                                                        100
                                                    )[0]
                                                }
                                                alt={product.name}
                                            />
                                            <span class="text-sm   font-semibold">
                                                {product.name}
                                            </span>
                                        </div>
                                        <span class="text-primary font-bold">
                                            {formatMoney(subtotalIgv(product))}
                                        </span>
                                    </div>
                                </button>
                            )
                        )}
                    </>
                )}
            </>
        );
    }

    return (
        <>
            <div
                class="flex  bg-paper-light w-full dark:!text-white  pl-2  dark:bg-paper-dark items-center gap-3 relative"

                // onClick={() => setOpenSearch(!openSearch)}
            >
                <i class="far fa-search text-md" />
                <input
                    type="text"
                    class="bg-transparent outline-none   w-full text-black text-sm font-semibold   dark:text-white"
                    placeholder="Buscar productos..."
                    role="combobox"
                    ref={inputSearchRef}
                    onChange={(e) => {
                        dropdown.onOpen();
                        value.value = (e.target as HTMLInputElement).value;
                    }}
                    onClick={() => {
                        dropdown.onOpen();
                    }}
                    aria-expanded="false"
                    aria-controls="options"
                />
                <button
                    type="button"
                    class="bg-primary text-white h-[50px] px-6 font-semibold "
                    aria-label="search"
                >
                    Buscar
                </button>
            </div>
            <div
                ref={dropdown.dropdown}
                class=" space-y-3 overflow-auto max-h-[500px] z-[99] bg-paper-light dark:bg-paper-dark  top-14 flex flex-col  absolute right-0 left-0"
                id="options"
            >
                {value.value.length && dropdown.dropdownOpen ? (
                    <>{component}</>
                ) : null}
            </div>
        </>
    );
}

export default ProductsSearch2;
