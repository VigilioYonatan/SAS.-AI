import Form from "~/components/form";
import useAuthstore from "@/auth/stores/auth.store";
import Loader from "~/components/Loader";
import useSocketStore from "~/stores/socket.store";
import {
    commentsStoreDto,
    type CommentsStoreDto,
} from "@/polymorphism/dtos/comments.store.dto";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { commentsStoreApi } from "@/polymorphism/apis/comments.store.api";
import { commentsIndexApi } from "@/polymorphism/apis/comments.index.api";
import usePaginator from "@vigilio/preact-paginator";
import { useEffect } from "preact/hooks";
import { handlerError } from "~/libs/helpers";
import { openAuth } from "@/auth/views/AuthLogin";
import type { CartProductSchema } from "@/cart/schemas";
import { Signal } from "@preact/signals";
import ProductComment from "./ProductComment";

interface ProductsCommentsProps {
    product: Signal<CartProductSchema>;
    type: "ProductsNormals" | "ProductsRestaurants" | "ProductsServicios";
    comment_id: number | null;
}
function ProductsComments({
    product,
    type,
    comment_id,
}: ProductsCommentsProps) {
    const { state } = useAuthstore();
    const { io } = useSocketStore();
    const commentsStoreApiMutation = commentsStoreApi(type, product.value.id);

    const paginator = usePaginator({ limit: 8 });

    const productCommentsIndexApiQuery = commentsIndexApi(
        type,
        product.value.id,
        paginator
    );
    const commentsStoreForm = useForm<CommentsStoreDto>({
        resolver: valibotVigilio(commentsStoreDto),
    });
    function onCommentsStore(body: CommentsStoreDto) {
        if (!state) {
            openAuth();
            return;
        }
        commentsStoreApiMutation.mutate(body, {
            onSuccess(data) {
                commentsStoreForm.reset();
                io?.emit("notifications:comment-store", {
                    product_id: product.value.id,
                    user_id: state.id,
                    isService: type === "ProductsServicios",
                    comment_id: data.comment.id,
                    content: data.comment.content,
                });
                productCommentsIndexApiQuery.refetch(false);
            },
            onError(error) {
                handlerError(commentsStoreForm, error);
            },
        });
    }
    useEffect(() => {
        productCommentsIndexApiQuery.refetch(false);
    }, [paginator.pagination.value.limit, paginator.pagination.value.offset]);

    let productComments: JSX.Element | JSX.Element[] | null = null;
    if (productCommentsIndexApiQuery.isLoading) {
        productComments = (
            <div class="flex justify-center items-center">
                <Loader />
            </div>
        );
    }
    if (productCommentsIndexApiQuery.isError) {
        productComments = (
            <span>{JSON.stringify(productCommentsIndexApiQuery.error)}</span>
        );
    }
    if (productCommentsIndexApiQuery.isSuccess) {
        function commentRefetch(comment_id: number, reaction_id: number) {
            productCommentsIndexApiQuery.transformData((data) => ({
                ...data,
                results: data.results.map((sub) => {
                    if (sub.id === comment_id) {
                        const existReaction = sub.reactions.find(
                            (reaction) => reaction.user_id === state!.id
                        );
                        return {
                            ...sub,
                            reactions: existReaction
                                ? sub.reactions.filter(
                                      (reaction) =>
                                          reaction.user_id !== state!.id
                                  )
                                : [
                                      ...sub.reactions,
                                      {
                                          id: reaction_id,
                                          user_id: state!.id,
                                          isLike: true,
                                      },
                                  ],
                        };
                    }
                    return sub;
                }),
            }));
        }
        productComments = (
            <div class="flex flex-col gap-4">
                {!productCommentsIndexApiQuery.data!.results.length ? (
                    <div class="flex flex-col justify-center items-center my-5 text-principal-dark dark:text-white">
                        <i class="fa-solid fa-comment-pen text-5xl" />
                        <span>Se el primero en comentar.</span>
                    </div>
                ) : (
                    <>
                        {productCommentsIndexApiQuery.data!.results.map(
                            (comment) => (
                                <ProductComment
                                    comment_id={comment_id}
                                    product_id={product.value.id}
                                    comment={comment}
                                    refetch={
                                        productCommentsIndexApiQuery.refetch
                                    }
                                    commentRefetch={commentRefetch}
                                    key={comment.id}
                                    type={type}
                                />
                            )
                        )}
                        {paginator.pagination.totalPages > 1 ? (
                            <ul class="flex items-center w-full -space-x-px h-8 lg:h-10 text-base justify-center dark:text-white ">
                                <li>
                                    <button
                                        onClick={() =>
                                            paginator.pagination.onBackPage()
                                        }
                                        type="button"
                                        class="flex items-center justify-center px-2 h-8 ms-0 leading-tight"
                                        aria-label="button previous table"
                                    >
                                        <i class="fa-solid fa-circle-chevron-left" />
                                    </button>
                                </li>
                                {paginator.pagination
                                    .startingBreakPointButtonIfCondition ? (
                                    <li class="flex items-center justify-center">
                                        <button
                                            type="button"
                                            class="flex items-center justify-center px-2 h-8 leading-tight "
                                            aria-label="button change page table"
                                            onClick={() =>
                                                paginator.pagination.onChangePage(
                                                    1
                                                )
                                            }
                                        >
                                            1
                                        </button>
                                        <span class="flex items-center justify-center px-2 h-8 leading-tight">
                                            ...
                                        </span>
                                    </li>
                                ) : null}
                                {paginator.pagination.paginator.pages.map(
                                    (page) => (
                                        <li key={page}>
                                            {paginator.pagination.paginator
                                                .currentPage === page ? (
                                                <span class="z-10 flex items-center justify-center px-2 h-8 leading-tight">
                                                    {page}
                                                </span>
                                            ) : (
                                                <button
                                                    v-else
                                                    type="button"
                                                    class="flex items-center justify-center px-2 h-8 leading-tight"
                                                    aria-label="button change page table"
                                                    onClick={() =>
                                                        paginator.pagination.onChangePage(
                                                            page
                                                        )
                                                    }
                                                >
                                                    {page}
                                                </button>
                                            )}
                                        </li>
                                    )
                                )}
                                {paginator.pagination
                                    .endingBreakPointButtonIfCondition ? (
                                    <li class="flex items-center justify-center">
                                        <span class="z-10 flex items-center justify-center px-2 h-8 leading-tight">
                                            ...
                                        </span>
                                        <button
                                            type="button"
                                            class="flex items-center justify-center px-2 h-8 leading-tight"
                                            aria-label="button change page table"
                                            onClick={() =>
                                                paginator.pagination.onChangePage(
                                                    paginator.pagination
                                                        .totalPages
                                                )
                                            }
                                        >
                                            {paginator.pagination.totalPages}
                                        </button>
                                    </li>
                                ) : null}

                                <li>
                                    <button
                                        onClick={() =>
                                            paginator.pagination.onNextPage()
                                        }
                                        type="button"
                                        aria-label="button next page table"
                                        class="flex items-center justify-center px-2 h-8 leading-tight  rounded-e-lg"
                                    >
                                        <i className="fa-solid fa-circle-chevron-right" />
                                    </button>
                                </li>
                            </ul>
                        ) : null}
                    </>
                )}
            </div>
        );
    }
    return (
        <>
            <div class="flex gap-2 items-center">
                <Form
                    className="flex items-center justify-center gap-3"
                    onSubmit={onCommentsStore}
                    {...commentsStoreForm}
                >
                    <Form.control.web
                        title="Deja un comentario"
                        placeholder="Escribe un comentario..."
                        name={"content" as keyof CommentsStoreDto}
                        autoComplete={"off"}
                    />

                    {state ? (
                        <Form.button.submit
                            ico={<i class="fa-solid fa-comment" />}
                            isLoading={
                                commentsStoreApiMutation.isLoading || false
                            }
                            className="py-3 mt-0"
                            title="Comentar"
                        />
                    ) : (
                        <button
                            type="button"
                            class="bg-primary px-4 py-2 rounded-md text-xs font-bold text-white"
                            aria-label="auth"
                            onClick={openAuth}
                        >
                            Iniciar session
                        </button>
                    )}
                </Form>
            </div>

            <section>{productComments}</section>
        </>
    );
}

export default ProductsComments;
