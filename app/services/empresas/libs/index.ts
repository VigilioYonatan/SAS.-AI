import enviroments from "~/config/enviroments.config";
import type { Empresas } from "../entities/empresas.entity";
import type { Settings } from "../entities/settings.entity";
import { Regions } from "@/ubigeo/entities/regions.entity";
import { Countries } from "@/ubigeo/entities/countries.entity";
import { RegionsEmpresa } from "@/ubigeo/entities/regions_empresa.entity";
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
        : `http://www.${empresa.slug}.localhost:4003`;
}
export const empresasLogoQualities = [100, 300];
export const empresasLogoPWAQualities = [73, 94, 145, 153, 193, 513];
export const backgroundQualities = [100, 1600];
export const bannersQualities = [0, 300, 600, 800, 1200];
// TIPO EMPRESA

export type OtherServicio = 40 | 41 | 42;

export const otherServicio: OtherServicio[] = [40, 41, 42];
export const empresaOTROID = {
    1: 40,
    2: 41,
    3: 42,
};

export function gridEmpresa(width: number[]): {
    width: number;
    height: number;
    gap: number;
    cols: number;
    rows: number;
    title: null;
}[] {
    return width.map((grid) => ({
        width: grid,
        height: 200,
        rows: 1,
        cols: 3,
        gap: 1,
        title: null,
    }));
}

export async function regionsCountry(empresa: Empresas) {
    const regions = await Regions.findAll({
        include: [
            {
                model: Countries,
                where: {
                    code: empresa.dial_code,
                },
                required: true,
                attributes: ["code"],
            },
        ],
    });

    const allData = await Promise.all(
        regions.map(async (data) => {
            const regionsEmpresa = await RegionsEmpresa.findOne({
                where: {
                    empresa_id: empresa.id,
                    region_id: data.id,
                },
            });
            return {
                ...data.toJSON(),
                priceShipping: regionsEmpresa?.priceShipping,
                enabled: regionsEmpresa?.enabled,
                days: regionsEmpresa?.days,
            };
        })
    );
    return allData.map((c) => ({
        name: c.name,
        price: c.priceShipping,
        days: c.days,
        enabled: c.enabled,
    }));
}
