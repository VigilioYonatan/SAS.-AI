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
import type { RequestVigilio } from "./types";
import type { EmpresasSchema } from "@/empresas/schemas/empresas.schema";
import { adminRouters } from "~/routers/admin.router";
import { GlobalMiddleware } from "~/libs/websocket";
import { socketsRouters } from "~/routers/sockets.router";
import type { MetodosPago } from "@/empresas/entities/metodosPago.entity";
import { Categories } from "@/products/entities/categories.entity";
import { printImagesProduct, Product } from "@/products/libs";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { formatMoney, subtotal } from "@/cart/libs/helpers";
import { Settings } from "@/empresas/entities/settings.entity";
// import { initial } from "@/empresas/services/empresas.api.service";
import { corsOptions, dirMode } from ".";
import { Brands } from "@/products/entities/brands.entitiy";
import * as i18nextHttpMiddleware from "i18next-http-middleware";
import i18next, { i18nextMiddleware } from "../libs/i18next";
import { Sequelize } from "sequelize-typescript";
import rateLimit from "express-rate-limit";
import cors from "cors";
import { NOW } from "~/libs/dayjs";
import { Citas } from "@/citas/entities/citas.entities";
import { Op } from "sequelize";
import cache from "@vigilio/express-core/cache";
import { initial } from "@/empresas/services/empresas.api.service";
import { Favorites } from "@/favorites/entities/favorites.entity";
import { converterMoneyApi } from "~/libs/apis";
import { MONEYLOCAL, type Money } from "@/empresas/libs";
import { Questions } from "@/empresas/entities/questions.entity";

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

        this.auth();
        // habilitar carpeta public
        this.app.use(express.static(`${dirMode}/public`));

        // habilitar para consumir vistas
        this.app.set("view engine", "ejs");
        this.app.set("views", `${dirMode}/resources/views`);
        this.app.use(i18nextHttpMiddleware.handle(i18next));
        this.app.use(i18nextMiddleware);
        await initial();

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
                          },
                      ],
                  };

            let empresa: Empresas | null = JSON.parse(
                cache.get(
                    `EMPRESA:${subdomain || host?.slice(4).split(".")[0]}`
                ) || "null"
            );

            if (!empresa) {
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
                    `EMPRESA:${subdomain || host?.slice(4).split(".")[0]}`,
                    JSON.stringify(empresa),
                    hours24
                );
            }

            if (empresa) {
                const certificado =
                    req.path.startsWith("/admin") && empresa?.company
                        ? { certificado: empresa?.certificado }
                        : {
                              whatsapp_mode: {
                                  ...empresa.whatsapp_mode,
                                  password: null,
                              },
                          };

                let MONEY: {
                    money: Money;
                    moneyValue: Record<Money, number>;
                } = { money: "LOCAL", moneyValue: { DOLARES: 1, LOCAL: 1 } };
                if (empresa?.isDolar) {
                    const cookie = req.cookies.money ?? MONEYLOCAL;
                    let DOLARES = JSON.parse(
                        cache.get(`money:${empresa.slug}`) ?? "null"
                    );
                    if (!DOLARES) {
                        const response = await converterMoneyApi({
                            amount: "1",
                            from: empresa.money.simbolo,
                            to: "USD",
                        });

                        DOLARES = Number.parseFloat(
                            response.result.resultadoNumber
                        );
                        const hours24 = 60 * 1000 * 60 * 24;
                        cache.set(
                            `money:${empresa.slug}`,
                            JSON.stringify(DOLARES),
                            hours24
                        ); // cada dia se actualizará el cambio de dolar
                    }

                    MONEY = {
                        ...MONEY,
                        money: cookie,
                        moneyValue: { DOLARES, LOCAL: 1 },
                    };
                }

                let citas = JSON.parse(
                    cache.get(`${empresa.slug}:citas`) ?? "null"
                );
                let questionCount: number | null = JSON.parse(
                    cache.get(`${empresa.slug}:questions-count`) ?? "null"
                );
                if (req.path.includes("admin") && !citas) {
                    const day = NOW(empresa);

                    questionCount = await Questions.count({
                        where: {
                            empresa_id: empresa.id,
                            answer: null,
                        },
                    });
                    cache.set(
                        `${empresa.slug}:questions-count`,
                        JSON.stringify(questionCount)
                    );

                    const dias = day.daysInMonth();

                    const cites = await Promise.all(
                        Array.from({ length: dias }).map(async (_, i) => {
                            const startOfDay = day
                                .date(i + 1)
                                .startOf("day")
                                .utc()
                                .format();
                            const endOfDay = day
                                .date(i + 1)
                                .endOf("day")
                                .utc()
                                .format();
                            const qty = await Citas.unscoped().count({
                                where: {
                                    empresa_id: empresa.id,
                                    date: {
                                        [Op.between]: [startOfDay, endOfDay],
                                    },
                                },
                            });
                            return [i + 1, qty];
                        })
                    );
                    citas = cites.reduce((acc, [key, value]) => {
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        (acc as any)[key] = value;
                        return acc;
                    }, {});
                    cache.set(
                        `${empresa.slug}:citas`,
                        JSON.stringify(citas),
                        1 * 60 * 60 * 1000
                    );
                }

                const info = {
                    ...empresa,
                    citas,
                    questionCount,
                    company: {
                        ruc: empresa.company?.ruc,
                        razonSocial: empresa.company?.razonSocial,
                        nombreComercial: empresa.company?.nombreComercial,
                        production: empresa.company?.production,
                    },
                    metodos_pago: {
                        ...(empresa.metodos_pago as MetodosPago),
                        transferencias: (empresa.metodos_pago as MetodosPago)
                            .transferencias,
                        paypal: {
                            enabled: (empresa.metodos_pago as MetodosPago)
                                .paypal.enabled,
                        },
                        mercado_pago: {
                            enabled: (empresa.metodos_pago as MetodosPago)
                                .mercado_pago.enabled,
                        },
                        izipay: {
                            enabled: (empresa.metodos_pago as MetodosPago)
                                .izipay.enabled,
                            izipay_public_key: (
                                empresa.metodos_pago as MetodosPago
                            ).izipay.izipay_public_key,
                        },
                        stripe: {
                            enabled: (empresa.metodos_pago as MetodosPago)
                                .stripe.enabled,
                        },
                    },
                    ...certificado,
                };
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (req as any).empresa = empresa;
                res.locals.$empresa = info;
                res.locals.printFileWithDimension =
                    printFileWithDimension(empresa);
                res.locals.subtotal = subtotal;
                res.locals.formatMoney = (number: number) =>
                    formatMoney(
                        empresa,
                        number,
                        empresa.money.international_simbolo as Money
                    );
                res.locals.printImagesProduct = printImagesProduct(empresa);
                res.locals.$money = MONEY;
                res.locals.$moneyConverter = MONEY.moneyValue[MONEY.money];
                // aca
                // si no existe req.user que sea nulo
                const user = (req.user ?? null) as Users;

                res.locals.$user = user;
                (req as RequestVigilio).money = MONEY;
                (req as RequestVigilio).moneyConverter =
                    MONEY.moneyValue[MONEY.money];
                (req as RequestVigilio).user = user;

                const host = req.headers.host?.slice(4);

                // no permitido para endpoints y que no sea el subdominio client
                if (!req.path.includes("api")) {
                    // LAYOUT
                    const [categories, categoriesService, totalProducts] =
                        await Promise.all([
                            Categories.findAll({
                                where: {
                                    empresa_id: empresa.id,
                                    isService: false,
                                },
                            }),
                            Categories.findAll({
                                where: {
                                    empresa_id: empresa.id,
                                    isService: true,
                                },
                            }),
                            Product(empresa, false).count(),
                        ]);
                    const categoriasTotal = await Promise.all(
                        categories.map(async (category) => {
                            // productnormal
                            const [product, subcategories] = await Promise.all([
                                Product(empresa, false).findOne({
                                    order: [["createdAt", "DESC"]],
                                    where: {
                                        enabled: true,
                                        category_id: category.id,
                                        empresa_id: empresa.id,
                                    },
                                }),
                                category.$get("subcategories"),
                            ]);
                            return {
                                ...category.toJSON(),
                                productNew: product,
                                subcategories,
                            };
                        })
                    );
                    const categoriesServiceTotal = await Promise.all(
                        categoriesService.map(async (category) => {
                            // productsServicios
                            const products = await category.$get(
                                "productsServicios"
                            );
                            return {
                                ...category.toJSON(),
                                products,
                            };
                        })
                    );
                    if (user) {
                        const [favorites] = await Promise.all([
                            Favorites.count({
                                where: {
                                    user_id: user.id,
                                    empresa_id: empresa.id,
                                },
                            }),
                        ]);
                        user.dataValues.products_favorites_length = favorites;
                    }
                    const brands = await Brands.findAll({
                        where: {
                            empresa_id: empresa.id,
                        },
                        attributes: [
                            "id",
                            "name",
                            "image",
                            "empresa_id",
                            "slug",
                        ],
                    });

                    res.locals.header = {
                        categories: categoriasTotal,
                        categoriesServices: categoriesServiceTotal,
                        brands,
                        totalProducts,
                    };
                }

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
        attachControllers(apiRouter, apiRouters);
        attachControllers(authRouter, authRouters);
        attachControllers(adminRouter, adminRouters);
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
