import enviroments from "~/config";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";

export type RucMutation = UseMutation<RucAPI, string, RucV1ErrorAPI>;
export function rucApi(): RucMutation {
	return useMutation("/peru/ruc", async (url, ruc) => {
		const response = await fetch(
			`${enviroments.VITE_VIGILIO_WEB}/api${url}/${ruc}`,
			{
				headers: {
					"access-token": enviroments.VITE_TOKEN_VIGILIO_SERVICES,
				},
			},
		);
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface RucAPI {
	success: boolean;
	result: {
		ruc: string;
		dni: string;
		tipo_ruc: string;
		razon_social: string;
		estado: string;
		habido: string;
		ubigeo: string;
		direccion: string;
		departamento: string;
		provincia: string;
		distrito: string;
		link: string;
	};
}

interface RucV1ErrorAPI {
	success: false;
	message: string;
}
