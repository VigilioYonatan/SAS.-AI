import Form from "~/components/form";
import { useForm } from "react-hook-form";
import useAuthstore from "@/auth/stores/auth.store";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { handlerError } from "~/libs/helpers";
import { postsStoreApi } from "../apis/posts.store.api";
import { postsStoreDto, type PostsStoreDto } from "../dtos/posts.store.dto";

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
    });
    const postsStoreMutation = postsStoreApi();

    function onAddPost(body: PostsStoreDto) {
        sweetModal({
            title: "¿Estás seguro de agregar un post?",
            customIcon:
                "<i class='fas fa-newspaper text-3xl dark:text-white' ></i>",
            showCloseButton: true,
            showCancelButton: true,
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
                        Agregar Post
                    </h3>
                    <Form.button.reset />
                </div>
                <Form.control
                    title="Título"
                    name={"title" as keyof PostsStoreDto}
                />
                <Form.control.area
                    title="Contenido"
                    name={"content" as keyof PostsStoreDto}
                />

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
