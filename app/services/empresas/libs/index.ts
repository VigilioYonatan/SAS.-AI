import enviroments from "~/config/enviroments.config";
import type { Empresas } from "../entities/empresas.entity";
import type { Settings } from "../entities/settings.entity";
export enum DIALCODE {
	mexico = "52",
	peru = "51",
	españa = "34",
}

export function BASE_URL(empresa: Empresas) {
	return enviroments.NODE_ENV === "production"
		? (empresa.setting as Settings)?.host.host &&
			(empresa.setting as Settings)?.host.enabled
			? `https://www.${(empresa.setting as Settings)?.host.host}`
			: `https://www.${empresa.slug}.vigilio-services.com`
		: `http://${empresa.slug}.localhost:4003`;
}
export const empresasLogoQualities = [100, 300];
export const empresasLogoPWAQualities = [73, 94, 145, 153, 193, 513];
export const backgroundQualities = [100, 1000];
// TIPO EMPRESA

export type OtherServicio = 40 | 41 | 42;

export const otherServicio: OtherServicio[] = [40, 41, 42];
export const empresaOTROID = {
	1: 40,
	2: 41,
	3: 42,
};
