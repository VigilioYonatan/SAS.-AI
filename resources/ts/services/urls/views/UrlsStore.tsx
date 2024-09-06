import Form from "~/components/form";
import { type UrlsStoreDto, urlsStoreDto } from "../dtos/urls.store.dto";
import { useForm } from "react-hook-form";
import { urlsStoreApi } from "../apis/urls.store.api";
import { valibotVigilio } from "~/libs/valibot";
import { handlerError } from "~/libs/helpers";
import { sweetAlert } from "@vigilio/sweet";
import { storageEmpresa } from "@/empresas/stores/empresa.store";

interface UrlsStoreProps {
    refetch: (clean?: boolean | undefined) => Promise<void>;
    onClose: () => void;
}
function UrlsStore({ refetch, onClose }: UrlsStoreProps) {
    const urlsStoreDtoForm = useForm<UrlsStoreDto>({
        resolver: valibotVigilio(urlsStoreDto),
        defaultValues: { empresa_id: storageEmpresa!.id },
    });
    const urlsStoreApiMutation = urlsStoreApi();
    function onAddUrl(data: UrlsStoreDto) {
        urlsStoreApiMutation.mutate(data, {
            onSuccess(data) {
                sweetAlert({
                    icon: "success",
                    title: `<p class="text-center"> url agregado correctamente <b>${data.url.web}</b></p>`,
                });
                onClose();
                refetch(false);
            },
            onError(error) {
                handlerError(urlsStoreDtoForm, error);
            },
        });
    }
    function onHash() {
        urlsStoreDtoForm.setValue(
            "hash",
            Math.random().toString(32).slice(2, 6)
        );
    }

    return (
        <div class="text-start">
            <div class="flex justify-between items-center mb-4 ">
                <h3 class="dark:text-white text-2xl font-bold uppercase text-center flex gap-2">
                    <i class="fa-solid fa-link" />
                    Agregar Url
                </h3>
            </div>
            <Form {...urlsStoreDtoForm} onSubmit={onAddUrl}>
                <div class="flex justify-end items-center mb-4">
                    <Form.button.reset />
                </div>
                <Form.control
                    ico={<i class="fa-solid fa-globe" />}
                    name={"web" as keyof UrlsStoreDto}
                    title="Url de web"
                />
                <div class="flex gap-2 items-center">
                    <Form.control
                        name={"hash" as keyof UrlsStoreDto}
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
                    name={"enabled" as keyof UrlsStoreDto}
                    title="Habilitado"
                />
                <Form.button.submit
                    disabled={urlsStoreApiMutation.isLoading || false}
                    isLoading={urlsStoreApiMutation.isLoading || false}
                    title="Guardar"
                    ico={null}
                />
            </Form>
        </div>
    );
}

export default UrlsStore;
