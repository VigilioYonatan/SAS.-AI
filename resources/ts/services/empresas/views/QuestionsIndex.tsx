import { questionsPaginatorApi } from "@/common/paginator/questions.paginator.api";
import usePaginator from "@vigilio/preact-paginator";
import { useEffect } from "preact/hooks";
import { Fragment } from "preact/jsx-runtime";
import PaginationFooter from "~/components/PaginationFooter";
import Loader from "~/components/Loader";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import Form from "~/components/form";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import {
    QuestionsStoreDto,
    questionsStoreDto,
} from "../dtos/questions.store.dto";
import { questionsStoreApi } from "../apis/questions/questions.store.api";
import { handlerError } from "~/libs/helpers";
import { questionsDestroyApi } from "../apis/questions/questions.destroy.api";
import LoaderSubmit from "~/components/LoaderSubmit";
import {
    questionsUpdateDto,
    QuestionsUpdateDto,
} from "../dtos/questions.update.dto";
import { questionsUpdateApi } from "../apis/questions/questions.update.api";
import { QuestionsSchema } from "../schemas/questions.schema";

function QuestionsIndex() {
    const paginator = usePaginator({ limit: 6 });

    const questionsPaginator = questionsPaginatorApi(paginator);

    useEffect(() => {
        questionsPaginator.refetch();
    }, [paginator.pagination.page, paginator.search.debounceTerm]);

    let component: JSX.Element | JSX.Element | null = null;
    if (questionsPaginator.isLoading) {
        component = <Loader />;
    }
    if (questionsPaginator.isError) {
        component = (
            <span class="mt-4 text-center dark:text-white">
                {questionsPaginator.error?.message}
            </span>
        );
    }
    if (questionsPaginator.isSuccess) {
        const questionsDestroyMutate = questionsDestroyApi();
        component = (
            <>
                <div class="flex justify-between w-full items-center">
                    <div class="flex gap-2 items-center">
                        <button
                            type="button"
                            onClick={() => questionsPaginator.refetch(false)}
                        >
                            <i class="fas fa-sync-alt" />
                        </button>
                        <input
                            type="text"
                            class="rounded-md text-xs py-2 px-2 text-black bg-white dark:bg-admin-terciary dark:text-white border border-paper-light dark:border-gray-600"
                            placeholder="Buscar pregunta"
                            onChange={(e) =>
                                paginator.search.onSearchByName(
                                    (e.target as HTMLInputElement).value
                                )
                            }
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            sweetModal((onClose) => ({
                                html: reactComponent(
                                    <QuestionsStore
                                        refetch={questionsPaginator.refetch}
                                        onClose={onClose}
                                    />
                                ),
                                showCloseButton: true,
                                isCloseInBackground: false,
                            }));
                        }}
                        class="bg-primary px-4 py-2 rounded-md shadow"
                    >
                        +
                    </button>
                </div>
                <div class="flex flex-col gap-4 my-6">
                    {questionsPaginator.data?.results.length ? (
                        questionsPaginator.data?.results.map((question) => (
                            <Fragment key={question.id}>
                                <div class="flex justify-between gap-2">
                                    <div class="flex flex-col">
                                        <span class="line-clamp-2 font-semibold">
                                            {question.question}
                                        </span>
                                        <p
                                            class={`line-clamp-2 ${
                                                !question.answer
                                                    ? "text-danger"
                                                    : ""
                                            }`}
                                        >
                                            {question.answer ||
                                                "no hay respuesta"}
                                        </p>
                                    </div>
                                    <div class="flex flex-col gap-2">
                                        <button
                                            class="px-2 py-1 rounded-md bg-orange-600"
                                            onClick={() => {
                                                sweetModal((onClose) => ({
                                                    html: reactComponent(
                                                        <QuestionsUpdate
                                                            refetch={
                                                                questionsPaginator.refetch
                                                            }
                                                            onClose={onClose}
                                                            question={question}
                                                        />
                                                    ),
                                                    showCancelButton: true,
                                                    showCloseButton: true,
                                                    isCloseInBackground: false,
                                                }));
                                            }}
                                            type="button"
                                        >
                                            <i class="fas fa-pen" />
                                        </button>
                                        <button
                                            class="px-2 py-1 rounded-md bg-danger"
                                            onClick={() => {
                                                sweetModal({
                                                    title: "¿Estas seguro de editar esta pregunta?",
                                                    showCancelButton: true,
                                                    showCloseButton: true,
                                                    isCloseInBackground: false,
                                                }).then(({ isConfirmed }) => {
                                                    if (isConfirmed) {
                                                        questionsDestroyMutate.mutate(
                                                            question.id,
                                                            {
                                                                onSuccess() {
                                                                    sweetAlert({
                                                                        icon: "success",
                                                                        title: "Eliminado correctamente correctamente",
                                                                    });
                                                                    questionsPaginator.refetch(
                                                                        false
                                                                    );
                                                                },
                                                                onError() {
                                                                    sweetAlert({
                                                                        icon: "danger",
                                                                        title: "No se eliminó correctamente",
                                                                    });
                                                                },
                                                            }
                                                        );
                                                    }
                                                });
                                            }}
                                            type="button"
                                            disabled={
                                                questionsDestroyMutate.isLoading ||
                                                false
                                            }
                                        >
                                            {questionsDestroyMutate.isLoading ? (
                                                <LoaderSubmit />
                                            ) : (
                                                <i class="fas fa-trash" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div class="w-full h-[1px] bg-gray-400" />
                            </Fragment>
                        ))
                    ) : (
                        <p class="dark:text-white block text-center">
                            No hay preguntas aún
                        </p>
                    )}
                </div>{" "}
                {paginator.pagination.paginator.totalPages > 0 ? (
                    <PaginationFooter paginator={paginator} />
                ) : null}
            </>
        );
    }
    return (
        <div class="dark:text-white">
            <h1 class="font-semibold text-xl text-center">Preguntas I.A</h1>
            <span class="block text-center text-gray-400 text-sm mb-3">
                (Cuando tus usuarios hacen estas preguntas, la I.A responde)
            </span>
            {component}
        </div>
    );
}
interface QuestionsStoreProps {
    refetch: (clean?: boolean) => void;
    onClose: () => void;
}
function QuestionsStore({ refetch, onClose }: QuestionsStoreProps) {
    const questionStoreForm = useForm<QuestionsStoreDto>({
        resolver: valibotVigilio(questionsStoreDto),
    });
    const questionsStoreMutate = questionsStoreApi();
    function onQuestionStore(body: QuestionsStoreDto) {
        sweetModal({
            title: "¿Estás seguro de agregar una nueva pregunta?",
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                questionsStoreMutate.mutate(body, {
                    onSuccess() {
                        sweetAlert({
                            title: "Pregunta Agregado correctamente.",
                            icon: "success",
                        });
                        refetch(false);
                        onClose();
                    },
                    onError(data) {
                        handlerError(questionStoreForm, data);
                    },
                });
            }
        });
    }
    return (
        <div>
            <Form {...questionStoreForm} onSubmit={onQuestionStore}>
                <Form.control
                    title="Pregunta"
                    placeholder=""
                    name={"question" as keyof QuestionsStoreDto}
                    question="Cuando un cliente pregunte."
                />
                <Form.control
                    title="Respuesta"
                    placeholder=""
                    name={"answer" as keyof QuestionsStoreDto}
                    question="La I.A responderá."
                />
                <Form.button.submit
                    title="Guardar"
                    ico={null}
                    isLoading={questionsStoreMutate.isLoading || false}
                    disabled={questionsStoreMutate.isLoading || false}
                />
            </Form>
        </div>
    );
}
interface QuestionsUpdateProps {
    refetch: (clean?: boolean) => void;
    onClose: () => void;
    question: QuestionsSchema;
}
function QuestionsUpdate({ refetch, onClose, question }: QuestionsUpdateProps) {
    const questionUpdateForm = useForm<QuestionsUpdateDto>({
        resolver: valibotVigilio(questionsUpdateDto),
        defaultValues: question,
    });
    const questionsUpdateMutate = questionsUpdateApi(question.id);
    function onQuestionUpdate(body: QuestionsUpdateDto) {
        sweetModal({
            title: "¿Estás seguro de agregar una nueva pregunta?",
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                questionsUpdateMutate.mutate(body, {
                    onSuccess() {
                        sweetAlert({
                            title: "Pregunta editado correctamente.",
                            icon: "success",
                        });
                        refetch(false);
                        onClose();
                    },
                    onError(data) {
                        handlerError(questionUpdateForm, data);
                    },
                });
            }
        });
    }
    return (
        <div>
            <Form {...questionUpdateForm} onSubmit={onQuestionUpdate}>
                <Form.control
                    title="Pregunta"
                    placeholder=""
                    name={"question" as keyof QuestionsUpdateDto}
                    question="Cuando un cliente pregunte."
                />
                <Form.control
                    title="Respuesta"
                    placeholder=""
                    name={"answer" as keyof QuestionsUpdateDto}
                    question="La I.A responderá."
                />
                <Form.button.submit
                    title="Guardar"
                    ico={null}
                    isLoading={questionsUpdateMutate.isLoading || false}
                    disabled={questionsUpdateMutate.isLoading || false}
                />
            </Form>
        </div>
    );
}
export default QuestionsIndex;
