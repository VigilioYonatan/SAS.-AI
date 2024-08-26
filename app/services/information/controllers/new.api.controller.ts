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
} from "@vigilio/express-core";
import { Pipe, Validator } from "@vigilio/express-core/valibot";
import { number, objectAsync } from "valibot";
import { NewApiService } from "../services/new.api.service";
import { newStoreDto, type NewStoreDto } from "../dtos/new.store.dto";
import { string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";

@Injectable()
@Controller("/new")
export class NewApiController {
    constructor(private readonly newApiService: NewApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index() {
        const result = await this.newApiService.index();
        return result;
    }

    @PermissionAdmin()
    @Get("/:id")
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    async show(@Params("id") id: number) {
        const result = await this.newApiService.show(id);
        return result;
    }

    @Validator(newStoreDto)
    @Status(201)
    @Post("/")
    async store(@Body() body: NewStoreDto) {
        const result = await this.newApiService.store(body);
        return result;
    }

    @Validator(newStoreDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @PermissionAdmin()
    @Status(201)
    @Put("/:id")
    async update(@Body() body: NewStoreDto, @Params("id") id: number) {
        const result = await this.newApiService.update(id, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: number(),
        })
    )
    @Delete("/:id")
    async destroy(@Params("id") id: number) {
        const result = await this.newApiService.destroy(id);
        return result;
    }
}
