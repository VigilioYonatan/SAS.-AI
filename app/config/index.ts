import path from "node:path";
import enviroments from "./enviroments.config";
import cors from "cors";
import { Settings } from "@/empresas/entities/settings.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Op, Sequelize } from "sequelize";
import cache from "@vigilio/express-core/cache";

export const dirMode =
    enviroments.NODE_ENV === "production"
        ? path.resolve(__dirname, "..", "..", "..")
        : path.resolve(__dirname, "..", "..");

export const corsOptions: cors.CorsOptions = {
    origin: async (origin, callback) => {
        let hosts: string[] | null = JSON.parse(cache.get("HOSTS") || "null");
        if (!hosts) {
            const empresas = await Empresas.unscoped().findAll({
                include: [
                    {
                        model: Settings,
                        //   dominio.com
                        where: Sequelize.where(
                            Sequelize.literal(`host->>'host'`), // Extrae el valor de 'dominio' dentro de 'host'
                            {
                                [Op.ne]: null,
                            } // Compara con el valor que necesitas
                        ),
                        required: true,
                        attributes: ["host"],
                    },
                ],
                attributes: ["id", "slug"],
            });
            hosts = empresas.map(
                (emp) => `https://www.${emp.setting.host.host}`
            );
            cache.set("HOSTS", JSON.stringify(hosts));
        }

        // Aquí puedes agregar lógica para permitir subdominios
        const allowedOrigins = [
            "https://*.vigilio-services.com",
            `http://*.localhost:${enviroments.PORT}`,
            "https://vigilioservices2.loca.lt",
            `https://${enviroments.CLIENT.toLowerCase()}.vigilio-services.com`,
            ...hosts,
        ];
        // Agrega los dominios y subdominios permitidos
        if (
            !origin ||
            allowedOrigins.some((allowedOrigin) =>
                new RegExp(allowedOrigin.replace(/\*/g, ".*")).test(origin)
            )
        ) {
            callback(null, true); // Permitir origen
        } else {
            callback(new Error("Not allowed by CORS")); // No permitir origen
        }
    },
    credentials: true,
};
