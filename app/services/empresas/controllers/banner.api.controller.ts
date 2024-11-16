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
import { number, objectAsync } from "valibot";
import { BannerApiService } from "../services/banner.api.service";
import { string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "../entities/empresas.entity";
import { bannerStoreDto, type BannerStoreDto } from "../dtos/banner.store.dto";
import {
    bannerUpdateDto,
    type BannerUpdateDto,
} from "../dtos/banner.update.dto";

@Injectable()
@Controller("/banner")
export class BannerApiController {
    constructor(private readonly bannerApiService: BannerApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.bannerApiService.index(empresa);
        return result;
    }

    @PermissionAdmin()
    @Get("/:id")
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    async show(@Params("id") id: number, @Req("empresa") empresa: Empresas) {
        const result = await this.bannerApiService.show(empresa, id);
        return result;
    }

    @Validator(bannerStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Body() body: BannerStoreDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.bannerApiService.store(empresa, body);
        return result;
    }

    @Validator(bannerUpdateDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @PermissionAdmin()
    @Status(201)
    @Put("/:id")
    async update(
        @Body() body: BannerUpdateDto,
        @Req("empresa") empresa: Empresas,
        @Params("id") id: number
    ) {
        const result = await this.bannerApiService.update(empresa, id, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: number(),
        })
    )
    @Delete("/:id")
    async destroy(@Params("id") id: number, @Req("empresa") empresa: Empresas) {
        const result = await this.bannerApiService.destroy(empresa, id);
        return result;
    }
}
