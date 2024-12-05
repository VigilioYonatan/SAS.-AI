import path from "node:path";
import enviroments from "./enviroments.config";
import cors from "cors";
import { Settings } from "@/empresas/entities/settings.entity";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Op, Sequelize } from "sequelize";
import cache from "@vigilio/express-core/cache";

export const dirMode =
    enviroments.NODE_ENV === "production"
        ? path.resolve(__dirname, "..", "..")
        : path.resolve(__dirname, "..", "..");

export const corsOptions: cors.CorsOptions = {
    origin: async (origin, callback) => {
        let empresas: Empresas[] = JSON.parse(
            cache.get("CACHE_HOST") ?? "null"
        );
        if (!empresas) {
            empresas = await Empresas.unscoped().findAll({
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
            const hours24 = 60 * 60 * 1000 * 10;
            cache.set("CACHE_HOST", JSON.stringify(empresas), hours24);
        }

        // Aquí puedes agregar lógica para permitir subdominios
        const allowedOrigins = [
            "https://*.vigilio-services.com",
            `http://*.localhost:${enviroments.PORT}`,
            "https://vigilioservices2.loca.lt",
            `https://${enviroments.CLIENT.toLowerCase()}.vigilio-services.com`,
            ...empresas.map((emp) => `https://www.${emp.setting.host.host}`),
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
