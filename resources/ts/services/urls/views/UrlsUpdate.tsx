import { useForm } from "react-hook-form";
import { type UrlsUpdateDto, urlsUpdateDto } from "../dtos/urls.update.dto";
import { urlsUpdateApi } from "../apis/urls.update.api";
import { sweetAlert } from "@vigilio/sweet";
import { urlsShowApi } from "../apis/urls.show.api";
import { valibotVigilio } from "~/libs/valibot";
import Form from "~/components/form";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { handlerError } from "~/libs/helpers";
import { useMemo } from "preact/hooks";

interface UrlsUpdateProps {
    id: number;
    refetch: (clean?: boolean) => void;
}
function UrlsUpdate({ id, refetch }: UrlsUpdateProps) {
    const query = urlsShowApi(id);

    let component: JSX.Element | JSX.Element[] | null = null;

    if (query.isLoading) {
        component = <Loading />;
    }
    if (query.isError) {
        component = <View404 message={`No se encontró una  url: ${id}`} />;
    }
    if (query.isSuccess && query.data) {
        const url = query.data.url;

        const urlsUpdateDtoForm = useForm<UrlsUpdateDto>({
            resolver: valibotVigilio(urlsUpdateDto),
            defaultValues: useMemo(() => {
                const { createdAt, updatedAt, id, ...rest } = url;
                return rest;
            }, []),
        });

        const urlsUpdateApiMutation = urlsUpdateApi(url.hash);

        function onUpdateUrl(data: UrlsUpdateDto) {
            urlsUpdateApiMutation.mutate(data, {
                onSuccess(data) {
                    sweetAlert({
                        icon: "success",
                        title: `<p class="text-center"> url actualizado correctamente <b>${data.url.web}</b></p>`,
                    });
                    refetch(false);
                },
                onError(error) {
                    handlerError(urlsUpdateDtoForm, error);
                },
            });
        }
        function onHash() {
            urlsUpdateDtoForm.setValue(
                "hash",
                Math.random().toString(32).slice(2, 6)
            );
        }

        return (
            <div class="text-start">
                <div class="flex justify-between items-center mb-4 ">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex items-center gap-2">
                        <i class="fa-solid fa-link" />
                        Actualizar url {url.web}
                    </h3>
                </div>
                <Form {...urlsUpdateDtoForm} onSubmit={onUpdateUrl}>
                    <div class="flex justify-end items-center mb-4">
                        <Form.button.reset />
                    </div>
                    <Form.control
                        ico={<i class="fa-solid fa-globe" />}
                        name={"web" as keyof UrlsUpdateDto}
                        placeholder="https://www.facebook.com"
                        title="Url de web"
                    />
                    <div class="flex gap-2 items-center">
                        <Form.control
                            name={"hash" as keyof UrlsUpdateDto}
                            title="Hash"
                        />
                        <button
                            type="button"
                            onClick={onHash}
                            class="px-2 py-1 rounded-md text-white bg-primary"
                        >
                            <i class="fa-solid fa-magnifying-glass" />
                        </button>
                    </div>
                    <Form.control.toggle
                        name={"enabled" as keyof UrlsUpdateDto}
                        title="Habilitado"
                    />
                    <Form.button.submit
                        disabled={urlsUpdateApiMutation.isLoading || false}
                        isLoading={urlsUpdateApiMutation.isLoading || false}
                        title="Guardar"
                        ico={null}
                    />
                </Form>
            </div>
        );
    }

    return component;
}

export default UrlsUpdate;
