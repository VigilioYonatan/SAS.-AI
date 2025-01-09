import {
    Controller,
    Get,
    Params,
    Query,
    Req,
    Injectable,
} from "@vigilio/express-core";
import { type PaginatorModel } from "../libs";
import { PaginatorApiServices } from "../services/paginator.api.service";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import type { Request } from "express";

@Controller("/paginator")
@Injectable()
export class PaginatorApiController {
    constructor(private readonly paginatorApiServices: PaginatorApiServices) {}

    @Pipe(
        objectAsync({
            model: string([
                // custom(
                // 	(val) => paginatorModel.includes(val as PaginatorModel),
                // 	"Modelo no válido",
                // ),
            ]),
        })
    )
    @Get("/:model")
    async index(
        @Params("model") model: PaginatorModel,
        @Query()
        query: {
            offset: string;
            limit: string;
            search: string;
        } & Record<string, string>,
        @Req() req: Request
    ) {
        const result = await this.paginatorApiServices.index({
            model,
            query,
            req,
        });
        return result;
    }
}
