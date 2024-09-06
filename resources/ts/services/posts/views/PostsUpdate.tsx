import Form from "~/components/form";
import { useForm } from "react-hook-form";
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
		component = <View404 message={`No se encontró un proveedor: ${id}`} />;
	}
	if (postsQuery.isSuccess) {
		const post = postsQuery.data!.post;
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
				const image = await getFilesEdit(post.image, 500);
				formPostsUpdateImage.setValue("image", image);
			}
		}

		useEffect(() => {
			initialUpdateImage();
		}, []);

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
					<Form.control title="Título" name={"title" as keyof PostsUpdateDto} />
					<Form.control.area
						title="Contenido"
						name={"content" as keyof PostsUpdateDto}
					/>

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
					/>
					<div class="flex justify-center">
						<Form.button.submit
							disabled={postsUpdateImageMutation.isLoading || false}
							isLoading={postsUpdateImageMutation.isLoading || false}
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
