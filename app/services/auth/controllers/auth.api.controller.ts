import passport from "passport";
import { Body, Controller, Post, Put, Req } from "@vigilio/express-core";
import type { NextFunction, Request, Response } from "express";
import { Injectable } from "@vigilio/express-core";
import { type AuthUserLogin } from "../types";
import {
	authConfirmPasswordDto,
	type AuthConfirmPasswordDto,
} from "../dtos/auth.confirm-password.dto";
import { AuthApiService } from "../services/auth.api.service";
import {
	authForgotPasswordDto,
	type AuthForgotPasswordDto,
} from "../dtos/auth.forgot-password.dto";
import { Validator } from "@vigilio/express-core/valibot";
import type { Empresas } from "@/empresas/entities/empresas.entity";
import { VigilioServicesGuard } from "@/empresas/guards/vigilioservices.guard";
import { objectAsync, string } from "@vigilio/valibot";
import {
	authRegisterDto,
	type AuthRegisterDto,
} from "../dtos/auth.register.dto";

@Injectable()
@Controller("/auth")
export class AuthApiController {
	constructor(private readonly authApiService: AuthApiService) {}
	@Post("/login", [
		(req: Request, res: Response, next: NextFunction) => {
			passport.authenticate(
				"local",
				(err: Error, user: AuthUserLogin, message: { message: string }) => {
					if (err) {
						return next(err);
					}

					if (!user) {
						return res.status(401).json({ success: false, ...message });
					}

					req.logIn(user, (err) => {
						if (err) {
							return next(err);
						}

						return res.status(200).json({
							success: true,
							user,
						});
					});
				},
			)(req, res, next);
		},
	])
	login() {}
	@Validator(authForgotPasswordDto)
	@Post("/forgot-password")
	async forgotPassword(
		@Body() body: AuthForgotPasswordDto,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.authApiService.forgotPassword(empresa, body);
		return result;
	}
	@Validator(authRegisterDto)
	@Post("/register")
	async register(
		@Body() body: AuthRegisterDto,
		@Req("empresa") empresa: Empresas,
	) {
		const result = await this.authApiService.register(empresa, body);
		return result;
	}
	@Validator(authConfirmPasswordDto)
	@Put("/confirm-password")
	async confirmPassword(
		@Req("empresa") empresa: Empresas,
		@Body() body: AuthConfirmPasswordDto,
	) {
		const result = await this.authApiService.confirmPassword(empresa, body);
		return result;
	}
	@VigilioServicesGuard()
	@Validator(
		objectAsync({
			password: string(),
			telephone: string(),
			secure: string(),
		}),
	)
	@Post("/change-password")
	async changePassword(
		@Req("empresa") empresa: Empresas,
		@Body() body: { password: string; telephone: string; secure: string },
	) {
		const result = await this.authApiService.changePassword(empresa, body);
		return result;
	}
}
