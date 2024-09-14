import AdminBreadCrumb from "@/admin/components/AdminBreadCrumb";
import Container from "@/admin/components/Container";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import Form from "~/components/form";
import { newStoreDto, type NewStoreDto } from "../dtos/new.store.dto";
import { formatDateTwo, handlerError } from "~/libs/helpers";
import { newStoreApi } from "../apis/new/new.store.api";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { newIndexApi } from "../apis/new/new.index.api";
import { webUpdateApi } from "../apis/new/new.update.api";
import type { NewSchema } from "../schemas/new.schema";
import AlertInfo from "~/components/Alerts/AlertInfo";

function BackgroundIndex() {
    const newIndexQuery = newIndexApi();

    let component: JSX.Element | JSX.Element[] | null = null;
    if (newIndexQuery.isLoading) {
        component = <Loading />;
    }
    if (newIndexQuery.isError) {
        component = <View404 message="error background" />;
    }
    if (newIndexQuery.isSuccess) {
        component = (
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {newIndexQuery.data?.data.length ? (
                    <NewUpdate noticia={newIndexQuery.data?.data[0]} />
                ) : (
                    <NewStore refetch={newIndexQuery.refetch} />
                )}
            </div>
        );
    }
    return (
        <Container className="p-2">
            <>
                <div class="flex flex-col gap-4 mx-1 ">
                    <AdminBreadCrumb current="noticia" />
                </div>

                {component}
            </>
        </Container>
    );
}

interface NewStoreProps {
    refetch: () => void;
}
function NewStore({ refetch }: NewStoreProps) {
    const newStoreMutate = newStoreApi();
    const newStoreForm = useForm<NewStoreDto>({
        resolver: valibotVigilio(newStoreDto),
    });
    function onNewStore(body: NewStoreDto) {
        sweetModal({
            icon: "info",
            title: "¿Estas seguro de agregar una nueva noticia?",
            showCloseButton: true,
            showCancelButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                newStoreMutate.mutate(body, {
                    onSuccess() {
                        refetch();
                        sweetAlert({
                            icon: "success",
                            title: "Agregado noticia nuevo",
                        });
                    },
                    onError(error) {
                        handlerError(newStoreForm, error);
                    },
                });
            }
        });
    }
    return (
        <Form {...newStoreForm} onSubmit={onNewStore}>
            <AlertInfo>Noticia que se mostrará a tus clientes.</AlertInfo>
            <Form.control
                title="Título"
                placeholder=""
                name={"title" as keyof NewStoreDto}
            />
            <Form.control
                title="Subtitulo"
                placeholder=""
                name={"subtitle" as keyof NewStoreDto}
            />
            <Form.control
                title="Link"
                placeholder="http:xxxxxx"
                name={"link" as keyof NewStoreDto}
            />
            <Form.control
                title="Fecha retroceso"
                type="date"
                name={"date" as keyof NewStoreDto}
            />
            <Form.control.toggle
                title="Mostrar"
                name={"enabled" as keyof NewStoreDto}
            />
            <Form.button.submit
                title="Guardar"
                disabled={newStoreMutate.isLoading || false}
                isLoading={newStoreMutate.isLoading || false}
            />
        </Form>
    );
}

interface NewUpdateProps {
    noticia: NewSchema;
}
function NewUpdate({ noticia }: NewUpdateProps) {
    const newUpdateMutate = webUpdateApi(noticia.id);
    const newUpdateForm = useForm<NewStoreDto>({
        resolver: valibotVigilio(newStoreDto),
        defaultValues: {
            ...noticia,
            date: noticia.date
                ? (formatDateTwo(noticia.date, "YYYY-MM-DD") as Date)
                : null,
        },
    });
    function onNewUpdate(body: NewStoreDto) {
        newUpdateMutate.mutate(body, {
            onSuccess() {
                sweetAlert({
                    icon: "success",
                    title: "Modificado correctamente",
                });
            },
            onError(error) {
                handlerError(newUpdateForm, error);
            },
        });
    }
    return (
        <Form {...newUpdateForm} onSubmit={onNewUpdate}>
            <Form.control
                title="Título"
                placeholder="xxxxx"
                name={"title" as keyof NewStoreDto}
            />
            <Form.control
                title="Subtitulo"
                placeholder="xxxxx"
                name={"subtitle" as keyof NewStoreDto}
            />
            <Form.control
                title="Link"
                placeholder="http:xxxxxx"
                name={"link" as keyof NewStoreDto}
            />
            <Form.control
                title="Fecha retroceso"
                type="date"
                name={"date" as keyof NewStoreDto}
            />
            <Form.control.toggle
                title="Mostrar"
                name={"enabled" as keyof NewStoreDto}
            />
            <Form.button.submit
                title="Guardar"
                disabled={newUpdateMutate.isLoading || false}
                isLoading={newUpdateMutate.isLoading || false}
            />
        </Form>
    );
}

export default BackgroundIndex;
