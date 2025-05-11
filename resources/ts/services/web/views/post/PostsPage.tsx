import WebLayout, { HeaderType } from "@/web/components/WebLayout";
import usePaginator from "@vigilio/preact-paginator";
import LoaderSubmit from "~/components/LoaderSubmit";
import { postsClientPaginatorApi } from "@/common/paginator/posts.paginator.api";
import { CSSProperties, useEffect } from "preact/compat";
import { formatDateTwo } from "~/libs/helpers";
import { printFileWithDimension } from "~/libs/upload";
import { storageEmpresa } from "@/empresas/stores/empresa.store";
import WebPaginationFooter from "@/web/components/WebPaginatorFooter";

interface BlogsPagesProps {
    header: HeaderType;
}
function BlogsPage({ header }: BlogsPagesProps) {
    const paginator = usePaginator({ limit: 12 });
    const blogsPaginatorQuery = postsClientPaginatorApi(paginator);
    useEffect(() => {
        blogsPaginatorQuery.refetch(false);
    }, [
        paginator.pagination.page,
        paginator.pagination.value.limit,
        paginator.search.debounceTerm,
    ]);
    return (
        <WebLayout header={header}>
            <section
                style={
                    {
                        backgroundImage: `url(${
                            storageEmpresa!.setting.background_posts
                                ? printFileWithDimension(
                                      storageEmpresa!.setting.background_posts,
                                      1600
                                  )[0]
                                : ""
                        })`,
                    } as CSSProperties
                }
                className="  bg-center bg-no-repeat bg-cover h-[200px] md:h-[400px] p-6 flex flex-col items-center  relative   "
            >
                <div className="bg-black bg-opacity-50 inset-0 absolute w-full h-full" />
                <div className="max-w-6xl mx-auto  z-1 relative flex justify-center items-end h-full w-full px-4">
                    <div className="bg-white py-2 px-4  rounded-xl flex w-full font-bold max-w-[300px] mb-4">
                        <input
                            type="text"
                            placeholder="Buscar"
                            className="w-full outline-none text-black placeholder:text-gray-400 placeholder:font-semibold"
                            onChange={(e) => {
                                paginator.search.onSearchByName(
                                    (e.target as HTMLInputElement).value
                                );
                            }}
                        />
                        <i class="fas fa-search" />
                    </div>
                </div>
            </section>
            <section className="max-w-6xl mx-auto flex flex-col gap-6 my-8 px-4">
                {/* <SubTitle>Selección de temas destacados</SubTitle> */}
                {/* <NavPage title="Blog" /> */}
                {blogsPaginatorQuery.isLoading ? (
                    <div className="h-[500px] w-full flex justify-center items-center">
                        <LoaderSubmit color="var(--primary)" />
                    </div>
                ) : blogsPaginatorQuery.isSuccess ? (
                    <>
                        {blogsPaginatorQuery.data?.results.length ? (
                            <>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 ">
                                    {blogsPaginatorQuery.data?.results.map(
                                        (card) => (
                                            <a
                                                href={`/blog/${card.slug}`}
                                                className="rounded-2xl shadow-custom overflow-hidden shadow"
                                                key={card.id}
                                            >
                                                <img
                                                    src={
                                                        printFileWithDimension(
                                                            card.image,
                                                            1200
                                                        )[0]
                                                    }
                                                    alt={card.title}
                                                    height={200}
                                                    width={200}
                                                    className="w-full object-cover h-[200px]"
                                                />
                                                <div className="p-4 flex flex-col gap-4">
                                                    <h3 className="font-bold  line-clamp-2 text-justify">
                                                        {card.title}
                                                    </h3>
                                                    <div class="flex justify-between items-center ">
                                                        <div class="flex gap-1 items-center text-primary">
                                                            <i class="fa-regular fa-thumbs-up text-sm" />
                                                            <span class="font-bold text-xs">
                                                                {
                                                                    card.likes
                                                                        .length
                                                                }
                                                            </span>
                                                        </div>
                                                        <span class="self-end  text-primary font-bold text-xs">
                                                            <i class="fa-regular fa-calendar-days mr-1" />{" "}
                                                            {formatDateTwo(
                                                                card.date!,
                                                                "D [de] MMMM [de] YYYY"
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </a>
                                        )
                                    )}{" "}
                                </div>
                                <div class="flex gap-2 items-center ">
                                    {paginator.pagination.totalPages > 1 ? (
                                        <WebPaginationFooter
                                            paginator={paginator}
                                        />
                                    ) : null}
                                </div>
                            </>
                        ) : (
                            <span className="text-primary font-semibold text-center block">
                                No se encontró ningun articulo
                            </span>
                        )}
                    </>
                ) : null}
            </section>
        </WebLayout>
    );
}

export default BlogsPage;
