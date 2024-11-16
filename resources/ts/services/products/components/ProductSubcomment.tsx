import Form from "~/components/form";
import WebDropdown from "~/components/dropdown/WebDropdown";
import useAuthStore from "@/auth/stores/auth.store";
import { printFileUser } from "@/users/libs/helpers";
import { showTime } from "~/libs/helpers";
import type { SubcommentsSchemaFromServe } from "@/polymorphism/schemas/subcomments.schema";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { useForm } from "react-hook-form";
import { valibotVigilio } from "~/libs/valibot";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import ReactionComment from "./ReactionComment";
import { subcommentsUpdateApi } from "@/polymorphism/apis/subcomments.update.api";
import { subcommentsDestroyApi } from "@/polymorphism/apis/subcomments.destroy.api";
import {
	subcommentsUpdateDto,
	type SubcommentsUpdateDto,
} from "@/polymorphism/dtos/subcomments.update.dto";
import { useDebounce } from "@vigilio/preact-paginator";
import UserShow from "@/users/components/UserShow";
import LoaderSubmit from "~/components/LoaderSubmit";

interface ProductSubCommentProps {
	product_id: number;
	comment_id: number;
	subcomment: SubcommentsSchemaFromServe;
	subcommentRefetch: (commentary_id: number, reaction_id: number) => void;
	subcommentDestroyRefetch: (commentary_id: number) => void;
	type: "ProductsNormals" | "ProductsRestaurants" | "ProductsServicios";
}
function ProductSubcomment({
	product_id,
	comment_id,
	subcomment,
	subcommentRefetch,
	subcommentDestroyRefetch,
	type,
}: ProductSubCommentProps) {
	const subcommentEdit = useSignal<null | { id: number; content: string }>(
		null,
	);

	const userId = useSignal<number | null>(null);
	const userDebounce = useDebounce(userId.value, 200);

	const { state } = useAuthStore();
	const subcommentsUpdateMutation = subcommentsUpdateApi(
		type,
		product_id,
		comment_id,
		subcommentEdit.value?.id!,
	);
	const subcommentsDestroyMutation = subcommentsDestroyApi(
		type,
		product_id,
		comment_id,
	);
	const subcommentsUpdateForm = useForm<SubcommentsUpdateDto>({
		resolver: valibotVigilio(subcommentsUpdateDto),
	});

	function onSubcommentsUpdate(body: SubcommentsUpdateDto) {
		if (!state) return;
		subcommentsUpdateMutation.mutate(body, {
			onSuccess() {
				sweetAlert({ title: "Editado correctamente!" });
				subcommentEdit.value = null;
			},
			onError(error) {
				sweetModal({
					icon: "danger",
					title: "Error en el servidor",
					text: `Comunicarse con el desarrollador ${error}`,
				});
			},
		});
	}
	function onSelectUpdate(props: { id: number; content: string }) {
		subcommentEdit.value = props;
	}
	function onSelectDestroy(id: number) {
		sweetModal({
			title: "Estas seguro de realizar esta acción",
			text: "Se eliminará tu comentario",
			showCancelButton: true,
		}).then(({ isConfirmed }) => {
			if (isConfirmed) {
				subcommentsDestroyMutation.mutate(id, {
					onSuccess() {
						subcommentDestroyRefetch(id);
						sweetAlert({ title: "Eliminado correctamente!" });
					},
					onError(error) {
						sweetModal({
							icon: "danger",
							title: "Error en el servidor",
							text: `Comunicarse con el desarrollador ${error}`,
						});
					},
				});
			}
		});
	}
	function chooseUser(id: number) {
		userId.value = id;
	}
	function unChooseUser() {
		userId.value = null;
	}
	useEffect(() => {
		if (subcommentEdit.value) {
			subcommentsUpdateForm.setValue("content", subcommentEdit.value.content);
		}
	}, [subcommentEdit.value]);

	return (
		<div class="flex gap-4 my-1">
			<button
				type="button"
				onMouseOver={() => chooseUser(subcomment.user.id)}
				onFocus={() => chooseUser(subcomment.user.id)}
				onMouseOut={unChooseUser}
				onBlur={unChooseUser}
				class="relative  flex flex-col gap-1 justify-center items-center dark:text-principal-light text-principal-"
			>
				<img
					class="rounded-full w-[50px] h-[50px]"
					width={50}
					height={50}
					src={printFileUser(subcomment.user.photo)[0]}
					alt={subcomment.user.username}
				/>
				<span class="text-[10px]">{subcomment.user.username}</span>
				{userDebounce ? <UserShow id={userDebounce} /> : null}
			</button>
			<div class="flex justify-between w-full">
				<div class="flex flex-col w-full dark:text-white">
					{subcomment.id === subcommentEdit.value?.id ? (
						<Form
							className="w-full"
							onSubmit={onSubcommentsUpdate}
							{...subcommentsUpdateForm}
						>
							<input
								type="text"
								className="outline-none py-1 rounded-md px-2 border bg-transparent border-primary w-full dark:bg-paper-dark"
								{...subcommentsUpdateForm.register("content")}
							/>
							{subcommentsUpdateForm.formState.errors.content ? (
								<p class="text-xs text-red-600">
									{subcommentsUpdateForm.formState.errors.content.message}
								</p>
							) : (
								<></>
							)}
							<button
								disabled={subcommentsUpdateMutation.isLoading || false}
								aria-label="update commentary"
								class="bg-orange-600 px-4 py-1 rounded-md text-xs text-white"
								type="submit"
							>
								{subcommentsUpdateMutation.isLoading ? (
									<LoaderSubmit />
								) : (
									"Actualizar"
								)}
							</button>
						</Form>
					) : (
						<span class="dark:text-principal-light text-principal-">
							{subcomment.content}
						</span>
					)}
					<div class="flex gap-2 items-center ">
						<span class="text-xs dark:text-principal-light text-principal-">
							{showTime(subcomment.createdAt!)}
						</span>
						<span class="text-xs dark:text-principal-light text-principal-">
							{subcomment.createdAt !== subcomment.updatedAt ? "(editado)" : ""}
						</span>
					</div>
				</div>
				<div class="flex flex-col items-center">
					<ReactionComment
						reactions={subcomment.reactions}
						type="subcomments"
						id={subcomment.id}
						refetch={subcommentRefetch}
					/>
					<>
						{state?.id === subcomment.user_id ? (
							<>
								<WebDropdown
									triggerChildren={({ onOpen }) => (
										<button type="button" onClick={onOpen} aria-label="open">
											<i class="fas fa-ellipsis-v dark:text-principal-light text-principal-dark" />
										</button>
									)}
									className="min-w-[60px] top-0  dark:text-principal-light text-principal-dark"
								>
									<div class="flex flex-col">
										<button
											type="button"
											class=" rounded-md flex items-center gap-2 text-xs py-1"
											onClick={() =>
												onSelectUpdate({
													id: subcomment.id,
													content: subcomment.content,
												})
											}
										>
											<i class="fa-solid fa-pen" /> Editar
										</button>

										<button
											onClick={() => onSelectDestroy(subcomment.id)}
											disabled={subcommentsDestroyMutation.isLoading || false}
											type="button"
											class=" rounded-md flex items-center gap-2 text-xs py-1"
										>
											<i class="fa-solid fa-trash" />
											Eliminar
										</button>
									</div>
								</WebDropdown>
							</>
						) : null}
					</>
				</div>
			</div>
		</div>
	);
}

export default ProductSubcomment;
