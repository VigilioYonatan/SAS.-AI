import { useForm } from "react-hook-form";
import {
    type CategoriesUpdateDto,
    categoriesUpdateDto,
    type CategoriesUpdateImageDto,
    categoriesUpdateImageDto,
} from "../dtos/categories.update.dto";
import {
    categoriesUpdateApi,
    categoriesUpdateImageApi,
} from "../apis/categories/categories.update.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useEffect, useMemo } from "preact/hooks";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { categoriesShowApi } from "../apis/categories/categories.show.api";
import { valibotVigilio } from "~/libs/valibot";
import { getFilesEdit } from "~/libs/upload";
import { handlerError } from "~/libs/helpers";
import Form from "~/components/form";
import Loading from "@/admin/components/Loading";
import useAuthStore from "@/auth/stores/auth.store";
import View404 from "@/admin/views/404";
import { familiesIndexApi } from "../apis/families/families.index.api";
import { formSelectNumber } from "~/components/form/WebFormSelect";

interface CategoriesUpdateProps {
    refetch: (clean?: boolean) => Promise<void>;
    onClose: () => void;
    id: string | number;
}

function CategoriesUpdate({ id, onClose, refetch }: CategoriesUpdateProps) {
    if (!useAuthStore().guards.permissionAdminGuard()) {
        onClose();
        return null;
    }
    const query = categoriesShowApi(id as string);

    let component = null;

    if (query.isLoading) {
        component = <Loading />;
    }
    if (query.isError) {
        component = <View404 message={query.error?.message} />;
    }
    if (query.isSuccess && query.data) {
        const category = query.data.category;
        const categoriesUpdateMutation = categoriesUpdateApi(category.id);
        const categoriesUpdateForm = useForm<CategoriesUpdateDto>({
            resolver: valibotVigilio(categoriesUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                return {
                    name: category.name,
                    slug: category.slug,
                    family_id: category.family_id,
                };
            }, []),
        });
        const familiesIndexQuery = familiesIndexApi();

        const familiesData = useMemo(() => {
            if (familiesIndexQuery.isSuccess && familiesIndexQuery.data) {
                return familiesIndexQuery.data.data.map((family) => ({
                    key: family.id,
                    value: family.name,
                }));
            }
            return [];
        }, [familiesIndexQuery.data, familiesIndexQuery.isSuccess]);

        function onUpdateCategory(body: CategoriesUpdateDto) {
            sweetModal({
                icon: "info",
                title: "¿Estás seguro de agregar esta categoría?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    categoriesUpdateMutation.mutate(body, {
                        onSuccess(data) {
                            sweetAlert({
                                icon: "success",
                                title: `<p class="text-center">Categoría actualizado correctamente <b>${data.category.name}</b></p>`,
                            });
                            onClose();
                            refetch(false);
                        },
                        onError(error) {
                            handlerError(categoriesUpdateForm, error);
                        },
                    });
                }
            });
        }
        const categoriesUpdateImageApiMutation = categoriesUpdateImageApi(
            category.id
        );

        const categoriesUpdateImageForm = useForm<CategoriesUpdateImageDto>({
            mode: "all",
            resolver: valibotVigilio(categoriesUpdateImageDto),
        });

        const onCategoriesUpdateImages = (data: CategoriesUpdateImageDto) => {
            sweetModal({
                icon: "info",
                title: "¿Estás seguro de editar esta categoría?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    categoriesUpdateImageApiMutation.mutate(
                        { ...data, name: category.name },
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
                                handlerError(categoriesUpdateImageForm, error);
                            },
                        }
                    );
                }
            });
        };

        async function initial() {
            const image = await getFilesEdit(category.image, 800);
            categoriesUpdateImageForm.setValue("image", image);
        }

        useEffect(() => {
            initial();
        }, []);
        const name = categoriesUpdateForm.watch("name");
        useEffect(() => {
            categoriesUpdateForm.setValue("slug", transformSlug(name || ""));
        }, [name]);

        component = (
            <div class="p-4">
                <div className="flex flex-col">
                    <div class="lg:col-span-3 dark:bg-admin-paper-dark p-4 rounded-md">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
                                <i class="fa-solid fa-layer-group" />
                                Editar Categoría - {category.name}
                            </h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Form
                                {...categoriesUpdateForm}
                                onSubmit={onUpdateCategory}
                            >
                                <div class="flex flex-col gap-4 justify-center items-center">
                                    <div class="w-full flex flex-col md:flex-row gap-2">
                                        <Form.control
                                            name={
                                                "name" as keyof CategoriesUpdateDto
                                            }
                                            title="Nombre"
                                            placeholder="Nombre de categoría"
                                        />
                                        <Form.control
                                            name={
                                                "slug" as keyof CategoriesUpdateDto
                                            }
                                            title="Slug"
                                            placeholder="nombre-de-categoria"
                                            options={{
                                                setValueAs: transformSlug,
                                            }}
                                        />
                                    </div>

                                    <Form.control.select
                                        title="Familias"
                                        array={familiesData}
                                        name={
                                            "family_id" as keyof CategoriesUpdateDto
                                        }
                                        options={{
                                            setValueAs: formSelectNumber,
                                        }}
                                        placeholder="Escoger Familia"
                                        isLoading={
                                            familiesIndexQuery.isLoading ||
                                            false
                                        }
                                    />
                                    <Form.button.submit
                                        disabled={
                                            categoriesUpdateMutation.isLoading ||
                                            false
                                        }
                                        isLoading={
                                            categoriesUpdateMutation.isLoading ||
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
                                Editar imagen - {category.name}
                            </h3>
                        </div>
                        <Form
                            {...categoriesUpdateImageForm}
                            onSubmit={onCategoriesUpdateImages}
                        >
                            <Form.control.file
                                name={"image" as keyof CategoriesUpdateImageDto}
                                title="Imagen"
                                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                                typeFile="image"
                            />
                            <div class="flex justify-center">
                                <Form.button.submit
                                    isLoading={
                                        categoriesUpdateImageApiMutation.isLoading ||
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

export default CategoriesUpdate;
