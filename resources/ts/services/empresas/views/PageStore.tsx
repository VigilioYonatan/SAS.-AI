import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { type PagesStoreDto, pagesStoreDto } from "../dtos/pages.store.dto";
import Form from "~/components/form";
import { pageStoreApi } from "../apis/pages/pages.store.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { storageEmpresa } from "../stores/empresa.store";
import { PageSchema } from "../schemas/pages.schema";
import { pageUpdateApi } from "../apis/pages/pages.update.api";
import { PagesUpdateDto, pagesUpdateDto } from "../dtos/pages.update.dto";

interface PageStoreProps {
    onClose: () => void;
    refetch: (clean?: boolean) => void;
}
function PageStore({ onClose, refetch }: PageStoreProps) {
    const pageStoreMutation = pageStoreApi();
    const pageStoreForm = useForm<PagesStoreDto>({
        resolver: valibotVigilio(pagesStoreDto),
        defaultValues: { empresa_id: storageEmpresa!.id },
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
export function PageUpdate({ onClose, refetch, page }: PageUpdateProps) {
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
                            refetch(false);
                            onClose();
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

export default PageStore;
