import { useForm } from "react-hook-form";
import {
    type SubcategoriesUpdateDto,
    subcategoriesUpdateDto,
    type SubcategoriesUpdateImageDto,
    subcategoriesUpdateImageDto,
} from "../dtos/subcategories.update.dto";
import {
    subcategoriesUpdateApi,
    subcategoriesUpdateImageApi,
} from "../apis/subcategories/subcategories.update.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useEffect, useMemo } from "preact/hooks";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { subcategoriesShowApi } from "../apis/subcategories/subcategories.show.api";
import { valibotVigilio } from "~/libs/valibot";
import { getFilesEdit } from "~/libs/upload";
import { handlerError } from "~/libs/helpers";
import Form from "~/components/form";
import Loading from "@/admin/components/Loading";
import useAuthStore from "@/auth/stores/auth.store";
import View404 from "@/admin/views/404";
import { formSelectNumber } from "~/components/form/WebFormSelect";
import { categoriesIndexApi } from "../apis/categories/categories.index.api";

interface SubcategoriesUpdateProps {
    refetch: (clean?: boolean) => Promise<void>;
    onClose: () => void;
    id: string | number;
}

function SubcategoriesUpdate({
    id,
    onClose,
    refetch,
}: SubcategoriesUpdateProps) {
    if (!useAuthStore().guards.permissionAdminGuard()) {
        onClose();
        return null;
    }
    const query = subcategoriesShowApi(id as string);

    let component = null;

    if (query.isLoading) {
        component = <Loading />;
    }
    if (query.isError) {
        component = <View404 message={query.error?.message} />;
    }
    if (query.isSuccess && query.data) {
        const subcategory = query.data.subcategory;
        const subcategoriesUpdateMutation = subcategoriesUpdateApi(
            subcategory.id
        );
        const categoriesIndexQuery = categoriesIndexApi(false);

        const subcategoriesUpdateForm = useForm<SubcategoriesUpdateDto>({
            resolver: valibotVigilio(subcategoriesUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                return {
                    name: subcategory.name,
                    slug: subcategory.slug,
                    category_id: subcategory.category_id,
                };
            }, []),
        });
        function onUpdateSubcategory(body: SubcategoriesUpdateDto) {
            sweetModal({
                icon: "info",
                title: "¿Estás seguro de agregar esta subcategoría?",
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    subcategoriesUpdateMutation.mutate(body, {
                        onSuccess(data) {
                            sweetAlert({
                                icon: "success",
                                title: `<p class="text-center">Subcategoría actualizado correctamente <b>${data.subcategory.name}</b></p>`,
                            });
                            onClose();
                            refetch(false);
                        },
                        onError(error) {
                            handlerError(subcategoriesUpdateForm, error);
                        },
                    });
                }
            });
        }
        const subcategoriesUpdateImageApiMutation = subcategoriesUpdateImageApi(
            subcategory.id
        );

        const subcategoriesUpdateImageForm =
            useForm<SubcategoriesUpdateImageDto>({
                mode: "all",
                resolver: valibotVigilio(subcategoriesUpdateImageDto),
            });

        const onSubcategoriesUpdateImages = (
            data: SubcategoriesUpdateImageDto
        ) => {
            sweetModal({
                icon: "info",
                title: "¿Estás seguro de agregar esta subcategoría?",
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    subcategoriesUpdateImageApiMutation.mutate(
                        { ...data, name: subcategory.name },
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
                                handlerError(
                                    subcategoriesUpdateImageForm,
                                    error
                                );
                            },
                        }
                    );
                }
            });
        };

        async function initial() {
            const image = await getFilesEdit(subcategory.image, 800);
            subcategoriesUpdateImageForm.setValue("image", image);
        }

        useEffect(() => {
            initial();
        }, []);
        const name = subcategoriesUpdateForm.watch("name");
        useEffect(() => {
            subcategoriesUpdateForm.setValue("slug", transformSlug(name || ""));
        }, [name]);

        const categoriesData = useMemo(() => {
            if (categoriesIndexQuery.isSuccess && categoriesIndexQuery.data) {
                return categoriesIndexQuery.data.data.map((category) => ({
                    key: category.id,
                    value: category.name,
                }));
            }
            return [];
        }, [categoriesIndexQuery.data, categoriesIndexQuery.isSuccess]);

        component = (
            <div class="p-4">
                <div className="flex flex-col">
                    <div class="lg:col-span-3 dark:bg-admin-paper-dark p-4 rounded-md">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2">
                                <i class="fa-solid fa-table-cells-large" />
                                Editar Subcategoría - {subcategory.name}
                            </h3>
                        </div>
                        <div className="flex flex-col gap-4">
                            <Form
                                {...subcategoriesUpdateForm}
                                onSubmit={onUpdateSubcategory}
                            >
                                <div class="flex flex-col gap-4 justify-center items-center">
                                    <div class="w-full flex flex-col md:flex-row gap-2">
                                        <Form.control
                                            name={
                                                "name" as keyof SubcategoriesUpdateDto
                                            }
                                            title="Nombre"
                                            placeholder="Nombre de subcategoría"
                                        />{" "}
                                        <Form.control.select
                                            title="Categoria"
                                            array={categoriesData}
                                            name={
                                                "category_id" as keyof SubcategoriesUpdateDto
                                            }
                                            options={{
                                                setValueAs: formSelectNumber,
                                            }}
                                            placeholder="escoger categoria"
                                            isLoading={
                                                categoriesIndexQuery.isLoading ||
                                                false
                                            }
                                        />
                                    </div>
                                    <Form.control
                                        name={
                                            "slug" as keyof SubcategoriesUpdateDto
                                        }
                                        title="Slug"
                                        placeholder="nombre-de-categoria"
                                        options={{
                                            setValueAs: transformSlug,
                                        }}
                                    />
                                    <Form.button.submit
                                        disabled={
                                            subcategoriesUpdateMutation.isLoading ||
                                            false
                                        }
                                        isLoading={
                                            subcategoriesUpdateMutation.isLoading ||
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
                                Editar imagen - {subcategory.name}
                            </h3>
                        </div>
                        <Form
                            {...subcategoriesUpdateImageForm}
                            onSubmit={onSubcategoriesUpdateImages}
                        >
                            <Form.control.file
                                name={
                                    "image" as keyof SubcategoriesUpdateImageDto
                                }
                                title="Imagen"
                                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                                typeFile="image"
                            />
                            <div class="flex justify-center">
                                <Form.button.submit
                                    disabled={
                                        subcategoriesUpdateImageApiMutation.isLoading ||
                                        false
                                    }
                                    isLoading={
                                        subcategoriesUpdateImageApiMutation.isLoading ||
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

export default SubcategoriesUpdate;
