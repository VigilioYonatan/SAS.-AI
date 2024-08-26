import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function webNewsApi(location: string) {
	return useQuery<WebsNewAPI, unknown>(
		`/peru/news/${location}`,
		async (url) => {
			const response = await fetch(
				`${enviroments.VITE_VIGILIO_WEB}/api${url}`,
				{
					headers: {
						"access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
					},
				},
			);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{ retry: 2 },
	);
}
interface WebsNewAPI {
	success: true;
	news: {
		fuente: string;
		image: string | null;
		title: string;
		uri: string;
		description: string;
	}[];
}
