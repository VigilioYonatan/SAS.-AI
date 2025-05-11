import Form from "~/components/form";
import { useFieldArray, useForm } from "react-hook-form";
import useAuthstore from "@/auth/stores/auth.store";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import { postsStoreApi } from "../apis/posts.store.api";
import { postsStoreDto, type PostsStoreDto } from "../dtos/posts.store.dto";
import FormControlEditor from "~/components/form/FormControlEditor";

interface PoststoreProps {
    onClose: () => void;
    refetch: (clean?: boolean) => void;
}
function PostsStore({ onClose, refetch }: PoststoreProps) {
    const { guards } = useAuthstore();
    if (!guards.permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const postsStoreDtoForm = useForm<PostsStoreDto>({
        resolver: valibotVigilio(postsStoreDto),
        mode: "all",
        defaultValues: { enabled: true },
    });
    const linksArray = useFieldArray({
        control: postsStoreDtoForm.control,
        name: "links",
    });

    const postsStoreMutation = postsStoreApi();

    function onAddPost(body: PostsStoreDto) {
        sweetModal({
            title: "¿Estás seguro de agregar un post?",
            customIcon:
                "<i class='fas fa-newspaper text-3xl dark:text-white' ></i>",
            isCloseInBackground: false,
            showCancelButton: true,
            showCloseButton: true,
        }).then(({ isConfirmed }) => {
            if (isConfirmed) {
                postsStoreMutation.mutate(body, {
                    onSuccess(data) {
                        sweetAlert({
                            icon: "success",
                            title: `se agregó un post ${data.post.id} correctamente`,
                        });
                        refetch(false);
                        postsStoreDtoForm.reset();
                        onClose();
                    },
                    onError(error) {
                        handlerError(postsStoreDtoForm, error);
                    },
                });
            }
        });
    }

    return (
        <div class="text-start">
            <Form {...postsStoreDtoForm} onSubmit={onAddPost}>
                <div class="flex justify-between items-center">
                    <h3 class="dark:text-white text-xl font-bold uppercase text-center flex gap-2 items-center">
                        <i class="fas fa-newspaper" />
                        Agregar Blog
                    </h3>
                    <Form.button.reset />
                </div>
                <div class="grid md:grid-cols-2 items-center gap-2">
                    <Form.control
                        title="Título"
                        ico={<i class="fas fa-text" />}
                        name={"title" as keyof PostsStoreDto}
                    />
                    <Form.control
                        title="SEO Título"
                        ico={<i class="fab fa-google" />}
                        name={"seo_title" as keyof PostsStoreDto}
                        question={
                            <div>
                                En los buscadores de google se buscará por el
                                seo título (meta title). <br />
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
                        name={"keywords" as keyof PostsStoreDto}
                        question={
                            <div>
                                Personalizar los keywords SEO (meta keywords).{" "}
                                <br />
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
                        name={"slug" as keyof PostsStoreDto}
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
                        name={"date" as keyof PostsStoreDto}
                    />
                    <Form.control.toggle
                        title="Mostrar blog"
                        name={"enabled" as keyof PostsStoreDto}
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
                    name={"content" as keyof PostsStoreDto}
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
                                        `links.${i}.title` as keyof PostsStoreDto
                                    }
                                    placeholder="Tribunal Constitucional. (2019)."
                                />
                                <Form.control
                                    title="Enlace"
                                    ico={<i class="fas fa-link" />}
                                    name={
                                        `links.${i}.title` as keyof PostsStoreDto
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
                    {postsStoreDtoForm.formState.errors.links ? (
                        <p className="text-xs text-red-600 font-semibold">
                            {postsStoreDtoForm.formState.errors.links.message}
                        </p>
                    ) : null}
                </div>

                <Form.control.file
                    name={"image" as keyof PostsStoreDto}
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                    title="Imagen"
                    typeFile="image"
                    showButonCopy
                />
                <div class="flex justify-center">
                    <Form.button.submit
                        ico={null}
                        disabled={postsStoreMutation.isLoading || false}
                        isLoading={postsStoreMutation.isLoading || false}
                        title="Guardar"
                    />
                </div>
            </Form>
        </div>
    );
}

export default PostsStore;
