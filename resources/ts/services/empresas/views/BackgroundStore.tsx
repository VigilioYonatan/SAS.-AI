import Form from "~/components/form";
import { useForm } from "react-hook-form";
import useAuthstore from "@/auth/stores/auth.store";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import {
    backgroundStoreDto,
    type BackgroundStoreDto,
} from "../dtos/background.store.dto";
import { backgroundStoreApi } from "../apis/background.store.api";
import { BackgroundSchemaFromServer } from "../schemas/background.schema";
import FormControlEditorJS from "~/components/form/FormControlEditorJS";

interface PoststoreProps {
    onClose: () => void;
    refetch: (clean?: boolean) => void;
    background_latest?: BackgroundSchemaFromServer;
}
function BackgroundStore({
    onClose,
    refetch,
    background_latest,
}: PoststoreProps) {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const backgroundStoreDtoForm = useForm<BackgroundStoreDto>({
        resolver: valibotVigilio(backgroundStoreDto),
        mode: "all",
        defaultValues: {
            html: background_latest?.html ? background_latest.html : null,
        },
    });
    const backgroundStoreMutation = backgroundStoreApi();

    function onAddBackground(body: BackgroundStoreDto) {
        sweetModal({
            title: "¿Estás seguro de agregar un nuevo background?",
            customIcon:
                "<i class='fa-solid fa-image text-3xl dark:text-white' ></i>",
            showCloseButton: true,
            showCancelButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                backgroundStoreMutation.mutate(body, {
                    onSuccess() {
                        sweetAlert({
                            icon: "success",
                            title: "Se agregó un nuevo background correctamente",
                        });
                        refetch(false);
                        backgroundStoreDtoForm.reset();
                        onClose();
                    },
                    onError(error) {
                        handlerError(backgroundStoreDtoForm, error);
                    },
                });
            }
        });
    }

    return (
        <div class="text-start">
            <Form {...backgroundStoreDtoForm} onSubmit={onAddBackground}>
                <div class="flex justify-between items-center">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 items-center">
                        <i class="fa-solid fa-image" />
                        Agregar Background
                    </h3>
                    <Form.button.reset />
                </div>

                <FormControlEditorJS
                    title="Contenido"
                    type="html"
                    name={"html" as keyof BackgroundStoreDto}
                />
                <Form.control.file
                    name={"image" as keyof BackgroundStoreDto}
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif, video/mp4"
                    title="Imagen"
                    typeFile="image-video"
                    multiple={false}
                    typesText="JPG, PNG, WEBP, GIF, MP4, OGG Ó JPEG"
                    showButonCopy
                />
                <div class="flex justify-center">
                    <Form.button.submit
                        ico={null}
                        disabled={backgroundStoreMutation.isLoading || false}
                        isLoading={backgroundStoreMutation.isLoading || false}
                        title="Guardar"
                    />
                </div>
            </Form>
        </div>
    );
}

export default BackgroundStore;
