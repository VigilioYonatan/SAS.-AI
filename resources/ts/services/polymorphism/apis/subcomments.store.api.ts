import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { SubcommentsSchema } from "@/polymorphism/schemas/subcomments.schema";
import type { SubcommentsStoreDto } from "../dtos/subcomments.store.dto";

export function subcommentsStoreApi(
	commentables_type: string,
	commentables_id: number,
	subcommentables_id: number,
) {
	return useMutation<
		SubcommentsStoreAPI,
		SubcommentsStoreDto,
		SubcommentsStoreErrorAPI
	>(
		`/comments/${commentables_type}/${commentables_id}/subcomments/${subcommentables_id}`,
		async (url, body) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
				body: JSON.stringify(body),
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
			});
			const result = await response.json();

			if (!result.success) throw result;
			return result;
		},
	);
}

export interface SubcommentsStoreAPI {
	success: boolean;
	subcomment: SubcommentsSchema;
}

export interface SubcommentsStoreErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
