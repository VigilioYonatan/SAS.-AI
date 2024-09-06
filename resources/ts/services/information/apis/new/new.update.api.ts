import { useMutation } from "@vigilio/preact-fetching";
import type { NewStoreDto } from "@/information/dtos/new.store.dto";

export function webUpdateApi(id: number) {
	return useMutation<NewUpdateAPI, NewStoreDto, NewUpdateErrorAPI>(
		`/new/${id}`,
		async (url, body) => {
			const response = await fetch(`/api${url}`, {
				method: "PUT",
				body: JSON.stringify(body),
				headers: {
					"Content-type": "application/json",
				},
			});
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface NewUpdateAPI {
	success: boolean;
	message: string;
}

export interface NewUpdateErrorAPI {
	success: boolean;
	body: keyof NewStoreDto;
	message: string;
}
