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
import { GridBannerPageApiService } from "../services/grid_banner_page.api.service";
import {
    gridBannerPageUpdateDto,
    type GridBannerPageUpdateDto,
} from "../dtos/grid_banner_page.update.dto";

@Injectable()
@Controller("/grid_banner_page")
export class GridBannerPageApiController {
    constructor(
        private readonly gridBannerPageApiService: GridBannerPageApiService
    ) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.gridBannerPageApiService.index(empresa);
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
        const result = await this.gridBannerPageApiService.show(empresa, id);
        return result;
    }

    @Validator(gridBannerPageUpdateDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @PermissionAdmin()
    @Status(201)
    @Put("/:id")
    async update(
        @Body() body: GridBannerPageUpdateDto,
        @Req("empresa") empresa: Empresas,
        @Params("id") id: string
    ) {
        const result = await this.gridBannerPageApiService.update(
            empresa,
            id,
            body
        );
        return result;
    }
}
