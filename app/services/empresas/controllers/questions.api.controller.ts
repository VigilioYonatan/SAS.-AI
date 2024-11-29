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
import {
    questionsStoreDto,
    type QuestionsStoreDto,
} from "../dtos/questions.store.dto";
import { string } from "@vigilio/valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import type { Empresas } from "../entities/empresas.entity";
import { QuestionsApiService } from "../services/questions.api.service";
import {
    questionsUpdateDto,
    type QuestionsUpdateDto,
} from "../dtos/questions.update.dto";

@Injectable()
@Controller("/questions")
export class QuestionsApiController {
    constructor(private readonly questionsApiService: QuestionsApiService) {}

    @PermissionAdmin()
    @Get("/")
    async index(@Req("empresa") empresa: Empresas) {
        const result = await this.questionsApiService.index(empresa);
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
        const result = await this.questionsApiService.show(empresa, id);
        return result;
    }

    @PermissionAdmin()
    @Validator(questionsStoreDto)
    @Status(201)
    @Post("/")
    async store(
        @Body() body: QuestionsStoreDto,
        @Req("empresa") empresa: Empresas
    ) {
        const result = await this.questionsApiService.store(empresa, body);
        return result;
    }

    @PermissionAdmin()
    @Validator(questionsUpdateDto)
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @PermissionAdmin()
    @Status(201)
    @Put("/:id")
    async update(
        @Body() body: QuestionsUpdateDto,
        @Req("empresa") empresa: Empresas,
        @Params("id") id: number
    ) {
        const result = await this.questionsApiService.update(empresa, id, body);
        return result;
    }

    @PermissionAdmin()
    @Pipe(
        objectAsync({
            id: string(),
        })
    )
    @Delete("/:id")
    async destroy(@Params("id") id: number, @Req("empresa") empresa: Empresas) {
        const result = await this.questionsApiService.destroy(empresa, id);
        return result;
    }
}
