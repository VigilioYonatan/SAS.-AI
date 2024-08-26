import { useForm } from "react-hook-form";
import {
    type BrandsUpdateDto,
    brandsUpdateDto,
    type BrandsUpdateImageDto,
    brandsUpdateImageDto,
} from "../dtos/brands.update.dto";
import {
    brandsUpdateApi,
    brandsUpdateImageApi,
} from "../apis/brands/brands.update.api";
import { sweetAlert } from "@vigilio/sweet";
import { useEffect, useMemo } from "preact/hooks";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { brandsShowApi } from "../apis/brands/brands.show.api";
import { valibotVigilio } from "~/libs/valibot";
import { getFilesEdit } from "~/libs/upload";
import { handlerError } from "~/libs/helpers";
import Form from "~/components/form";
import Loading from "@/admin/components/Loading";
import useAuthStore from "@/auth/stores/auth.store";
import View404 from "@/admin/views/404";

interface BrandsUpdateProps {
    refetch: (clean?: boolean) => Promise<void>;
    onClose: () => void;
    id: string | number;
}

function BrandsUpdate({ id, onClose, refetch }: BrandsUpdateProps) {
    if (!useAuthStore().guards.permissionAdminGuard()) {
        onClose();
        return null;
    }
    const query = brandsShowApi(id as string);

    let component = null;

    if (query.isLoading) {
        component = <Loading />;
    }
    if (query.isError) {
        component = <View404 message={query.error?.message} />;
    }
    if (query.isSuccess && query.data) {
        const brand = query.data.brand;
        const brandsUpdateMutation = brandsUpdateApi(brand.id);
        const brandsUpdateForm = useForm<BrandsUpdateDto>({
            resolver: valibotVigilio(brandsUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                const { createdAt, updatedAt, id, ...rest } = brand;
                return rest;
            }, []),
        });
        function onUpdateBrand(body: BrandsUpdateDto) {
            brandsUpdateMutation.mutate(body, {
                onSuccess(data) {
                    sweetAlert({
                        icon: "success",
                        title: `<p class="text-center">Categoría actualizado correctamente <b>${data.brand.name}</b></p>`,
                    });
                    onClose();
                    refetch(false);
                },
                onError(error) {
                    handlerError(brandsUpdateForm, error);
                },
            });
        }
        const brandsUpdateImageApiMutation = brandsUpdateImageApi(brand.id);

        const brandsUpdateImageForm = useForm<BrandsUpdateImageDto>({
            mode: "all",
            resolver: valibotVigilio(brandsUpdateImageDto),
        });

        const onBrandsUpdateImages = (data: BrandsUpdateImageDto) => {
            brandsUpdateImageApiMutation.mutate(
                { ...data, name: brand.name },
                {
                    onSuccess(_data) {
                        sweetAlert({
                            icon: "success",
                            title: "Se actualizó la imagen correctamente",
                        });
                        onClose();
                        refetch(false);
                    },
                    onError(error) {
                        handlerError(brandsUpdateImageForm, error);
                    },
                }
            );
        };

        async function initial() {
            const image = await getFilesEdit(brand.image, 300);
            brandsUpdateImageForm.setValue("image", image);
        }

        useEffect(() => {
            initial();
        }, []);
        const name = brandsUpdateForm.watch("name");
        useEffect(() => {
            brandsUpdateForm.setValue("slug", transformSlug(name || ""));
        }, [name]);

        component = (
            <div class="p-4">
                <div className="flex flex-col">
                    <div class="lg:col-span-3 dark:bg-admin-paper-dark p-4 rounded-md">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
                                <i class="fa-solid fa-layer-group" />
                                Editar Categoría - {brand.name}
                            </h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Form
                                {...brandsUpdateForm}
                                onSubmit={onUpdateBrand}
                            >
                                <div class="flex flex-col gap-4 justify-center items-center">
                                    <div class="w-full flex flex-col md:flex-row gap-2">
                                        <Form.control
                                            name={
                                                "name" as keyof BrandsUpdateDto
                                            }
                                            title="Nombre"
                                            placeholder="Nombre de categoría"
                                        />
                                        <Form.control
                                            name={
                                                "slug" as keyof BrandsUpdateDto
                                            }
                                            title="Slug"
                                            placeholder="nombre-de-categoria"
                                            options={{
                                                setValueAs: transformSlug,
                                            }}
                                        />
                                    </div>
                                    <Form.button.submit
                                        disabled={
                                            brandsUpdateMutation.isLoading ||
                                            false
                                        }
                                        isLoading={
                                            brandsUpdateMutation.isLoading ||
                                            false
                                        }
                                        title="Editar"
                                    />
                                </div>
                            </Form>
                        </div>
                    </div>
                    <div className="p-4 rounded-md lg:col-span-2 dark:bg-admin-paper-dark">
                        <div class="flex justify-between items-center">
                            <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
                                <i class="fa-solid fa-image" />
                                Editar imagen - {brand.name}
                            </h3>
                        </div>
                        <Form
                            {...brandsUpdateImageForm}
                            onSubmit={onBrandsUpdateImages}
                        >
                            <Form.control.file
                                name={"image" as keyof BrandsUpdateImageDto}
                                title="Imagen"
                                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                                typeFile="image"
                            />
                            <div class="flex justify-center">
                                <Form.button.submit
                                    isLoading={
                                        brandsUpdateImageApiMutation.isLoading ||
                                        false
                                    }
                                    ico={<i class="fas fa-pen" />}
                                    title="Editar"
                                />
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        );
    }

    return component;
}

export default BrandsUpdate;
