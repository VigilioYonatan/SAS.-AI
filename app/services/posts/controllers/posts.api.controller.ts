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
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
@Controller("/posts")
export class PostsApiController {
    constructor(private readonly postsApiService: PostsApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("information") information: InformationEntity) {
        const result = await this.postsApiService.index(information);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Get("/:id")
    async show(
        @Req("information") information: InformationEntity,
        @Params("id") id: string
    ) {
        const result = await this.postsApiService.show(information, id);
        return result;
    }

    @PermissionAdmin()
    @Validator(postsStoreDto)
    @Post("/")
    async store(
        @Req("information") information: InformationEntity,
        @Body() body: PostsStoreDto,
        @Req("user") user: Users
    ) {
        const result = await this.postsApiService.store(
            information,
            body,
            user
        );
        return result;
    }

    @PermissionAdmin()
    @Validator(postsUpdateDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Put("/:id")
    async update(
        @Req("information") information: InformationEntity,
        @Params("id") id: string,
        @Body() body: PostsUpdateDto,
        @Req("user") user: Users
    ) {
        const result = await this.postsApiService.update(
            information,
            id,
            body,
            user
        );
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Delete("/:id")
    async destroy(
        @Req("information") information: InformationEntity,
        @Params("id") id: string
    ) {
        const result = await this.postsApiService.destroy(information, id);
        return result;
    }
}
