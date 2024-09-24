import { Empresas } from "@/empresas/entities/empresas.entity";
import {
	BadRequestException,
	Body,
	Controller,
	Params,
	Post,
	Res,
} from "@vigilio/express-core";
import { clientsTelegram } from "../libs/ai";
import type { Response } from "express";
import type { Update } from "node-telegram-bot-api";

@Controller("/telegram")
export class TelegramApiController {
	@Post("/:token")
	async ready(
		@Body()
		body: Update,
		@Params("token") token: string,
		@Res() res: Response,
	) {
		try {
			const empresa = await Empresas.unscoped().findOne({
				where: { telegram_token: token },
				attributes: ["telegram_token", "slug"],
			});
			if (!empresa) throw new BadRequestException("Server error");

			clientsTelegram[empresa.slug].processUpdate(body);
			res.sendStatus(200);
		} catch (error) {}
	}
}
