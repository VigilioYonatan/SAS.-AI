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
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync } from "valibot";
import { string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "../entities/empresas.entity";
import { CrudDateApiService } from "../services/crud_data.api.service";

@Injectable()
@Controller("/crud_data")
export class CrudDateApiController {
    constructor(private readonly crudDateApiService: CrudDateApiService) {}

    @PermissionAdmin()
    @Pipe(objectAsync({ type: string() }))
    @Get("/:type")
    async index(
        @Params("type") type: string,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.crudDateApiService.index(empresa, type);
        return result;
    }

    @PermissionAdmin()
    @Get("/:type/:id")
    @Pipe(
        objectAsync({
            type: string(),
            id: string(),
        })
    )
    async show(
        @Params("id") id: string,
        @Params("type") type: string,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.crudDateApiService.show(empresa, type, id);
        return result;
    }
    @PermissionAdmin()
    @Pipe(
        objectAsync({
            type: string(),
        })
    )
    @Status(201)
    @Post("/:type")
    async store(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        @Body() body: Record<string, any>,
        @Params("type") type: string,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.crudDateApiService.store(empresa, type, body);
        return result;
    }

    @Pipe(
        objectAsync({
            id: string(),
            type: string(),
        })
    )
    @PermissionAdmin()
    @Status(201)
    @Put("/:type/:id")
    async update(
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        @Body() body: Record<string, any>,
        @Req("empresa") empresa: Empresas,
        @Params("type") type: string,
        @Params("id") id: string
    ) {
        const result = await this.crudDateApiService.update(
            empresa,
            type,
            id,
            body
        );
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
            type: string(),
        })
    )
    @Delete("/:type/:id")
    async destroy(
        @Params("type") type: string,
        @Params("id") id: string,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.crudDateApiService.destroy(empresa, type, id);
        return result;
    }
}
