import Loading from "@/admin/components/Loading";
import View404 from "@/admin/views/404";
import { printFileUser } from "@/users/libs/helpers";
import { postsShowApi } from "../apis/posts.show.api";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import { postsDestroyApi } from "../apis/posts.destroy.api";
import { formatDateTwo } from "~/libs/helpers";
import enviroments from "~/config";

interface PostsShowProps {
    id: number;
    onClose: () => void;
    refetch: (clean?: boolean) => void;
}
function PostsShow({ id, onClose, refetch }: PostsShowProps) {
    const postshowIndex = postsShowApi(id);

    let component = null;
    if (postshowIndex.isLoading) {
        component = <Loading />;
    }

    if (postshowIndex.isError) {
        component = (
            <View404 message={`No se encontró un post con el id ${id}`} />
        );
    }
    if (postshowIndex.isSuccess) {
        const post = postshowIndex.data!.post;
        const postsDestroyMutation = postsDestroyApi();
        component = (
            <div class="flex gap-4 flex-wrap justify-center  font-semibold">
                <div class="flex-1 min-w-[250px]">
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            ID:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {post.id}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Contenido:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide h-[400px] overflow-auto">
                            {post.content}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Imagen:
                        </span>
                        {post.image ? (
                            <img
                                width={100}
                                height={100}
                                src={printFileUser(post.image, 100)[0]}
                                alt=""
                            />
                        ) : (
                            "No se subió imagen"
                        )}
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Acciones:
                        </span>
                        <button
                            class="px-4 py-2 rounded-md bg-red-600 flex items-center  text-white self-start"
                            type="button"
                            aria-label="button to delete post"
                            onClick={() => {
                                sweetModal({
                                    title: "Estas seguro?",
                                    text: `Quieres eliminar este producto <b>${post.title}</b>`,
                                    icon: "danger",
                                    showCancelButton: true,
                                    confirmButtonText: "Si, Eliminar!",
                                    showCloseButton: true,
                                }).then((result) => {
                                    if (result.isConfirmed) {
                                        postsDestroyMutation.mutate(post.id, {
                                            onSuccess: () => {
                                                sweetAlert({
                                                    icon: "success",
                                                    title: `El post ${post.id} fue eliminado correctamente`,
                                                });
                                                refetch();
                                                onClose();
                                            },
                                            onError: (error) => {
                                                sweetModal({
                                                    icon: "danger",
                                                    text: `El post ${
                                                        post.id
                                                    } no fue eliminado, :${JSON.stringify(
                                                        error
                                                    )}`,
                                                    title: "Error!",
                                                });
                                            },
                                        });
                                    }
                                });
                            }}
                        >
                            <i class="fa-solid text-sm fa-trash px-1" />
                            <span class="text-xs">Eliminar</span>
                        </button>
                    </div>
                </div>
                <div class="flex-1 min-w-[250px]">
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            SEO title:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {post.seo_title || "no ingresado"}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            SEO keywords:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {post.keywords || "no ingresado"}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            slug:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {post.slug || "no ingresado"}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            links:
                        </span>
                        {post.links.length ? (
                            <table
                                class={`text-lg  font-medium w-full  overflow-hidden  ${
                                    enviroments.TYPE_BORDER === "circle"
                                        ? "rounded-md"
                                        : ""
                                }`}
                            >
                                <tbody>
                                    {post.links.map((link) => (
                                        <tr
                                            class="text-sm h-[40px]  odd:bg-[#f9f9f9]"
                                            key={link.url}
                                        >
                                            <td>
                                                <span class="font-semibold px-2 dark:text-white ">
                                                    {link.title}
                                                </span>
                                            </td>
                                            <td>
                                                <span class="font-normal dark:text-white px-2">
                                                    {link.url}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <span class="dark:text-white text-sm">
                                No se insertó caracteristicas a este producto
                            </span>
                        )}
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Creado:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {formatDateTwo(post.date!)}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Subido por:
                        </span>
                        <div>
                            <span class="dark:text-white">
                                {post.user.username}
                            </span>
                            <img
                                class="w-[60px] rounded-full"
                                width={100}
                                height={100}
                                src={printFileUser(post.user.photo, 100)[0]}
                                alt=""
                            />
                        </div>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Creado:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {formatDateTwo(post.createdAt!)}
                        </span>
                    </div>
                    <div class="flex gap-1 flex-col mb-3 odd:bg-paper-light odd:dark:bg-admin-terciary rounded-md p-2">
                        <span class="text-primary dark:text-terciary font-bold">
                            Actualizado:
                        </span>
                        <span class="dark:text-secondary-light text-secondary-dark tracking-wide">
                            {formatDateTwo(post.updatedAt!)}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
    return component;
}

export default PostsShow;
