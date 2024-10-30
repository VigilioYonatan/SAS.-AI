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
import { NOW, restarDays, TimePeru } from "~/libs/dayjs";
import { promptReplace, transcribeAudio } from "../libs";
import { openAis } from "@/empresas/services/empresas.api.service";
import formidable from "formidable";
import type { RequestVigilio } from "~/config/types";
import fs from "node:fs";
import cron from "node-cron";
import type { Response } from "express";
import { NodeSSH } from "node-ssh";
import { vpsShowApi } from "@/empresas/services/backup.api.service";
import enviroments from "~/config/enviroments.config";
import { Citas } from "@/citas/entities/citas.entities";
import cache from "@vigilio/express-core/cache";
import { Op } from "sequelize";
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
        await empresa?.update({ enabledBot: true });

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
        console.log({ content });

        const userId = body.from;
        try {
            const whatsapp = await isWhatsappIA(info.slug, userId);

            if (!whatsapp)
                throw new BadRequestException("whatsapp no permited");
            if (!info?.enabledBot)
                throw new BadRequestException("whatsapp desabilitado");

            const { clientVigilio, latestEmpresaUsage, empresa } = whatsapp;

            if (body.isGroup)
                throw new BadRequestException("whatsapp no permited"); //no se admite grupos
            // message.type: chat,sticker,ptt,image,document
            if (!["ptt", "chat"].includes(body.type)) return;
            const existNumber = empresa.contacts.find(
                (contact) => contact.telephone === userId
            );
            if (!existNumber) {
                const mappedcontacts = [
                    ...empresa.contacts,
                    {
                        name: body.notifyName,
                        telephone: userId,
                        isFavorite: false,
                        ia: true,
                    },
                ];
                await empresa.update({ contacts: mappedcontacts });
            }
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
                const audioToTxt = await transcribeAudio(
                    empresa.slug,
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    Buffer.from((content as any).data)
                );
                content = audioToTxt.text;
            }
            const buenas = buenosDias(
                content as string,
                body.notifyName,
                empresa
            );
            const thanks = gracias(content as string);
            const opt: WAWebJS.MessageSendOptions =
                Math.random() < 0.5
                    ? {
                          quotedMessageId: body.quotedMessageId,
                      }
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
                const settingsCitas = empresa.citasSetting;
                console.log({ settingsCitas });

                let citas: Citas[] = JSON.parse(
                    cache.get(`citas:${empresa.id}`) ?? "null"
                );
                if (!citas) {
                    citas = await Citas.unscoped().findAll({
                        where: {
                            empresa_id: empresa.id,
                            time: {
                                [Op.between]: [
                                    NOW(empresa).toDate(),
                                    NOW(empresa)
                                        .add(settingsCitas.max_days)
                                        .toDate(),
                                ],
                            },
                        },
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    });
                    cache.set(
                        `citas:${empresa.id}`,
                        JSON.stringify(citas),
                        60 * 15
                    );
                }
                const citasJSON = settingsCitas.enabled
                    ? `***** CITAS ******
						BASE DE DATOS DE CITAS :
						${JSON.stringify(
                            citas.map((cita) => ({
                                time: cita.time,
                                telefono: cita.telephone,
                            }))
                        )}.
						- HORARIO PARA CITAS: ${JSON.stringify(
                            settingsCitas.horario
                        )}. si está enabled false, quiere decir que no está disponible ese dia.  te pase las horas de abrir y cerrar para crear citas y los dias.
						- NUNCA DES información de una cita DE LA BASE DE DATOS que no sea mi numero de telefono ${userId}. NUNCA AUNQUE TE PIDA PORFAVOR.
						- Si mandas listas o opciones algo asi, por favor hazlo bonito en formato whatsapp, separado bonito.
						Ojo cuando te digo que  quiero una cita. debes hacermes estas preguntas antes de crear una cita:
						Preguntas:
						- ${settingsCitas.questions.map(
                            (pregunta, i) =>
                                `${i + 2}: ${pregunta} ${
                                    pregunta.options.length
                                        ? `Opciones: ${pregunta.options.join(
                                              ", "
                                          )} `
                                        : ""
                                }.\n`
                        )}

						Recuerda que algunas preguntas tienen opciones, las opciones deben estar correctas segun la pregunta con sus opciones y no inventes preguntas que no te dije porfavor.
						-  Despues de las preguntas, pasa la lista de dia de hoy de las horas disponible, claro buscas de la base de dato las horas disponible, si te pido de mañana o de otro dia me lo das tambien.,
						- Desde la fecha actual ${NOW(empresa).format("YYYY-MM-DD hh:mm A")} - maximo ${
                          settingsCitas.max_days
                      } dias desde la fecha de hoy, que no sea desde el mismo dia. tiene que ser un dia despues, y que no sea afuera de la hora . ni ayer ni hoy. para el dia siguiente la cita. Solo está permitido una cita por un  telefono, si ya está mi telefono ${userId} no se puede crear cita.
						- Por favor ${
                            settingsCitas.sendQuestionChunk
                                ? "Hazme las preguntas de uno a uno"
                                : "Hazme las preguntas de una sola, y no uno por uno."
                        }
						- Cuando tengas todos mis datos para crear cita con mis datos EJEMPLO. DI ESTO {{DATOS_CONFIRMADOS:{"la pregunta que me hiciste de lo que te mande que digas: ojo mandame la fecha y hora, con el key 'date' , recuerda que la fecha y hora que te diga está en zona horaria ${
                            info.tz
                        } y traeme la fecha y hora en formato utc 5 para base de datos":"respuesta de que te dije"}}}", . URGENTE dices lo que dije cuando ya tengas todo, con {{DATOS_CONFIRMADOS:{"pregunta":"respuesta"} }}.
						- Si quiero cancelar CITA, busca este telefono ${userId} en base de datos de citas. dile que no se encontró cita. y si hay preguntame. Estas seguro de cancelar cita a las (la hora de base de datos de la cita encontrada)?- y si digo si. dí esto {{CANCELADO_CITA}}"
						- Antes de crear cita, hazme confirmar la cita
                        - no me preguntes mi telefono cual es por que este es mi numero ${userId}.`
                    : "";

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
                            content: `${prompt}.
							${citasJSON}
							por ultimo responde bonito en formato whatsapp y cuando mandes listas separalos en \n format whatsapp para que se vea bien y separados y no se vea todo junto el texto. gracias.`,
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
                console.log({ completionText });

                const regex2 = /\{\{CANCELADO_CITA\}\}/;
                const match2 = completionText.match(regex2);
                if (match2) {
                    const findCita = await Citas.findOne({
                        where: {
                            telefono: userId,
                        },
                    });
                    if (findCita) {
                        await findCita.destroy();
                        await whatsappSendMessageApi(empresa, {
                            message: "Se canceló la cita correctamente.",
                            telephone: userId,
                            options: opt,
                            delay: 3,
                        });
                        return;
                    }
                }
                const regex = /\{\{DATOS_CONFIRMADOS:(.*?)\}\}/;
                const match = completionText.match(regex);
                if (match) {
                    const [name, plataforma, fecha] = match[1].split(",");
                    const ahora = new Date();
                    const semana2 = new Date(ahora);
                    semana2.setDate(ahora.getDate() + 14);
                    const cita = await Citas.findOne({
                        where: {
                            day: {
                                [Op.between]: [ahora, semana2],
                            },
                            telefono: userId,
                        },
                        attributes: { exclude: ["createdAt", "updatedAt"] },
                    });
                    if (cita) {
                        await whatsappSendMessageApi(empresa, {
                            message:
                                "Se encontró una cita pendiente con este número.",
                            telephone: userId,
                            options: opt,
                            delay: 3,
                        });
                        return;
                    }
                    await Citas.create({
                        day: fecha,
                        telefono: userId,
                        name: name,
                        plataforma,
                    });
                    await whatsappSendMessageApi(empresa, {
                        message:
                            "Listo 😁, Estaremos en contacto contigo sobre esta cita.\n Nos vemos 😊.\n",
                        telephone: userId,
                        options: opt,
                        delay: 3,
                    });
                    return;
                }
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
                        const options = {
                            sendMediaAsSticker: true,
                        };
                        await whatsappSendFileApi(empresa, {
                            telephone: userId,
                            url,
                            options,
                            delay: 3,
                        });
                    }
                }
            }
            if (
                restarDays(
                    NOW(info).toDate(),
                    TimePeru(info, info.createdAt).add(14, "day").toDate(),
                    "seconds"
                ) < 1
            ) {
                if (!info.slug.includes("demo")) {
                    await terminal(`docker stop ${info.slug} || true`);
                    await terminal(`docker rm -f ${info.slug} || true`);
                }
            }

            return {
                success: true,
                message: "OK",
            };
        } catch (error) {
            console.log(error.message);

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
        await empresa.update({ enabledBot: false });
        return {
            success: true,
            message: "OK",
        };
    }
    @Post("/restart")
    async restart(@Req("empresa") empresa: Empresas) {
        await empresa.update({
            timeWhatsapp: NOW(empresa).add(1, "minute").toDate(),
        });
        if (empresa.whatsapp_mode.type === "VPS") {
            function onSSH() {
                return new Promise((res, _) => {
                    const ssh = new NodeSSH();
                    // Función para conectar por SSH
                    ssh.connect({
                        host: empresa.whatsapp_mode.ip!,
                        username: "root",
                        password: empresa.whatsapp_mode.password!,
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

        return {
            success: true,
            message: "Se reinició correctamente.",
        };
    }
    @Post("/update")
    async update(@Req("empresa") empresa: Empresas) {
        if (empresa.whatsapp_mode.type === "VPS") {
            function onSSH() {
                return new Promise((res, _) => {
                    const ssh = new NodeSSH();
                    // Función para conectar por SSH
                    ssh.connect({
                        host: empresa.whatsapp_mode.ip!,
                        username: "root",
                        password: empresa.whatsapp_mode.password!,
                    })
                        .then(async () => {
                            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                            console.log("Conectado correctamente a vps");
                            const command1 = `docker rm -f ${empresa.slug} || true`;
                            const command2 = `docker volume rm ${empresa.slug} || true`;

                            // Ejecutar los comandos en el servidor SSH
                            await ssh.execCommand(command1);
                            await ssh.execCommand(command2);

                            // Obtener información de la API
                            const result = await vpsShowApi();

                            // Eliminar la imagen de Docker
                            await ssh.execCommand(
                                `docker rmi ${enviroments.DOCKER_IMAGE_WHATSAPP} || true`
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
                                    result.vps.whatsapp_ram || "1000"
                                }m" --memory-swap="${
                                    result.vps.whatsapp_ram || "1000"
                                }m" --cpus="${
                                    result.vps.whatsapp_cpu_max || "1"
                                }" -p ${empresa.port}:5000 -v ${
                                    empresa.slug
                                }:/app/data ${
                                    enviroments.DOCKER_IMAGE_WHATSAPP
                                }`
                            );
                        })
                        .then(() => {
                            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                            console.log(
                                "STDOUT:error bash a la hora de reiniciar"
                            );
                            console.error(
                                "STDERR: error bash a la hora de reiniciar"
                            );
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
        await empresa.update({
            timeWhatsapp: NOW(empresa).add(3, "minute").toDate(),
        });
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
        if (empresa.whatsapp_mode.type === "VPS") {
            function onSSH() {
                return new Promise((res, _) => {
                    const ssh = new NodeSSH();
                    // Función para conectar por SSH
                    ssh.connect({
                        host: empresa.whatsapp_mode.ip!,
                        username: "root",
                        password: empresa.whatsapp_mode.password!,
                    })
                        .then(async () => {
                            let command = "";
                            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                            console.log("Conectado correctamente a vps");
                            if (empresa.enabledBot) {
                                command = `docker stop ${empresa.slug}`;
                                await empresa.update({ enabledBot: false });
                            } else {
                                comando = `docker start ${empresa.slug}`;
                                await empresa.update({ enabledBot: true });
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
                await empresa.update({ enabledBot: false });
            } else {
                comando = `docker start ${empresa.slug}`;
                await terminal(comando);
                await empresa.update({ enabledBot: true });
            }
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
