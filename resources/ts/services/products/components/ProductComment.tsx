import Form from "~/components/form";
import WebDropdown from "~/components/dropdown/WebDropdown";
import useAuthStore from "@/auth/stores/auth.store";
import { printFileUser } from "@/users/libs/helpers";
import { handlerError, showTime } from "~/libs/helpers";
import type { CommentsSchemaFromServe } from "@/polymorphism/schemas/comments.schema";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { commentsUpdateApi } from "@/polymorphism/apis/comments.update.api";
import { commentsDestroyApi } from "@/polymorphism/apis/comments.destroy.api";
import {
    commentsUpdateDto,
    type CommentsUpdateDto,
} from "@/polymorphism/dtos/comments.update.dto";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { subcommentsIndexApi } from "@/polymorphism/apis/subcomments.index.api";
import usePaginator, { useDebounce } from "@vigilio/preact-paginator";
import {
    subcommentsStoreDto,
    type SubcommentsStoreDto,
} from "@/polymorphism/dtos/subcomments.store.dto";
import { subcommentsStoreApi } from "@/polymorphism/apis/subcomments.store.api";
import UserShow from "@/users/components/UserShow";
import { openAuth } from "@/auth/views/AuthLogin";
import type { SubcommentsSchemaFromServe } from "@/polymorphism/schemas/subcomments.schema";
import ReactionComment from "./ReactionComment";
import ProductSubcomment from "./ProductSubcomment";
import useSocketStore from "~/stores/socket.store";

interface ProductCommentProps {
    product_id: number;
    comment: CommentsSchemaFromServe & { count: number };
    commentRefetch: (commentary_id: number, reaction_id: number) => void;
    refetch: (clean?: boolean) => Promise<void>;
    comment_id: number | null;
    type: "ProductsNormals" | "ProductsRestaurants" | "ProductsServicios";
}
function ProductComment({
    product_id,
    comment,
    refetch,
    commentRefetch,
    type,
    comment_id,
}: ProductCommentProps) {
    const commentEdit = useSignal<null | { id: number; content: string }>(null);
    const subcommentEdit = useSignal<null | { id: number; content: string }>(
        null
    );
    const { io } = useSocketStore();
    const authStore = useAuthStore();
    const subcommentsStoreMutation = subcommentsStoreApi(
        type,
        product_id,
        comment.id
    );
    const commentsUpdateMutation = commentsUpdateApi(
        type,
        product_id,
        commentEdit.value?.id!
    );
    const commentsDestroyMutation = commentsDestroyApi(type, product_id);
    const commentsUpdateForm = useForm<CommentsUpdateDto>({
        resolver: valibotVigilio(commentsUpdateDto),
    });
    const subcommentsStoreForm = useForm<SubcommentsStoreDto>({
        resolver: valibotVigilio(subcommentsStoreDto),
    });
    const paginator = usePaginator({ limit: 6 });
    const userId = useSignal<number | null>(null);
    const userDebounce = useDebounce(userId.value, 200);
    const subcommentarios = useSignal<SubcommentsSchemaFromServe[]>([]);
    const showComments = useSignal<boolean>(false);

    const productSubcommentsIndex = subcommentsIndexApi(
        type,
        product_id,
        comment.id,
        paginator,
        subcommentarios
    );

    useEffect(() => {
        productSubcommentsIndex.refetch(false);
    }, [paginator.pagination.page]);

    function onCommentsUpdate(body: CommentsUpdateDto) {
        if (!authStore.state) return;
        commentsUpdateMutation.mutate(body, {
            onSuccess() {
                commentEdit.value = null;
                refetch(false);
                sweetAlert({
                    title: "Se editó su comentario correctamente",
                    icon: "success",
                });
            },
            onError(error) {
                handlerError(commentsUpdateForm, error);
            },
        });
    }
    function onSelectUpdate(props: { id: number; content: string }) {
        commentEdit.value = props;
    }
    function onSelectDestroy(id: number) {
        sweetModal({
            title: "Estas seguro de realizar esta acción",
            text: "Se eliminará tu comentario",
            showCancelButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                commentsDestroyMutation.mutate(id, {
                    onSuccess() {
                        refetch(false);
                        sweetAlert({
                            title: "Se eliminó su comentario correctamente",
                            icon: "success",
                        });
                    },
                    onError(error) {
                        sweetModal({
                            icon: "danger",
                            title: "Error en el servidor",
                            text: `Comunicarse con el desarrollador ${error.message}`,
                        });
                    },
                });
            }
        });
    }

    // subcommentario

    function onSubcommentsStore(body: SubcommentsStoreDto) {
        subcommentsStoreMutation.mutate(body, {
            onSuccess: async (data) => {
                subcommentsStoreForm.reset();
                if (comment.count < 1) {
                    await refetch(false);
                }
                subcommentarios.value = [
                    {
                        ...data.subcomment,
                        reactions: [],
                        user: {
                            id: authStore.state!.id,
                            photo: authStore.state!.photo,
                            username: authStore.state!.username,
                            role_id: authStore.state!.role_id,
                        },
                    },
                    ...subcommentarios.value,
                ];
                subcommentEdit.value = null;
                let receptores = subcommentarios.value.map(
                    (sub) => sub.user_id
                );

                receptores = [...receptores, comment.user_id].filter(
                    (sub) => sub !== authStore.state!.id
                );

                io?.emit("notifications:subcomment-store", {
                    product_id: product_id,
                    user_id: authStore.state!.id,
                    isService: type === "ProductsServicios",
                    receptores,
                    content: body.content,
                    comment_id: comment.id,
                });
                sweetAlert({
                    title: "Se agrego comentario correctamente.",
                    icon: "success",
                });
            },
            onError(err) {
                sweetModal({
                    icon: "danger",
                    title: `Comunicarse con desarollador:${err.message}.`,
                });
            },
        });
    }
    function onSelectUpdateSubcommentary(props: {
        id: number;
        content: string;
    }) {
        subcommentEdit.value = props;
    }
    function chooseUser(id: number) {
        userId.value = id;
    }
    function unChooseUser() {
        userId.value = null;
    }
    function reeditCommentary(subcommentary_id: number, reaction_id: number) {
        subcommentarios.value = subcommentarios.value.map((sub) => {
            if (sub.id === subcommentary_id) {
                const existReaction = sub.reactions.find(
                    (reaction) => reaction.user_id === authStore.state?.id
                );
                return {
                    ...sub,
                    reactions: existReaction
                        ? sub.reactions.filter(
                              (reaction) =>
                                  reaction.user_id !== authStore.state?.id
                          )
                        : [
                              ...sub.reactions,
                              {
                                  id: reaction_id,
                                  user_id: authStore.state!.id,
                                  isLike: true,
                              },
                          ],
                };
            }
            return sub;
        });
    }
    function subcommentDestroyRefetch(subcommentary_id: number) {
        subcommentarios.value = subcommentarios.value.filter(
            (subcommentary) => subcommentary.id !== subcommentary_id
        );
    }
    useEffect(() => {
        if (commentEdit.value) {
            commentsUpdateForm.setValue("content", commentEdit.value.content);
        }
    }, [commentEdit.value]);

    return (
        <div
            class={
                comment_id === comment.id
                    ? "border border-gray-300 p-1 rounded-md"
                    : ""
            }
            id={`${comment_id === comment.id ? `#${comment_id}` : ""}`}
        >
            <div class="flex gap-4">
                <button
                    type="button"
                    onMouseOver={() => chooseUser(comment.user.id)}
                    onFocus={() => chooseUser(comment.user.id)}
                    onMouseOut={unChooseUser}
                    onBlur={unChooseUser}
                    class="relative  flex flex-col gap-1 self-start"
                >
                    <img
                        class="rounded-full w-[50px] h-[50px] self-start"
                        width={50}
                        height={50}
                        src={printFileUser(comment.user.photo)[0]}
                        alt={comment.user.username}
                    />
                    <span class="text-[10px] dark:text-white ">
                        {comment.user.username}
                    </span>
                    {userDebounce ? <UserShow id={userDebounce} /> : null}
                </button>

                <div class="flex justify-between w-full">
                    <div class="flex flex-col w-full gap-2">
                        {comment.id === commentEdit.value?.id ? (
                            <Form
                                className="w-full flex flex-col items-center gap-2"
                                onSubmit={onCommentsUpdate}
                                {...commentsUpdateForm}
                            >
                                <input
                                    type="text"
                                    className="outline-none py-2 rounded-md px-2 border border-primary w-full bg-transparent dark:bg-paper-dark text-sm dark:text-white"
                                    {...commentsUpdateForm.register("content")}
                                />
                                <button
                                    aria-label="update commentary"
                                    class="bg-orange-600 px-4 py-1 rounded-md text-xs text-white self-start"
                                    type="submit"
                                >
                                    Actualizar
                                </button>
                            </Form>
                        ) : (
                            <span class="dark:text-white  text-sm">
                                {comment.content}
                            </span>
                        )}
                        <div class="flex gap-2 items-center self-end">
                            <span class="text-xs dark:text-white ">
                                {showTime(comment.createdAt!)}
                            </span>
                            <span class="text-xs dark:text-white ">
                                {comment.createdAt !== comment.updatedAt
                                    ? "(editado)"
                                    : ""}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-center dark:text-white ">
                        <ReactionComment
                            reactions={comment.reactions}
                            type="comments"
                            id={comment.id}
                            refetch={commentRefetch}
                        />
                        {authStore.state?.id ? (
                            <>
                                <WebDropdown
                                    triggerChildren={({ onOpen }) => (
                                        <button
                                            type="button"
                                            onClick={onOpen}
                                            aria-label="open"
                                        >
                                            <i class="fas fa-ellipsis-v" />
                                        </button>
                                    )}
                                    className="min-w-[60px] top-0"
                                >
                                    <div class="flex flex-col p-2">
                                        <button
                                            type="button"
                                            class=" rounded-md flex items-center gap-2 text-xs py-1"
                                            onClick={() =>
                                                onSelectUpdateSubcommentary({
                                                    id: comment.id,
                                                    content: comment.content,
                                                })
                                            }
                                        >
                                            <i class="fas fa-reply" /> Responder
                                        </button>
                                        {authStore.state?.id ===
                                        comment.user_id ? (
                                            <>
                                                {" "}
                                                <button
                                                    type="button"
                                                    class=" rounded-md flex items-center gap-2 text-xs py-1"
                                                    onClick={() =>
                                                        onSelectUpdate({
                                                            id: comment.id,
                                                            content:
                                                                comment.content,
                                                        })
                                                    }
                                                >
                                                    <i class="fa-solid fa-pen" />{" "}
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        onSelectDestroy(
                                                            comment.id
                                                        )
                                                    }
                                                    type="button"
                                                    class=" rounded-md flex items-center gap-2 text-xs py-1"
                                                >
                                                    <i class="fa-solid fa-trash" />
                                                    Eliminar
                                                </button>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                </WebDropdown>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
            <div class="ml-8">
                {subcommentEdit.value?.id ? (
                    <Form
                        className="flex items-center justify-center gap-3"
                        onSubmit={onSubcommentsStore}
                        {...subcommentsStoreForm}
                    >
                        <div class="[&>div>label]:hidden w-full   my-2">
                            <input
                                class="w-full outline-none  text-sm border-b-2 border-primary dark:border-white p-2 dark:bg-paper-dark rounded-md dark:text-white bg-transparent"
                                type="text"
                                placeholder="Escribe un comentario..."
                                {...subcommentsStoreForm.register("content")}
                            />
                            {subcommentsStoreForm.formState.errors.content ? (
                                <p class="text-xs text-red-600 mt-1">
                                    {
                                        subcommentsStoreForm.formState.errors
                                            .content.message
                                    }
                                </p>
                            ) : (
                                <></>
                            )}
                            <button
                                type="button"
                                aria-label="cancelar"
                                onClick={() => {
                                    subcommentEdit.value = null;
                                }}
                                class="text-xs dark:text-white "
                            >
                                cancelar
                            </button>
                        </div>

                        {authStore.state ? (
                            <Form.button.submit
                                ico={<i class="fa-solid fa-comment" />}
                                disabled={
                                    subcommentsStoreMutation.isLoading || false
                                }
                                isLoading={
                                    subcommentsStoreMutation.isLoading || false
                                }
                                className="py-3 mt-0"
                                title="Agregar"
                            />
                        ) : (
                            <button
                                type="button"
                                aria-label="auth"
                                onClick={openAuth}
                            >
                                Iniciar session
                            </button>
                        )}
                    </Form>
                ) : null}

                {/* si es verdadero mosrtar subcomentarios y mappear*/}
                {comment.count > 0 ? (
                    <>
                        <button
                            class=" text-xs dark:text-white"
                            type="button"
                            aria-label="ver mas"
                            onClick={() => {
                                showComments.value = !showComments.value;
                            }}
                        >
                            {showComments.value ? (
                                <>
                                    <i class="fa-solid fa-eye mr-1" />
                                    Ocultar
                                </>
                            ) : (
                                `Ver ${comment.count} comentarios`
                            )}
                        </button>
                        <div
                            class={`${
                                showComments.value
                                    ? "max-h-[1200px]"
                                    : "max-h-0 overflow-hidden"
                            } delay-custom-1`}
                        >
                            {subcommentarios.value.map((subcomentary) => (
                                <ProductSubcomment
                                    comment_id={comment.id}
                                    product_id={product_id}
                                    subcomment={subcomentary}
                                    key={subcomentary.id}
                                    subcommentRefetch={reeditCommentary}
                                    subcommentDestroyRefetch={
                                        subcommentDestroyRefetch
                                    }
                                    type={type}
                                />
                            ))}
                            {paginator.pagination.paginator.totalPages >
                            paginator.pagination.page ? (
                                <button
                                    class=" text-xs dark:text-white"
                                    type="button"
                                    aria-label="ver mas"
                                    onClick={() =>
                                        paginator.pagination.onNextPage()
                                    }
                                >
                                    Ver más
                                </button>
                            ) : null}
                        </div>

                        {/* si la cantidad de subcomentario es igual que la cantidad de subcometarios que se agregan que muestre ocultar */}
                        {/* {productSubcommentsIndex.data?.count ===
                        subcomments.value.length ? (
                            <button
                                class="text-xs dark:text-white "
                                type="button"
                                onClick={() => {
                                    showSubcomments.value = false;
                                }}
                                aria-label="button show comments"
                            >
                                Ocultar
                            </button>
                        ) : null} */}
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default ProductComment;
