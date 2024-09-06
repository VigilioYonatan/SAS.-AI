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
import { InformationEntity } from "@/information/entities/information.entity";
import { Users } from "@/users/entities/users.entity";
import type { RequestVigilio } from "./types";
import type { InformationSchema } from "@/information/schemas/information.schema";
import cors from "cors";
import { adminRouters } from "~/routers/admin.router";
import { GlobalMiddleware } from "~/libs/websocket";
import { socketsRouters } from "~/routers/sockets.router";
import type { MetodosPago } from "@/information/entities/metodosPago.entity";
import { Categories } from "@/products/entities/categories.entity";
import { printImagesProduct, Product } from "@/products/libs";
import { printFileWithDimension } from "@/uploads/libs/helpers";
import { formatMoney, subtotal } from "@/cart/libs/helpers";
import { Settings } from "@/information/entities/settings.entity";

export class Server {
	public readonly app: express.Application = express();

	constructor() {
		this.middlewares();
		this.auth();
		this.routes();
		// initialTelegram();
		// Llama a la función para inicializar las instancias
		// initializeClients();
	}
	middlewares() {
		// comprimir paginas webs para mejor rendimiento - NO TOCAR si no es necesario
		this.app.use(
			cors({
				origin: enviroments.VITE_VIGILIO_WEB,
				credentials: true,
				methods: ["GET", "POST", "PUT", "DELETE", "HEAD"],
			}),
		);
		this.app.use(compression());
		// habilitar cookies
		this.app.use(cookieParser());
		// habilitar para consumir json
		this.app.use(express.json({ limit: "50mb" }));
		this.app.use(express.json());
		this.app.use(async (req: Request, res, next) => {
			const host = req.headers.host;

			let subdomain = null;

			if (host?.includes(".")) {
				subdomain = host?.split(".")[0]; // Obtiene el subdominio
				if (enviroments.CLIENT.toLowerCase() === subdomain.toLowerCase()) {
					return next();
				}
			}
			const where = subdomain
				? { where: { slug: subdomain } }
				: {
						include: [{ model: Settings, where: { host }, required: true }],
					};
			const information = await InformationEntity.findOne({
				...where,
				attributes: {
					exclude: [
						"about",
						"contacts",
						"groupWhatsapp",
						"credentials",
					] as (keyof InformationSchema)[],
				},
			});

			if (information) {
				const certificado =
					req.path.startsWith("/admin") && information?.company
						? { certificado: information?.certificado }
						: {};

				const info = {
					...information?.toJSON(),
					company: {
						ruc: information.company?.ruc,
						razonSocial: information.company?.razonSocial,
						nombreComercial: information.company?.nombreComercial,
						production: information.company?.production,
					},
					metodos_pago: {
						...(information.metodos_pago as MetodosPago).toJSON(),
						transferencias: (information.metodos_pago as MetodosPago)
							.transferencias,
						paypal: {
							enabled: (information.metodos_pago as MetodosPago).paypal.enabled,
						},
						mercado_pago: {
							enabled: (information.metodos_pago as MetodosPago).mercado_pago
								.enabled,
						},
					},
					...certificado,
				};

				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				(req as any).information = information;
				res.locals.$information = info;
				res.locals.printFileWithDimension = printFileWithDimension(information);
				res.locals.subtotal = subtotal;
				res.locals.formatMoney = (number: number) =>
					formatMoney(
						information,
						number,
						information.money.international_simbolo,
					);
				res.locals.printImagesProduct = printImagesProduct(information);

				return next();
			}
			if (enviroments.NODE_ENV !== "production") {
				return next();
			}
			return res.redirect("https://www.vigilio-services.com");
		});
		// habilitar carpeta public
		this.app.use(
			express.static(path.resolve(import.meta.dir, "..", "..", "public")),
		);
		// habilitar para consumir vistas
		this.app.set("view engine", "ejs");
		this.app.set(
			"views",
			path.resolve(import.meta.dir, "..", "..", "resources", "views"),
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
			}),
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
		this.app.use(async (req: Request, res: Response, next: NextFunction) => {
			// si no existe req.user que sea nulo
			const user = (req.user ?? null) as Users;
			res.locals.$user = user;
			(req as RequestVigilio).user = user;
			const information = (req as RequestVigilio).information;
			// no permitido para endpoints
			if (!req.path.includes("/api")) {
				// LAYOUT
				const [categories] = await Promise.all([Categories.findAll()]);
				const categoriasTotal = await Promise.all(
					categories.map(async (category) => {
						const product = await Product(information).findOne({
							order: [["createdAt", "DESC"]],
							where: {
								enabled: true,
								category_id: category.id,
							},
						});
						return {
							...category.toJSON(),
							productNew: product,
						};
					}),
				);
				res.locals.header = { categories: categoriasTotal };
			}
			next();
		});
	}

	routes() {
		this.app.use(morgan("dev"));
		const apiRouter = express.Router();
		const webRouter = express.Router();
		const authRouter = express.Router();
		const adminRouter = express.Router();
		attachControllers(apiRouter, apiRouters);
		attachControllers(webRouter, webRouters);
		attachControllers(authRouter, authRouters);
		attachControllers(adminRouter, adminRouters);
		Container.provide([
			{ provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware },
		]);
		this.app.use("/auth", authRouter);
		this.app.use("/admin", adminRouter);
		this.app.use("/", webRouter);
		this.app.use("/api", apiRouter);
		this.app.use(middlewareRoute);
	}
	sockets() {
		// socket io
		const server = new http.Server(this.app);
		const io = new socket.Server(server);
		Container.provide([{ provide: IO_MIDDLEWARE, useClass: GlobalMiddleware }]);
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
