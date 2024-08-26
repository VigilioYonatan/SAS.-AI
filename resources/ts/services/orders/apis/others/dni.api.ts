import enviroments from "~/config";
import { useMutation, type UseMutation } from "@vigilio/preact-fetching";

export type DniApiMutation = UseMutation<DniAPI, string, DniErrorAPI>;
export function dniApi(): DniApiMutation {
	return useMutation("/peru/dni", async (url, dni) => {
		const response = await fetch(
			`${enviroments.VITE_VIGILIO_WEB}/api${url}/${dni}`,
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

export interface DniAPI {
	success: boolean;
	data: Data;
}

export interface Data {
	numero: string;
	nombre_completo: string;
	nombres: string;
	apellido_paterno: string;
	apellido_materno: string;
	codigo_verificacion: string;
	fecha_nacimiento: string;
	sexo: string;
	estado_civil: string;
	departamento: string;
	provincia: string;
	distrito: string;
	direccion: string;
	direccion_completa: string;
	ubigeo_reniec: string;
	ubigeo_sunat: null;
	ubigeo: string[];
}

export interface DniErrorAPI {
	success: false;
	message: string;
}
