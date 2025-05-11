import Form from "~/components/form";
import { useFieldArray, useForm } from "react-hook-form";
import useAuthstore from "@/auth/stores/auth.store";
import { valibotVigilio } from "~/libs/valibot";
import { useEffect, useMemo } from "preact/hooks";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import { postsShowApi } from "../apis/posts.show.api";
import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import {
    postsImageUpdateDto,
    postsUpdateDto,
    type PostsImageUpdateDto,
    type PostsUpdateDto,
} from "../dtos/posts.update.dto";
import { postsUpdateApi, postsUpdateImageApi } from "../apis/posts.update.api";
import { getFilesEdit } from "~/libs/upload";
import AdminHr from "~/components/AdminHr";
import FormControlEditor from "~/components/form/FormControlEditor";
import { useSignal } from "@preact/signals";

interface PostUpdateProps {
    id: number;
    onClose: () => void;
    refetch: (clean?: boolean) => void;
}
function PostsUpdate({ id, onClose, refetch }: PostUpdateProps) {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const postsQuery = postsShowApi(id);

    let component: JSX.Element | JSX.Element[] | null = null;

    if (postsQuery.isLoading) {
        component = <Loading />;
    }
    if (postsQuery.isError) {
        component = <View404 message={`No se encontró un blog: ${id}`} />;
    }
    if (postsQuery.isSuccess) {
        const post = postsQuery.data!.post;
        const content = useSignal<string | null>(post!.content);

        const postsUpdateDtoForm = useForm<PostsUpdateDto>({
            resolver: valibotVigilio(postsUpdateDto),
            mode: "all",
            defaultValues: useMemo(() => {
                const { createdAt, updatedAt, id, image, ...rest } = post;
                return {
                    ...rest,
                };
            }, []),
        });
        const formPostsUpdateImage = useForm<PostsImageUpdateDto>({
            mode: "all",
            resolver: valibotVigilio(postsImageUpdateDto),
        });

        const postsUpdateMutation = postsUpdateApi(id);
        const postsUpdateImageMutation = postsUpdateImageApi(post.id);

        function onUpdatePost(body: PostsUpdateDto) {
            sweetModal({
                title: `¿Estás seguro de editar el post ${post.id}?`,
                customIcon:
                    "<i class='fas fa-newspaper text-3xl dark:text-white' ></i>",
                isCloseInBackground: false,
                showCancelButton: true,
                showCloseButton: true,
            }).then(({ isConfirmed }) => {
                if (isConfirmed) {
                    postsUpdateMutation.mutate(body, {
                        onSuccess(data) {
                            sweetAlert({
                                icon: "success",
                                title: `Se realizó los cambios correctamente ${data.post.id}`,
                            });
                            onClose();
                            refetch(false);
                        },
                        onError(error) {
                            handlerError(postsUpdateDtoForm, error);
                        },
                    });
                }
            });
        }
        function onUpdateImagePost(body: PostsImageUpdateDto) {
            postsUpdateImageMutation.mutate(body, {
                onSuccess() {
                    sweetAlert({
                        icon: "success",
                        title: "Se actualizó image correctamente",
                    });
                    refetch(false);
                },
                onError(error) {
                    handlerError(formPostsUpdateImage, error);
                },
            });
        }
        async function initialUpdateImage() {
            if (post.image) {
                const image = await getFilesEdit(post.image, 600);
                formPostsUpdateImage.setValue("image", image);
            }
        }

        useEffect(() => {
            initialUpdateImage();
        }, []);
        const linksArray = useFieldArray({
            control: postsUpdateDtoForm.control,
            name: "links",
        });
        component = (
            <div class="text-start  mt-6">
                <Form {...postsUpdateDtoForm} onSubmit={onUpdatePost}>
                    <div class="flex justify-between items-center">
                        <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 items-center">
                            <i class="far fa-person-dolly" />
                            Editar post
                        </h3>
                        <Form.button.reset />
                    </div>
                    <div class="grid md:grid-cols-2 items-center gap-2">
                        <Form.control
                            title="Título"
                            ico={<i class="fas fa-text" />}
                            name={"title" as keyof PostsUpdateDto}
                        />
                        <Form.control
                            title="SEO Título"
                            ico={<i class="fab fa-google" />}
                            name={"seo_title" as keyof PostsUpdateDto}
                            question={
                                <div>
                                    En los buscadores de google se buscará por
                                    el seo título (meta title). <br />
                                    Este campo no es obligatorio. <br />
                                    <a
                                        href="https://developers.google.com/search/docs/crawling-indexing/special-tags?hl=es"
                                        target="_blank"
                                        class="text-primary underline"
                                        rel="noreferrer"
                                    >
                                        Más informacion
                                    </a>
                                </div>
                            }
                        />
                    </div>
                    <div class="grid md:grid-cols-2 items-center gap-2">
                        <Form.control
                            title="Keywords SEO"
                            ico={<i class="fab fa-google" />}
                            name={"keywords" as keyof PostsUpdateDto}
                            question={
                                <div>
                                    Personalizar los keywords SEO (meta
                                    keywords). <br />
                                    Este campo no es obligatorio. <br />
                                    <a
                                        href="https://developers.google.com/search/docs/crawling-indexing/special-tags?hl=es"
                                        target="_blank"
                                        class="text-primary underline"
                                        rel="noreferrer"
                                    >
                                        Más informacion
                                    </a>
                                </div>
                            }
                        />
                        <Form.control
                            title="Slug"
                            ico={<i class="fab fa-google" />}
                            name={"slug" as keyof PostsUpdateDto}
                            question={
                                <div class="w-[200px]">
                                    Personalizar el slug de este blog. <br />
                                    Link del blog /este-es-un-blog. <br />
                                    Este campo no es obligatorio
                                </div>
                            }
                        />
                    </div>
                    <div class="grid md:grid-cols-2 items-center gap-2">
                        <Form.control
                            title="Fecha del blog"
                            ico={<i class="fas fa-calendar" />}
                            type="date"
                            name={"date" as keyof PostsUpdateDto}
                        />
                        <Form.control.toggle
                            title="Mostrar blog"
                            name={"enabled" as keyof PostsUpdateDto}
                            question={
                                <div>
                                    No se mostrará a tus usuarios si está
                                    deshabilitado
                                </div>
                            }
                        />
                    </div>
                    <FormControlEditor
                        title="Contenido"
                        name={"content" as keyof PostsUpdateDto}
                        change={content.value}
                        isShow
                    />
                    <div className="flex flex-col gap-2 mb-4 w-full mt-6">
                        <label
                            htmlFor="links"
                            className="text-xs font-bold dark:text-white"
                        >
                            Enlaces:
                        </label>
                        <div className="grid  gap-2 w-full">
                            {linksArray.fields.map((_, i) => (
                                <div
                                    className="flex gap-2 items-center"
                                    // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                                    key={i}
                                >
                                    <Form.control
                                        title="Titulo de Link"
                                        ico={<i class="fas fa-text" />}
                                        name={
                                            `links.${i}.title` as keyof PostsUpdateDto
                                        }
                                        placeholder="Tribunal Constitucional. (2019)."
                                    />
                                    <Form.control
                                        title="Enlace"
                                        ico={<i class="fas fa-link" />}
                                        name={
                                            `links.${i}.title` as keyof PostsUpdateDto
                                        }
                                        placeholder="https://comunidad.com/tribunal-constitucional-"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => {
                                            sweetModal({
                                                title: "¿Estás seguro de eliminar?",
                                                isCloseInBackground: false,
                                                showConfirmButton: true,
                                            }).then(({ isConfirmed }) => {
                                                if (isConfirmed) {
                                                    linksArray.remove(i);
                                                }
                                            });
                                        }}
                                        className="bg-red-600  px-2 font-bold py-2 rounded-lg  text-white  fill-white"
                                    >
                                        <i class="fas fa-trash" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                linksArray.append({ title: "", url: "" });
                            }}
                            className="bg-primary px-4 font-bold py-2 rounded-lg self-start text-white "
                        >
                            +
                        </button>
                        {postsUpdateDtoForm.formState.errors.links ? (
                            <p className="text-xs text-red-600 font-semibold">
                                {
                                    postsUpdateDtoForm.formState.errors.links
                                        .message
                                }
                            </p>
                        ) : null}
                    </div>

                    <div class="flex justify-center">
                        <Form.button.submit
                            ico={null}
                            disabled={postsUpdateMutation.isLoading || false}
                            isLoading={postsUpdateMutation.isLoading || false}
                            title="Actualizar"
                        />
                    </div>
                </Form>
                <AdminHr />
                <div class="flex justify-between items-center">
                    <h3 class="dark:text-white text-lg lg:text-2xl font-bold uppercase text-center flex gap-2">
                        <i class="fa-solid fa-image" />
                        Editar Imagen
                    </h3>
                </div>
                <Form {...formPostsUpdateImage} onSubmit={onUpdateImagePost}>
                    <Form.control.file
                        name={"image" as keyof PostsImageUpdateDto}
                        title="Image de empresa"
                        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                        typeFile="image"
                        showButonCopy
                    />
                    <div class="flex justify-center">
                        <Form.button.submit
                            disabled={
                                postsUpdateImageMutation.isLoading || false
                            }
                            isLoading={
                                postsUpdateImageMutation.isLoading || false
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

export default PostsUpdate;
