import express, {
    type NextFunction,
    type Request,
    type Response,
} from "express";
import path from "node:path";
import session from "express-session";
import passport from "passport";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import enviroments from "~/config/enviroments.config";
import memoryStore from "memorystore";
import {
    ERROR_MIDDLEWARE,
    attachControllers,
    Container,
} from "@vigilio/express-core";
import { connectDB } from "~/config/db.config";
import { ServerErrorMiddleware } from "@vigilio/express-core/handler";
import { logger } from "@vigilio/express-core/helpers";
import { client } from "@vigilio/express-core/client";
import { apiRouters } from "~/routers/api.router";
import { webRouters } from "~/routers/web.router";
import { authRouters } from "~/routers/auth.router";
import { middlewareRoute } from "~/libs/middleware-route";
import { initializeClients } from "@/bot/libs/ai";
import { localStrategy } from "@/auth/strategies/local.strategy";
import { InformationEntity } from "@/information/entities/information.entity";
import { Users } from "@/users/entities/users.entity";
import type { RequestVigilio } from "./types";
import type { InformationSchema } from "@/information/schemas/information.schema";
import type { WhereOptions } from "sequelize";

export class Server {
    public readonly app: express.Application = express();

    constructor() {
        this.middlewares();
        this.auth();
        this.routes();
        // Llama a la función para inicializar las instancias
        initializeClients();
    }
    middlewares() {
        // comprimir paginas webs para mejor rendimiento - NO TOCAR si no es necesario
        this.app.use(
            compression({
                threshold: 10000,
                filter: (req, res) => {
                    if (req.headers["x-no-compression"]) {
                        return false;
                    }
                    return compression.filter(req, res);
                },
            })
        );
        this.app.use(async (req: Request, res, next) => {
            const host = req.headers.host;
            let subdomain = null;
            if (host?.includes(".")) {
                subdomain = host?.split(".")[0]; // Obtiene el subdominio
                if (
                    enviroments.CLIENT.toLowerCase() === subdomain.toLowerCase()
                ) {
                    return next();
                }
            }
            const where: WhereOptions = subdomain
                ? { slug: subdomain }
                : { host };
            const information = await InformationEntity.findOne({
                where,
                attributes: {
                    exclude: [
                        "about",
                        "certificado",
                        "inteligenceArtificial",
                        "contacts",
                        "groupWhatsapp",
                        "transferencias",
                        "payments",
                        "credentials",
                    ] as (keyof InformationSchema)[],
                },
            });

            if (information) {
                const info = information
                    ? {
                          ...information?.toJSON(),
                          company: {
                              production: information?.company.production,
                              ruc: information?.company.ruc,
                              razonSocial: information?.company.razonSocial,
                              nombreComercial:
                                  information?.company.nombreComercial,
                          },
                      }
                    : null;
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (req as any).information = info;
                res.locals.$information = info;

                next();
            } else {
                if (enviroments.NODE_ENV !== "production") {
                    next();
                    return;
                }
                return res.redirect("https://www.vigilio-services.com");
            }
        });
        // habilitar cookies
        this.app.use(cookieParser());
        // habilitar para consumir json
        this.app.use(express.json({ limit: "50mb" }));
        this.app.use(express.json());
        // habilitar carpeta public
        this.app.use(
            express.static(path.resolve(import.meta.dir, "..", "..", "public"))
        );
        // habilitar para consumir vistas
        this.app.set("view engine", "ejs");
        this.app.set(
            "views",
            path.resolve(import.meta.dir, "..", "..", "resources", "views")
        );
        // vite js configuración
        this.app.use(client());
        // metodos globales

        connectDB();
    }

    async auth() {
        this.app.set("trust proxy", 1);
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
                    httpOnly: true,
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
            const findInformation = await Users.findByPk(user.id, {
                attributes: {
                    exclude: ["password"],
                },
            });
            if (!findInformation)
                return done({ message: "error authenticated" });
            return done(null, findInformation);
        });
        this.app.use(
            async (req: Request, res: Response, next: NextFunction) => {
                // si no existe req.user que sea nulo
                const user = (req.user ?? null) as Users;
                res.locals.$user = user;
                (req as RequestVigilio).user = user;

                next();
            }
        );
    }

    routes() {
        this.app.use(morgan("dev"));
        const apiRouter = express.Router();
        const webRouter = express.Router();
        const authRouter = express.Router();
        attachControllers(apiRouter, apiRouters);
        attachControllers(webRouter, webRouters);
        attachControllers(authRouter, authRouters);
        Container.provide([
            { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware },
        ]);
        this.app.use("/auth", authRouter);
        this.app.use("/", webRouter);
        this.app.use("/api", apiRouter);
        this.app.use(middlewareRoute);
    }
    listen() {
        const server = this.app.listen(enviroments.PORT, () => {
            logger.primary(`Run server in port ${enviroments.PORT}`);
        });
        return server;
    }
}
