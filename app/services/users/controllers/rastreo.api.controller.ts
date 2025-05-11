import {
    Body,
    Controller,
    Injectable,
    Post,
    Req,
    UnauthorizedException,
} from "@vigilio/express-core";
import { RastreoApiService } from "../services/rastreo.api.service";
import type { RequestVigilio } from "~/config/types";
import { Validator } from "@vigilio/express-core/valibot";
import { hmacAuthMiddleware } from "~/libs/security.middleware";
import enviroments from "~/config/enviroments.config";
import {
    type VisitantesPageDto,
    visitantesPageDto,
} from "../dtos/visitantes.page.dto";

@Injectable()
@Controller("/rastreo")
export class RastreoApiController {
    constructor(private readonly rastreoApiService: RastreoApiService) {}

    @Validator(visitantesPageDto)
    @Post("/")
    async store(
        @Req() req: RequestVigilio,
        @Body()
        body: VisitantesPageDto
    ) {
        const clientIp = req.ip;
        const forwardedIp = req.headers["x-forwarded-for"];
        const userAgent = req.headers["user-agent"] || "";
        const realIp = (
            forwardedIp
                ? typeof forwardedIp === "string"
                    ? forwardedIp.split(",")[0].trim()
                    : forwardedIp[0].trim()
                : clientIp
        ) as string;
        const empresa = req.empresa;
        const user = req.user;
        const isValid = hmacAuthMiddleware(req, enviroments.HMAC_CHAT_AI);
        if (!isValid) {
            throw new UnauthorizedException("unauthorized");
        }
        if (body.api_key !== empresa.scrapping.api_key) {
            throw new UnauthorizedException("API KEY no valid");
        }
        const result = await this.rastreoApiService.store({
            empresa,
            realIp,
            body,
            userAgent,
            user,
        });
        return result;
    }
}
