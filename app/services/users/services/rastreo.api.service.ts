import { Injectable } from "@vigilio/express-core";
import { getBrowser, getInformationWithIP, getOS, ROLES } from "../libs";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { VisitantesEntity } from "../entities/visitantes.entity";
import cache from "@vigilio/express-core/cache";
import { VisitantesPagesEntity } from "../entities/visitantes_pages.entity";
import { getTime } from "~/libs/dayjs";
import { Op } from "sequelize";
import cron from "node-cron";
import type { AuthUser } from "@/auth/types";
import type { VisitantesPageDto } from "../dtos/visitantes.page.dto";

export interface RastreoStoreProps {
    empresa: Empresas;
    user: AuthUser;
    realIp: string;
    userAgent: string;
    body: VisitantesPageDto;
}
@Injectable()
export class RastreoApiService {
    async store({ empresa, realIp, userAgent, body, user }: RastreoStoreProps) {
        const { event, token } = body;
        if (user && [ROLES.admin, ROLES.trabajador].includes(user.role_id)) {
            return {
                success: true,
                message: "Succelly and not modified",
            };
        }

        // Parse user agent information
        const os = getOS(userAgent);
        const browser = getBrowser(userAgent);

        // Try to get visitor from cache
        let visitante = JSON.parse(
            cache.get(`visitante:${empresa.id}:${token}`) || "null"
        );

        // If not in cache, try database
        if (!visitante) {
            visitante = await VisitantesEntity.findOne({
                where: {
                    key: token,
                    os,
                    browser,
                    empresa_id: empresa.id,
                },
            });

            // Cache for 24 hours if found
            if (visitante) {
                cache.set(
                    `visitante:${empresa.id}:${token}`,
                    JSON.stringify(visitante),
                    24 * 60 * 60 * 1000 // 24 hours in milliseconds
                );
            }
        }

        // If visitor doesn't exist, create new record
        if (!visitante) {
            const ipInfo = await getInformationWithIP(); // You might want to pass the IP here
            visitante = await VisitantesEntity.create({
                key: token,
                ip: realIp,
                browser,
                os,
                ubicacion: ipInfo || "error - ip",
                empresa_id: empresa.id,
            });
        }
        const { startOfToday, endOfToday } = getTime(empresa);
        let pageVisitanteExist = JSON.parse(
            cache.get(
                `rastreo:${visitante.id}:${startOfToday}:${event.page}`
            ) || "null"
        );

        if (!pageVisitanteExist) {
            pageVisitanteExist = await VisitantesPagesEntity.findOne({
                where: {
                    visitante_id: visitante.id,
                    page: event.page,
                    empresa_id: empresa.id,
                    createdAt: {
                        [Op.between]: [startOfToday, endOfToday],
                    },
                },
            });

            cache.set(
                `rastreo:${visitante.id}:${startOfToday}:${event.page}`,
                JSON.stringify(pageVisitanteExist),
                10 * 60 * 1000 // 10 minutos
            );
        }

        if (!pageVisitanteExist) {
            pageVisitanteExist = await VisitantesPagesEntity.create({
                visitante_id: visitante.id,
                page: event.page,
                time: event.time || 0,
                click: event.click || 0,
                scroll: event.scroll || 0,
                visit: 1,
                empresa_id: empresa.id,
            });
        }

        if (pageVisitanteExist) {
            const rastro = JSON.parse(cache.get("rastreo-clicked") || "[]") as {
                id: number;
                time: number;
                scroll: number;
                click: number;
                visit: number;
                empresa_id: number;
            }[];

            const findRastro = rastro.find(
                (ras) => ras.id === pageVisitanteExist.id
            );
            if (findRastro) {
                const mapped = rastro.map((ras) => {
                    if (ras.id === findRastro.id) {
                        const visit = pageVisitanteExist.visit;

                        const result = {
                            id: pageVisitanteExist.id,
                            page: event.page,
                            time: pageVisitanteExist.time + (event.time || 0),
                            click:
                                pageVisitanteExist.click + (event.click || 0),
                            scroll:
                                pageVisitanteExist.scroll + (event.scroll || 0),
                            visit: event.isVisit ? visit + 1 : visit,
                            visitante_id: pageVisitanteExist.visitante_id,
                            empresa_id: empresa.id,
                        };
                        cache.set(
                            `rastreo:${visitante.id}:${startOfToday}:${event.page}`,
                            JSON.stringify(result),
                            10 * 60 * 1000 // 10 minutos
                        );
                        return result;
                    }
                    return ras;
                });

                cache.set("rastreo-clicked", JSON.stringify(mapped));
            } else {
                const result = {
                    id: pageVisitanteExist.id,
                    page: event.page,
                    time: pageVisitanteExist.time + (event.time || 0),
                    click: pageVisitanteExist.click + (event.click || 0),
                    scroll: pageVisitanteExist.scroll + (event.scroll || 0),
                    visit: event.isVisit
                        ? pageVisitanteExist.visit + 1
                        : pageVisitanteExist.visit,
                    visitante_id: pageVisitanteExist.visitante_id,
                    empresa_id: empresa.id,
                };
                cache.set(
                    "rastreo-clicked",
                    JSON.stringify([...rastro, result])
                );
            }
        }
    }
}

// cada 1 minuto actualizar
cron.schedule("* * * * *", async () => {
    const rastros = JSON.parse(cache.get("rastreo-clicked") || "[]") as {
        id: number;
        time: number;
        click: number;
        scroll: number;
        visit: number;
        empresa_id: number;
    }[];
    try {
        await Promise.all(
            rastros.map(async (rastro) => {
                const { id, empresa_id, ...rest } = rastro;

                await VisitantesPagesEntity.update(
                    {
                        time: rest.time,
                        click: rest.click,
                        scroll: rest.scroll,
                        visit: rest.visit,
                    },
                    { where: { id, empresa_id } }
                );
            })
        );
    } catch (error) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log({ error: (error as Error).message });
    }
    cache.delete("rastreo-clicked");
});
