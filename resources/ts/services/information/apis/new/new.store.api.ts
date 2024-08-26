import type { NewStoreDto } from "@/information/dtos/new.store.dto";
import type { NewSchema } from "@/information/schemas/new.schema";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function newStoreApi(): UseMutation<
	NewStoreApi,
	NewStoreDto,
	NewStoreApiError
> {
	return useMutation("/new", async (url, body) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			method: "POST",
			body: JSON.stringify(body),
			headers: {
				"content-type": "application/json",
			},
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
interface NewStoreApi {
	success: true;
	message: string;
}
interface NewStoreApiError {
	success: true;
	message: string;
	body: keyof NewSchema;
}
