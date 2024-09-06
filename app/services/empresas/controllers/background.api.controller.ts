import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
    Status,
    Injectable,
    Put,
    Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync } from "valibot";
import { BackgroundApiService } from "../services/background.api.service";
import {
    backgroundStoreDto,
    type BackgroundStoreDto,
} from "../dtos/background.store.dto";
import {
    backgroundUpdateDto,
    type BackgroundUpdateDto,
} from "../dtos/background.update.dto";
import { string } from "@vigilio/valibot";
import type { Empresas } from "../entities/empresas.entity";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
@Injectable()
@Controller("/background")
export class BackgroundApiController {
    constructor(private readonly backgroundsApiService: BackgroundApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.backgroundsApiService.index(empresa);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Get("/:id")
    async show(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
        const result = await this.backgroundsApiService.show(empresa, id);
        return result;
    }

    @PermissionAdmin()
    @Validator(backgroundStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Req("empresa") empresa: Empresas,
        @Body() body: BackgroundStoreDto
    ) {
        const result = await this.backgroundsApiService.store(empresa, body);
        return result;
    }
    @PermissionAdmin()
    @Validator(backgroundUpdateDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Status(201)
    @Put("/:id")
    async update(
        @Req("empresa") empresa: Empresas,
        @Params("id") id: string,
        @Body() body: BackgroundUpdateDto
    ) {
        const result = await this.backgroundsApiService.update(
            empresa,
            id,
            body
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
    async destroy(@Req("empresa") empresa: Empresas, @Params("id") id: string) {
        const result = await this.backgroundsApiService.destroy(empresa, id);
        return result;
    }
}
