import { Injectable, Query } from "@vigilio/express-core";
import { Controller, Get, Req, Res } from "@vigilio/express-core";
import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import {
	authAuthenticatedMiddleware,
	authNoAuthenticatedMiddleware,
} from "../middlewares/auth.middleware";
import type { RequestVigilio } from "~/config/types";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { BASE_URL } from "@/empresas/libs";
import type { Users } from "@/users/entities/users.entity";
const CLIENT_ID = "1957086741385823";
const CLIENT_SECRET = "94dff236a11b006bc4b215bf5c2d4fa6";
@Injectable()
@Controller("/")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get("/facebook")
	async facebook(@Req("empresa") empresa: Empresas, @Res() res: Response) {
		const REDIRECT_URI = `${BASE_URL(empresa)}/auth/facebook/callback`;
		const fbAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=pages_messaging,pages_read_engagement`;
		res.redirect(fbAuthUrl);
	}

	@Get("/facebook/callback")
	async facebookCallback(
		@Req("empresa") empresa: Empresas,
		@Query("code") code: string,
		@Res() res: Response,
	) {
		if (!code) {
			return res.status(400).send("No authorization code provided.");
		}
		const REDIRECT_URI = `${BASE_URL(empresa)}/auth/facebook/callback`;

		try {
			// Intercambia el código por un token de acceso
			const tokenResponse = await fetch(
				`https://graph.facebook.com/v21.0/oauth/access_token?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&client_secret=${CLIENT_SECRET}`,
			);
			const tokenResult = await tokenResponse.json();

			const accessToken = tokenResult.data.access_token;

			// Aquí puedes almacenar el `accessToken` en tu base de datos o devolverlo al frontend
			res.send({ accessToken });
		} catch (error) {
			console.error(
				"Error al obtener el token de acceso:",
				(error as Error).message,
			);
			res.status(500).send("Error al obtener el token de acceso.");
		}
	}
	@Get("/profile", [authAuthenticatedMiddleware])
	async profile(@Res() res: Response, @Req("user") user: Users) {
		return res.render("auth/profile", { user });
	}

	@Get("/register", [authNoAuthenticatedMiddleware])
	async register(@Res() res: Response) {
		return res.render("auth/register", {
			title: "Registrarse",
			description: "Unete a nosotros, Registraste ahora.",
		});
	}

	@Get("/login", [authNoAuthenticatedMiddleware])
	async login(@Res() res: Response) {
		return res.render("auth/login", {
			title: "Iniciar sesión",
			description: "Bienvenido a",
		});
	}
	@Get("/logout", [authAuthenticatedMiddleware])
	async logout(@Req() req: Request, @Res() res: Response, next: NextFunction) {
		req.logout((err) => {
			if (err) {
				return next(err);
			}
			res.redirect("/");
		});
	}

	@Get("/forgot-password")
	async changePassword(@Res() res: Response, @Req() req: Request) {
		const token = (req.query as { token: string }).token;
		const empresa = (req as RequestVigilio).empresa;
		const result = await this.authService.forgotPassword(empresa, token);
		return res.render("auth/forgot-password", result);
	}

	@Get("/confirmed-account")
	async confirmedAccount(
		@Res() res: Response,
		@Query("token") token: string | null,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.authService.confirmedAccount(empresa, token);
		return res.render("auth/confirmed-account", result);
	}
}
