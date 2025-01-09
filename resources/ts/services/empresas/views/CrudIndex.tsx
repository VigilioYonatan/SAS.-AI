import Loading from "@/admin/components/Loading";
import { crudIndexApi } from "../apis/crud/crud.index.api";
import View404 from "@/admin/views/404";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { useFieldArray, useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { CrudStoreDto, crudStoreDto } from "../dtos/crud.store.dto";
import Form from "~/components/form";
import { storageEmpresa } from "../stores/empresa.store";
import { crudStoreApi } from "../apis/crud/crud.store.api";
import { CrudSchema } from "../schemas/crud.schema";
import { crudUpdateApi } from "../apis/crud/crud.update.api";
import Hr from "@/web/components/Hr";
import { crudDestroyApi } from "../apis/crud/crud.destroy.api";
import { useEffect, useMemo } from "preact/hooks";
import { formSelectNumber } from "~/components/form/FormSelect";
const TYPES = [
    "STRING",
    "TEXT",
    "INTEGER",
    "DECIMAL",
    "BOOLEAN",
    "DATE",
    "FILE",
    "FOREIGNKEY",
];

function CrudIndex() {
    const crudIndexQuery = crudIndexApi();
    let component = null;
    if (crudIndexQuery.isLoading) {
        component = <Loading />;
    }
    if (crudIndexQuery.isError) {
        component = <View404 message="error page" />;
    }
    if (crudIndexQuery.isSuccess) {
        component = (
            <div>
                <div class="flex justify-between gap-2 items-center mb-4">
                    <button
                        type="button"
                        onClick={() => {
                            sweetModal({
                                html: reactComponent(
                                    <CrudStore
                                        refetch={crudIndexQuery.refetch}
                                    />
                                ),
                                showCloseButton: true,
                                sweetWidth: "700px",
                                isCloseInBackground: false,
                                position: "start",
                            });
                        }}
                        class="bg-primary px-2 py-1 rounded-md shadow"
                    >
                        +
                    </button>

                    <h3 class="text-3xl dark:text-white font-bold text-center">
                        CRUD
                    </h3>
                    <div />
                </div>

                <table class="text-sm text-left  h-full shadow w-full">
                    <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary text-secondary-dark dark:text-primaryuppercase  shadow-sm  border-b dark:border-admin-terciary">
                        <tr>
                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                id
                            </th>
                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                Nombre
                            </th>
                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                Icono
                            </th>
                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                data
                            </th>
                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                opcion
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {crudIndexQuery.data?.data.map((crud, i) => (
                            <tr
                                key={crud.id}
                                class="border-b h-[45px] dark:hover:text-black dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black  dark:text-secondary-light  cursor-pointer"
                            >
                                <td>
                                    <div class="flex justify-center items-center">
                                        {i + 1}
                                    </div>
                                </td>
                                <td>
                                    <div class="flex justify-center items-center">
                                        {crud.name}
                                    </div>
                                </td>
                                <td>
                                    <div class="flex justify-center items-center">
                                        <div
                                            class="dark:text-white"
                                            dangerouslySetInnerHTML={{
                                                __html: crud.icon,
                                            }}
                                        />
                                    </div>
                                </td>
                                <td>
                                    <div class="flex justify-center items-center">
                                        <button
                                            class="bg-primary px-2 py-1 rounded-md relative"
                                            type="button"
                                            onClick={() => {
                                                sweetModal({
                                                    isCloseInBackground: false,
                                                    showCloseButton: true,
                                                    html: reactComponent(
                                                        <div>
                                                            <h3 class="dark:text-white mb-2 text-lg font-semibold">
                                                                {crud.name}
                                                            </h3>
                                                            <table class="text-sm text-left  h-full shadow w-full">
                                                                <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary text-secondary-dark dark:text-primaryuppercase  shadow-sm  border-b dark:border-admin-terciary">
                                                                    <tr>
                                                                        <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                                                            id
                                                                        </th>
                                                                        <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                                                            Nombre
                                                                        </th>
                                                                        <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                                                            Tipo
                                                                        </th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {crud.data.map(
                                                                        (
                                                                            data,
                                                                            i
                                                                        ) => (
                                                                            <tr
                                                                                key={
                                                                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                                                                    i
                                                                                }
                                                                                class="border-b h-[45px] dark:hover:text-black dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black  dark:text-secondary-light  cursor-pointer"
                                                                            >
                                                                                <td>
                                                                                    <div class="flex justify-center items-center">
                                                                                        {i +
                                                                                            1}
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div class="flex justify-center items-center">
                                                                                        {
                                                                                            data.name
                                                                                        }
                                                                                    </div>
                                                                                </td>
                                                                                <td>
                                                                                    <div class="flex justify-center items-center  flex-wrap gap-1">
                                                                                        {data
                                                                                            .options
                                                                                            ?.allowNull ? (
                                                                                            <span class="px-2 py-0.5 rounded-md bg-primary  textxs">
                                                                                                nullable
                                                                                            </span>
                                                                                        ) : null}
                                                                                        {data
                                                                                            .options
                                                                                            ?.unique ? (
                                                                                            <span class="px-2 py-0.5 rounded-md bg-primary  textxs">
                                                                                                unique
                                                                                            </span>
                                                                                        ) : null}
                                                                                        {data
                                                                                            .options
                                                                                            .defaultValue
                                                                                            ?.length ? (
                                                                                            <span class="px-2 py-0.5 rounded-md bg-primary  textxs">
                                                                                                {
                                                                                                    data
                                                                                                        .options
                                                                                                        .defaultValue
                                                                                                }
                                                                                            </span>
                                                                                        ) : null}
                                                                                        {data
                                                                                            .options
                                                                                            .references
                                                                                            ?.length ? (
                                                                                            <span class="px-2 py-0.5 rounded-md bg-primary  textxs">
                                                                                                {
                                                                                                    data
                                                                                                        .options
                                                                                                        .references
                                                                                                }
                                                                                            </span>
                                                                                        ) : null}
                                                                                        {data
                                                                                            .options
                                                                                            .onDelete
                                                                                            ?.length ? (
                                                                                            <span class="px-2 py-0.5 rounded-md bg-primary  textxs">
                                                                                                {
                                                                                                    data
                                                                                                        .options
                                                                                                        .onDelete
                                                                                                }
                                                                                            </span>
                                                                                        ) : null}
                                                                                        {data
                                                                                            .options
                                                                                            .onUpdate
                                                                                            ?.length ? (
                                                                                            <span class="px-2 py-0.5 rounded-md bg-primary  textxs">
                                                                                                {
                                                                                                    data
                                                                                                        .options
                                                                                                        .onUpdate
                                                                                                }
                                                                                            </span>
                                                                                        ) : null}
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    )}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ),
                                                });
                                            }}
                                        >
                                            <span class="bg-black text-white text-xs font-semibold px-1 py-1 rounded-md absolute -top-2 -right-2">
                                                {crud.data.length}
                                            </span>
                                            <i class="fa-solid fa-database" />
                                        </button>
                                    </div>
                                </td>
                                <td>
                                    <div class="flex justify-center items-center gap-2">
                                        <button
                                            class="bg-orange-500 px-2 py-1 rounded-md relative"
                                            type="button"
                                            onClick={() => {
                                                sweetModal({
                                                    isCloseInBackground: false,
                                                    showCloseButton: true,
                                                    html: reactComponent(
                                                        <CrudUpdate
                                                            refetch={
                                                                crudIndexQuery.refetch
                                                            }
                                                            crud={crud}
                                                        />
                                                    ),
                                                    position: "start",
                                                    sweetWidth: "700px",
                                                });
                                            }}
                                        >
                                            <i class="fa-solid fa-gears" />
                                        </button>
                                        {(() => {
                                            const crudDestroyMutation =
                                                crudDestroyApi();

                                            return (
                                                <button
                                                    class="bg-primary px-2 py-1 rounded-md relative"
                                                    type="button"
                                                    onClick={() => {
                                                        sweetModal({
                                                            title: "¿Estás seguro de eliminar este crud?",
                                                            showCancelButton:
                                                                true,
                                                            showCloseButton:
                                                                true,
                                                            isCloseInBackground:
                                                                false,
                                                        }).then(
                                                            ({
                                                                isConfirmed,
                                                            }) => {
                                                                if (
                                                                    isConfirmed
                                                                ) {
                                                                    crudDestroyMutation.mutate(
                                                                        crud.id,
                                                                        {
                                                                            onSuccess() {
                                                                                sweetAlert(
                                                                                    {
                                                                                        title: "Se eliminó correctamente",
                                                                                        icon: "success",
                                                                                    }
                                                                                );
                                                                                crudIndexQuery.refetch(
                                                                                    false
                                                                                );
                                                                            },
                                                                            onError(
                                                                                data
                                                                            ) {
                                                                                sweetAlert(
                                                                                    {
                                                                                        title: data.message,
                                                                                        icon: "danger",
                                                                                    }
                                                                                );
                                                                            },
                                                                        }
                                                                    );
                                                                }
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <i class="fas fa-trash" />
                                                </button>
                                            );
                                        })()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
    return component;
}

interface CrudStoreProps {
    refetch: (clean?: boolean) => void;
}
function CrudStore({ refetch }: CrudStoreProps) {
    const crudStoreMutation = crudStoreApi();
    const crudStoreForm = useForm<CrudStoreDto>({
        resolver: valibotVigilio(crudStoreDto),
        defaultValues: {
            empresa_id: storageEmpresa!.id,
            data: [
                {
                    type: "STRING",
                    name: "slug",
                    options: { unique: true, allowNull: false },
                    placeholder: "slug",
                },
            ],
        },
    });
    const crudIndexQuery = crudIndexApi();
    const crudIndexSelect = useMemo(() => {
        if (crudIndexQuery.isSuccess && crudIndexQuery.data) {
            return crudIndexQuery.data.data.map((value) => ({
                key: value.id,
                value: value.name,
            }));
        }
        return [];
    }, [crudIndexQuery.data, crudIndexQuery.isSuccess]);

    function onCrud(body: CrudStoreDto) {
        if (!body.data.some((a) => a.name === "slug")) {
            sweetAlert({
                icon: "danger",
                title: "No se encontró slug tipo string",
            });
            return;
        }
        sweetModal({ title: "¿Estas seguro de agregar este crud?" }).then(
            ({ isConfirmed }) => {
                if (isConfirmed) {
                    crudStoreMutation.mutate(body, {
                        onSuccess() {
                            sweetAlert({
                                title: "Agregado correctamente",
                                icon: "success",
                            });
                            refetch(false);
                        },
                        onError(err) {
                            sweetAlert({
                                title: err.message,
                                icon: "danger",
                            });
                        },
                    });
                }
            }
        );
    }
    const arrayData = useFieldArray({
        name: "data",
        control: crudStoreForm.control,
    });

    return (
        <Form {...crudStoreForm} onSubmit={onCrud}>
            <div class="grid  md:grid-cols-3 gap-2 items-center">
                <Form.control
                    title="Nombre"
                    placeholder="example"
                    name={"name" as keyof CrudStoreDto}
                />
                <Form.control
                    title="Slug"
                    placeholder="example"
                    name={"slug" as keyof CrudStoreDto}
                />
                <Form.control
                    name={"icon" as keyof CrudStoreDto}
                    title="Icono"
                    type="text"
                    placeholder="<i class='fa-solid fa-brush'></i>"
                    question={
                        <div>
                            <p>
                                Busque un icono{" "}
                                <a
                                    class="font-bold underline"
                                    href="https://fontawesome.com/search"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Aquí
                                </a>{" "}
                                y copie y pegue
                            </p>
                            <br />
                            Este campo no es obligatorio.
                        </div>
                    }
                />
            </div>
            <div>
                <span class="dark:text-white font-semibold">Data:</span>
                <div>
                    {arrayData.fields.map((_, i) => {
                        const type = crudStoreForm.watch(`data.${i}.type`);
                        useEffect(() => {
                            if (type === "FILE") {
                                crudStoreForm.setValue(
                                    `data.${i}.file_option`,
                                    {
                                        max: 1,
                                        multiple: false,
                                        types: "image/jpg, image/webp, image/jpeg, image/png, image/gif",
                                        type: "image",
                                    }
                                );
                            } else {
                                crudStoreForm.setValue(
                                    `data.${i}.file_option`,
                                    null
                                );
                            }
                            if (type !== "FOREIGNKEY") {
                                crudStoreForm.setValue(`data.${i}.options`, {
                                    references: null,
                                    onUpdate: null,
                                    onDelete: null,
                                    allowNull: false,
                                    unique: false,
                                    defaultValue: null,
                                });
                            } else {
                                crudStoreForm.setValue(`data.${i}.options`, {
                                    references: null,
                                    onUpdate: "CASCADE",
                                    onDelete: "CASCADE",
                                    allowNull: false,
                                    unique: false,
                                    defaultValue: null,
                                });
                            }
                        }, [type]);
                        return (
                            <div
                                class="flex gap-2 items-center mb-3 py-2"
                                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                key={i}
                            >
                                <Form.control
                                    title="Nombre"
                                    name={`data.${i}.name`}
                                    placeholder="Nombre"
                                />
                                <Form.control.select
                                    title="Tipo"
                                    name={`data.${i}.type`}
                                    placeholder="Escoja el tipo de dato"
                                    array={TYPES.map((t) => ({
                                        key: t,
                                        value: t,
                                    }))}
                                />{" "}
                                {crudStoreForm.watch(`data.${i}.type`) ===
                                    "STRING" ||
                                crudStoreForm.watch(`data.${i}.type`) ===
                                    "INTEGER" ||
                                crudStoreForm.watch(`data.${i}.type`) ===
                                    "DECIMAL" ? (
                                    <>
                                        <Form.control
                                            title="Placeholder"
                                            name={`data.${i}.placeholder`}
                                            placeholder="Jhon Doe"
                                        />
                                    </>
                                ) : null}
                                <div class="flex flex-col gap-1">
                                    <span class="text-xs dark:text-white font-semibold">
                                        Opciones
                                    </span>

                                    <label
                                        class="text-sm flex gap-1 items-center dark:text-white"
                                        htmlFor={"nullable"}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                crudStoreForm.watch(
                                                    `data.${i}.options`
                                                ).allowNull || false
                                            }
                                            onChange={(e) => {
                                                const isChecked = (
                                                    e.target as HTMLInputElement
                                                ).checked;
                                                const getOptions =
                                                    crudStoreForm.watch(
                                                        `data.${i}.options`
                                                    );
                                                // allowNull: false,
                                                // unique: false,
                                                // defaultValue: "",
                                                const filter = {
                                                    ...getOptions,
                                                    allowNull: isChecked,
                                                };

                                                crudStoreForm.setValue(
                                                    `data.${i}.options`,
                                                    filter
                                                );
                                            }}
                                        />
                                        nullable
                                    </label>
                                    <label
                                        class="text-sm flex gap-1 items-center dark:text-white"
                                        htmlFor={"unique"}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={
                                                crudStoreForm.watch(
                                                    `data.${i}.options`
                                                ).unique || false
                                            }
                                            onChange={(e) => {
                                                const isChecked = (
                                                    e.target as HTMLInputElement
                                                ).checked;
                                                const getOptions =
                                                    crudStoreForm.watch(
                                                        `data.${i}.options`
                                                    );

                                                const filter = {
                                                    ...getOptions,
                                                    unique: isChecked,
                                                };

                                                crudStoreForm.setValue(
                                                    `data.${i}.options`,
                                                    filter
                                                );
                                            }}
                                        />
                                        unique
                                    </label>
                                    <label
                                        class="text-sm flex gap-1 items-center dark:text-white"
                                        htmlFor={"default"}
                                    >
                                        <input
                                            className="w-[60px] rounded-md text-black"
                                            value={
                                                crudStoreForm.watch(
                                                    `data.${i}.options`
                                                ).defaultValue || ""
                                            }
                                            onChange={(e) => {
                                                const getOptions =
                                                    crudStoreForm.watch(
                                                        `data.${i}.options`
                                                    );
                                                const val = (
                                                    e.target as HTMLInputElement
                                                ).value;
                                                const value =
                                                    crudStoreForm.watch(
                                                        `data.${i}.type`
                                                    ) === "DECIMAL" ||
                                                    crudStoreForm.watch(
                                                        `data.${i}.type`
                                                    ) === "INTEGER"
                                                        ? Number(val)
                                                        : val === "true" ||
                                                          val === "false"
                                                        ? JSON.parse(val)
                                                        : val;
                                                const filter = {
                                                    ...getOptions,
                                                    defaultValue: value,
                                                };

                                                crudStoreForm.setValue(
                                                    `data.${i}.options`,
                                                    filter
                                                );
                                            }}
                                            type={
                                                crudStoreForm.watch(
                                                    `data.${i}.type`
                                                ) === "STRING" ||
                                                crudStoreForm.watch(
                                                    `data.${i}.type`
                                                ) === "TEXT" ||
                                                crudStoreForm.watch(
                                                    `data.${i}.type`
                                                ) === "FILE" ||
                                                crudStoreForm.watch(
                                                    `data.${i}.type`
                                                ) === "BOOLEAN"
                                                    ? "text"
                                                    : crudStoreForm.watch(
                                                          `data.${i}.type`
                                                      ) === "DATE"
                                                    ? "date"
                                                    : "number"
                                            }
                                        />
                                        Default
                                    </label>
                                </div>
                                {crudStoreForm.watch(`data.${i}.type`) ===
                                "FOREIGNKEY" ? (
                                    <div class="flex flex-col gap-1">
                                        {" "}
                                        <label
                                            class="text-sm flex gap-1 items-center dark:text-white"
                                            htmlFor={"references"}
                                            onChange={(e) => {
                                                const getOptions =
                                                    crudStoreForm.watch(
                                                        `data.${i}.options`
                                                    );
                                                const value = (
                                                    e.target as HTMLInputElement
                                                ).value;

                                                const filter = {
                                                    ...getOptions,
                                                    references:
                                                        value === "null"
                                                            ? null
                                                            : value,
                                                };
                                                crudStoreForm.setValue(
                                                    `data.${i}.options`,
                                                    filter
                                                );
                                            }}
                                        >
                                            <select
                                                name=""
                                                class="text-black rounded-md"
                                                id=""
                                            >
                                                <option
                                                    value={"null"}
                                                    selected={
                                                        crudStoreForm.watch(
                                                            `data.${i}.options`
                                                        ).references === null ||
                                                        false
                                                    }
                                                >
                                                    Escoger referencia
                                                </option>
                                                {crudIndexSelect.map((val) => (
                                                    <option
                                                        key={val.key}
                                                        value={val.value}
                                                        selected={
                                                            crudStoreForm.watch(
                                                                `data.${i}.options`
                                                            ).references ===
                                                                (val.value as "") ||
                                                            false
                                                        }
                                                    >
                                                        {val.value}
                                                    </option>
                                                ))}
                                            </select>
                                            references
                                        </label>
                                        <label
                                            class="text-sm flex gap-1 items-center dark:text-white"
                                            htmlFor={"multiple"}
                                            onChange={(e) => {
                                                const getOptions =
                                                    crudStoreForm.watch(
                                                        `data.${i}.options`
                                                    );
                                                const value = (
                                                    e.target as HTMLInputElement
                                                ).value;

                                                const filter = {
                                                    ...getOptions,
                                                    onUpdate:
                                                        value as CrudSchema["data"][0]["options"]["onUpdate"],
                                                };
                                                crudStoreForm.setValue(
                                                    `data.${i}.options`,
                                                    filter
                                                );
                                            }}
                                        >
                                            <select
                                                name="onUpdate"
                                                class="text-black rounded-md"
                                                id=""
                                            >
                                                {["CASCADE", "RESTRICT"].map(
                                                    (val) => (
                                                        <option
                                                            key={val}
                                                            value={val}
                                                            selected={
                                                                crudStoreForm.watch(
                                                                    `data.${i}.options`
                                                                ).onUpdate ===
                                                                    val || false
                                                            }
                                                        >
                                                            {val}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            onUpdate
                                        </label>
                                        <label
                                            class="text-sm flex gap-1 items-center dark:text-white"
                                            htmlFor={"onDelete"}
                                            onChange={(e) => {
                                                const getOptions =
                                                    crudStoreForm.watch(
                                                        `data.${i}.options`
                                                    );
                                                const value = (
                                                    e.target as HTMLInputElement
                                                ).value;

                                                const filter = {
                                                    ...getOptions,
                                                    onDelete:
                                                        value as CrudSchema["data"][0]["options"]["onDelete"],
                                                };
                                                crudStoreForm.setValue(
                                                    `data.${i}.options`,
                                                    filter
                                                );
                                            }}
                                        >
                                            <select
                                                name=""
                                                class="text-black rounded-md"
                                                id=""
                                            >
                                                {["CASCADE", "SET NULL"].map(
                                                    (val) => (
                                                        <option
                                                            key={val}
                                                            value={val}
                                                            selected={
                                                                crudStoreForm.watch(
                                                                    `data.${i}.options`
                                                                ).onDelete ===
                                                                    val || false
                                                            }
                                                        >
                                                            {val}
                                                        </option>
                                                    )
                                                )}
                                            </select>
                                            onDelete
                                        </label>
                                    </div>
                                ) : null}
                                {crudStoreForm.watch(`data.${i}.type`) ===
                                "FILE" ? (
                                    <div class="flex flex-col gap-1">
                                        <label
                                            class="text-sm flex gap-1 items-center dark:text-white"
                                            htmlFor={"multiple"}
                                        >
                                            <input
                                                className=" rounded-md text-black"
                                                checked={
                                                    // max
                                                    // types
                                                    crudStoreForm.watch(
                                                        `data.${i}.file_option`
                                                    )?.multiple || false
                                                }
                                                onChange={(e) => {
                                                    const getOptions =
                                                        crudStoreForm.watch(
                                                            `data.${i}.file_option`
                                                        );
                                                    const value = (
                                                        e.target as HTMLInputElement
                                                    ).checked;

                                                    if (getOptions) {
                                                        const filter = {
                                                            ...getOptions,
                                                            multiple: value,
                                                        };
                                                        crudStoreForm.setValue(
                                                            `data.${i}.file_option`,
                                                            filter
                                                        );
                                                    }
                                                }}
                                                type="checkbox"
                                            />
                                            multiple
                                        </label>
                                        <label
                                            class="text-sm flex gap-1 items-center dark:text-white"
                                            htmlFor={"max"}
                                        >
                                            <input
                                                className="w-[40px] rounded-md text-black"
                                                value={
                                                    // max
                                                    // types
                                                    crudStoreForm.watch(
                                                        `data.${i}.file_option`
                                                    )?.max || "0"
                                                }
                                                onChange={(e) => {
                                                    const getOptions =
                                                        crudStoreForm.watch(
                                                            `data.${i}.file_option`
                                                        );
                                                    const value = Number(
                                                        (
                                                            e.target as HTMLInputElement
                                                        ).value
                                                    );
                                                    if (getOptions) {
                                                        const filter = {
                                                            ...getOptions,
                                                            max: value,
                                                        };
                                                        crudStoreForm.setValue(
                                                            `data.${i}.file_option`,
                                                            filter
                                                        );
                                                    }
                                                }}
                                                type="number"
                                            />
                                            Max files
                                        </label>
                                        <label
                                            class="text-sm flex gap-1 items-center dark:text-white"
                                            htmlFor={"types"}
                                        >
                                            <input
                                                className="w-[140px] rounded-md text-black"
                                                placeholder="image/jpg, image/webp, image/png"
                                                value={
                                                    // max
                                                    // types
                                                    crudStoreForm.watch(
                                                        `data.${i}.file_option`
                                                    )?.types || ""
                                                }
                                                onChange={(e) => {
                                                    const getOptions =
                                                        crudStoreForm.watch(
                                                            `data.${i}.file_option`
                                                        );
                                                    const value = (
                                                        e.target as HTMLInputElement
                                                    ).value;
                                                    if (getOptions) {
                                                        crudStoreForm.setValue(
                                                            `data.${i}.file_option`,
                                                            {
                                                                ...getOptions,
                                                                types: value,
                                                            }
                                                        );
                                                    }
                                                }}
                                                type="text"
                                            />
                                            types
                                        </label>
                                        <label
                                            class="text-sm flex gap-1 items-center "
                                            htmlFor={"tipo"}
                                        >
                                            <select
                                                onChange={(e) => {
                                                    const getOptions =
                                                        crudStoreForm.watch(
                                                            `data.${i}.file_option`
                                                        );
                                                    const value = (
                                                        e.target as HTMLInputElement
                                                    ).value as
                                                        | "image"
                                                        | "video"
                                                        | "file"
                                                        | "image-video";
                                                    if (getOptions) {
                                                        crudStoreForm.setValue(
                                                            `data.${i}.file_option`,
                                                            {
                                                                ...getOptions,
                                                                type: value,
                                                            }
                                                        );
                                                    }
                                                }}
                                            >
                                                {[
                                                    "image",
                                                    "video",
                                                    "image-video",
                                                    "file",
                                                ].map((val) => (
                                                    <option
                                                        value={val}
                                                        key={val}
                                                        selected={
                                                            (crudStoreForm.watch(
                                                                `data.${i}.file_option`
                                                            ) || "image") ===
                                                            val
                                                        }
                                                    >
                                                        {val}
                                                    </option>
                                                ))}
                                            </select>
                                            <span class="dark:text-white">
                                                Tipo?
                                            </span>
                                        </label>
                                    </div>
                                ) : null}
                                <button
                                    type="button"
                                    class="bg-danger text-white px-2 py-1 rounded-md "
                                    onClick={() => {
                                        sweetModal({
                                            title: "Estas seguro de eliminar esto?",
                                            showCancelButton: true,
                                            showCloseButton: true,
                                            isCloseInBackground: false,
                                        }).then(({ isConfirmed }) => {
                                            if (isConfirmed) {
                                                arrayData.remove(i);
                                            }
                                        });
                                    }}
                                >
                                    <i class="fas fa-trash" />
                                </button>
                            </div>
                        );
                    })}
                    <button
                        type="button"
                        class="bg-primary px-2 py-1 rounded-md "
                        onClick={() => {
                            arrayData.append({
                                name: "",
                                options: {
                                    allowNull: false,
                                    unique: false,
                                    defaultValue: null,
                                    references: null,
                                    onDelete: null,
                                    onUpdate: null,
                                },
                                type: "STRING",
                                placeholder: null,
                                file_option: null,
                            });
                        }}
                    >
                        +
                    </button>
                </div>{" "}
                {crudStoreForm.formState.errors.data?.message ? (
                    <p class="text-danger text-xs">
                        {crudStoreForm.formState.errors.data?.message}
                    </p>
                ) : null}
            </div>
            <br />
            <div>
                <span class="dark:text-white">Páginas</span>
                <div class="grid grid-cols-3">
                    <Form.control.toggle
                        name={"isCreatePage" as keyof CrudStoreDto}
                        title="Crear Página"
                    />
                    <Form.control.toggle
                        name={"isDynamicPage" as keyof CrudStoreDto}
                        title="Crear Páginas dinamicas :id"
                    />
                    <Form.control
                        type="number"
                        name={"paginator" as keyof CrudStoreDto}
                        options={{ setValueAs: formSelectNumber }}
                        title="Crear paginator?"
                        question="0 o vacio no traerá paginador y trae todos los datos. limite por página"
                    />
                </div>
            </div>

            <Form.button.submit
                title="Guardar"
                ico={null}
                isLoading={crudStoreMutation.isLoading || false}
                disabled={crudStoreMutation.isLoading || false}
            />
            {/* <Form.control /> */}
        </Form>
    );
}
interface CrudUpdateProps {
    refetch: (clean?: boolean) => void;
    crud: CrudSchema;
}
function CrudUpdate({ refetch, crud }: CrudUpdateProps) {
    const crudStoreMutation = crudUpdateApi(crud.id);
    const crudStoreForm = useForm<CrudStoreDto>({
        resolver: valibotVigilio(crudStoreDto),
        defaultValues: crud,
    });
    function onCrud(body: CrudStoreDto) {
        sweetModal({
            title: "¿Estas seguro de editar este crud?",
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                crudStoreMutation.mutate(body, {
                    onSuccess() {
                        sweetAlert({
                            title: "Agregado correctamente",
                            icon: "success",
                        });
                        refetch(false);
                    },
                    onError(err) {
                        sweetAlert({
                            title: err.message,
                            icon: "danger",
                        });
                    },
                });
            }
        });
    }

    return (
        <Form {...crudStoreForm} onSubmit={onCrud}>
            <span class="dark:text-white mb-2 text-xl font-bold">
                {crud.name}
            </span>
            <div class="grid  md:grid-cols-3 gap-2 items-center">
                <Form.control
                    title="Nombre"
                    placeholder="example"
                    name={"name" as keyof CrudStoreDto}
                />
                <Form.control
                    title="Slug"
                    placeholder="example"
                    name={"slug" as keyof CrudStoreDto}
                />
                <Form.control
                    name={"icon" as keyof CrudStoreDto}
                    title="Icono"
                    type="text"
                    placeholder="<i class='fa-solid fa-brush'></i>"
                    question={
                        <div>
                            <p>
                                Busque un icono{" "}
                                <a
                                    class="font-bold underline"
                                    href="https://fontawesome.com/search"
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    Aquí
                                </a>{" "}
                                y copie y pegue
                            </p>
                            <br />
                            Este campo no es obligatorio.
                        </div>
                    }
                />
            </div>
            <br />
            <div>
                <span class="dark:text-white">Páginas</span>
                <div class="grid grid-cols-3">
                    <Form.control.toggle
                        name={"isCreatePage" as keyof CrudStoreDto}
                        title="Crear Página"
                    />
                    <Form.control.toggle
                        name={"isDynamicPage" as keyof CrudStoreDto}
                        title="Crear Páginas dinamicas :id"
                    />
                    <Form.control
                        type="number"
                        name={"paginator" as keyof CrudStoreDto}
                        options={{ setValueAs: formSelectNumber }}
                        title="Crear paginator?"
                        question="0 o vacio no traerá paginador y trae todos los datos. limite por página"
                    />
                </div>
            </div>
            <Hr />

            <Form.button.submit
                title="Guardar"
                ico={null}
                isLoading={crudStoreMutation.isLoading || false}
                disabled={crudStoreMutation.isLoading || false}
            />
            {/* <Form.control /> */}
        </Form>
    );
}

export default CrudIndex;
