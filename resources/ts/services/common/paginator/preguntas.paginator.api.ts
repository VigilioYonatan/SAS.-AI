import enviroments from "~/config";
import { type UseQuery, useQuery } from "@vigilio/preact-fetching";

export function preguntasIndexApi(): UseQuery<
	PreguntasIndexAPI,
	PreguntasIndexErrorAPI
> {
	return useQuery<PreguntasIndexAPI, PreguntasIndexErrorAPI>(
		"/preguntas",
		async (url) => {
			const response = await fetch(`${enviroments.VITE_VIGILIO_WEB}/api${url}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{ isCaching: 60 * 1000 * 60 * 24 },
	);
}

export interface PreguntasIndexAPI {
	success: boolean;
	data: { id: number; title: string; description: string }[];
}

export interface PreguntasIndexErrorAPI {
	success: boolean;
	message: string;
}
