import useAuthStore from "@/auth/stores/auth.store";
import { openAuth } from "@/auth/views/AuthLogin";
import { reactionsDestroyApi } from "@/polymorphism/apis/reactions.destroy.api";
import { reactionsStoreApi } from "@/polymorphism/apis/reactions.store.api";
import type { ReactionsSchema } from "@/polymorphism/schemas/reactions.schema";
import { sweetAlert, sweetModal } from "@vigilio/sweet";
import confetti from "canvas-confetti";

interface ReactionCommentProps {
	reactions: Pick<ReactionsSchema, "id" | "isLike" | "user_id">[];
	type: "comments" | "subcomments";
	id: number;
	refetch: (commentary_id: number, reaction_id: number) => void;
}
function ReactionComment(props: ReactionCommentProps) {
	const { state } = useAuthStore();

	const reactionsStoreMutation = reactionsStoreApi(props.type, props.id);
	const reactionsUpdateMutation = reactionsDestroyApi(props.type, props.id);

	// si su reacción existe
	const findByUserId = props.reactions.find(
		(reaction) => reaction.user_id === state?.id,
	);

	function onReaction() {
		if (!state) {
			openAuth();
			return;
		}
		if (!findByUserId) {
			reactionsStoreMutation.mutate(
				{ isLike: true },
				{
					onSuccess(data) {
						props.refetch(props.id, data.reaction.id);
						sweetAlert({
							title: "Se agregó reacción a este comentario correctamente.",
							icon: "success",
						});
						confetti({
							angle: 90,
							spread: 360,
							startVelocity: 40,
							colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
						});
					},
					onError(error) {
						sweetModal({
							icon: "danger",
							title: "Error en el servidor",
							text: `Comunicarse con el desarrollador ${error.message}.`,
						});
					},
				},
			);
			return;
		}
		reactionsUpdateMutation.mutate(findByUserId.id, {
			onSuccess() {
				props.refetch(props.id, findByUserId.id);
				sweetAlert({
					title: "Se quitó la reacción a este comentario correctamente.",
					icon: "success",
				});
			},
			onError(error) {
				sweetModal({
					icon: "danger",
					title: "Error en el servidor",
					text: `Comunicarse con el desarrollador ${error.message}`,
				});
			},
		});
	}
	return (
		<button
			type="button"
			class="w-[30px] h-[30px] rounded-md flex flex-col items-center"
			onClick={onReaction}
			disabled={
				reactionsStoreMutation.isLoading ||
				reactionsUpdateMutation.isLoading ||
				false
			}
		>
			{findByUserId ? (
				<i class="fa-solid fa-heart text-primary" />
			) : (
				<i class="far fa-heart text-primary" />
			)}
			<span class="text-xs dark:text-principal-light text-principal-">
				{props.reactions.length}
			</span>
		</button>
	);
}

export default ReactionComment;
