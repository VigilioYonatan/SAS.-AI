import {
    Body,
    Controller,
    Get,
    Params,
    Status,
    Injectable,
    Put,
    Req,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync } from "valibot";
import { string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "../entities/empresas.entity";
import { GridBannerServiceApiService } from "../services/grid_banner_service.api.service";
import {
    gridBannerServiceUpdateDto,
    type GridBannerServiceUpdateDto,
} from "../dtos/grid_banner_service.update.dto";

@Injectable()
@Controller("/grid_banner_service")
export class GridBannerServiceApiController {
    constructor(
        private readonly gridBannerServiceApiService: GridBannerServiceApiService
    ) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.gridBannerServiceApiService.index(empresa);
        return result;
    }

    @PermissionAdmin()
    @Get("/:id")
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    async show(@Params("id") id: string, @Req("empresa") empresa: Empresas) {
        const result = await this.gridBannerServiceApiService.show(empresa, id);
        return result;
    }

    @Validator(gridBannerServiceUpdateDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @PermissionAdmin()
    @Status(201)
    @Put("/:id")
    async update(
        @Body() body: GridBannerServiceUpdateDto,
        @Req("empresa") empresa: Empresas,
        @Params("id") id: string
    ) {
        const result = await this.gridBannerServiceApiService.update(
            empresa,
            id,
            body
        );
        return result;
    }
}
