import enviroments from "~/config";
import { useMutation } from "@vigilio/preact-fetching";

export function subcommentsDestroyApi(
	commentables_type: string,
	commentables_id: number,
	subcommentables_id: number,
) {
	return useMutation<SubcommentsDestroyAPI, number, SubcommentsDestroyErrorAPI>(
		`/comments/${commentables_type}/${commentables_id}/subcomments/${subcommentables_id}`,
		async (url, id) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}/${id}`, {
				method: "DELETE",
			});
			const result = await response.json();

			if (!result.success) throw result;
			return result;
		},
	);
}

export interface SubcommentsDestroyErrorAPI {
	success: boolean;
	message: string;
}
export interface SubcommentsDestroyAPI {
	success: boolean;
	message: string;
}
