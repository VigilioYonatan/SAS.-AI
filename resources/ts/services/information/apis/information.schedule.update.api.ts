import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import type { ScheduleSchema } from "../schemas/information.schema";
export function informationScheduleUpdateApi(): UseMutation<
	InformationScheduleUpdateApi,
	{ schedule: ScheduleSchema[] },
	InformationScheduleUpdateApiError
> {
	return useMutation("/information/schedule", async (url, body) => {
		const response = await fetch(`/api${url}`, {
			method: "PUT",
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

interface InformationScheduleUpdateApi {
	success: true;
	message: string;
}
interface InformationScheduleUpdateApiError {
	success: true;
	message: string;
	body: keyof ScheduleSchema;
}
