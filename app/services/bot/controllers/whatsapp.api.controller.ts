import { Empresas } from "@/empresas/entities/empresas.entity";
import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Params,
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
import {
    buenosDias,
    featuresIA,
    gracias,
    isWhatsappTelegramIA,
    updateTokensEmpresa,
} from "../libs/ai";
import { NOW } from "~/libs/dayjs";
import { interpretarImagen, promptReplace, transcribeAudio } from "../libs";
import { openAis } from "@/empresas/services/empresas.api.service";
import formidable from "formidable";
import type { RequestVigilio } from "~/config/types";
import fs from "node:fs";
import cron from "node-cron";
import type { Response } from "express";
import { NodeSSH } from "node-ssh";
import { vpsShowApi } from "@/empresas/services/backup.api.service";
import enviroments from "~/config/enviroments.config";
import cache from "@vigilio/express-core/cache";
import { objectAsync, string } from "@vigilio/valibot";
import { Pipe } from "@vigilio/express-core/valibot";

export let chats: Record<string, ["assistant" | "user", string][]> = {};
export const chatsWait: Record<string, string[]> = {};

@Controller("/whatsapp")
export class whatsappApiController {
    @Pipe(objectAsync({ name: string() }))
    @Post("/ready/:name")
    async ready(
        @Body()
        client: { contacts: { name: string; id: { _serialized: string } }[] },
        @Req() req: RequestVigilio,
        @Params("name") name: string
    ) {
        const info = req.empresa;
        const whatsapp_mode = info.whatsapp_mode.find((w) => w.name === name);
        if (!whatsapp_mode) {
            throw new BadRequestException("No se encontro subdomain whatsapp");
        }
        if (!whatsapp_mode.enabled) {
            throw new BadRequestException("No esta habilitado");
        }
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
        await empresa?.update({ enabledBot: true });
        cache.delete(`EMPRESA:${empresa.slug}`);

        return {
            success: true,
            message: "OK",
        };
    }
    @Pipe(objectAsync({ name: string() }))
    @Post("/receive-message/:name")
    async receiveMessage(
        @Req() req: RequestVigilio,
        @Body()
        body: {
            type: string;
            isGroup: boolean;
            content: string | Buffer;
            from: string;
            contact: {
                name: string;
                descripcion: string;
                category: string;
                isBusiness: boolean;
            };
            quotedMessageId: string;
        },
        @Params("name") name: string
    ) {
        const info = req.empresa;
        const whatsapp_mode = info.whatsapp_mode.find((w) => w.name === name);
        if (!whatsapp_mode) {
            throw new BadRequestException("No se encontro subdomain whatsapp");
        }
        if (!whatsapp_mode.enabled) {
            throw new BadRequestException("No esta habilitado");
        }
        let content = body.content;

        const userId = body.from;
        try {
            const whatsapp = await isWhatsappTelegramIA(info.slug, userId);

            if (!whatsapp)
                throw new BadRequestException("whatsapp no permited");
            if (!info?.enabledBot)
                throw new BadRequestException("whatsapp desabilitado");

            const { clientVigilio, latestEmpresaUsage, empresa } = whatsapp;
            if (body.isGroup)
                throw new BadRequestException("whatsapp no permited"); //no se admite grupos
            // message.type: chat,sticker,ptt,image,document
            if (!["ptt", "chat", "image"].includes(body.type))
                throw new BadRequestException("no audio o other");
            const opt: WAWebJS.MessageSendOptions =
                Math.random() < 0.5
                    ? {
                          quotedMessageId: body.quotedMessageId,
                          linkPreview: false,
                      }
                    : { linkPreview: false };
            if (body.type === "ptt") {
                const audioToTxt = await transcribeAudio(
                    empresa.slug,
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    Buffer.from((content as any).data)
                );
                content = audioToTxt.text;
            }
            if (body.type === "image") {
                const imageText = await interpretarImagen(
                    whatsapp,
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    Buffer.from((content as any).data)
                );
                if (imageText === "null") {
                    await whatsappSendMessageApi(empresa, whatsapp_mode.name, {
                        message:
                            "No se pudo analizar esta imagen o no se encontró 😢.",
                        telephone: userId,
                        options: opt,
                        delay: 1,
                    });
                    return {
                        success: true,
                        message: "executed",
                    };
                }
                content = `TE ENVIE UNA IMAGEN DE : '${imageText}'  y buscalo en la base de datos  o sigue las instrucciones y te mande la imagen para que no busques imagenes en la base de datos tranquilo.`;
            }

            const existNumber = empresa.contacts.find(
                (contact) => contact.telephone === userId
            );
            if (!existNumber) {
                const mappedcontacts = [
                    ...empresa.contacts,
                    {
                        name: body.contact.name || "unknown",
                        telephone: userId,
                        isFavorite: false,
                        ia: true,
                    },
                ];
                await Empresas.update(
                    { contacts: mappedcontacts },
                    { where: { slug: empresa.slug } }
                );

                cache.delete(`EMPRESA:${empresa.slug}`);
            }
            const random = randomNumber(
                empresa.inteligenceArtificial.timer.start,
                empresa.inteligenceArtificial.timer.finish
            );
            // imporante que esto este acá
            chats[`${info.slug}:${userId}`] = [
                ...(chats[`${info.slug}:${userId}`] ?? []),
                [
                    "user",
                    `${content}.[[HAZ TODAS LAS INSTRUCCIONES, FIJATE EN LA BASE DE DATOS BIEN, QUE TE MANDE NO FALLES, trata de escribir poco, siempre hazme confirmar ¿? y formato whatsapp, cuando mandes listas separalos en \n format whatsapp para que se vea bien , separados y no se vea todo junto y trata de escribir poco. mis datos: ${JSON.stringify(
                        body.contact
                    )}]]` as string,
                ],
            ];
            chatsWait[`${info.slug}:${userId}`] = [
                ...(chatsWait[`${info.slug}:${userId}`] ?? []),
                content as string,
            ];
            if (chatsWait[`${info.slug}:${userId}`].length > 70) {
                throw new BadRequestException("Limite de conversación");
            }
            await delay(random);

            const isSimilar =
                chatsWait[`${info.slug}:${userId}`].at(-1) === content;

            if (!isSimilar) {
                chats[`${info.slug}:${userId}`] = chats[
                    `${info.slug}:${userId}`
                ].filter(
                    ([assistant, val]) =>
                        assistant === "user" && val !== content
                );
                return { success: true, message: "executed" };
            }
            chats[`${info.slug}:${userId}`] = chats[
                `${info.slug}:${userId}`
            ].map(([assistant, val]) => {
                if (assistant === "user" && val === content) {
                    return [
                        assistant,
                        chatsWait[`${info.slug}:${userId}`].join(", "),
                    ];
                }
                return [assistant, val];
            });

            chatsWait[`${info.slug}:${userId}`] = [];

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

            const buenas = buenosDias(
                content as string,
                body.contact.name || "unknown",
                empresa
            );
            const thanks = gracias(content as string);

            if (buenas) {
                // aveces que responda reply

                await whatsappSendMessageApi(empresa, whatsapp_mode.name, {
                    message: buenas,
                    telephone: userId,
                    options: opt,
                    delay: 1,
                });
                return {
                    success: true,
                    message: "OK",
                };
            }
            if (thanks) {
                await whatsappSendMessageApi(empresa, whatsapp_mode.name, {
                    message: thanks,
                    telephone: userId,
                    options: opt,
                    delay: 1,
                });

                return {
                    success: true,
                    message: "OK",
                };
            }

            if (chats[`${info.slug}:${userId}`]) {
                const messages = chats[`${info.slug}:${userId}`].map(
                    ([role, content]) => ({
                        role,
                        content,
                    })
                );

                // Si el primer mensaje en lastMessages no es del role
                const messageAnterior = messages
                    .slice(-5, -1)
                    .map(
                        (c) =>
                            `${c.role === "user" ? "yo" : c.role}:  ${
                                c.content
                            }`
                    );
                const messageActual = `Mensajes Anteriores: ${messageAnterior.join(
                    ", "
                )}.\n
				Mensaje Actual: ${content}. escribe formato whatsapp`;
                const prompt = await promptReplace(
                    whatsapp,
                    messageActual as string,
                    empresa
                );

                const completion = await openAis[
                    info.slug
                ].chat.completions.create({
                    model: clientVigilio
                        ? clientVigilio.information.modelOpenAi
                        : "gpt-4o-mini",
                    max_tokens: empresa.inteligenceArtificial.max_length,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                        {
                            role: "assistant",
                            content: "Entendido, Empezemos.",
                        }, // getting start
                        ...messages.slice(
                            -empresa.inteligenceArtificial.memory
                        ), // solos los ultimo 7 mensajes
                    ],
                });

                // actualizamos uso de tokens
                await updateTokensEmpresa(
                    empresa,
                    latestEmpresaUsage,
                    completion
                );
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
                        await whatsappSendMessageApi(
                            empresa,
                            whatsapp_mode.name,
                            {
                                message: chunk,
                                telephone: userId,
                                options: opt,
                                delay: 2,
                            }
                        );
                    }
                } else {
                    await whatsappSendMessageApi(empresa, whatsapp_mode.name, {
                        message: removeNote,
                        telephone: userId,
                        options: opt,
                        delay: 2,
                    });
                }

                // enviar imagen
                if (urlExtraidas.length < 2) {
                    for (const url of urlExtraidas) {
                        const options = {
                            sendMediaAsSticker: true,
                        };
                        await whatsappSendFileApi(empresa, whatsapp_mode.name, {
                            telephone: userId,
                            url,
                            options,
                            delay: 1,
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
            throw new BadRequestException((error as Error).message);
        }
    }

    @Pipe(objectAsync({ name: string() }))
    @Post("/send-message/:name")
    async sendMessage(
        @Req("empresa") empresa: Empresas,
        @Query("telephone") telephone: string,
        @Body()
        body: {
            message: string;
            options?: WAWebJS.MessageSendOptions;
        },
        @Params("name") name: string
    ) {
        try {
            const result = await whatsappSendMessageApi(empresa, name, {
                ...body,
                telephone,
                delay: 0,
            });
            return result;
        } catch (error) {
            throw new BadRequestException("POSIBLE ERROR: conectar a Whatsapp");
        }
    }

    @Pipe(objectAsync({ name: string() }))
    @Post("/send-file/:name")
    async sendFile(@Req() req: RequestVigilio, @Params("name") name: string) {
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
        const result = await whatsappSendFileApi(empresa, name, data);
        return result;
    }

    // send-seen
    @Pipe(objectAsync({ name: string() }))
    @Post("/send-seen/:name")
    async sendSeen(
        @Req("empresa") empresa: Empresas,
        @Query("telephone") telephone: string,
        @Params("name") name: string
    ) {
        const result = await whatsappSendSeenApi(empresa, name, { telephone });
        return result;
    }
    @Pipe(objectAsync({ name: string() }))
    @Post("/send-typing/:name")
    async sendTyping(
        @Req("empresa") empresa: Empresas,
        @Body()
        body: {
            delay: number;
        },
        @Query("telephone") telephone: string,
        @Params("name") name: string
    ) {
        const result = await whatsappSendTypingApi(empresa, name, {
            ...body,
            telephone,
        });
        return result;
    }

    @Pipe(objectAsync({ name: string() }))
    @Post("/disconnected/:name")
    async disconnected(
        @Req("empresa") emp: Empresas,
        @Params("name") name: string
    ) {
        const whatsapp_mode = emp.whatsapp_mode.find((w) => w.name === name);
        if (!whatsapp_mode) {
            throw new BadRequestException("No se encontro subdomain whatsapp");
        }
        await Empresas.update(
            { enabledBot: false },
            { where: { slug: emp.slug } }
        );
        cache.delete(`EMPRESA:${emp.slug}`);
        return {
            success: true,
            message: "OK",
        };
    }

    @Pipe(objectAsync({ name: string() }))
    @Post("/restart/:name")
    async restart(
        @Req("empresa") empresa: Empresas,
        @Params("name") name: string
    ) {
        const whatsappMode = empresa.whatsapp_mode.find(
            (wh) => wh.name === name
        );
        if (!whatsappMode) {
            throw new BadRequestException("No se encontró wahtsapp");
        }
        await Empresas.update(
            { timeWhatsapp: NOW(empresa).add(1, "minute").format() },
            { where: { slug: empresa.slug } }
        );
        if (whatsappMode.type === "VPS") {
            function onSSH() {
                return new Promise((res, _) => {
                    const ssh = new NodeSSH();
                    // Función para conectar por SSH
                    ssh.connect({
                        host: whatsappMode?.ip!,
                        username: "root",
                        password: whatsappMode?.password!,
                    })
                        .then(() => {
                            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                            console.log("Conectado correctamente a vps");
                            const commands = `docker exec ${empresa.slug} sh -c "rm -rf ${empresa.slug}-qr.png && rm -rf .wwebjs_auth && rm -rf .wwebjs_cache" && docker restart ${empresa.slug} `;
                            return ssh.execCommand(commands);
                        })
                        .then((result) => {
                            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                            console.log(`STDOUT: ${result.stdout}`);
                            console.error(`STDERR: ${result.stderr}`);
                            res(true);
                        })
                        .catch(() => {
                            res(true);
                        })
                        .finally(() => {
                            ssh.dispose();
                        });
                });
            }
            await onSSH();
        } else {
            const comando = `docker exec ${empresa.slug} sh -c "rm -rf ${empresa.slug}-qr.png && rm -rf .wwebjs_auth && rm -rf .wwebjs_cache" && docker restart ${empresa.slug} `;
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log(`Ejecutando comando: ${comando}`);
            await terminal(comando, true);
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log("Ejecutó correctamente");
        }
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message: "Se reinició correctamente.",
        };
    }
    @Pipe(objectAsync({ name: string() }))
    @Post("/update/:name")
    async update(
        @Req("empresa") empresa: Empresas,
        @Params("name") name: string
    ) {
        const whatsappMode = empresa.whatsapp_mode.find(
            (wh) => wh.name === name
        );
        if (!whatsappMode) {
            throw new BadRequestException("No se encontró wahtsapp");
        }
        if (whatsappMode.type === "VPS") {
            const ssh = new NodeSSH();
            try {
                // Conectar por SSH
                await ssh.connect({
                    host: whatsappMode.ip!,
                    username: "root",
                    password: whatsappMode.password!,
                });

                // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                console.log("Conectado correctamente a vps");
                // Eliminar la imagen de Docker
                await ssh.execCommand(
                    `docker ps -a -q --filter ancestor=${enviroments.DOCKER_IMAGE_WHATSAPP} | xargs -I {} docker rm -f {} || true && docker rmi -f ${enviroments.DOCKER_IMAGE_WHATSAPP}|| true`
                );

                // Crear el volumen y ejecutar el contenedor Docker
                await ssh.execCommand(
                    `docker volume create ${
                        empresa.slug
                    } && docker run -d --name ${
                        empresa.slug
                    } -e PORT=5000 -e NODE_ENV=${
                        enviroments.NODE_ENV
                    } -e SESSION_NAME=${
                        empresa.slug
                    } -e VITE_TOKEN_VIGILIO_SERVICES=${
                        enviroments.VITE_TOKEN_VIGILIO_SERVICES
                    } --restart always --memory="${
                        Number(whatsappMode.memory) - 0.2 || "1"
                    }g" --memory-swap="${
                        Number(whatsappMode.memory) - 0.2 || "1"
                    }g" --cpus="${Number(whatsappMode.cpu) - 0.2 || "1"}" -p ${
                        empresa.port
                    }:5000 -v ${empresa.slug}:/app/data ${
                        enviroments.DOCKER_IMAGE_WHATSAPP
                    }`
                );

                console.error("STDERR: error bash a la hora de reiniciar");
            } catch (error) {
                console.error("Hubo un error: ", error);
            } finally {
                ssh.dispose();
            }
        } else {
            const command1 = `docker rm -f ${empresa.slug} || true`;
            const command2 = `docker volume rm ${empresa.slug}  || true`;

            await terminal(command1, true);
            await terminal(command2, true);
            const result = await vpsShowApi();
            await terminal(
                `docker rmi ${enviroments.DOCKER_IMAGE_WHATSAPP} || true`,
                true
            );
            await terminal(
                `docker volume create ${empresa.slug} && docker run -d --name ${
                    empresa.slug
                } -e PORT=5000 -e NODE_ENV=${
                    enviroments.NODE_ENV
                } -e SESSION_NAME=${
                    empresa.slug
                } -e VITE_TOKEN_VIGILIO_SERVICES=${
                    enviroments.VITE_TOKEN_VIGILIO_SERVICES
                } --restart always --memory="${
                    result.vps.whatsapp_ram || "1000"
                }m" --memory-swap="${
                    result.vps.whatsapp_ram || "1000"
                }m" --cpus="${result.vps.whatsapp_cpu_max || "1"}" -p ${
                    empresa.port
                }:5000 -v ${empresa.slug}:/app/data ${
                    enviroments.DOCKER_IMAGE_WHATSAPP
                }`
            );
        }
        await Empresas.update(
            {
                timeWhatsapp: NOW(empresa).add(3, "minute").format(),
            },
            {
                where: {
                    slug: empresa.slug,
                },
            }
        );
        cache.delete(`EMPRESA:${empresa.slug}`);
        return {
            success: true,
            message: "Se reinició correctamente.",
        };
    }

    @Pipe(objectAsync({ name: string() }))
    @Get("/qr/:name")
    async qr(
        @Req("empresa") empresa: Empresas,
        @Res() res: Response,
        @Params("name") name: string
    ) {
        const result = await whatsappGetQrApi(empresa, name);
        res.setHeader("Content-Type", "image/png");
        res.send(Buffer.from(result));
    }
    @Pipe(objectAsync({ name: string() }))
    @Post("/logout/:name")
    async logout(
        @Req("empresa") empresa: Empresas,
        @Params("name") name: string
    ) {
        const whatsappMode = empresa.whatsapp_mode.find(
            (wh) => wh.name === name
        );
        if (!whatsappMode) {
            throw new BadRequestException("No se encontró wahtsapp");
        }
        let comando = "";
        if (whatsappMode.type === "VPS") {
            function onSSH() {
                return new Promise((res, _) => {
                    const ssh = new NodeSSH();
                    // Función para conectar por SSH
                    ssh.connect({
                        host: whatsappMode?.ip!,
                        username: "root",
                        password: whatsappMode?.password!,
                    })
                        .then(async () => {
                            let command = "";
                            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                            console.log("Conectado correctamente a vps");
                            if (empresa.enabledBot) {
                                command = `docker stop ${empresa.slug}`;
                                await Empresas.update(
                                    { enabledBot: false },
                                    {
                                        where: {
                                            slug: empresa.slug,
                                        },
                                    }
                                );
                            } else {
                                comando = `docker start ${empresa.slug}`;
                                await Empresas.update(
                                    { enabledBot: true },
                                    {
                                        where: {
                                            slug: empresa.slug,
                                        },
                                    }
                                );
                            }
                            return ssh.execCommand(command);
                        })
                        .then((result) => {
                            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                            console.log(`STDOUT: ${result.stdout}`);
                            console.error(`STDERR: ${result.stderr}`);
                            res(true);
                        })
                        .catch(() => {
                            res(true);
                        })
                        .finally(() => {
                            ssh.dispose();
                        });
                });
            }
            await onSSH();
        } else {
            if (empresa.enabledBot) {
                comando = `docker stop ${empresa.slug}`;
                await terminal(comando);
                await Empresas.update(
                    { enabledBot: false },
                    {
                        where: {
                            slug: empresa.slug,
                        },
                    }
                );
            } else {
                comando = `docker start ${empresa.slug}`;
                await terminal(comando);
                await Empresas.update(
                    { enabledBot: true },
                    {
                        where: {
                            slug: empresa.slug,
                        },
                    }
                );
            }
        }
        cache.delete(`EMPRESA:${empresa.slug}`);
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
