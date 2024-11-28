import { formatMoney, subtotalIgv } from "@/cart/libs/helpers";
import { printImagesProduct } from "@/products/libs/helpers";
import { useSignal } from "@preact/signals";
import { useDebounce } from "@vigilio/preact-paginator";
import { useEffect } from "preact/hooks";
import { useState } from "react";
import { useRef } from "react";
import { productsSearchApi } from "../apis/products/products.search.api";
import LoaderSubmit from "~/components/LoaderSubmit";

function SearchProducts() {
    const value = useSignal("");
    const [openSearch, setOpenSearch] = useState(false);
    const debounce = useDebounce(value.value);
    const productsPaginatorApiQuery = productsSearchApi(debounce);

    const inputSearchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (debounce.length) {
            productsPaginatorApiQuery.refetch();
        }
    }, [debounce]);

    useEffect(() => {
        if (openSearch) {
            inputSearchRef.current?.focus();
        }
    }, [openSearch]);

    let component = null;

    if (
        productsPaginatorApiQuery.isLoading ||
        productsPaginatorApiQuery.isFetching
    ) {
        component = <LoaderSubmit />;
    }
    if (productsPaginatorApiQuery.isSuccess) {
        component = !productsPaginatorApiQuery.data!.results.length ? (
            <span class=" dark:text-white  text-center text-sm">
                No se encontró ningun producto con {value.value}
            </span>
        ) : (
            <>
                {productsPaginatorApiQuery.data!.results.map((product) => (
                    <button
                        type="button"
                        onClick={() => {
                            window.location.href = `/${product.slug}`;
                        }}
                        key={product.id}
                        class=" block p-3 dark:text-gray-300  duration-200 cursor-default select-none hover:text-primary group rounded-xl hover:bg-white/5"
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
                ))}
            </>
        );
    }
    return (
        <>
            <button
                type="button"
                aria-label="search"
                class="   dark:lg:text-white px-1 py-2 rounded-md text-lg "
                onClick={() => {
                    setOpenSearch(!openSearch);
                }}
            >
                <i class="far fa-search " />
            </button>
            {openSearch && (
                <>
                    <div class="">
                        <div
                            class="fixed top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-20 px-4 max-w-xl w-full mx-auto overflow-hidden transition-all transform dark:bg-black bg-background-light  border divide-y shadow-2xl divide-white/10 rounded-xl ring-1 ring-black border-white/5 ring-opacity-5 bg-opacity-80 backdrop-blur backdrop-filter"
                            onClick={(e) => e.preventDefault()}
                        >
                            <div class="relative">
                                <i class="fa-duotone absolute fa-magnifying-glass text-xl top-1/2 -translate-y-1/2 left-2 dark:text-white  " />
                                <input
                                    type="search"
                                    class="w-full h-12 pr-4 dark:text-white placeholder-gray-400 bg-transparent border-0 pl-11  sm:text-sm focus-visible:outline-none "
                                    placeholder="Buscar"
                                    role="combobox"
                                    ref={inputSearchRef}
                                    onChange={(e) => {
                                        value.value = (
                                            e.target as HTMLInputElement
                                        ).value;
                                    }}
                                    aria-expanded="false"
                                    aria-controls="options"
                                />
                            </div>
                            <ul
                                class="px-5  py-4 space-y-3 overflow-y-auto h-full max-h-96 scroll-py-3 flex flex-col "
                                id="options"
                            >
                                {value.value.length ? (
                                    <>{component}</>
                                ) : (
                                    <li class="flex flex-col items-center justify-center my-12">
                                        <i class="fa-duotone fa-magnifying-glass text-[100px] dark:text-white my-6 " />
                                        <p class="pl-2 text-sm font-medium dark:text-white ">
                                            Tipea para buscar un producto...
                                        </p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div
                        onClick={() => setOpenSearch(false)}
                        className="fixed inset-0 z-10 bg-[#0000]/40"
                    />
                </>
            )}
        </>
    );
}

export default SearchProducts;
