import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import type { ReactionsUpdateDto } from "@/polymorphism/dtos/reactions.update.dto";
import type { ReactionsSchema } from "@/polymorphism/schemas/reactions.schema";

export function reactionsUpdateApi(
	reactionsable_type: string,
	reactionsable_id: number,
) {
	return useMutation<
		ReactionsUpdateAPI,
		ReactionsUpdateDto & { id: number },
		ReactionsUpdateErrorAPI
	>(
		`/reactions/${reactionsable_type}/${reactionsable_id}`,
		async (url, body) => {
			const { id, ...rest } = body;
			const response = await fetch(`${enviroments.VITE_URL}/api${url}/${id}`, {
				body: JSON.stringify(rest),
				method: "PUT",
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

export interface ReactionsUpdateAPI {
	success: boolean;
	reaction: ReactionsSchema;
}

export interface ReactionsUpdateErrorAPI {
	success: boolean;
	message: string;
	body: string;
}
