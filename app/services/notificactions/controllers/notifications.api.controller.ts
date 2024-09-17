import { Injectable, Post, Req } from "@vigilio/express-core";
import { NotificationsApiService } from "../services/notifications.api.service";
import { Body, Controller, Get, Params, Put } from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { boolean, number, objectAsync, string } from "@vigilio/valibot";
import { Users } from "@/users/entities/users.entity";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";
import { subscription, type Subscription } from "@/users/schemas/users.schema";
import type { RequestVigilio } from "~/config/types";

@Injectable()
@Controller("/notifications")
export class NotificationsApiController {
	constructor(
		private readonly notificationsApiService: NotificationsApiService,
	) {}

	@PermissionAuth()
	@Get("/count")
	async count(@Req() req: RequestVigilio) {
		const user = req.user;
		const empresa = req.empresa;
		const result = await this.notificationsApiService.count(empresa, user);
		return result;
	}

	@PermissionAuth()
	@Validator(subscription)
	@Post("/subscribe")
	async register(@Body() body: Subscription, @Req("user") user: Users) {
		const result = await this.notificationsApiService.register(user, body);
		return result;
	}

	@PermissionAuth()
	@Get("/clean")
	async clean(@Req() req: RequestVigilio) {
		const user = req.user;
		const empresa = req.empresa;
		const result = await this.notificationsApiService.clean(empresa, user);
		return result;
	}

	@PermissionAuth()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id")
	async show(@Req() req: RequestVigilio, @Params("id") id: string) {
		const empresa = req.empresa;
		const result = await this.notificationsApiService.show(empresa, id);
		return result;
	}

	@PermissionAuth()
	@Validator(objectAsync({ notification_id: number(), isRead: boolean() }))
	@Put("/")
	async update(
		@Req() req: RequestVigilio,
		@Body()
		body: {
			notification_id: number;
			isRead: boolean;
		},
		@Req("user") user: Users,
	) {
		const empresa = req.empresa;

		const result = await this.notificationsApiService.update(
			empresa,
			user,
			body,
		);
		return result;
	}
}
