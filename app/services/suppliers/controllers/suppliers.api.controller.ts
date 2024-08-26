import { Injectable, Put, Req } from "@vigilio/express-core";
import {
    Body,
    Controller,
    Delete,
    Get,
    Params,
    Post,
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { SuppliersApiService } from "../services/suppliers.api.service";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import {
    suppliersStoreDto,
    type SuppliersStoreDto,
} from "../dtos/suppliers.store.dto";
import {
    suppliersUpdateDto,
    type SuppliersUpdateDto,
} from "../dtos/suppliers.update.dto";
import type { InformationEntity } from "@/information/entities/information.entity";

@Injectable()
@Controller("/suppliers")
export class SuppliersApiController {
    constructor(private readonly suppliersApiService: SuppliersApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("information") information: InformationEntity) {
        const result = await this.suppliersApiService.index(information);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            code: string(),
        })
    )
    @Get("/:code")
    async show(
        @Req("information") information: InformationEntity,
        @Params("code") code: string
    ) {
        const result = await this.suppliersApiService.show(information, code);
        return result;
    }

    @PermissionAdmin()
    @Validator(suppliersStoreDto)
    @Post("/")
    async store(
        @Req("information") information: InformationEntity,
        @Body() body: SuppliersStoreDto
    ) {
        const result = await this.suppliersApiService.store(information, body);
        return result;
    }
    @PermissionAdmin()
    @Validator(suppliersUpdateDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Put("/:id")
    async update(
        @Req("information") information: InformationEntity,
        @Params("id") id: string,
        @Body() body: SuppliersUpdateDto
    ) {
        const result = await this.suppliersApiService.update(
            information,
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
    async destroy(
        @Req("information") information: InformationEntity,
        @Params("id") id: string
    ) {
        const result = await this.suppliersApiService.destroy(information, id);
        return result;
    }
}
