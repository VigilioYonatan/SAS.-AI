import { Injectable } from "@vigilio/express-core";
import { Controller, Get, Req, Res } from "@vigilio/express-core";
import type { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import {
    authAuthenticatedMiddleware,
    authNoAuthenticatedMiddleware,
} from "../middlewares/auth.middleware";
import type { RequestVigilio } from "~/config/types";

@Injectable()
@Controller("/")
export class AuthController {
    constructor(private readonly authService: AuthService) {}
    @Get("/login", [authNoAuthenticatedMiddleware])
    async login(@Res() res: Response) {
        return res.render("auth/login", {
            title: "Iniciar sesión",
            description: "Bienvenido a",
        });
    }
    @Get("/logout", [authAuthenticatedMiddleware])
    async logout(
        @Req() req: Request,
        @Res() res: Response,
        next: NextFunction
    ) {
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
}
