import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
export async function vigilioServicesempresa() {
    const vigilio = await fetch(
        `${enviroments.VITE_VIGILIO_WEB}/api/webs/${process.env.VITE_VIGILIO_TOKEN}`
    );
    const responseV = await vigilio.json();
    if (!vigilio.ok)
        throw new Error(
            "Error al encontrar informacion de la web.Error en la web de vigilio services-"
        );
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    const clean = responseV.web.technologies.map((tech: any) => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const { technology, ...rest } = tech as any;
        return {
            ...rest,
        };
    });
    return { success: true, result: { ...responseV.web, technologies: clean } };
}
export function vigilioVersionLatests() {
    return useQuery<
        {
            success: boolean;
            version: {
                versionamiento: string;
                description: string;
                sql_command: string;
                is_latest: boolean;
                changes: string;
            };
        },
        { success: false; message: string }
    >(
        `${enviroments.VITE_VIGILIO_WEB}/api/version/latest`,
        async (url) => {
            const vigilio = await fetch(url);
            const responseV = await vigilio.json();
            if (!vigilio.ok)
                throw new Error(
                    "Error al encontrar informacion de la web.Error en la web de vigilio services-"
                );
            return responseV;
        },
        { isCaching: 60 * 3600 * 500 }
    );
}
