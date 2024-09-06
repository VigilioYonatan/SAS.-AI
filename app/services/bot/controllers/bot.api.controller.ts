import {
    Controller,
    Get,
    Params,
    Req,
    NotFoundException,
    Post,
    Body,
    BadRequestException,
} from "@vigilio/express-core";
import { Pipe } from "@vigilio/express-core/valibot";
import { objectAsync, string } from "@vigilio/valibot";
import { buenosDias, gracias, isWhatsappIA } from "../libs/ai";
import enviroments from "~/config/enviroments.config";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { Client } from "whatsapp-web.js";
import { randomNumber, terminal } from "~/libs/helpers";
import {
    whatsappRemoveQR,
    whatsappSendFileApi,
    whatsappSendMessageApi,
    whatsappSendTypingApi,
} from "../api";
import { formatTime, NOW } from "~/libs/dayjs";
import { promptReplace, transcribeAudio } from "../libs";
import type WAWebJS from "whatsapp-web.js";
import { openAis } from "@/empresas/services/empresas.api.service";
import { BASE_URL } from "@/empresas/libs";

export const chats: Record<
    string,
    Record<string, ["assistant" | "user", string][]>
> = {};

@Controller("/bot")
export class BotApiController {
    @Post("/whatsapp/ready")
    async whatsappReady(
        @Body() client: Client,
        @Req("empresa") info: Empresas
    ) {
        const empresa = await Empresas.findOne({
            where: { slug: info.slug },
            attributes: ["contacts"],
        });
        if (!empresa) throw new BadRequestException("Server error");
        if (!empresa.contacts.length) {
            const contacts = await client.getContacts();
            const mappedcontacts = contacts.map((contact) => ({
                name: contact.name!,
                telephone: contact.id._serialized,
                isFavorite: false,
                ia: true,
            }));
            await empresa.update({ contacts: mappedcontacts });
        }

        await empresa?.update({ enabledBot: true });
    }
    @Post("/whatsapp/receive-message")
    async whatsappReceiveMessage(
        @Req("empresa") info: Empresas,
        @Body()
        body: {
            type: string;
            isGroup: boolean;
            content: string | Buffer;
            from: string;
            props: WAWebJS.Message;
        }
    ) {
        let content = body.content;
        const userId = body.from;
        const { props } = body;
        try {
            const whatsapp = await isWhatsappIA(info.slug, userId);
            if (!whatsapp) return;
            const { clientVigilio, latestEmpresaUsage, empresa } = whatsapp;

            if (body.isGroup) return; //no se admite grupos
            // message.type: chat,sticker,ptt,image,document
            if (!["ptt", "chat"].includes(body.type)) return;

            const random = randomNumber(
                empresa.inteligenceArtificial.timer.start,
                empresa.inteligenceArtificial.timer.finish
            );

            // delay en 5 - 15 segundos
            await whatsappSendTypingApi(empresa, {
                telephone: userId,
                delay: random,
            });

            //  cuando cierra el restaurante
            const findDay = empresa.schedule.find(
                (day) => day.id === NOW().day()
            );
            if (
                NOW().isAfter(formatTime(findDay!.openTime)) &&
                NOW().isBefore(formatTime(findDay!.closeTime))
            ) {
            } else {
                return;
            }

            if (body.type === "ptt") {
                const media = body.content as Buffer;
                const audioToTxt = await transcribeAudio(empresa.slug, media);
                content = audioToTxt.text;
            }
            const buenas = buenosDias(
                content as string,
                // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                (props as any)._data.notifyName,
                empresa
            );
            const thanks = gracias(content as string);
            if (buenas) {
                await whatsappSendMessageApi(empresa, {
                    message: buenas,
                    telephone: userId,
                    options: { quotedMessageId: props.id.id }, // id del mensaje
                });
                return;
            }
            if (thanks) {
                await whatsappSendMessageApi(empresa, {
                    message: thanks,
                    telephone: userId,
                    options: { quotedMessageId: props.id.id }, // id del mensaje
                });

                return;
            }

            // imporante que esto este acá
            (chats[info.slug] ?? [])[userId] = [
                ...((chats[info.slug] ?? [])[userId] ?? []),
                ["user", content as string],
            ];

            if (chats[info.slug][userId]) {
                const messages = chats[info.slug][userId].map(
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
                        ? clientVigilio.empresa.modelai
                        : enviroments.MODEL_AI,
                    max_tokens: 300,
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
                        ...empresa.toJSON().inteligenceArtificial,
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
                });

                // get message ai
                const completionText = completion.choices[0].message.content!;
                let removeNote = completionText.replace(/\s*\(.*?\)\s*/g, " ");
                // quitar las imagenes para enviar imagen
                const baseURL = `${BASE_URL(empresa)}/${empresa.slug}/${
                    empresa.slug
                }/images/products`;
                const urlPattern = new RegExp(`${baseURL}[^\\s]*`, "g");
                const match = removeNote.match(urlPattern);
                const urlExtraida = match ? match[0] : null;

                if (urlExtraida) {
                    removeNote = removeNote.replace(urlPattern, "").trim();
                }

                chats[info.slug][userId] = [
                    ...(chats[info.slug][userId] || []),
                    ["assistant", removeNote],
                ];
                await whatsappSendMessageApi(empresa, {
                    message: removeNote,
                    telephone: userId,
                    options: { quotedMessageId: props.id.id }, // id del mensaje
                });
                // enviar imagen
                if (urlExtraida) {
                    await whatsappSendFileApi(empresa, {
                        telephone: userId,
                        url: urlExtraida,
                        option: { sendMediaAsSticker: true },
                    });
                }
            }
        } catch (error) {
            chats[info.slug][userId] = [];
        }
    }
    @Post("/whatsapp/disconnected")
    async whatsappDisconnected(empresa: Empresas) {
        await empresa.update({ enabledBot: false });
    }
    @Post("/whatsapp/restart")
    async whatsappRestart(empresa: Empresas) {
        try {
            await whatsappRemoveQR(empresa);
            await terminal(`docker container stop ${empresa.slug}`);
            await terminal(`docker container start ${empresa.slug}`);
            return {
                success: true,
                message: "Se reinició correctamente.",
            };
        } catch (error) {}
    }

    @Pipe(objectAsync({ name: string() }))
    @Get("/description/:name")
    async description(
        @Params("name") name: string,
        @Req("empresa") empresa: Empresas
    ) {
        const whatsapp = await isWhatsappIA(empresa.slug);
        if (!whatsapp)
            throw new NotFoundException(
                "Hubo un problema al usar la ia, Recomiendo fijarse en los limites token"
            );
        const completion = await openAis[empresa.slug].chat.completions.create({
            model:
                whatsapp.clientVigilio?.empresa.modelai || enviroments.MODEL_AI,
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
        const latestEmpresaUsage = empresa!.inteligenceArtificial.usage;
        await empresa.update({
            ...empresa.inteligenceArtificial,
            usage: {
                ...latestEmpresaUsage,
                input_tokens:
                    latestEmpresaUsage.input_tokens +
                    completion.usage!.prompt_tokens,
                output_tokens:
                    latestEmpresaUsage.input_tokens +
                    completion.usage!.completion_tokens,
            },
        });

        return {
            success: true,
            description: completionText,
        };
    }
}
