import { Injectable, Req } from "@vigilio/express-core";
import { UsersApiService } from "../services/users.api.service";
import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Put,
	Status,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { type UsersStoreDto, usersStoreDto } from "../dtos/users.store.dto";
import { type UsersUpdateDto, usersUpdateDto } from "../dtos/users.update.dto";
import { objectAsync, string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import { PermissionAuth } from "@/auth/guards/permission-auth.guard";
import {
	usersProfileDto,
	type UsersProfileDto,
} from "../dtos/users.profile.dto";
import type { Users } from "../entities/users.entity";
import {
	type UsersPasswordDto,
	usersPasswordDto,
} from "../dtos/users.password.dto";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/users")
export class UsersApiController {
	constructor(private readonly usersApiService: UsersApiService) {}

	@PermissionAdmin() // solo los admin pueden ver la lista de  usuarios
	@Get("/")
	async index() {
		const result = await this.usersApiService.index();
		return result;
	}

	@Pipe(
		objectAsync({
			slug: string(),
		}),
	)
	@Get("/:slug")
	async show(@Params("slug") slug: string, @Req("empresa") empresa: Empresas) {
		const result = await this.usersApiService.show(empresa, slug);
		return result;
	}

	@PermissionAdmin()
	@Validator(usersStoreDto)
	@Status(201)
	@Post("/")
	async store(@Req("empresa") empresa: Empresas, @Body() body: UsersStoreDto) {
		const result = await this.usersApiService.store(empresa, body);
		return result;
	}

	@PermissionAuth()
	@Validator(usersProfileDto)
	@Status(200)
	@Put("/profile")
	async profile(
		@Req("empresa") empresa: Empresas,
		@Body() body: UsersProfileDto,
		@Req("user") user: Users,
	) {
		const result = await this.usersApiService.profile(empresa, body, user);
		return result;
	}

	@PermissionAuth()
	@Validator(usersPasswordDto)
	@Status(201)
	@Post("/change-password")
	async changePassword(
		@Req("empresa") empresa: Empresas,
		@Body() body: UsersPasswordDto,
		@Req("user") user: Users,
	) {
		const result = await this.usersApiService.changePassword(
			empresa,
			body,
			user,
		);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(usersUpdateDto)
	@Status(200)
	@Put("/:id")
	async update(
		@Req("empresa") empresa: Empresas,
		@Params("id") id: string,
		@Body() body: UsersUpdateDto,
	) {
		const result = await this.usersApiService.update(empresa, id, body);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Status(201)
	@Delete("/:id")
	async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
		const result = await this.usersApiService.destroy(empresa, id);
		return result;
	}
}
