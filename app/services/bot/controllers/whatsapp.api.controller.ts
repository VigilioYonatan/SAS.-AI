import { Empresas } from "@/empresas/entities/empresas.entity";
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Post,
    Query,
    Req,
    Res,
} from "@vigilio/express-core";
import type WAWebJS from "whatsapp-web.js";
import {
    whatsappGetQrApi,
    whatsappSendFileApi,
    whatsappSendMessageApi,
    whatsappSendSeenApi,
    whatsappSendTypingApi,
    type WhatsappSendFileApi,
} from "../api";
import { delay, randomNumber, terminal } from "~/libs/helpers";
import { buenosDias, featuresIA, gracias, isWhatsappIA } from "../libs/ai";
import { NOW } from "~/libs/dayjs";
import { promptReplace, transcribeAudio } from "../libs";
import { openAis } from "@/empresas/services/empresas.api.service";
import { BASE_URL } from "@/empresas/libs";
import formidable from "formidable";
import type { RequestVigilio } from "~/config/types";
import fs from "node:fs";
import cron from "node-cron";
import type { Response } from "express";
import enviroments from "~/config/enviroments.config";
import { vpsShowApi } from "@/empresas/services/backup.api.service";
export let chats: Record<string, ["assistant" | "user", string][]> = {};

@Controller("/whatsapp")
export class whatsappApiController {
    @Post("/ready")
    async ready(
        @Body()
        client: { contacts: { name: string; id: { _serialized: string } }[] },
        @Req("empresa") info: Empresas
    ) {
        const empresa = await Empresas.findOne({
            where: { slug: info.slug },
            attributes: ["id", "contacts", "slug"],
        });
        if (!empresa) throw new BadRequestException("Server error");
        if (!empresa.contacts.length || empresa.contacts.length < 10) {
            const contacts = client.contacts;
            const mappedcontacts = contacts.map((contact) => ({
                name: contact.name!,
                telephone: contact.id._serialized,
                isFavorite: false,
                ia: true,
            }));
            await empresa.update({ contacts: mappedcontacts });
        }
        const result = await vpsShowApi();

        await empresa?.update({ enabledBot: true });
        if (enviroments.NODE_ENV === "production") {
            await terminal(
                `docker update --cpus="${
                    result.vps.whatsapp_cpu_low || "0.14"
                }" ${empresa.slug}`
            );
        }
        return {
            success: true,
            message: "OK",
        };
    }
    @Post("/receive-message")
    async receiveMessage(
        @Req("empresa") info: Empresas,
        @Body()
        body: {
            type: string;
            isGroup: boolean;
            content: string | Buffer;
            from: string;
            notifyName: string;
            quotedMessageId: string;
        }
    ) {
        let content = body.content;

        const userId = body.from;
        try {
            const whatsapp = await isWhatsappIA(info.slug, userId);

            if (!whatsapp)
                throw new BadRequestException("whatsapp no permited");
            const { clientVigilio, latestEmpresaUsage, empresa } = whatsapp;

            if (body.isGroup)
                throw new BadRequestException("whatsapp no permited"); //no se admite grupos
            // message.type: chat,sticker,ptt,image,document
            if (!["ptt", "chat"].includes(body.type)) return;

            const random = randomNumber(
                empresa.inteligenceArtificial.timer.start,
                empresa.inteligenceArtificial.timer.finish
            );
            await delay(random);
            // delay en 5 - 15 segundos
            // await whatsappSendTypingApi(empresa, {
            //     telephone: userId,
            //     delay: random,
            // });
            //  cuando cierra el restaurante
            // const findDay = empresa.schedule.find(
            //     (day) => day.id === NOW(empresa).day()
            // );
            // if (
            //     NOW(empresa).isAfter(formatTime(empresa, findDay!.openTime)) &&
            //     NOW(empresa).isBefore(formatTime(empresa, findDay!.closeTime))
            // ) {
            // } else {
            //     throw new BadRequestException("cerrado");
            // }

            if (body.type === "ptt") {
                const media = body.content as Buffer;
                const audioToTxt = await transcribeAudio(empresa.slug, media);
                content = audioToTxt.text;
            }
            const buenas = buenosDias(
                content as string,
                body.notifyName,
                empresa
            );
            const thanks = gracias(content as string);
            const opt =
                Math.random() < 0.5
                    ? { quotedMessageId: body.quotedMessageId }
                    : {};
            if (buenas) {
                // aveces que responda reply

                await whatsappSendMessageApi(empresa, {
                    message: buenas,
                    telephone: userId,
                    options: opt,
                    delay: 3,
                });
                return {
                    success: true,
                    message: "OK",
                };
            }
            if (thanks) {
                await whatsappSendMessageApi(empresa, {
                    message: thanks,
                    telephone: userId,
                    options: opt,
                    delay: 3,
                });

                return {
                    success: true,
                    message: "OK",
                };
            }

            // imporante que esto este acá
            chats[`${info.slug}:${userId}`] = [
                ...(chats[`${info.slug}:${userId}`] ?? []),
                ["user", content as string],
            ];

            if (chats[`${info.slug}:${userId}`]) {
                const messages = chats[`${info.slug}:${userId}`].map(
                    ([role, content]) => ({
                        role,
                        content,
                    })
                );

                // Si el primer mensaje en lastMessages no es del role

                const prompt = await promptReplace(content as string, empresa);

                const completion = await openAis[
                    info.slug
                ].chat.completions.create({
                    model: clientVigilio
                        ? clientVigilio.information.modelai
                        : "gpt-4o-mini",
                    max_tokens: empresa.inteligenceArtificial.max_length,
                    messages: [
                        {
                            role: "user",
                            content: `${prompt} -  Solo enviamen la imagen ( mandarme la url de la imagen) ${BASE_URL(
                                empresa
                            )}/${
                                empresa.slug
                            }/images/products/... , si te pido información de un producto o si te pido una imagen de un producto, por ultimo responde bonito en formato whatsapp`,
                        },
                        { role: "assistant", content: "Entendido, Empezemos." }, // getting start
                        ...messages.slice(
                            -empresa.inteligenceArtificial.memory
                        ), // solos los ultimo 7 mensajes
                    ],
                });

                // actualizamos uso de tokens
                await empresa.update({
                    ...empresa.toJSON(),
                    inteligenceArtificial: {
                        ...empresa.inteligenceArtificial,
                        usage: {
                            ...latestEmpresaUsage,
                            input_tokens:
                                latestEmpresaUsage.input_tokens +
                                completion.usage!.prompt_tokens,
                            output_tokens:
                                latestEmpresaUsage.output_tokens +
                                completion.usage!.completion_tokens,
                        },
                    },
                    payments: {
                        ...empresa.payments,
                        tokens: {
                            tokens:
                                empresa.payments.tokens.tokens -
                                completion.usage!.completion_tokens,
                        },
                    },
                });

                // get message ai
                const completionText = completion.choices[0].message.content!;
                const [removeNote, urlExtraidas] = await featuresIA(
                    empresa,
                    completionText,
                    true
                );

                chats[`${info.slug}:${userId}`] = [
                    ...(chats[`${info.slug}:${userId}`] || []),
                    ["assistant", removeNote],
                ];
                if (empresa.inteligenceArtificial.isChunk) {
                    const chunks = removeNote.split(/(?<!\d)\.\s+/g);
                    for (const chunk of chunks) {
                        await whatsappSendMessageApi(empresa, {
                            message: chunk,
                            telephone: userId,
                            options: opt,
                            delay: 3,
                        });
                    }
                } else {
                    await whatsappSendMessageApi(empresa, {
                        message: removeNote,
                        telephone: userId,
                        options: opt,
                        delay: 3,
                    });
                }

                // enviar imagen
                if (urlExtraidas.length) {
                    for (const url of urlExtraidas) {
                        await whatsappSendFileApi(empresa, {
                            telephone: userId,
                            url,
                            options: { sendMediaAsSticker: true },
                            delay: 3,
                        });
                    }
                }
            }

            return {
                success: true,
                message: "OK",
            };
        } catch (error) {
            chats[`${info.slug}:${userId}`] = [];
        }
    }
    @Post("/send-message")
    async sendMessage(
        @Req("empresa") empresa: Empresas,
        @Query("telephone") telephone: string,
        @Body()
        body: {
            message: string;
            options?: WAWebJS.MessageSendOptions;
        }
    ) {
        try {
            const result = await whatsappSendMessageApi(empresa, {
                ...body,
                telephone,
                delay: 0,
            });
            return result;
        } catch (error) {
            throw new BadRequestException("POSIBLE ERROR: conectar a Whatsapp");
        }
    }

    @Post("/send-file")
    async sendFile(@Req() req: RequestVigilio) {
        const form = formidable();
        const [fields, files] = await form.parse(req);
        const empresa = req.empresa;
        const file = files.file
            ? new File(
                  [await fs.promises.readFile(files.file[0].filepath)],
                  files.file[0].originalFilename ?? "archivo",
                  {
                      type: files.file[0].mimetype!,
                  }
              )
            : null;
        const data: WhatsappSendFileApi = {
            file,
            telephone: (req.query as { telephone: string }).telephone,
            name: fields.name ? fields.name![0] : null,
            options: fields.option ? JSON.parse(fields.option![0]) : null,
            url: fields.url ? JSON.parse(fields.url[0]) : null,
            delay: 0,
        };
        const result = await whatsappSendFileApi(empresa, data);
        return result;
    }

    // send-seen

    @Post("/send-seen")
    async sendSeen(
        @Req("empresa") empresa: Empresas,
        @Query("telephone") telephone: string
    ) {
        const result = await whatsappSendSeenApi(empresa, { telephone });
        return result;
    }
    @Post("/send-typing")
    async sendTyping(
        @Req("empresa") empresa: Empresas,
        @Body()
        body: {
            delay: number;
        },
        @Query("telephone") telephone: string
    ) {
        const result = await whatsappSendTypingApi(empresa, {
            ...body,
            telephone,
        });
        return result;
    }
    @Post("/disconnected")
    async disconnected(@Req("empresa") empresa: Empresas) {
        await empresa.update({ enabledwhatsapp: false });
        return {
            success: true,
            message: "OK",
        };
    }
    @Post("/restart")
    async restart(@Req("empresa") empresa: Empresas) {
        await empresa.update({
            timeWhatsapp: NOW(empresa).add(5, "minute").toDate(),
        });
        const result = await vpsShowApi();
        const comando = `docker exec ${empresa.slug} sh -c "rm -rf ${
            empresa.slug
        }-qr.png && rm -rf .wwebjs_auth && rm -rf .wwebjs_cache" && docker update --cpus="${
            result.vps.whatsapp_cpu_max ?? "0.7"
        }" ${empresa.slug} && docker restart ${empresa.slug} `;
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`Ejecutando comando: ${comando}`);
        await terminal(comando);
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Ejecutó correctamente");

        return {
            success: true,
            message: "Se reinició correctamente.",
        };
    }

    @Get("/qr")
    async qr(@Req("empresa") empresa: Empresas, @Res() res: Response) {
        const result = await whatsappGetQrApi(empresa);
        res.setHeader("Content-Type", "image/png");
        res.send(Buffer.from(result));
    }

    @Post("/logout")
    async logout(@Req("empresa") empresa: Empresas) {
        let comando = "";
        if (empresa.enabledBot) {
            comando = `docker stop ${empresa.slug}`;
            await terminal(comando);
            await empresa.update({ enabledBot: false });
        } else {
            comando = `docker start ${empresa.slug}`;
            await terminal(comando);
            await empresa.update({ enabledBot: true });
        }

        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(`Ejecutando comando: ${comando}`);
        return {
            success: true,
            message: "Se reinició correctamente.",
        };
    }
}
// cada 24 horas
cron.schedule("0 0 * * *", () => {
    chats = {};
});
