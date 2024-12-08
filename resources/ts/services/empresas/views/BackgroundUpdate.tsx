import Form from "~/components/form";
import { useForm } from "react-hook-form";
import useAuthstore from "@/auth/stores/auth.store";
import { valibotVigilio } from "~/libs/valibot";
import { useEffect, useMemo } from "preact/hooks";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { getFilesEdit } from "~/libs/upload";
import AdminHr from "~/components/AdminHr";
import {
    backgroundImageUpdateDto,
    backgroundUpdateDto,
    type BackgroundImageUpdateDto,
    type BackgroundUpdateDto,
} from "@/empresas/dtos/background.update.dto";
import { backgroundShowApi } from "../apis/background.show.api";
import {
    backgroundUpdateApi,
    backgroundUpdateImageApi,
} from "../apis/background.update.api";
import { BASE_URL } from "~/config";

interface BackgroundUpdateProps {
    id: number;
    onClose: () => void;
    refetch: (clean?: boolean) => void;
}
function BackgroundUpdate({ id, onClose, refetch }: BackgroundUpdateProps) {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const backgroundQuery = backgroundShowApi(id);

    let component: JSX.Element | JSX.Element[] | null = null;

    if (backgroundQuery.isLoading) {
        component = <Loading />;
    }
    if (backgroundQuery.isError) {
        component = <View404 message={`No se encontró un background: ${id}`} />;
    }
    if (backgroundQuery.isSuccess) {
        const background = backgroundQuery.data!.background;
        const backgroundUpdateDtoForm = useForm<BackgroundUpdateDto>({
            resolver: valibotVigilio(backgroundUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                const { createdAt, updatedAt, id, image, ...rest } = background;
                return {
                    ...rest,
                };
            }, []),
        });
        const formBackgroundUpdateImage = useForm<BackgroundImageUpdateDto>({
            mode: "all",
            resolver: valibotVigilio(backgroundImageUpdateDto),
        });

        const backgroundUpdateMutation = backgroundUpdateApi(id);
        const backgroundUpdateImageMutation = backgroundUpdateImageApi(
            background.id
        );

        function onUpdateBackground(body: BackgroundUpdateDto) {
            sweetModal({
                title: "¿Estás seguro de editar el background ?",
                customIcon:
                    "<i class='fa-solid fa-image text-3xl dark:text-white' ></i>",
                isCloseInBackground: false,
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    backgroundUpdateMutation.mutate(body, {
                        onSuccess() {
                            sweetAlert({
                                icon: "success",
                                title: "Se realizó los cambios correctament",
                            });
                            onClose();
                            refetch(false);
                        },
                        onError(error) {
                            handlerError(backgroundUpdateDtoForm, error);
                        },
                    });
                }
            });
        }
        function onUpdateImageBackground(body: BackgroundImageUpdateDto) {
            backgroundUpdateImageMutation.mutate(body, {
                onSuccess() {
                    sweetAlert({
                        icon: "success",
                        title: "Se actualizó image correctamente",
                    });
                    refetch(false);
                },
                onError(error) {
                    handlerError(formBackgroundUpdateImage, error);
                },
            });
        }
        async function initialUpdateImage() {
            if (background.image) {
                const files = await getFilesEdit(background.image, 1600);

                formBackgroundUpdateImage.setValue("image", files);
            }
        }

        useEffect(() => {
            initialUpdateImage();
        }, []);

        component = (
            <div class="text-start  mt-6">
                <Form
                    {...backgroundUpdateDtoForm}
                    onSubmit={onUpdateBackground}
                >
                    <div class="flex justify-between items-center">
                        <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 items-center">
                            <i class="fa-solid fa-image" />
                            Editar background
                        </h3>
                        <Form.button.reset />
                    </div>
                    <Form.control
                        title="Título"
                        name={"title" as keyof BackgroundUpdateDto}
                    />
                    <Form.control
                        title="Url"
                        name={"url" as keyof BackgroundUpdateDto}
                    />
                    <Form.control
                        placeholder={BASE_URL}
                        title="Contenido"
                        name={"description" as keyof BackgroundUpdateDto}
                    />
                    <div class="flex justify-center">
                        <Form.button.submit
                            ico={null}
                            disabled={
                                backgroundUpdateMutation.isLoading || false
                            }
                            isLoading={
                                backgroundUpdateMutation.isLoading || false
                            }
                            title="Actualizar"
                        />
                    </div>
                </Form>
                <AdminHr />
                <div class="flex justify-between items-center">
                    <h3 class="dark:text-white text-lg lg:text-2xl font-bold uppercase text-center flex gap-2">
                        <i class="fa-solid fa-image" />
                        Editar Imagen/video
                    </h3>
                </div>
                <Form
                    {...formBackgroundUpdateImage}
                    onSubmit={onUpdateImageBackground}
                >
                    <Form.control.file
                        name={"image" as keyof BackgroundImageUpdateDto}
                        title="Image de empresa"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif y video/mp4"
                        typeFile="image-video"
                        showButonCopy
                        typesText="JPG, PNG, WEBP, GIF, MP4, OGG Ó JPEG"
                    />
                    <div class="flex justify-center">
                        <Form.button.submit
                            disabled={
                                backgroundUpdateImageMutation.isLoading || false
                            }
                            isLoading={
                                backgroundUpdateImageMutation.isLoading || false
                            }
                            ico={null}
                            title="Editar"
                        />
                    </div>
                </Form>
            </div>
        );
    }
    return component;
}

export default BackgroundUpdate;
