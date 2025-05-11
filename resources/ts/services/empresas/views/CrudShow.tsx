import Loading from "@/admin/components/Loading";
import { crudShowApi } from "../apis/crud/crud.show.api";
import View404 from "@/admin/views/404";
import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import useAuthStore from "@/auth/stores/auth.store";
import { CrudSchema } from "../schemas/crud.schema";
import Form from "~/components/form";
import { Fragment } from "preact/jsx-runtime";
import { useForm } from "react-hook-form";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { crudDataStoreApi } from "../apis/crud_data/crud-data.store.api";
import { useTable, type Columns } from "@vigilio/preact-table";
import { crudPaginatorApi } from "@/common/paginator/crud.paginator.api";
import VigilioTable from "~/components/table";
import { crudDataUpdateApi } from "../apis/crud_data/crud-data.update.api";
import { crudDataDestroyApi } from "../apis/crud_data/crud-data.destroy.api";
import { useSignal } from "@preact/signals";
import { useEffect, useMemo } from "preact/hooks";
import {
    array,
    boolean,
    coerce,
    date,
    instance,
    nullable,
    number,
    object,
    string,
} from "@vigilio/valibot";
import validFileValibot, { valibotVigilio } from "~/libs/valibot";
import { getFilesEdit, printFileWithDimension, uploadApi } from "~/libs/upload";
import { useMutation } from "@vigilio/preact-fetching";
import {
    formatDateTwo,
    handlerError,
    removeTextHTML,
    TimePeru,
} from "~/libs/helpers";
import { crudDataIndexApi } from "../apis/crud_data/crud-data.index.api";
import { formSelectNumber } from "~/components/form/FormSelect";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import FormControlEditor from "~/components/form/FormControlEditor";

interface CrudShowProps {
    params: {
        slug: string;
    };
}
function CrudShow({ params }: CrudShowProps) {
    const slug = params.slug;

    const crudShowQuery = crudShowApi(slug);
    let component = null;
    if (crudShowQuery.isLoading) {
        component = <Loading />;
    }
    if (crudShowQuery.isError) {
        component = <View404 message={"error no params"} />;
    }
    if (crudShowQuery.isSuccess) {
        const crud = crudShowQuery.data?.crud!;

        useEffect(() => {
            crudShowQuery.refetch(true);
        }, [slug]);

        const cols = [
            {
                id: 0,
                name: "id",
                type: "INTEGER",
            },
            ...crud.data.map((val, i) => ({ ...val, id: i + 1 })),
        ];

        const { guards } = useAuthStore();
        const columns: Columns<Record<string, unknown>, "acciones"> = [
            ...cols
                .filter((data) => data?.type !== "TEXT")
                .map((data) => ({
                    key: data.name,
                    isSort:
                        data?.type === "INTEGER" ||
                        data?.type === "STRING" ||
                        data?.type === "BOOLEAN" ||
                        data?.type === "FOREIGNKEY",
                    cell: (props: Record<string, unknown>, i: number) => {
                        return (
                            <div class="flex justify-center items-center">
                                {data.name === "id" ? (
                                    <span>{i + 1}</span>
                                ) : (
                                    <>
                                        {data?.type === "BOOLEAN" ? (
                                            <div
                                                class={`${
                                                    props[data.name]
                                                        ? "bg-success"
                                                        : "bg-danger"
                                                } w-[20px] h-[20px] rounded-full`}
                                            />
                                        ) : data?.type === "STRING" ? (
                                            <span>
                                                {(
                                                    props[
                                                        data.name as keyof Record<
                                                            string,
                                                            unknown
                                                        >
                                                    ] as string
                                                ).slice(0, 30)}
                                            </span>
                                        ) : data?.type === "DATE" ? (
                                            <span>
                                                {TimePeru(
                                                    props[
                                                        data.name as keyof Record<
                                                            string,
                                                            unknown
                                                        >
                                                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                    ] as any
                                                ).format(
                                                    "DD/MM/YYYY hh:mm A"
                                                )}{" "}
                                            </span>
                                        ) : data?.type === "FILE" ? (
                                            <div>
                                                {(props[
                                                    data.name as keyof Record<
                                                        string,
                                                        unknown
                                                    >
                                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                ] as any) ? (
                                                    <img
                                                        src={
                                                            printFileWithDimension(
                                                                props[
                                                                    data.name as keyof Record<
                                                                        string,
                                                                        unknown
                                                                    >
                                                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                                ] as any,
                                                                null
                                                            )[0]
                                                        }
                                                        width={60}
                                                        height={60}
                                                        class="w-[60px] h-[60px] object-contain"
                                                        alt=""
                                                    />
                                                ) : (
                                                    <span>no image</span>
                                                )}
                                            </div>
                                        ) : data?.type === "FOREIGNKEY" ? (
                                            <span class="bg-blue-500 text-white rounded-lg shadow px-2 py-0.8">
                                                {
                                                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                    (props as any)[
                                                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                        (data as any).options
                                                            .references
                                                    ].slug
                                                }
                                            </span>
                                        ) : (
                                            <span>
                                                {
                                                    props[
                                                        data.name as keyof Record<
                                                            string,
                                                            unknown
                                                        >
                                                    ] as string
                                                }
                                            </span>
                                        )}
                                    </>
                                )}
                            </div>
                        );
                    },
                })),
            {
                key: "acciones",
                cell: (props, _index, methods) => {
                    const crudDataDestroyMutate = crudDataDestroyApi(crud.name);
                    function onBrandsUpdate(e: Event) {
                        const { index, ...rest } = props;
                        e.stopPropagation();
                        sweetModal((onClose) => ({
                            html: reactComponent(
                                <CrudDataUpdate
                                    onClose={onClose}
                                    refetch={methods.refetch}
                                    data={rest}
                                    crud={crud}
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
                                aria-label="edit brand"
                                class="w-[40px] h-[40px] flex justify-center items-center rounded-md bg-orange-600"
                                type="button"
                                onClick={onBrandsUpdate}
                            >
                                <i class="fa-solid text-sm fa-pen lg:mr-1" />
                            </button>
                            <button
                                onClick={() => {
                                    sweetModal({
                                        title: `¿Estás seguro de eliminar esta ${props.id}?`,
                                        showCancelButton: true,
                                        showCloseButton: true,
                                        isCloseInBackground: false,
                                    }).then(({ isConfirmed }) => {
                                        if (isConfirmed) {
                                            crudDataDestroyMutate.mutate(
                                                props.id as number,
                                                {
                                                    onSuccess() {
                                                        sweetAlert({
                                                            icon: "success",
                                                            title: "Se eliminó correctamente",
                                                        });
                                                        crudShowQuery.refetch(
                                                            true
                                                        );
                                                    },
                                                    onError(error) {
                                                        sweetAlert({
                                                            icon: "danger",
                                                            title: `Se eliminó correctamente ${error.message}`,
                                                        });
                                                    },
                                                }
                                            );
                                        }
                                    });
                                }}
                                aria-label="show brand"
                                class="w-[40px] h-[40px] flex justify-center items-center lg:px-4 lg:py-2 rounded-md bg-danger "
                                type="button"
                                disabled={
                                    crudDataDestroyMutate.isLoading || false
                                }
                            >
                                {crudDataDestroyMutate.isLoading ? (
                                    <Loading />
                                ) : (
                                    <i class="fas fa-trash" />
                                )}
                            </button>
                        </div>
                    );
                },
            },
        ];
        const table = useTable({
            columns,
        });
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const query = crudPaginatorApi(table as any, slug);
        function onShow(data: Record<string, unknown>) {
            sweetModal({
                html: reactComponent(
                    <div class="grid grid-cols-2">
                        {crud.data.map((c, i) => {
                            return (
                                <div
                                    class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2 "
                                    key={data.id}
                                >
                                    <span class="text-primary dark:text-terciary font-bold">
                                        {c.name}:
                                    </span>
                                    <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                        {c.name === "id" ? (
                                            <span>{i + 1}</span>
                                        ) : (
                                            <>
                                                {c.type === "BOOLEAN" ? (
                                                    <div
                                                        class={`${
                                                            data[c.name]
                                                                ? "bg-success"
                                                                : "bg-danger"
                                                        } w-[20px] h-[20px] rounded-full`}
                                                    />
                                                ) : c.type === "STRING" ? (
                                                    <span>
                                                        {(
                                                            data[
                                                                c.name as keyof typeof data
                                                            ] as string
                                                        ).slice(0, 30)}
                                                    </span>
                                                ) : c.type === "TEXT" ? (
                                                    <div class="max-h-[300px] overflow-auto">
                                                        {removeTextHTML(
                                                            (
                                                                data[
                                                                    c.name as keyof typeof data
                                                                ] as string
                                                            ).slice(0, 30)
                                                        )}
                                                    </div>
                                                ) : c.type === "DATE" ? (
                                                    <div class="max-h-[300px] overflow-auto">
                                                        {TimePeru(
                                                            data[
                                                                c.name as keyof typeof data
                                                            ] as string
                                                        ).format(
                                                            "DD/MM/YYYY hh:mm A"
                                                        )}
                                                    </div>
                                                ) : c.type === "FILE" ? (
                                                    <div class="max-h-[300px] overflow-auto">
                                                        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
                                                        {(data as any)[
                                                            c.name as keyof Record<
                                                                string,
                                                                unknown
                                                            >
                                                        ] ? (
                                                            <img
                                                                src={
                                                                    printFileWithDimension(
                                                                        data[
                                                                            c
                                                                                .name
                                                                            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                                        ] as any,
                                                                        null
                                                                    )[0]
                                                                }
                                                                width={60}
                                                                height={60}
                                                                class="w-[60px] h-[60px] object-contain"
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <span>
                                                                no image
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span class="max-h-[300px] overflow-auto">
                                                        {data[c.name] as string}
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2 ">
                            <span class="text-primary dark:text-terciary font-bold">
                                Creado:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {TimePeru(data.createdAt as string).format(
                                    "DD/MM/YYYY hh:mm A"
                                )}
                            </span>
                        </div>
                        <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2 ">
                            <span class="text-primary dark:text-terciary font-bold">
                                Actualizado:
                            </span>
                            <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                                {TimePeru(data.updatedAt as string).format(
                                    "DD/MM/YYYY hh:mm A"
                                )}
                            </span>
                        </div>
                    </div>
                ),
                showCloseButton: true,
                isCloseInBackground: false,
                sweetWidth: "700px",
            });
        }
        component = (
            <Container className="p-2">
                <div className="flex flex-col gap-4 mx-1 ">
                    <AdminBreadCrumb current={crud.name} />
                    <div class="flex  items-center justify-between gap-2">
                        {guards.permissionAdminGuard() ? (
                            <button
                                type="button"
                                class="bg-primary px-6 py-2 text-xs font-bold self-start rounded-md text-white flex justify-center items-center gap-2"
                                aria-label="button to open create new crud data"
                                onClick={() => {
                                    sweetModal((onClose) => ({
                                        html: reactComponent(
                                            <CrudDataStore
                                                crud={crud}
                                                refetch={crudShowQuery.refetch}
                                                onClose={onClose}
                                            />
                                        ),
                                        showCloseButton: true,
                                        isCloseInBackground: false,
                                        sweetWidth: "700px",
                                        position: "start",
                                    }));
                                }}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: crud.icon,
                                    }}
                                />
                                Agregar {crud?.name}
                            </button>
                        ) : null}
                    </div>
                </div>

                <div class="overflow-auto">
                    <VigilioTable query={query} table={table}>
                        <VigilioTable.header className="p-0 mb-2 flex justify-between items-center">
                            <VigilioTable.header.tools
                                hiddenDelete
                                hiddenFetching
                                hiddenInput
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
                                <VigilioTable.tbody.row handleClick={onShow}>
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

    return component;
}
function valibotDynamic(arr: CrudSchema["data"], isNull = false) {
    const obj = {};
    // arr[0].
    for (const item of arr) {
        const types = {
            STRING: item.options.allowNull ? nullable(string()) : string(),
            TEXT: item.options.allowNull ? nullable(string()) : string(),
            FILE: item.options.allowNull
                ? nullable(
                      array(instance(File), [
                          validFileValibot({
                              required: !item.options.allowNull,
                              min: 1,
                              max: item.file_option?.max || 1,
                              types: item.file_option?.types.split(", "),
                          }),
                      ])
                  )
                : array(instance(File), [
                      validFileValibot({
                          required: !item.options.allowNull,
                          min: 1,
                          max: item.file_option?.max || 1,
                          types: item.file_option?.types.split(", "),
                      }),
                  ]),
            BOOLEAN: boolean(),
            INTEGER: item.options.allowNull ? nullable(number()) : number(),
            DECIMAL: item.options.allowNull ? nullable(number()) : number(),
            DATE: item.options.allowNull
                ? nullable(coerce(date(), (val) => new Date(val as Date)))
                : coerce(date(), (val) => new Date(val as Date)),
            FOREIGNKEY:
                item.type !== "FOREIGNKEY" ? nullable(number()) : number(),
        };
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        (obj as any)[item.name] = isNull
            ? item.type === "BOOLEAN"
                ? false
                : null
            : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              ((types as any)[
                  item.type as keyof typeof types
              ] as keyof typeof item);
    }
    return obj;
}

interface CrudDataStoreProps {
    crud: CrudSchema;
    refetch: (clean?: boolean) => void;
    onClose: () => void;
}
function CrudDataStore({ crud, refetch, onClose }: CrudDataStoreProps) {
    const crudStoreMutation = crudDataStoreApi(crud.data, crud.name);
    const validator = object(valibotDynamic(crud.data));

    const crudDataStoreForm = useForm<Record<string, unknown>>({
        resolver: valibotVigilio(validator),
        defaultValues: valibotDynamic(crud.data, true),
    });

    function onCrudData(body: Record<string, unknown>) {
        sweetModal({
            title: `Estas seguro de agregar un nuevo ${crud.name.toLowerCase()}?`,
            showCancelButton: true,
            isCloseInBackground: false,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                crudStoreMutation.mutate(body, {
                    onSuccess() {
                        sweetAlert({
                            icon: "success",
                            title: `Agregado correctamente ${crud.name}`,
                        });
                        refetch(true);
                        onClose();
                    },
                    onError(error) {
                        handlerError(crudDataStoreForm, error);
                    },
                });
            }
        });
    }
    const slug = crud.data.find((c) => c.name === "slug");
    return (
        <div>
            <h3 class="mb-3 dark:text-white text-xl text-center">
                Agregar {crud.name}
            </h3>
            <Form onSubmit={onCrudData} {...crudDataStoreForm}>
                <Fragment>
                    {[...crud.data.filter((c) => c.name !== "slug"), slug].map(
                        (data) => {
                            return (
                                <Fragment key={data?.name}>
                                    {data?.type === "STRING" ||
                                    data?.type === "DATE" ? (
                                        <Form.control
                                            name={data.name}
                                            type={
                                                data?.type === "DATE"
                                                    ? "datetime-local"
                                                    : "text"
                                            }
                                            title={data.name}
                                            options={{
                                                setValueAs: (val) => {
                                                    return data?.name === "slug"
                                                        ? transformSlug(
                                                              val || ""
                                                          )
                                                        : val;
                                                },
                                            }}
                                            placeholder={data.placeholder || ""}
                                        />
                                    ) : data?.type === "TEXT" ? (
                                        <>
                                            {(() => {
                                                const description = useSignal<
                                                    string | null
                                                >(null);
                                                return (
                                                    <FormControlEditor
                                                        name={data.name}
                                                        title={data.name}
                                                        isShow
                                                        change={
                                                            description.value
                                                        }
                                                    />
                                                );
                                            })()}
                                        </>
                                    ) : data?.type === "INTEGER" ||
                                      data?.type === "DECIMAL" ? (
                                        <Form.control
                                            name={data.name}
                                            type="number"
                                            options={{ setValueAs: Number }}
                                            title={data.name}
                                            placeholder={data.placeholder || ""}
                                        />
                                    ) : data?.type === "FILE" ? (
                                        <Form.control.file
                                            name={data.name}
                                            title={data.name}
                                            typeFile={
                                                data.file_option?.type || "file"
                                            }
                                            showButonCopy={
                                                data.file_option?.type ===
                                                    "image" ||
                                                data.file_option?.type ===
                                                    "video"
                                            }
                                            multiple={
                                                data.file_option?.multiple
                                            }
                                            typesText={
                                                data.file_option?.types ||
                                                "jpg, png, webp ó jpeg"
                                            }
                                        />
                                    ) : data?.type === "BOOLEAN" ? (
                                        <Form.control.toggle
                                            name={data.name}
                                            title={data.name}
                                        />
                                    ) : data?.type === "FOREIGNKEY" ? (
                                        <>
                                            {(() => {
                                                const crudDataIndexQuery =
                                                    crudDataIndexApi(
                                                        data.options
                                                            ?.references as string
                                                    );
                                                const subcategoriesSelect =
                                                    useMemo(() => {
                                                        if (
                                                            crudDataIndexQuery.isSuccess &&
                                                            crudDataIndexQuery.data
                                                        ) {
                                                            return (
                                                                crudDataIndexQuery
                                                                    .data
                                                                    .data as unknown as {
                                                                    id: number;
                                                                    slug: string;
                                                                }[]
                                                            )?.map((value) => ({
                                                                key: value.id,
                                                                value: value.slug,
                                                            }));
                                                        }
                                                        return [];
                                                    }, [
                                                        crudDataIndexQuery.data,
                                                        crudDataIndexQuery.isSuccess,
                                                    ]);

                                                return (
                                                    <Form.control.select
                                                        name={data.name}
                                                        array={
                                                            subcategoriesSelect
                                                        }
                                                        title={data.name}
                                                        placeholder={
                                                            data.placeholder ||
                                                            `Escoger ${data.options.references}`
                                                        }
                                                        options={{
                                                            setValueAs:
                                                                formSelectNumber,
                                                        }}
                                                    />
                                                );
                                            })()}
                                        </>
                                    ) : null}
                                </Fragment>
                            );
                        }
                    )}
                </Fragment>
                <br />
                <Form.button.submit
                    disabled={false}
                    isLoading={false}
                    title="Guardar"
                    ico={
                        <div dangerouslySetInnerHTML={{ __html: crud.icon }} />
                    }
                />
            </Form>
        </div>
    );
}
interface CrudDataUpdateProps {
    data: Record<string, unknown>;
    crud: CrudSchema;
    onClose: () => void;
    refetch: (clean?: boolean) => void;
}
function CrudDataUpdate({ data, crud, onClose, refetch }: CrudDataUpdateProps) {
    const resolver = valibotDynamic(crud.data.filter((v) => v.type !== "FILE"));
    function obj() {
        const files: Record<string, unknown> = {};
        const rest: Record<string, unknown> = {};
        for (const c of crud.data) {
            if (c.type === "FILE") {
                files[c.name as keyof typeof files] =
                    data[c.name as keyof typeof crud];
            } else {
                rest[c.name as keyof typeof rest] =
                    c.type === "DATE"
                        ? (formatDateTwo(
                              data[c.name as keyof typeof crud] as string,
                              "YYYY-MM-DDTHH:mm"
                          ) as unknown as Date)
                        : data[c.name as keyof typeof crud];
            }
        }
        return {
            rest,
            files,
        };
    }

    const crudStoreMutation = crudDataUpdateApi(crud.name, data.id as number);
    const crudDataStoreForm = useForm<Record<string, unknown>>({
        defaultValues: obj().rest,
        resolver: valibotVigilio(object(resolver)),
    });

    function onCrudData(body: Record<string, unknown>) {
        sweetModal({
            title: "¿Estas seguro de editar?",
            showCancelButton: true,
            isCloseInBackground: false,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                crudStoreMutation.mutate(body, {
                    onSuccess() {
                        sweetAlert({
                            icon: "success",
                            title: `Agregado correctamente ${data.id}`,
                        });
                        refetch(true);
                        onClose();
                    },
                    onError() {
                        sweetAlert({
                            icon: "danger",
                            title: `No se edito  ${data.id}`,
                        });
                    },
                });
            }
        });
    }

    return (
        <div>
            <h3 class="mb-3 dark:text-white text-xl text-center">
                Editar {crud.name}
            </h3>
            <Form onSubmit={onCrudData} {...crudDataStoreForm}>
                <Fragment>
                    {crud.data
                        .filter((d) => d.type !== "FILE")
                        .map((d) => {
                            return (
                                <Fragment key={d.name}>
                                    {d.type === "STRING" ||
                                    d.type === "DATE" ? (
                                        <Form.control
                                            name={d.name}
                                            type={
                                                d.type === "DATE"
                                                    ? "datetime-local"
                                                    : "text"
                                            }
                                            title={d.name}
                                            placeholder={d.placeholder || ""}
                                            options={{
                                                setValueAs: (val) => {
                                                    return data?.name === "slug"
                                                        ? transformSlug(
                                                              val || ""
                                                          )
                                                        : val;
                                                },
                                            }}
                                        />
                                    ) : d.type === "TEXT" ? (
                                        <>
                                            {(() => {
                                                const description = useSignal<
                                                    string | null
                                                >(
                                                    data[
                                                        d.name as keyof typeof data
                                                    ] as string
                                                );

                                                return (
                                                    <FormControlEditor
                                                        name={d.name}
                                                        title={d.name}
                                                        isShow
                                                        change={
                                                            description.value
                                                        }
                                                    />
                                                );
                                            })()}
                                        </>
                                    ) : d.type === "INTEGER" ||
                                      d.type === "DECIMAL" ? (
                                        <Form.control
                                            name={d.name}
                                            type="number"
                                            options={{ setValueAs: Number }}
                                            title={d.name}
                                            placeholder={d.placeholder || ""}
                                        />
                                    ) : d.type === "FILE" ? (
                                        <Form.control.file
                                            name={d.name}
                                            title={d.name}
                                            typeFile={
                                                d.file_option?.type || "file"
                                            }
                                            multiple={d.file_option?.multiple}
                                            showButonCopy={
                                                d.file_option?.type ===
                                                    "image" ||
                                                d.file_option?.type === "video"
                                            }
                                            typesText={
                                                d.file_option?.types ||
                                                "jpg, png, webp ó jpeg"
                                            }
                                        />
                                    ) : d.type === "BOOLEAN" ? (
                                        <Form.control.toggle
                                            name={d.name}
                                            title={d.name}
                                        />
                                    ) : null}
                                </Fragment>
                            );
                        })}
                </Fragment>
                <br />
                <Form.button.submit
                    disabled={crudStoreMutation.isLoading || false}
                    isLoading={crudStoreMutation.isLoading || false}
                    title="Guardar"
                    ico={
                        <div dangerouslySetInnerHTML={{ __html: crud.icon }} />
                    }
                />
            </Form>
            {crud.data
                .filter((d) => d.type === "FILE")
                .map((col) => {
                    const formProductsNormalUpdateImages = useForm({
                        mode: "all",
                        resolver: valibotVigilio(
                            object({
                                [col.name]: col.options.allowNull
                                    ? nullable(
                                          array(instance(File), [
                                              validFileValibot({
                                                  required:
                                                      !col.options.allowNull,
                                                  min: 1,
                                                  max:
                                                      col.file_option?.max || 1,
                                                  types: col.file_option?.types.split(
                                                      ", "
                                                  ),
                                              }),
                                          ])
                                      )
                                    : array(instance(File), [
                                          validFileValibot({
                                              required: !col.options.allowNull,
                                              min: 1,
                                              max: col.file_option?.max || 1,
                                              types: col.file_option?.types.split(
                                                  ", "
                                              ),
                                          }),
                                      ]),
                            })
                        ),
                    });
                    const brandsUpdateImagesMutate = useMutation(
                        `/uploads/${crud.name}/${col.name}/${data.id}`,
                        async (url, body: Record<string, File[]>) => {
                            const result = await uploadApi(`/api${url}`, {
                                file: body[col.name as keyof typeof body],
                            });
                            return result;
                        }
                    );
                    async function initialUpdateImages() {
                        if (data[col.name as keyof typeof data]) {
                            const images = await getFilesEdit(
                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                (data as any)[col.name as keyof typeof data],
                                null
                            );

                            formProductsNormalUpdateImages.setValue(
                                col.name,
                                images
                            );
                        }
                    }
                    function onUpdateImagesProduct(
                        data: Record<string, File[]>
                    ) {
                        sweetModal({
                            title: "¿Estás seguro de editar las imagenes de esta marca?",

                            showCloseButton: true,
                            showCancelButton: true,
                        }).then(({ isConfirmed }) => {
                            if (isConfirmed) {
                                brandsUpdateImagesMutate.mutate(
                                    {
                                        ...data,
                                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                        name: (data as any)[
                                            col.name as keyof typeof data
                                        ],
                                    },
                                    {
                                        onSuccess() {
                                            sweetAlert({
                                                icon: "success",
                                                title: "Se actualizó imagenes correctamente",
                                            });

                                            if (refetch) {
                                                refetch(true);
                                            }
                                        },
                                        onError(error) {
                                            handlerError(
                                                formProductsNormalUpdateImages,
                                                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                                error as any
                                            );
                                        },
                                    }
                                );
                            }
                        });
                    }
                    useEffect(() => {
                        initialUpdateImages();
                    }, []);

                    return (
                        <div key={col.name}>
                            <br />
                            <h3 class=" dark:text-white font-bold">
                                Editar {col.name}
                            </h3>{" "}
                            <Form
                                onSubmit={onUpdateImagesProduct}
                                {...formProductsNormalUpdateImages}
                            >
                                <Form.control.file
                                    name={col.name}
                                    title={col.name}
                                    typeFile={col.file_option?.type || "file"}
                                    multiple={col.file_option?.multiple}
                                    showButonCopy={
                                        col.file_option?.type === "image" ||
                                        col.file_option?.type === "video"
                                    }
                                    typesText={
                                        col.file_option?.types ||
                                        "jpg, png, webp ó jpeg"
                                    }
                                />
                                <Form.button.submit
                                    disabled={
                                        brandsUpdateImagesMutate.isLoading ||
                                        false
                                    }
                                    isLoading={
                                        brandsUpdateImagesMutate.isLoading ||
                                        false
                                    }
                                    title="Guardar"
                                    ico={
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: crud.icon,
                                            }}
                                        />
                                    }
                                />
                            </Form>
                        </div>
                    );
                })}
        </div>
    );
}
export default CrudShow;
