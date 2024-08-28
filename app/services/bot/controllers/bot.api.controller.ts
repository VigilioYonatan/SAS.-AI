import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";
import {
    Controller,
    Get,
    Params,
    Post,
    Req,
    Res,
    InternalServerErrorException,
    NotFoundException,
    BadRequestException,
} from "@vigilio/express-core";
import type { Response } from "express";
import { MessageMedia } from "whatsapp-web.js";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import fs from "node:fs";
import formidable from "formidable";
import { clientsWhatsapp, isWhatsappIA, openAis } from "../libs/ai";
import enviroments from "~/config/enviroments.config";
import type { InformationEntity } from "@/information/entities/information.entity";
import type { RequestVigilio } from "~/config/types";
import { pathUploads } from "@/uploads/libs/helpers";

@Controller("/bot")
export class BotApiController {
    @PermissionAdmin()
    @Get("/qr")
    qr(
        @Req("information") information: InformationEntity,
        @Res() res: Response
    ) {
        const qrImage = `${pathUploads()}/${information.slug}/qr/${
            information.slug
        }-qr.png`;
        return res.sendFile(qrImage);
    }
    @PermissionAdmin()
    @Post("/logout")
    async cerrarSession(@Req("information") information: InformationEntity) {
        try {
            await clientsWhatsapp[information.slug].logout();
            await clientsWhatsapp[information.slug].initialize();
            return {
                success: true,
                message: "Cerró sesión correctamente",
            };
        } catch (error) {
            throw new BadRequestException(`Error: ${(error as Error).message}`);
        }
    }
    @PermissionAdmin()
    @Pipe(objectAsync({ telephone: string() }))
    @Post("/message/:telephone")
    async message(
        @Req() req: RequestVigilio,
        @Params("telephone") telephone: string
    ) {
        try {
            const information = req.information;
            const form = formidable();
            const [fields, files] = await form.parse(req);
            if (fields.message) {
                clientsWhatsapp[information!.slug].sendMessage(
                    telephone,
                    fields.message[0],
                    {
                        sendMediaAsDocument: true,
                    }
                );
            }
            if (files.message) {
                const filePath = files.message[0].filepath;
                const bufferFile = Buffer.from(
                    fs.readFileSync(filePath)
                ).toString("base64");
                // delete filepath
                fs.unlinkSync(filePath);
                const file = await new MessageMedia(
                    files.message[0].mimetype!,
                    bufferFile,
                    files.message[0].originalFilename,
                    files.message[0].size
                );
                await clientsWhatsapp[information!.slug].sendMessage(
                    telephone,
                    file
                );
            }
            return {
                success: true,
                message: "Se envió mensaje correctamente",
            };
        } catch (error) {
            throw new InternalServerErrorException(
                "Error en el sistema, dirigase al desarrollador"
            );
        }
    }

    @Pipe(objectAsync({ name: string() }))
    @Get("/description/:name")
    async description(
        @Params("name") name: string,
        @Req("information") information: InformationEntity
    ) {
        const whatsapp = await isWhatsappIA(information.slug);
        if (!whatsapp)
            throw new NotFoundException(
                "Hubo un problema al usar la ia, Recomiendo fijarse en los limites token"
            );
        const completion = await openAis[
            information.slug
        ].chat.completions.create({
            model:
                whatsapp.clientVigilio?.information.modelai ||
                enviroments.MODEL_AI,
            max_tokens: 300,
            messages: [
                {
                    role: "user",
                    // insert custom prompt
                    content: `Dame solo la "descripcion" y no otro en formato de tienda virtual de producto de ${name} en español  y no traer fuentes y no menciones otra cosa que no sea la descripción, y sin comillas "" por favor`,
                },
            ],
        });
        const completionText = completion.choices[0].message.content;
        const latestInformationUsage = information!.inteligenceArtificial.usage;
        await information.update({
            ...information.inteligenceArtificial,
            usage: {
                ...latestInformationUsage,
                input_tokens:
                    latestInformationUsage.input_tokens +
                    completion.usage!.prompt_tokens,
                output_tokens:
                    latestInformationUsage.input_tokens +
                    completion.usage!.completion_tokens,
            },
        });

        return {
            success: true,
            description: completionText,
        };
    }
}
