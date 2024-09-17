import { useMutation, type UseMutation } from "@vigilio/preact-fetching";
import { ScheduleSchema } from "../schemas/empresas.schema";
export function empresaScheduleUpdateApi(): UseMutation<
	empresaScheduleUpdateApi,
	{ schedule: ScheduleSchema[] },
	empresaScheduleUpdateApiError
> {
	return useMutation("/empresas/schedule", async (url, body) => {
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

interface empresaScheduleUpdateApi {
	success: true;
	message: string;
}
interface empresaScheduleUpdateApiError {
	success: true;
	message: string;
	body: keyof ScheduleSchema;
}
