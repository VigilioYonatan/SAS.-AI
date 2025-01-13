import { useFieldArray, useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { type PagesStoreDto, pagesStoreDto } from "../dtos/pages.store.dto";
import Form from "~/components/form";
import { pageStoreApi } from "../apis/pages/pages.store.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { storageEmpresa } from "../stores/empresa.store";
import { PageSchema } from "../schemas/pages.schema";
import { pageUpdateApi } from "../apis/pages/pages.update.api";
import { PagesUpdateDto, pagesUpdateDto } from "../dtos/pages.update.dto";
import { reactComponent } from "~/libs/preact";
import Hr from "@/web/components/Hr";

interface PageStoreProps {
    onClose: () => void;
    refetch: (clean?: boolean) => void;
}
function PageStore({ onClose, refetch }: PageStoreProps) {
    const pageStoreMutation = pageStoreApi();
    const pageStoreForm = useForm<PagesStoreDto>({
        resolver: valibotVigilio(pagesStoreDto),
        defaultValues: { empresa_id: storageEmpresa!.id, queries: [] },
    });

    function onPageStore(body: PagesStoreDto) {
        sweetModal({ title: "¿Estás seguro de agregar esta página?" }).then(
            ({ isConfirmed }) => {
                if (isConfirmed) {
                    pageStoreMutation.mutate(body, {
                        onSuccess() {
                            sweetAlert({
                                icon: "success",
                                title: "Se agregó correctamente",
                            });
                            refetch(false);
                            onClose();
                        },
                        onError() {
                            sweetAlert({
                                icon: "danger",
                                title: "Se agregó correctamente",
                            });
                        },
                    });
                }
            }
        );
    }
    return (
        <div>
            <h3 class="font-bold text-xl dark:text-white">Crear Página</h3>
            <br />
            <Form {...pageStoreForm} onSubmit={onPageStore}>
                <Form.control
                    title="Titulo de la página"
                    name={"title" as keyof PagesStoreDto}
                />
                <Form.control
                    title="Url - slug de la página"
                    name={"slug" as keyof PagesStoreDto}
                />
                <Form.control
                    title="Descripción"
                    name={"description" as keyof PagesStoreDto}
                />
                <div class="w-full flex gap-2 items-center">
                    <Form.control
                        name={"icon" as keyof PagesUpdateDto}
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
                    {pageStoreForm.watch("icon") ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: pageStoreForm.watch("icon")!,
                            }}
                            class="mt-3"
                        />
                    ) : null}
                </div>
                <Hr />
                <Form.control.toggle
                    title="Header Url?"
                    question="Que se muestre en el header"
                    name={"enabledHeaderPage" as keyof PagesStoreDto}
                />
                <br />
                <Form.button.submit
                    ico={null}
                    title="Guardar"
                    isLoading={pageStoreMutation.isLoading || false}
                    disabled={pageStoreMutation.isLoading || false}
                />
            </Form>
        </div>
    );
}

interface PageUpdateProps {
    page: PageSchema;
    onClose: () => void;
    refetch: (clean?: boolean) => void;
}
export function PageUpdate({ page }: PageUpdateProps) {
    const pageStoreMutation = pageUpdateApi(page.id);
    const pageStoreForm = useForm<PagesUpdateDto>({
        resolver: valibotVigilio(pagesUpdateDto),
        defaultValues: page,
    });

    function onPageStore(body: PagesUpdateDto) {
        sweetModal({ title: "¿Estás seguro de editar esta página?" }).then(
            ({ isConfirmed }) => {
                if (isConfirmed) {
                    pageStoreMutation.mutate(body, {
                        onSuccess() {
                            sweetAlert({
                                icon: "success",
                                title: "Se editó correctamente",
                            });
                        },
                        onError() {
                            sweetAlert({
                                icon: "danger",
                                title: "No se editó correctamente",
                            });
                        },
                    });
                }
            }
        );
    }
    const queries = useFieldArray({
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        name: "queries" as any,
        control: pageStoreForm.control,
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } as any);
    return (
        <div>
            <h3 class="font-bold text-xl dark:text-white">
                Efitar Página {page.title}
            </h3>
            <br />
            <Form {...pageStoreForm} onSubmit={onPageStore}>
                <Form.control
                    title="Titulo de la página"
                    name={"title" as keyof PagesStoreDto}
                />
                <Form.control
                    title="Url - slug de la página"
                    name={"slug" as keyof PagesUpdateDto}
                />
                <Form.control
                    title="Descripción"
                    name={"description" as keyof PagesUpdateDto}
                />
                <div class="w-full flex gap-2 items-center">
                    <Form.control
                        name={"icon" as keyof PagesUpdateDto}
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
                    {pageStoreForm.watch("icon") ? (
                        <div
                            dangerouslySetInnerHTML={{
                                __html: pageStoreForm.watch("icon")!,
                            }}
                            class="mt-3"
                        />
                    ) : null}
                </div>
                <div class="my-2">
                    <span class="text-xs dark:text-white relative flex gap-2 items-center">
                        Queries <ShowTablesDB />
                    </span>
                    <div class="max-h-[300px] overflow-auto">
                        {queries.fields.map((_, i) => (
                            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                            <div key={i} class="flex gap-2 items-center">
                                <div class="w-[150px] flex items-center">
                                    <Form.control
                                        title="Key"
                                        placeholder="users"
                                        name={
                                            `queries.${i}.key` as keyof PagesStoreDto
                                        }
                                        question={
                                            <div>
                                                LLave única <br />
                                                ejemplo: users, posts,etc
                                            </div>
                                        }
                                    />
                                </div>
                                <Form.control.area
                                    class="h-[200px]"
                                    title="Query"
                                    placeholder="SELECT * FROM USERS WHERE empresa_id = :id"
                                    name={
                                        `queries.${i}.query` as keyof PagesStoreDto
                                    }
                                    question={
                                        <div class="w-[300px]">
                                            Solo Consultas SELECT <br />
                                            obligatorio el where empresa_id =
                                            :empresa_id
                                            <br />
                                            <br />
                                            SELECT * FROM "Users" WHERE
                                            "Users"."empresa_id" = :empresa_id
                                        </div>
                                    }
                                />
                                <button
                                    type="button"
                                    class="bg-danger px-2 py-1 rounded-md text-white text-xs"
                                    onClick={() => {
                                        sweetModal({
                                            title: "¿Estas seguro de eliminar esta query?",
                                        }).then(({ isConfirmed }) => {
                                            if (isConfirmed) {
                                                queries.remove(i);
                                            }
                                        });
                                    }}
                                >
                                    <i class="fas fa-trash" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => {
                                queries.prepend({ key: null, query: null });
                            }}
                            class="bg-primary px-2 py-1 rounded-md  font-bold mt-2 "
                        >
                            +
                        </button>
                    </div>
                </div>
                <Hr />
                <Form.control.toggle
                    title="Header Url?"
                    question="Que se muestre en el header"
                    name={"enabledHeaderPage" as keyof PagesStoreDto}
                />
                <br />
                <Form.button.submit
                    ico={null}
                    title="Guardar"
                    isLoading={pageStoreMutation.isLoading || false}
                    disabled={pageStoreMutation.isLoading || false}
                />
            </Form>
        </div>
    );
}
export function ShowTablesDB() {
    return (
        <button
            type="button"
            class="bg-black text-white w-[20px] h-[20px] rounded-full flex justify-center items-center font-bold"
            onClick={() => {
                sweetModal({
                    html: reactComponent(
                        <div>
                            <h2 class="font-semibold text-xl dark:text-white text-center mb-3">
                                Tablas
                            </h2>
                            <div class="max-h-[600px] overflow-auto">
                                <table class="text-sm text-left  h-full shadow w-full ">
                                    <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary text-secondary-dark dark:text-primaryuppercase  shadow-sm  border-b dark:border-admin-terciary">
                                        <tr>
                                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                                id
                                            </th>
                                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                                Nombre
                                            </th>
                                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                                cantidad
                                            </th>

                                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                                opcion
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {storageEmpresa!.tableObjects.map(
                                            (table, i) => (
                                                <tr
                                                    key={table.name}
                                                    class="border-b h-[45px] dark:hover:text-black dark:border-admin-terciary border-paper-light hover:bg-paper-light text-black  dark:text-secondary-light  cursor-pointer"
                                                >
                                                    <td>
                                                        <div class="flex justify-center items-center">
                                                            {i + 1}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="flex justify-center items-center">
                                                            {table.name}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="flex justify-center items-center">
                                                            {table.data.length}
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div class="flex justify-center items-center">
                                                            <button
                                                                class="bg-primary px-2 py-1 rounded-md relative"
                                                                type="button"
                                                                onClick={() => {
                                                                    sweetModal({
                                                                        isCloseInBackground:
                                                                            false,
                                                                        showCloseButton:
                                                                            true,
                                                                        html: reactComponent(
                                                                            <div>
                                                                                <table class="text-sm text-left  h-full shadow w-full ">
                                                                                    <thead class="text-[10px] lg:text-xs bg-paper-light dark:bg-admin-terciary text-secondary-dark dark:text-primaryuppercase  shadow-sm  border-b dark:border-admin-terciary">
                                                                                        <tr>
                                                                                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                                                                                id
                                                                                            </th>
                                                                                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                                                                                Nombre
                                                                                            </th>
                                                                                            <th class="px-1 py-1  dark:bg-admin-terciary text-center cursor-pointer dark:text-white">
                                                                                                Tipo{" "}
                                                                                            </th>
                                                                                        </tr>
                                                                                    </thead>
                                                                                    <tbody>
                                                                                        {table.data.map(
                                                                                            (
                                                                                                col,
                                                                                                i
                                                                                            ) => (
                                                                                                <tr
                                                                                                    key={
                                                                                                        col.name
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
                                                                                                                col.name
                                                                                                            }
                                                                                                        </div>
                                                                                                    </td>
                                                                                                    <td>
                                                                                                        <div class="flex justify-center items-center">
                                                                                                            {
                                                                                                                col.type
                                                                                                            }{" "}
                                                                                                            {col.is_nullable
                                                                                                                ? "(nullable)"
                                                                                                                : ""}
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
                                                                <i class="fa-solid fa-database" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ),
                    position: "start",
                    sweetWidth: "600px",
                    isCloseInBackground: false,
                    showCloseButton: true,
                });
            }}
        >
            ?
        </button>
    );
}

export default PageStore;
