import express, { type Request } from "express";
import session from "express-session";
import passport from "passport";
import compression from "compression";
import cookieParser from "cookie-parser";
import * as socket from "socket.io";
import http from "node:http";
import morgan from "morgan";
import enviroments from "~/config/enviroments.config";
import memoryStore from "memorystore";
import {
    ERROR_MIDDLEWARE,
    attachControllers,
    Container,
    attachSocketControllers,
    IO_MIDDLEWARE,
} from "@vigilio/express-core";
import { connectDB } from "~/config/db.config";
import { ServerErrorMiddleware } from "@vigilio/express-core/handler";
import { logger } from "@vigilio/express-core/helpers";
import { client } from "@vigilio/express-core/client";
import { apiRouters } from "~/routers/api.router";
import { webRouters } from "~/routers/web.router";
import { authRouters } from "~/routers/auth.router";
import { middlewareRoute } from "~/libs/middleware-route";
import { localStrategy } from "@/auth/strategies/local.strategy";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { Users } from "@/users/entities/users.entity";
import type { EmpresasSchema } from "@/empresas/schemas/empresas.schema";
import { adminRouters } from "~/routers/admin.router";
import { GlobalMiddleware } from "~/libs/websocket";
import { socketsRouters } from "~/routers/sockets.router";
import { Settings } from "@/empresas/entities/settings.entity";
// import { initial } from "@/empresas/services/empresas.api.service";
import cors from "cors";
import { corsOptions, dirMode } from ".";
import * as i18nextHttpMiddleware from "i18next-http-middleware";
import i18next, { i18nextMiddleware } from "../libs/i18next";
import { Sequelize } from "sequelize-typescript";
import rateLimit from "express-rate-limit";
import cache from "@vigilio/express-core/cache";
import { initial } from "@/empresas/services/empresas.api.service";

let slugs: string[] = [];
export class Server {
    public readonly app: express.Application = express();

    constructor() {
        this.middlewares();

        // Llama a la función para inicializar las instancias
    }
    async middlewares() {
        this.app.set("trust proxy", 1);

        this.app.use(cors(corsOptions));
        const limiter = rateLimit({
            windowMs: 1 * 60 * 1000, // 1 minutos
            max: 1000, // Límite de 100 solicitudes por IP
            message:
                "Has superado el límite de solicitudes, intenta de nuevo más tarde.",
        });
        this.app.use(limiter);
        // comprimir paginas webs para mejor rendimiento - NO TOCAR si no es necesario
        this.app.use(compression());
        // habilitar cookies
        this.app.use(cookieParser());
        // habilitar para consumir json
        this.app.use(express.json({ limit: "100mb" }));
        await connectDB();
        await initial();

        this.auth();
        // habilitar carpeta public
        this.app.use(express.static(`${dirMode}/public`));

        // habilitar para consumir vistas
        this.app.set("view engine", "ejs");
        this.app.set("views", `${dirMode}/resources/views`);
        this.app.use(i18nextHttpMiddleware.handle(i18next));
        this.app.use(i18nextMiddleware);

        // vite js configuración
        this.app.use(client());
        this.app.use(async (req: Request, res, next) => {
            const host = req.headers.host;

            // if (
            //     host?.includes("client-vps2.loca.lt") &&
            //     enviroments.NODE_ENV !== "production"
            // )
            //     return next();
            let subdomain = null;

            if (host?.includes(".")) {
                subdomain = !host?.startsWith("www.") ? `www.${host}` : host;
                subdomain = subdomain.slice(4);

                const subdomainSplit = subdomain?.split("."); // Obtiene el subdominio
                if (enviroments.NODE_ENV === "production") {
                    if (subdomainSplit?.length === 3) {
                        subdomain = subdomainSplit[0];
                        // puede ser que el dominio sea vigilio-services.com.net
                        if (subdomainSplit[1] === "com") {
                            subdomain = null;
                        }

                        if (
                            enviroments.CLIENT.toLowerCase() ===
                            subdomain?.toLowerCase()
                        ) {
                            return next();
                        }
                    } else {
                        subdomain = null;
                    }
                } else {
                    subdomain = subdomainSplit[0];
                }

                if (
                    subdomain === "vigilio-services" ||
                    subdomain?.includes(".docker") ||
                    subdomain === "facturacion"
                ) {
                    return null;
                }
            }

            let empresa: Empresas | null = JSON.parse(
                cache.get(`EMPRESA:${subdomain}`) || "null"
            );

            if (!subdomain) {
                const emp = await Empresas.unscoped().findOne({
                    include: [
                        {
                            model: Settings,
                            //   dominio.com
                            where: Sequelize.where(
                                Sequelize.literal(`host->>'host'`), // Extrae el valor de 'dominio' dentro de 'host'
                                host?.slice(4) // Compara con el valor que necesitas
                            ),
                            required: true,
                            attributes: ["host"],
                        },
                    ],
                    attributes: ["id", "slug"],
                });
                if (emp) {
                    subdomain = emp.slug;
                    slugs = [...slugs, emp.slug];
                }
            }
            // console.log({ empresa });

            if (!empresa) {
                const where = subdomain
                    ? {
                          where: {
                              slug: subdomain,
                          },
                      }
                    : {
                          include: [
                              {
                                  model: Settings,
                                  //   dominio.com
                                  where: Sequelize.where(
                                      Sequelize.literal(`host->>'host'`), // Extrae el valor de 'dominio' dentro de 'host'
                                      host?.slice(4) // Compara con el valor que necesitas
                                  ),
                                  required: true,
                                  attributes: ["host"],
                              },
                          ],
                      };
                empresa = await Empresas.findOne({
                    ...where,
                    attributes: {
                        exclude: [
                            "groupWhatsapp",
                            "credentials",
                            "token",
                        ] as (keyof EmpresasSchema)[],
                    },
                });

                empresa = empresa?.toJSON() as Empresas;
                // agregar todos los hosts
                const hours24 = 60 * 1000 * 60 * 24;
                cache.set(
                    `EMPRESA:${subdomain}`,
                    JSON.stringify(empresa),
                    hours24
                );
            }
            if (empresa) {
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (req as any).empresa = empresa;

                return next();
            }

            if (enviroments.NODE_ENV !== "production") {
                return next();
            }
            return res.redirect("https://www.vigilio-services.com");
        });
        this.routes();
    }

    auth() {
        // cachear session para mejor rendimiento de las sessiones
        const memoryStoreClass = memoryStore(session);
        // https://www.passportjs.org/concepts/authentication/sessions/
        const closeSession = 24 * 60 * 60 * 1000 * 7; // 7 dias
        this.app.use(
            session({
                secret: enviroments.SECRET_SESSION_KEY,
                resave: false,
                saveUninitialized: false,
                proxy: enviroments.NODE_ENV === "production", // NODE_ENV === 'production'
                cookie: {
                    secure: enviroments.NODE_ENV === "production", //true in production
                    httpOnly: enviroments.NODE_ENV === "production",
                    maxAge: closeSession, // 15 dia
                },
                store: new memoryStoreClass({
                    checkPeriod: closeSession,
                }),
            })
        );
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        // strategies
        passport.use(localStrategy());
        passport.serializeUser((user, done) => {
            return done(null, user);
        });
        passport.deserializeUser(async (user: Users, done) => {
            const findUser = await Users.findByPk(user.id, {
                attributes: {
                    exclude: ["password"],
                },
            });
            if (!findUser) return done({ message: "error authenticated" });
            return done(null, findUser);
        });
    }

    routes() {
        this.app.use(morgan("dev"));
        const apiRouter = express.Router();
        const webRouter = express.Router();
        const authRouter = express.Router();
        const adminRouter = express.Router();
        attachControllers(webRouter, webRouters);
        attachControllers(adminRouter, adminRouters);
        attachControllers(apiRouter, apiRouters);
        attachControllers(authRouter, authRouters);
        Container.provide([
            { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware },
        ]);
        this.app.use("/auth", authRouter);
        this.app.use("/admin", adminRouter);
        this.app.use("/api", apiRouter);
        this.app.use("/", webRouter);
        this.app.use(middlewareRoute);
    }
    sockets() {
        // socket io
        const server = new http.Server(this.app);
        server.setTimeout(1800000); //30 minutos

        const io = new socket.Server(server);
        Container.provide([
            { provide: IO_MIDDLEWARE, useClass: GlobalMiddleware },
        ]);
        attachSocketControllers(io, socketsRouters);
        return server;
    }

    listen() {
        const server = this.sockets().listen(enviroments.PORT, () => {
            logger.primary(`Run server in port ${enviroments.PORT}`);
        });
        return server;
    }
}
