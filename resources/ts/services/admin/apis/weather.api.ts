import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function weatherApi() {
	return useQuery<WeatherAPI, unknown>(
		`/peru/weather/${storageEmpresa?.dial_code}`,
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
interface WeatherAPI {
	success: true;
	weather: {
		temperature: string;
		viento: string;
		humedad: string;
		image: string;
	};
}
