import { useForm } from "react-hook-form";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { useEffect, useMemo } from "preact/hooks";
import { slug as transformSlug } from "@vigilio/express-core/helpers";
import { categoriesShowApi } from "../apis/categories/categories.show.api";
import { valibotVigilio } from "~/libs/valibot";
import { handlerError } from "~/libs/helpers";
import Form from "~/components/form";
import Loading from "@/admin/components/Loading";
import useAuthStore from "@/auth/stores/auth.store";
import View404 from "@/admin/views/404";
import {
    categoriesUpdateApi,
    categoriesUpdateImagesApi,
} from "../apis/categories/categories.update.api";
import {
    categoriesUpdateDto,
    CategoriesUpdateDto,
    CategoriesUpdateImageDto,
    categoriesUpdateImageDto,
} from "../dtos/categories.update.dto";
import { getFilesEdit } from "~/libs/upload";

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
                };
            }, []),
        });
        const formProductsNormalUpdateImages =
            useForm<CategoriesUpdateImageDto>({
                mode: "all",
                resolver: valibotVigilio(categoriesUpdateImageDto),
            });

        const categoriesUpdateImagesMutate = categoriesUpdateImagesApi(
            category.id
        );
        function onUpdateCategory(body: CategoriesUpdateDto) {
            sweetModal({
                icon: "info",
                title: "¿Estás seguro de actualizar esta categoría?",
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

        const name = categoriesUpdateForm.watch("name");
        useEffect(() => {
            categoriesUpdateForm.setValue("slug", transformSlug(name || ""));
        }, [name]);
        async function initialUpdateImages() {
            if (category.image) {
                const images = await getFilesEdit(category.image, 500);
                formProductsNormalUpdateImages.setValue("image", images);
            }
        }
        function onUpdateImagesProduct(data: CategoriesUpdateImageDto) {
            sweetModal({
                title: "¿Estás seguro de editar las imagenes de esta categoria?",

                showCloseButton: true,
                showCancelButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    categoriesUpdateImagesMutate.mutate(
                        { ...data, name: category.name },
                        {
                            onSuccess() {
                                sweetAlert({
                                    icon: "success",
                                    title: "Se actualizó imagenes correctamente",
                                });

                                if (refetch) {
                                    refetch(false);
                                }
                                query.refetch(false);
                            },
                            onError(error) {
                                handlerError(
                                    formProductsNormalUpdateImages,
                                    error
                                );
                            },
                        }
                    );
                }
            });
        }

        useEffect(() => {
            initialUpdateImages();
        }, []);
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
                                    <Form.control
                                        name={
                                            "icon" as keyof CategoriesUpdateDto
                                        }
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
                    <br />
                    <div class="flex justify-between items-center">
                        <h3 class="dark:text-white  font-bold uppercase text-center flex gap-2 break-words text-wrap ">
                            <i class="fa-solid fa-layer-group" />
                            Editar imagen - {category.name}
                        </h3>
                    </div>
                    <Form
                        {...formProductsNormalUpdateImages}
                        onSubmit={onUpdateImagesProduct}
                    >
                        <Form.control.file
                            name={"image" as keyof CategoriesUpdateImageDto}
                            title="Imagen de categoría"
                            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                            typeFile="image"
                            multiple
                            showButonCopy
                        />
                        <div class="flex justify-center">
                            <Form.button.submit
                                disabled={
                                    categoriesUpdateImagesMutate.isLoading ||
                                    false
                                }
                                isLoading={
                                    categoriesUpdateImagesMutate.isLoading ||
                                    false
                                }
                                ico={<i class="fas fa-pen" />}
                                title="Editar"
                            />
                        </div>
                    </Form>
                </div>
            </div>
        );
    }

    return component;
}

export default CategoriesUpdate;
