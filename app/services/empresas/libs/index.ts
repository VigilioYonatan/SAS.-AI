import enviroments from "~/config/enviroments.config";
import type { Empresas } from "../entities/empresas.entity";
import type { Settings } from "../entities/settings.entity";

export function BASE_URL(empresa: Empresas) {
    return enviroments.NODE_ENV === "production"
        ? (empresa.setting as Settings)?.host
            ? `https://www.${(empresa.setting as Settings)?.host}`
            : `https://www.${empresa.slug}.vigilio-services.com`
        : `http://${empresa.slug}.localhost:4003`;
}
export const empresasLogoQualities = [100, 300];
export const backgroundQualities = [100, 1000];
// TIPO EMPRESA

export type OtherServicio = 40 | 41 | 42;

export const otherServicio: OtherServicio[] = [40, 41, 42];
export const empresaOTROID = {
    1: 40,
    2: 41,
    3: 42,
};
