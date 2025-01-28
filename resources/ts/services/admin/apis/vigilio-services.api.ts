import { storageEmpresa } from "@/empresas/stores/empresa.store";
import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";

export function vigilioServicesQuery() {
    return useQuery(
        `${enviroments.VITE_VIGILIO_WEB}/api/information/client`,
        async (url) => {
            const response = await fetch(url);
            const result: {
                success: true;
                information: {
                    whatsappVersion: string;
                    modelai: string;
                    facebook: string;
                    instagram: string;
                    youtube: string;
                    tiktok: string;
                    linkedin: string;
                    twitter: string;
                    modelDeepSeek: string;
                    modelOpenAi: string;
                };
            } = await response.json();
            if (!result.success) throw result;
            return result;
        },
        { isCaching: 6 * 60 * 1000 * 60 } // 6 horas
    );
}
export function vigilioServicesPricingQuery() {
    return useQuery(
        `${enviroments.VITE_VIGILIO_WEB}/api/countries/${storageEmpresa?.dial_code}`,
        async (url) => {
            const response = await fetch(url);
            const result: {
                success: true;
                country: {
                    dial_code: string;
                    id: number;
                    value: string;
                    key: string;
                    map_marker: {
                        lat: number;
                        lng: number;
                    };
                    money: string;
                    simbolo: string;
                    international_simbolo: string;
                    impuesto: number;
                    tipo_impuesto: string;
                    bancos: { key: string; value: string; image: string }[];
                    pricing: {
                        dolar: {
                            facturacion: number | null;
                            mensual: number;
                            tokens: number;
                            telegram: number;
                            email: number;
                        };
                        local: {
                            facturacion: number | null;
                            mensual: number;
                            tokens: number;
                            email: number;
                            telegram: number;
                        };
                    };
                };
            } = await response.json();

            if (!result.success) throw result;
            return result;
        }
        // { isCaching: 6 * 60 * 1000 * 60 } // 6 horas
    );
}
