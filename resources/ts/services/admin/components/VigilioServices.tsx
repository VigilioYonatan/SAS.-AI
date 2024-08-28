/***********
 * 
 * 

**************
NO TOCAR
**************

 */

import type { InformationSchemaFromServer } from "@/information/schemas/information.schema";
import useInformationStore from "@/information/stores/information.store";
import { useMutation, useQuery, type UseQuery } from "@vigilio/preact-fetching";
import { useTable, type Columns, type UseTable } from "@vigilio/preact-table";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useForm } from "react-hook-form";
import {
    array,
    boolean,
    instance,
    merge,
    minLength,
    nullable,
    number,
    object,
    omit,
    string,
    type Input,
} from "@vigilio/valibot";
import Form from "~/components/form";
import VigilioTable from "~/components/table";
import enviroments from "~/config";
import useDropdown from "~/hooks/useDropdown";
import {
    NOW,
    formatDateTwo,
    handlerError,
    restarDays,
    showTime,
} from "~/libs/helpers";
import { reactComponent } from "~/libs/preact";
import {
    filesSchema,
    printFileWithDimension,
    uploadApi,
    type FilesSchema,
} from "~/libs/upload";
import validFileValibot, { valibotVigilio } from "~/libs/valibot";

function VigilioServices() {
    const tableHelpers = useTable({
        columns: helpersColumns,
        pagination: { limit: 12 },
    });
    const tableGlobals = useTable({
        columns: globalColumns,
        pagination: { limit: 12 },
    });
    const helperquery = helpersPaginatorApi(tableHelpers);
    const globalQuery = globalPaginatorApi(tableGlobals);
    const dropdownHelper = useDropdown();
    const dopdownNew = useDropdown();
    function handleOpenHelper(props: { id: number }) {
        sweetModal((onClose) => ({
            html: reactComponent(
                <HelperShow
                    onClose={onClose}
                    id={props.id}
                    refetch={helperquery.refetch}
                />
            ),
            showCloseButton: true,
            position: "start",
            isCloseInBackground: false,
        }));
    }
    return (
        <div>
            <h3 class="text-primary text-2xl font-bold text-center">
                Con tu apoyo, ofreceremos lo mejor para su negocio
            </h3>
            <div class="flex flex-col gap-2 mt-6  ">
                <div
                    ref={dropdownHelper.trigger}
                    class={`${
                        dropdownHelper.dropdownOpen
                            ? "max-h-[420px] overflow-auto"
                            : "max-h-[60px] md:max-h-[40px] overflow-hidden"
                    } delay-custom-1`}
                >
                    <button
                        class="py-2 dark:text-white shadow rounded-md bg-paper-light dark:bg-admin-terciary  text-sm flex justify-between items-center px-2 w-full"
                        type="button"
                        aria-label="report"
                        onClick={() => {
                            dropdownHelper.onOpenClose();
                        }}
                    >
                        <div />
                        <span>
                            <i class="fa-thin fa-globe-pointer" /> ¿Que
                            agregarías a la web o al dashboard, IA, etc?
                        </span>
                        <i class="fa-solid fa-caret-down" />
                    </button>
                    <div class="flex justify-between mt-4 items-center">
                        <button
                            type="button"
                            class="text-xs dark:bg-admin-terciary px-4 py-2 rounded-md shadow dark:text-white"
                            aria-label="on comment"
                            onClick={() => {
                                sweetModal({
                                    html: reactComponent(
                                        <HelperStore
                                            refetch={helperquery.refetch}
                                        />
                                    ),
                                    showCloseButton: true,
                                    isCloseInBackground: false,
                                });
                            }}
                        >
                            <i class="fa-solid fa-messages" /> Dejar aporte
                        </button>
                        <button
                            type="button"
                            aria-label="xd"
                            class="bg-white text-black w-[20px] h-[20px] text-xs self-end rounded-full"
                            onClick={() => {
                                sweetModal({
                                    html: reactComponent(
                                        <div class="flex flex-col gap-2 dark:text-white">
                                            <span class="dark:text-white">
                                                * Entre mas like tenga el
                                                comentario, más trabajaremos en
                                                ello.
                                            </span>
                                            <span class="">
                                                * Habrá actualizaciones
                                                gratuitas como de paga.
                                            </span>
                                            <span class="dark:text-white">
                                                * Si no tienes alguna
                                                actualización comunicarse con
                                                empresa.
                                            </span>
                                            <span>
                                                * Habrá actualizaciones que no
                                                se podrá para empresas
                                                anteriores, mientras la
                                                actualización sea grande.
                                            </span>
                                            <span>
                                                * Se eliminarán comentario que
                                                no tengan que ver con el tema.
                                            </span>
                                            <span>
                                                * Esperamos tu discreción por
                                                las actualizaciones.
                                            </span>
                                            <span>
                                                Muchas gracias y exitos en su
                                                negocio 😊.{" "}
                                                <b>Por Yonatan Vigilio</b>
                                            </span>
                                        </div>
                                    ),
                                    showCloseButton: true,
                                });
                            }}
                        >
                            <i class="fa-solid fa-question" />
                        </button>
                    </div>
                    <div class="overflow-auto ">
                        <VigilioTable query={helperquery} table={tableHelpers}>
                            <VigilioTable.header>
                                <VigilioTable.header.tools
                                    hiddenInput
                                    hiddenDelete
                                />
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
                                        handleClick={handleOpenHelper}
                                    >
                                        {(data) => (
                                            <VigilioTable.tbody.td
                                                data={data}
                                            />
                                        )}
                                    </VigilioTable.tbody.row>
                                </VigilioTable.tbody>
                            </VigilioTable.table>
                            <VigilioTable.footer>
                                <VigilioTable.footer.show />
                                <VigilioTable.footer.paginator />
                            </VigilioTable.footer>
                        </VigilioTable>
                    </div>
                </div>

                <div
                    ref={dopdownNew.dropdown}
                    class={`${
                        dopdownNew.dropdownOpen
                            ? "max-h-auto"
                            : "max-h-[35px] overflow-hidden"
                    } delay-custom-1`}
                >
                    <button
                        class="p-2 dark:text-white shadow rounded-md bg-paper-light dark:bg-admin-terciary   text-sm flex justify-between items-center  px-2 w-full "
                        type="button"
                        aria-label="report"
                        onClick={() => {
                            dopdownNew.onOpenClose();
                        }}
                    >
                        <div />
                        <span>
                            <i class="fa-solid fa-newspaper" /> Noticias y
                            eventos
                        </span>
                        <i class="fa-solid fa-caret-down" />
                    </button>{" "}
                    <div class="overflow-auto">
                        <VigilioTable query={globalQuery} table={tableGlobals}>
                            <VigilioTable.header>
                                <VigilioTable.header.tools
                                    hiddenInput
                                    hiddenDelete
                                />
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
                                    <VigilioTable.tbody.row>
                                        {(data) => (
                                            <VigilioTable.tbody.td
                                                data={data}
                                            />
                                        )}
                                    </VigilioTable.tbody.row>
                                </VigilioTable.tbody>
                            </VigilioTable.table>
                            <VigilioTable.footer>
                                <VigilioTable.footer.show />
                                <VigilioTable.footer.paginator />
                            </VigilioTable.footer>
                        </VigilioTable>
                    </div>
                </div>
            </div>
        </div>
    );
}
interface HelpersStore {
    refetch: (clean?: boolean | undefined) => Promise<void>;
}
function HelperStore({ refetch }: HelpersStore) {
    const informationStore = useInformationStore();
    const helperStoreMutation = helperStoreApi();

    const formHelperStore = useForm<HelpersStoreDto>({
        resolver: valibotVigilio(helpersStoreDto),
        defaultValues: {
            token: informationStore.state!.token,
        },
    });

    function onHelper(body: HelpersStoreDto) {
        sweetModal({ title: "¿Estas seguro de enviar aporte" }).then(
            ({ isConfirmed }) => {
                if (isConfirmed) {
                    helperStoreMutation.mutate(body, {
                        onSuccess() {
                            refetch(false);
                            sweetAlert({
                                icon: "success",
                                title: "Muchas gracias por tu aporte :).",
                            });
                            formHelperStore.reset();
                        },
                        onError(error) {
                            handlerError(formHelperStore, error);
                        },
                    });
                }
            }
        );
    }
    return (
        <div>
            <h1 class="text-primary text-xl text-center">Nuevo aporte</h1>
            <Form onSubmit={onHelper} {...formHelperStore}>
                <Form.control
                    title="Titulo"
                    placeholder="*titulo de aporte"
                    name={"title" as keyof HelpersStoreDto}
                />
                <Form.control.area
                    title="Aporte"
                    placeholder="tu aporte*"
                    name={"message" as keyof HelpersStoreDto}
                />

                <Form.control.file
                    name={"images" as keyof HelpersStoreDto}
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                    title="Imagenes *No obligatorio"
                    typeFile="image"
                    multiple
                />
                <Form.button.submit
                    disabled={helperStoreMutation.isLoading || false}
                    isLoading={helperStoreMutation.isLoading || false}
                    title="Enviar aporte"
                    ico={null}
                />
            </Form>
        </div>
    );
}
interface HelperShowProps {
    id: number;
    onClose: () => void;
    refetch: (clean?: boolean) => void;
}
function HelperShow({ id, onClose, refetch }: HelperShowProps) {
    const helpersShowQuery = helpersShowApi(id);
    let component = null;
    if (helpersShowQuery.isLoading) {
        component = <Loading />;
    }
    if (helpersShowQuery.isError) {
        component = <View404 message={"error"} />;
    }
    if (helpersShowQuery.isSuccess) {
        const data = helpersShowQuery.data!.helper;
        const informationStore = useInformationStore();
        const destroyHelper = helpersDestroyApi(data.id);
        const updateHelper = helperUpdateApi(data.id);
        component = (
            <div class="">
                <div class="h-[300px] overflow-auto">
                    <h3 class="text-primary text-center">{data.title}</h3>
                    <p class="text-wrap break-words text-xs dark:text-white  text-center my-4">
                        {data.message}
                    </p>
                    {data.images ? (
                        <>
                            {printFileWithDimension(data.images, 300).map(
                                (file) => (
                                    <img
                                        key={file}
                                        src={file}
                                        class="w-[300px] h-[300px] object-cover"
                                        width={150}
                                        height={150}
                                        alt=""
                                    />
                                )
                            )}
                        </>
                    ) : (
                        <span class="dark:text-white text-[10px] text-center block">
                            No se subió imagenes
                        </span>
                    )}
                </div>
                <div class="flex gap-2 items-center">
                    <>
                        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                        {informationStore.state!.id === (data as any).web_id ? (
                            <button
                                type="button"
                                onClick={() => {
                                    sweetAlert({
                                        title: "¿Estas seguro de eliminar esta opinion?",
                                    }).then(({ isConfirmed }) => {
                                        if (isConfirmed) {
                                            destroyHelper.mutate(
                                                {
                                                    token: informationStore.state!
                                                        .token,
                                                },
                                                {
                                                    onSuccess() {
                                                        sweetAlert({
                                                            title: "Opinion eliminado correctamente",
                                                            icon: "success",
                                                        });
                                                        onClose();
                                                        refetch(false);
                                                    },
                                                    onError() {
                                                        sweetAlert({
                                                            title: "ERROR",
                                                            icon: "danger",
                                                        });
                                                    },
                                                }
                                            );
                                        }
                                    });
                                }}
                                class="bg-danger px-4 py-2 rounded-md text-white my-6 text-xs"
                                aria-label="dejar"
                            >
                                Eliminar
                            </button>
                        ) : (
                            <button
                                type="button"
                                class="bg-primary px-4 py-2 rounded-md text-white my-6 text-xs flex gap-2 items-center"
                                aria-label="dejar"
                                onClick={() => {
                                    if (
                                        data.likes.includes(
                                            informationStore.state!.token
                                        )
                                    ) {
                                        const remove = data.likes.filter(
                                            (like) =>
                                                like !==
                                                informationStore.state!.token
                                        );
                                        updateHelper.mutate(
                                            {
                                                ...data,
                                                likes: remove,
                                                token: informationStore.state!
                                                    .token,
                                            },
                                            {
                                                onSuccess() {
                                                    helpersShowQuery.transformData(
                                                        (data) => ({
                                                            ...data,
                                                            helper: {
                                                                ...data.helper,
                                                                likes: remove,
                                                            },
                                                        })
                                                    );
                                                    sweetAlert({
                                                        icon: "success",
                                                        title: "Dejaste de apoyar a esta opinión.",
                                                    });
                                                },
                                            }
                                        );

                                        return;
                                    }
                                    const addLikes = [
                                        ...data.likes,
                                        informationStore.state!.token,
                                    ];
                                    updateHelper.mutate(
                                        {
                                            ...data,
                                            likes: addLikes,
                                            token: informationStore.state!
                                                .token,
                                        },
                                        {
                                            onSuccess() {
                                                helpersShowQuery.transformData(
                                                    (data) => ({
                                                        ...data,
                                                        helper: {
                                                            ...data.helper,
                                                            likes: addLikes,
                                                        },
                                                    })
                                                );
                                                sweetAlert({
                                                    icon: "success",
                                                    title: "Apoyaste a esta opinión.",
                                                });
                                            },
                                        }
                                    );
                                }}
                            >
                                <i class="fa-solid fa-thumbs-up" /> Apoyar esta
                                opinión
                                <b class="bg-black text-white text-xs w-[20px] h-[20px] flex justify-center items-center ml-2 rounded-full">
                                    {data.likes.length}
                                </b>
                            </button>
                        )}
                    </>
                </div>

                <div class="flex flex-col mt-6">
                    <p class="dark:text-white font-bold">Comentarios</p>
                    <CommentsHelpers
                        isClose={data.isClose}
                        id={helpersShowQuery.data!.helper.id}
                    />
                </div>
            </div>
        );
    }
    return component;
}
interface CommentsHelpersProps {
    id: number;
    isClose: boolean;
}

function CommentsHelpers({ id, isClose }: CommentsHelpersProps) {
    const commentsStoreApiMutation = commentsStoreVigilioApi("helpers", id);
    const informationStore = useInformationStore();

    const paginator = usePaginator({ limit: 6 });

    const vigilioCommentsIndexApiQuery = commentsIndexVigilioApi(
        "helpers",
        id,
        paginator
    );
    const commentsStoreForm = useForm<CommentsStoreDto>({
        resolver: valibotVigilio(commentsStoreDto),
    });
    function onCommentsStore(body: CommentsStoreDto) {
        commentsStoreApiMutation.mutate(
            {
                ...body,
                token: informationStore.state!.token,
            },
            {
                onSuccess() {
                    commentsStoreForm.reset();
                    vigilioCommentsIndexApiQuery.refetch(false);
                },
                onError(error) {
                    handlerError(commentsStoreForm, error);
                },
            }
        );
    }
    useEffect(() => {
        vigilioCommentsIndexApiQuery.refetch(false);
    }, [paginator.pagination.value.limit, paginator.pagination.value.offset]);

    let vigilioComments: JSX.Element | JSX.Element[] | null = null;
    if (vigilioCommentsIndexApiQuery.isLoading) {
        vigilioComments = <Loading />;
    }
    if (vigilioCommentsIndexApiQuery.isError) {
        vigilioComments = (
            <span>{JSON.stringify(vigilioCommentsIndexApiQuery.error)}</span>
        );
    }
    if (vigilioCommentsIndexApiQuery.isSuccess) {
        vigilioComments = (
            <div class="flex flex-col gap-2">
                {!vigilioCommentsIndexApiQuery.data!.results.length ? (
                    <div class="flex flex-col justify-center items-center my-5 dark:text-white">
                        {isClose ? null : (
                            <>
                                <i class="fa-solid fa-comment-pen text-5xl" />
                                <span>Se el primero en comentar.</span>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        {vigilioCommentsIndexApiQuery.data!.results.map(
                            (comment) => (
                                <Comment
                                    id={id}
                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                    comment={comment as any}
                                    refetch={
                                        vigilioCommentsIndexApiQuery.refetch
                                    }
                                    key={comment.id}
                                />
                            )
                        )}
                        <PaginationFooter paginator={paginator} />
                    </>
                )}
            </div>
        );
    }
    return (
        <>
            {!isClose ? (
                <Form
                    className="flex items-center justify-center gap-3"
                    onSubmit={onCommentsStore}
                    {...commentsStoreForm}
                >
                    <Form.control.web
                        title="Deja un comentario"
                        placeholder="Escribe un comentario..."
                        name={"content" as keyof CommentsStoreDto}
                    />
                    <Form.button.submit
                        ico={<i class="fa-solid fa-comment" />}
                        isLoading={commentsStoreApiMutation.isLoading || false}
                        className="py-3 mt-0"
                        title="Agregar"
                    />
                </Form>
            ) : (
                <span class="text-danger text-xs">Cerrado</span>
            )}

            <section>{vigilioComments}</section>
        </>
    );
}

export default VigilioServices;
export function helpersPaginatorApi(
    table: UseTable<HelpersVigilio, UsersIndexSecondaryPaginator>
) {
    const result = useQuery<HelpersPaginatorAPI, HelpersPaginatorAPIError>(
        "/paginator/helpers",
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(table.pagination.value.offset));
            data.append("limit", String(table.pagination.value.limit));
            data.append("search", String(table.search.value));
            if (!Object.keys(table.sort.value).length) {
                data.append("id", "DESC");
            }
            for (const [key, value] of Object.entries(table.sort.value)) {
                data.append(key, value as string);
            }
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api${url}?${data}`
            );
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        {
            onSuccess(data) {
                table.updateData({
                    count: data.count,
                    result: data.results,
                    methods: { refetch: result.refetch },
                });
            },
        }
    );
    return result;
}

export type GlobalPaginatorQuery = UseQuery<
    GlobalPaginatorAPI,
    GlobalPaginatorErrorAPI
>;
export function globalPaginatorApi(
    table: UseTable<GlobalSchemaFromServer, GlobalIndexSecondaryPaginator>
): GlobalPaginatorQuery {
    const query = useQuery<GlobalPaginatorAPI, GlobalPaginatorErrorAPI>(
        "/global",
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(table.pagination.value.offset));
            data.append("search", table.search.debounceTerm);
            data.append("limit", String(table.pagination.value.limit));
            if (!Object.keys(table.sort.value).length) {
                data.append("id", "DESC");
            }
            for (const [key, value] of Object.entries(table.sort.value)) {
                data.append(key, value as string);
            }
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api/paginator${url}?${data}`
            );
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        },
        {
            onSuccess(data) {
                table.updateData({
                    count: data.count,
                    result: data.results,
                });
            },
            clean: false,
        }
    );
    return query;
}
interface GlobalSchemaFromServer {
    id: number;
    message: string;
    date: Date;
    createdAt: Date;
    updatedAt: Date;
    comentario: number;
}
export interface GlobalPaginatorAPI {
    success: boolean;
    count: number;
    next: string;
    previous: null;
    results: GlobalSchemaFromServer[];
}

export interface GlobalPaginatorErrorAPI {
    success: boolean;
    message: string;
    params: string;
}

interface HelpersVigilio {
    id: number;
    title: string;
    message: string;
    images: FilesSchema[];
    likes: number[];
    web_id: number;
    web: InformationSchemaFromServer;
    user: { id: number; name: string; photo: FilesSchema[] };
    comentario: number;
    createdAt: Date;
}
interface HelpersPaginatorAPI {
    success: true;
    results: HelpersVigilio[];
    count: number;
    next: string | null;
    previous: string | null;
}
interface HelpersPaginatorAPIError {
    success: false;
    message: string;
    params: string;
}
export type UsersIndexSecondaryPaginator = "acciones" | "index";

const helpersColumns: Columns<HelpersVigilio, UsersIndexSecondaryPaginator> = [
    { key: "index", header: "n°", isSort: "id" },
    {
        key: "title",
        header: "Titulo",
        isSort: "id",
        cell: (props) => (
            <div class="w-[250px] text-wrap break-words line-clamp-3">
                {props.title}
            </div>
        ),
    },
    { key: "likes", cell: (props) => props.likes.length },
    {
        key: "web",
        header: "usuario",
        cell: (props) => (
            <span>
                {props.web ? (
                    `${props.web.name.slice(0, 20)}...`
                ) : (
                    <>
                        <i class="fas fa-user-cog mr-1" />
                        {props.user.name.slice(0, 20)}...
                    </>
                )}
            </span>
        ),
    },
    {
        key: "createdAt",
        header: "fecha",
        cell: (props) => formatDateTwo(props.createdAt),
    },
    {
        key: "acciones",
        cell: (props, _index, methods) => {
            return (
                <div
                    class="flex items-center justify-center gap-1 text-white flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        type="button"
                        class="text-white bg-blue-600 rounded-md px-2 py-1"
                        onClick={() => {
                            sweetModal((onClose) => ({
                                html: reactComponent(
                                    <HelperShow
                                        onClose={onClose}
                                        id={props.id}
                                        refetch={methods.refetch}
                                    />
                                ),
                                showCloseButton: true,
                                position: "start",
                            }));
                        }}
                        aria-label="show"
                    >
                        <i class="fa-solid fa-eye" />
                    </button>
                    <span class="dark:text-white text-[10px]">
                        Hay {props.comentario} comentarios
                    </span>
                </div>
            );
        },
    },
];
export type GlobalIndexSecondaryPaginator = "acciones";
export const globalColumns: Columns<
    GlobalSchemaFromServer,
    GlobalIndexSecondaryPaginator
> = [
    {
        key: "id",
        isSort: true,
    },

    {
        key: "date",
        header: "Fecha de expiración",
        cell: (props) => (
            <div class="dark:text-white">
                {formatDateTwo(props.date)} -{" "}
                {restarDays(NOW().toDate(), props.date) < 0 ? (
                    <div class="bg-danger text-white px-4 py-1 rounded-md inline-block">
                        Venció
                    </div>
                ) : (
                    showTime(props.date)
                )}
            </div>
        ),
    },
    {
        key: "createdAt",
        header: "Creado",
        cell: (props) => formatDateTwo(props.createdAt),
    },
    {
        key: "acciones",
        cell: (props) => (
            <div class="flex items-center gap-2  justify-center">
                <button
                    class="px-1 py-1 lg:px-4 lg:py-2 rounded-md bg-white-600 text-black dark:text-white bg-paper-light dark:bg-admin-terciary shadow"
                    type="button"
                    aria-label="edit user"
                    onClick={() => {
                        sweetModal({
                            html: reactComponent(
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: props.message,
                                    }}
                                />
                            ),
                            showCloseButton: true,
                        });
                    }}
                >
                    <i class="fa-solid fa-eye" />
                </button>
            </div>
        ),
    },
];

export const helpersSchema = object({
    id: number("Este campo es obligatorio."),
    title: string("Este campo es obligatorio.", [
        minLength(10, "Este campo permite mínimo 10 cáracteres."),
    ]),
    message: string("Este campo es obligatorio.", [
        minLength(10, "Este campo permite mínimo 10 cáracteres."),
    ]),
    images: nullable(array(filesSchema())),
    likes: array(string()),
    isClose: boolean("Este campo es obligatorio"),
});

export type HelpersSchema = Input<typeof helpersSchema> & {
    createdAt: Date;
    updatedAt: Date;
};

export const helpersStoreDto = merge([
    omit(helpersSchema, ["id", "images", "isClose", "likes"]),
    object({
        token: string(),
        images: nullable(
            array(instance(File), "Este campo es obligatorio", [
                validFileValibot({
                    required: false,
                    min: 1,
                    max: 12,
                    types: [
                        "image/webp",
                        "image/jpg",
                        "image/jpeg",
                        "image/png",
                        "image/gif",
                    ],
                }),
            ])
        ),
    }),
]);
export type HelpersStoreDto = Input<typeof helpersStoreDto> & { token: string };
export const helpersUpdateDto = merge([
    omit(helpersSchema, ["id", "isClose", "images"]),
    object({ token: string() }),
]);
export type HelpersUpdateDto = Input<typeof helpersUpdateDto> & {
    token: string;
};

export function helperStoreApi() {
    return useMutation<helpersStoreAPI, HelpersStoreDto, helpersStoreErrorAPI>(
        "/helpers",
        async (url, body) => {
            let images = null;
            if (body.images) {
                const result = await uploadApi(
                    `${enviroments.VITE_VIGILIO_WEB}/api/uploads/helpers/images`,
                    {
                        file: body.images,
                    }
                );
                images = result.files;
            }
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api${url}`,
                {
                    body: JSON.stringify({ ...body, images }),
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export interface helpersStoreAPI {
    success: boolean;
    message: string;
}

export interface helpersStoreErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
export function helperUpdateApi(id: number) {
    return useMutation<helpersStoreAPI, HelpersUpdateDto, helpersStoreErrorAPI>(
        `/helpers/${id}`,
        async (url, body) => {
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api${url}`,
                {
                    body: JSON.stringify(body),
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
            const result = await response.json();
            if (!result.success) throw result;
            return result;
        }
    );
}

export function commentsIndexVigilioApi(
    commentables_type: string,
    commentables_id: number,
    paginator: UsePaginator
) {
    return useQuery<CommentsIndexAPI, CommentsIndexErrorAPI>(
        `/comments/${commentables_type}/${commentables_id}`,
        async (url) => {
            const data = new URLSearchParams();
            data.append("offset", String(paginator.pagination.value.offset));
            data.append("limit", String(paginator.pagination.value.limit));
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api${url}?${data}`
            );
            const result = await response.json();
            if (!result.success) throw result;
            paginator.updateData({ total: result.count });
            return result;
        }
    );
}

export interface CommentsIndexAPI {
    success: boolean;
    count: number;
    results: (CommentsSchemaFromServe & {
        count: number;
        web: { id: number; logo: string; name: string };
    })[];
}

export interface CommentsIndexErrorAPI {
    success: boolean;
    message: string;
}
export function commentsDestroyVigilioApi(
    commentables_type: string,
    commentables_id: number
) {
    return useMutation<
        CommentsDestroyAPI,
        { id: number; token: string },
        CommentsDestroyErrorAPI
    >(
        `/comments/${commentables_type}/${commentables_id}`,
        async (url, body) => {
            const { id, ...rest } = body;
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api${url}/${id}`,
                {
                    method: "DELETE",
                    body: JSON.stringify(rest),
                    headers: {
                        "Content-type": "application/json",
                    },
                }
            );
            const result = await response.json();

            if (!result.success) throw result;
            return result;
        }
    );
}

export interface CommentsDestroyErrorAPI {
    success: boolean;
    message: string;
}
export interface CommentsDestroyAPI {
    success: boolean;
    message: string;
}
import {
    commentsStoreDto,
    type CommentsStoreDto,
} from "@/polymorphism/dtos/comments.store.dto";
import type { CommentsSchema } from "@/polymorphism/schemas/comments.schema";

export function commentsStoreVigilioApi(
    commentables_type: string,
    commentables_id: number
) {
    return useMutation<
        CommentsStoreAPI,
        CommentsStoreDto & { token: string },
        CommentsStoreErrorAPI
    >(
        `/comments/${commentables_type}/${commentables_id}`,
        async (url, body) => {
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api${url}`,
                {
                    body: JSON.stringify(body),
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
            const result = await response.json();

            if (!result.success) throw result;
            return result;
        }
    );
}

export interface CommentsStoreAPI {
    success: boolean;
    comment: CommentsSchema;
}

export interface CommentsStoreErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
import Loading from "./Loading";
import View404 from "../views/404";
import PaginationFooter from "~/components/PaginationFooter";

export function commentsUpdateVigilioApi(
    commentables_type: string,
    commentables_id: number,
    id: number
) {
    return useMutation<
        CommentsUpdateAPI,
        CommentsUpdateDto & { token: string },
        CommentsUpdateErrorAPI
    >(
        `/comments/${commentables_type}/${commentables_id}/${id}`,
        async (url, body) => {
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api${url}`,
                {
                    body: JSON.stringify(body),
                    method: "PUT",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
            const result = await response.json();

            if (!result.success) throw result;
            return result;
        }
    );
}

export interface CommentsUpdateAPI {
    success: boolean;
    comment: CommentsSchema;
}

export interface CommentsUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
function helpersShowApi(id: number) {
    return useQuery<HelpersShowAPI, unknown>(`/helpers/${id}`, async (url) => {
        const response = await fetch(
            `${enviroments.VITE_VIGILIO_WEB}/api${url}`
        );
        const result = await response.json();

        if (!result.success) throw result;
        return result;
    });
}
function helpersDestroyApi(id: number) {
    return useMutation<
        { success: true; message: string },
        { token: string },
        { success: boolean; message: string }
    >(`/helpers/${id}`, async (url, body) => {
        const response = await fetch(
            `${enviroments.VITE_VIGILIO_WEB}/api${url}`,
            {
                method: "DELETE",
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        const result = await response.json();

        if (!result.success) throw result;
        return result;
    });
}

export interface HelpersShowAPI {
    success: boolean;
    helper: HelpersSchema & { comments: [{ id: string; comment: string }] };
}

export interface CommentsUpdateErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
//  -------------
import WebDropdown from "~/components/dropdown/WebDropdown";
import useAuthStore from "@/auth/stores/auth.store";
import type { CommentsSchemaFromServe } from "@/polymorphism/schemas/comments.schema";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import {
    commentsUpdateDto,
    type CommentsUpdateDto,
} from "@/polymorphism/dtos/comments.update.dto";
import usePaginator, { type UsePaginator } from "@vigilio/preact-paginator";
import type { ReactionsSchema } from "@/polymorphism/schemas/reactions.schema";
import type { ReactionsStoreDto } from "@/polymorphism/dtos/reactions.store.dto";
import { NoProfileImage } from "~/config/settings";

interface CommentProps {
    id: number;
    comment: {
        count: number;
        web_id: number;
        user: { id: number; name: string; photo: FilesSchema[] };
        content: string;
        id: number;
        createdAt: Date;
        updatedAt: Date;
        web: { id: number; name: string; logo: FilesSchema[]; token: string };
    };
    refetch: (clean?: boolean) => void;
}
function Comment({ id, comment, refetch }: CommentProps) {
    const commentEdit = useSignal<null | { id: number; content: string }>(null);
    const authStore = useAuthStore();
    const commentsUpdateMutation = commentsUpdateVigilioApi(
        "helpers",
        id,
        commentEdit.value?.id!
    );
    const commentsDestroyMutation = commentsDestroyVigilioApi("helpers", id);
    const commentsUpdateForm = useForm<CommentsUpdateDto>({
        resolver: valibotVigilio(commentsUpdateDto),
    });
    const informationStore = useInformationStore();

    function onCommentsUpdate(body: CommentsUpdateDto) {
        if (!authStore.state) return;
        commentsUpdateMutation.mutate(
            {
                ...body,
                token: informationStore.state!.token,
            },
            {
                onSuccess() {
                    commentEdit.value = null;
                    refetch(false);
                },
                onError(error) {
                    handlerError(commentsUpdateForm, error);
                },
            }
        );
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
                commentsDestroyMutation.mutate(
                    {
                        id,
                        token: informationStore.state!.token,
                    },
                    {
                        onSuccess() {
                            sweetAlert({
                                icon: "success",
                                title: "Eliminado correctamente",
                            });
                            refetch(false);
                        },
                        onError(error) {
                            sweetModal({
                                icon: "danger",
                                title: "Error en el servidor",
                                text: `Comunicarse con el desarrollador ${error.message}`,
                            });
                        },
                    }
                );
            }
        });
    }

    // subcommentario

    useEffect(() => {
        if (commentEdit.value) {
            commentsUpdateForm.setValue("content", commentEdit.value.content);
        }
    }, [commentEdit.value]);

    return (
        <div>
            <div class="flex gap-4">
                <div class="flex flex-col justify-center items-center">
                    <img
                        class="rounded-full min-w-[40px] h-[40px] object-cover"
                        width={50}
                        height={50}
                        src={
                            comment.web
                                ? comment.web.logo
                                    ? printFileWithDimension(
                                          comment.web.logo,
                                          300
                                      )[0]
                                    : NoProfileImage()
                                : comment.user.photo
                                ? printFileWithDimension(
                                      comment.user.photo,
                                      300
                                  )[0]
                                : NoProfileImage()
                        }
                        alt={comment.web ? comment.web.name : comment.user.name}
                    />
                    <span class="text-[10px] text-center dark:text-white line-clamp-2">
                        {comment.web ? comment.web.name : comment.user.name}
                    </span>
                </div>

                <div class="flex justify-between w-full">
                    <div class="flex flex-col w-full gap-2">
                        {comment.id === commentEdit.value?.id ? (
                            <Form
                                className="w-full"
                                onSubmit={onCommentsUpdate}
                                {...commentsUpdateForm}
                            >
                                <input
                                    type="text"
                                    className="outline-none py-1 rounded-md px-2 border border-primary w-full"
                                    {...commentsUpdateForm.register("content")}
                                />
                                <button
                                    aria-label="update commentary"
                                    class="bg-orange-600 px-4 py-1 rounded-md text-xs text-white"
                                    type="submit"
                                >
                                    Actualizar
                                </button>
                            </Form>
                        ) : (
                            <span class="dark:text-white text-wrap break-words text-xs md:w-[300px] w-[220px]">
                                {comment.content}
                            </span>
                        )}
                        <div class="flex gap-2 items-center  w-full">
                            <span class="text-xs  dark:text-white">
                                {showTime(comment.createdAt!)}
                            </span>
                            <span class="text-xs  dark:text-white">
                                {comment.createdAt !== comment.updatedAt
                                    ? "(editado)"
                                    : ""}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col items-center">
                        <>
                            {JSON.stringify(comment.web)}
                            {comment.web_id &&
                            comment.web.token === authStore.state!.token ? (
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
                                        <div class="flex flex-col">
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
                                                    onSelectDestroy(comment.id)
                                                }
                                                type="button"
                                                class=" rounded-md flex items-center gap-2 text-xs py-1"
                                            >
                                                <i class="fa-solid fa-trash" />
                                                Eliminar
                                            </button>
                                        </div>
                                    </WebDropdown>
                                </>
                            ) : null}
                        </>
                    </div>
                </div>
            </div>
        </div>
    );
}

export interface ReactionsShowAPI {
    success: boolean;
    data: ReactionsSchema[];
}

export interface ReactionsShowErrorAPI {
    success: boolean;
    message: string;
}
export function reactionsStoreVigilioApi(
    reactionsable_type: string,
    reactionsable_id: number
) {
    return useMutation<
        ReactionsStoreAPI,
        ReactionsStoreDto,
        ReactionsStoreErrorAPI
    >(
        `/reactions/${reactionsable_type}/${reactionsable_id}`,
        async (url, body) => {
            const response = await fetch(
                `${enviroments.VITE_VIGILIO_WEB}/api${url}`,
                {
                    body: JSON.stringify(body),
                    method: "POST",
                    headers: {
                        "content-type": "application/json",
                    },
                }
            );
            const result = await response.json();

            if (!result.success) throw result;
            return result;
        }
    );
}

export interface ReactionsStoreAPI {
    success: boolean;
    reaction: ReactionsSchema;
}

export interface ReactionsStoreErrorAPI {
    success: boolean;
    message: string;
    body: string;
}
export function reactionsDestroyVigilioApi(
    reactionsable_type: string,
    reactionsable_id: number
) {
    return useMutation<ReactionsDestroyAPI, number, ReactionsDestroyErrorAPI>(
        `/reactions/${reactionsable_type}/${reactionsable_id}`,
        async (url, id) => {
            const response = await fetch(`/${url}/${id}`, {
                method: "DELETE",
            });
            const result = await response.json();

            if (!result.success) throw result;
            return result;
        }
    );
}

export interface ReactionsDestroyErrorAPI {
    success: boolean;
    message: string;
}
export interface ReactionsDestroyAPI {
    success: boolean;
    message: string;
}
