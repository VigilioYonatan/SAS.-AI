import {
    Body,
    Controller,
    Delete,
    Get,
    Injectable,
    Params,
    Post,
    Req,
    UnauthorizedException,
} from "@vigilio/express-core";
import type { RequestVigilio } from "~/config/types";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { hmacAuthMiddleware } from "~/libs/security.middleware";
import { UsersFormApiService } from "../services/users-form.api.service";
import enviroments from "~/config/enviroments.config";
import {
    usersFormStoreDto,
    type UsersFormStoreDto,
} from "../dtos/users-form.dto";
import { objectAsync, string } from "@vigilio/valibot";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { PermissionAdminWorker } from "@/auth/guards/permission-adminworker.guard";

@Injectable()
@Controller("/users-form")
export class UsersFormApiController {
    constructor(private readonly usersFormApiService: UsersFormApiService) {}

    @Pipe(objectAsync({ id: string() }))
    @Get("/:id")
    async show(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
        const result = await this.usersFormApiService.show(empresa, id);
        return result;
    }

    @Validator(usersFormStoreDto)
    @Post("/")
    async store(
        @Req() req: RequestVigilio,
        @Body()
        body: UsersFormStoreDto
    ) {
        const empresa = req.empresa;
        const isValid = hmacAuthMiddleware(req, enviroments.HMAC_CHAT_AI);
        if (!isValid) {
            throw new UnauthorizedException("unauthorized");
        }
        if (body.api_key !== empresa.scrapping.api_key) {
            throw new UnauthorizedException("API KEY no valid");
        }
        const result = await this.usersFormApiService.store(empresa, body);
        return result;
    }

    @PermissionAdminWorker()
    @Pipe(objectAsync({ id: string() }))
    @Delete("/:id")
    async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
        const result = await this.usersFormApiService.destroy(empresa, id);
        return result;
    }
}
