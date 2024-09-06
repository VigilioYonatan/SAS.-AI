import enviroments from "~/config/enviroments.config";
import type { InformationEntity } from "../entities/information.entity";
import type { Settings } from "../entities/settings.entity";

export function BASE_URL(information: InformationEntity) {
	return enviroments.NODE_ENV === "production"
		? (information.setting as Settings)?.host
			? `https://www.${(information.setting as Settings)?.host}`
			: `https://www.${information.slug}.vigilio-services.com`
		: `http://${information.slug}.localhost:4003`;
}
export const informationLogoQualities = [100, 300];
export const backgroundQualities = [100, 1000];
// TIPO EMPRESA

export type OtherServicio = 40 | 41 | 42;

export const otherServicio: OtherServicio[] = [40, 41, 42];
export const INFORMATIONOTROID = {
	1: 40,
	2: 41,
	3: 42,
};
