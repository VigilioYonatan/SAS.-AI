import { Injectable, Req } from "@vigilio/express-core";
import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Put,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { postsStoreDto, type PostsStoreDto } from "../dtos/posts.store.dto";
import { postsUpdateDto, type PostsUpdateDto } from "../dtos/posts.update.dto";
import { PostsApiService } from "../services/posts.api.service";
import type { Users } from "@/users/entities/users.entity";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "@/empresas/entities/empresas.entity";

@Injectable()
@Controller("/posts")
export class PostsApiController {
	constructor(private readonly postsApiService: PostsApiService) {}

	@PermissionAdmin()
	@Get("/")
	async index(@Req("empresa") empresa: Empresas) {
		const result = await this.postsApiService.index(empresa);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Get("/:id")
	async show(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
		const result = await this.postsApiService.show(empresa, id);
		return result;
	}

	@PermissionAdmin()
	@Validator(postsStoreDto)
	@Post("/")
	async store(
		@Req("empresa") empresa: Empresas,
		@Body() body: PostsStoreDto,
		@Req("user") user: Users,
	) {
		const result = await this.postsApiService.store(empresa, body, user);
		return result;
	}

	@PermissionAdmin()
	@Validator(postsUpdateDto)
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Put("/:id")
	async update(
		@Req("empresa") empresa: Empresas,
		@Params("id") id: string,
		@Body() body: PostsUpdateDto,
		@Req("user") user: Users,
	) {
		const result = await this.postsApiService.update(empresa, id, body, user);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Delete("/:id")
	async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
		const result = await this.postsApiService.destroy(empresa, id);
		return result;
	}
}
