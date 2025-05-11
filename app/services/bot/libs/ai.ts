import { delay, randomNumber } from "~/libs/helpers";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { promptAssitant } from "./prompt";
import dayjs, { NOW, restarDays, TimePeru } from "~/libs/dayjs";
import cron from "node-cron";
import enviroments from "~/config/enviroments.config";
import {
    checkCPUUsage,
    checkDiskUsage,
    updateVigilioServices,
} from "~/libs/os";
import { openAis } from "@/empresas/services/empresas.api.service";
import TelegramBot from "node-telegram-bot-api";
import { modelAiByEmpresa, promptReplace, transcribeAudio } from ".";
import { BASE_URL } from "@/empresas/libs";
import { UrlsPayment } from "@/urls/entities/urls.payment.entity";
import cache from "@vigilio/express-core/cache";
import { chats } from "../controllers/whatsapp.api.controller";
import { whatsappSendMessageApi } from "../api";
import { Citas } from "@/citas/entities/citas.entities";
import { Op } from "sequelize";
import { CompletionUsage } from "openai/resources";

export function buenosDias(query: string, name: string, empresa: Empresas) {
    const messages = [
        `¡Hola ${name}! Bienvenido a ${empresa.name_empresa}, ¿en qué puedo ayudarte hoy? 😊.`,
        `¡Hola ${name}! ¿Cómo puedo ayudarte el día de hoy? 😀.\n `,
    ];
    if (
        [
            "buenos dias",
            "hola",
            "buenas",
            "buenas noches",
            "buenas tardes",
        ].includes(query.toLowerCase())
    ) {
        return messages[randomNumber(0, 1)];
    }
    return null;
}
export function gracias(query: string) {
    const messages = [
        "De nada, estamos aquí para ayudarte 😊.\n",
        "Que bien, estamos aquí para ayudarte 😊.\n .",
    ];
    if (["gracias", "muchas gracias"].includes(query.toLowerCase())) {
        return messages[randomNumber(0, 1)];
    }
    return null;
}

export let clientsTelegram: Record<string, TelegramBot>;
export async function initializeBot(empresa: Empresas, token: string) {
    const bot = new TelegramBot(token);
    if (clientsTelegram?.[empresa.slug]) {
        delete clientsTelegram[empresa.slug];
    }
    clientsTelegram = { ...clientsTelegram, [empresa.slug]: bot };

    clientsTelegram[empresa.slug].setWebHook(
        `${BASE_URL(empresa)}/api/telegram/${token}`
    );

    clientsTelegram[empresa.slug].on("message", async (msg) => {
        await AiTelegram(empresa, msg);
    });

    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(`Conectado TELEGRAM BOT ${token}`);
}

export async function isWhatsappTelegramIA(
    empresa: string,
    telephone?: string
) {
    let clientVigilio: ClientVigilio = JSON.parse(
        cache.get("client-vigilio") || "null"
    );
    try {
        if (!clientVigilio) {
            clientVigilio = await getClientVigilio();
            const hour24 = 24 * 60 * 1000;
            cache.set("client-vigilio", JSON.stringify(clientVigilio), hour24);
        }
    } catch (error) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Error al hacer fetch a la empresa");
    }
    const where = !Number.isNaN(Number(empresa))
        ? { id: empresa }
        : { slug: empresa };
    let emp: Empresas | null = JSON.parse(
        cache.get(`EMPRESA:${empresa}`) ?? "null"
    );
    if (!emp) {
        const e = await Empresas.findOne({
            where,
        });
        if (!e) return null;
        emp = e.toJSON() as Empresas;
        const hour24 = 24 * 60 * 60 * 1000;
        cache.set(`EMPRESA:${empresa}`, JSON.stringify(e.slug), hour24);
    }
    if (!emp) return null;

    const latestEmpresaUsage = emp!.inteligenceArtificial.usage;

    const vencioWebCuota =
        emp.cuota_web &&
        restarDays(emp, NOW(emp), emp.cuota_web.date, "day") < -3;
    const vencioChatCuota =
        emp.cuota_chat &&
        restarDays(emp, NOW(emp), emp.cuota_chat.date, "day") < -3;

    if (telephone) {
        const contact = emp!.contacts.find(
            (contact) => contact.telephone === telephone
        );
        if (contact && !contact.ia) return null;
        // si existe en el array de contacto y la ia es false que salga null
    }

    // si se vencio la fecha y no hay tokens
    if (enviroments.NODE_ENV === "production") {
        if (vencioWebCuota && vencioChatCuota) return null;
        if (emp.payments.tokens.tokens < 1) return null;
    }

    return {
        empresa: emp,
        clientVigilio,
        latestEmpresaUsage,
    };
}
export async function isRedesIA(empresa: string) {
    let clientVigilio = null;
    try {
        clientVigilio = await getClientVigilio();
    } catch (error) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Error al hacer fetch a la empresa");
    }
    const where = !Number.isNaN(Number(empresa))
        ? { id: empresa }
        : { slug: empresa };
    const [emp] = await Promise.all([
        Empresas.findOne({
            where,
        }),
    ]);
    if (!emp) return null;
    const latestEmpresaUsage = emp!.inteligenceArtificial.usage;
    if (!emp?.enabledBot) return null;
    const isDateNow = restarDays(
        emp,
        NOW(emp).format(),
        emp.payments.redes.date!,
        "day"
    );
    // si se vencio la fecha y no hay tokens
    if (isDateNow < 1 || emp.payments.tokens.tokens < 1) return null;
    return {
        empresa: emp,
        clientVigilio,
        latestEmpresaUsage,
    };
}

export let chatsTelegram: Record<string, ["assistant" | "user", string][]> = {};
export async function AiTelegram(emp: Empresas, message: TelegramBot.Message) {
    const userId = message.chat.id;
    let body = message.text ?? null;
    const voice = message.voice ?? null;
    if (!voice && !body) return;
    try {
        const telegram = await isWhatsappTelegramIA(emp.slug);

        if (!telegram) return;

        const { empresa, latestEmpresaUsage } = telegram;

        const random = randomNumber(
            empresa.inteligenceArtificial.timer.start,
            empresa.inteligenceArtificial.timer.finish
        );
        // delay en 5 - 15 segundos
        await delay(random);
        //  cuando cierra el restaurante
        if (voice) {
            const fileLink = await clientsTelegram[emp.slug].getFileLink(
                voice.file_id
            );
            const getVoice = await fetch(fileLink, { method: "GET" });
            const responseGetVoice = await getVoice.arrayBuffer();
            const binaryData = Buffer.from(responseGetVoice);
            const audioToTxt = await transcribeAudio(empresa.slug, binaryData);
            body = audioToTxt.text;
        }
        const buenas = buenosDias(body!, "", empresa);
        const thanks = gracias(body!);
        if (buenas) {
            await clientsTelegram[emp.slug].sendMessage(userId, buenas);
            return;
        }
        if (thanks) {
            await clientsTelegram[emp.slug].sendMessage(userId, thanks);
            return;
        }
        // imporante que esto este acá
        chatsTelegram[`${empresa.slug}:${userId}`] = [
            ...(chatsTelegram[`${empresa.slug}:${userId}`] ?? []),
            ["user", body!],
        ];
        if (chatsTelegram[`${empresa.slug}:${userId}`]) {
            const messages = chatsTelegram[`${empresa.slug}:${userId}`].map(
                ([role, content]) => ({
                    role,
                    content: `${content}.'[[HAZ TODAS LAS INSTRUCCIONES QUE TE MANDE NO FALLES, FIJATE EN LA BASE DE DATOS BIEN,, trata de escribir poco,  siempre hazme confirmar y formato telegram, no sobrecargues información ${
                        empresa.inteligenceArtificial.settings?.enabled_cart
                            ? "fijate en las cantidades/unidad por producto (stock significa cantidad ilimitado)"
                            : ""
                    } ]]`,
                })
            );
            const messageAnterior = messages
                .slice(-5, -1)
                .map(
                    (c) => `${c.role === "user" ? "yo" : c.role}:  ${c.content}`
                );
            const messageActual = `Mensajes Anterior: ${messageAnterior.join(
                ", "
            )}.\n
        Mensaje Actual: ${message.text}. escribe formato telegram`;
            // Si el primer mensaje en lastMessages no es del role
            const prompt = await promptReplace(
                telegram,
                messageActual,
                empresa
            );

            const completion = await openAis[
                empresa.slug
            ].chat.completions.create({
                model: modelAiByEmpresa(telegram),
                max_tokens: empresa.inteligenceArtificial.max_length,
                messages: [
                    {
                        role: "user",
                        content: `${prompt} -  Solo enviamen la imagen ( mandarme la url de la imagen) ${BASE_URL(
                            empresa
                        )}/${
                            empresa.slug
                        }/images/products/... , si te pido información de un producto o si te pido una imagen de un producto, por ultimo responde bonito en formato telegram`,
                    },
                    { role: "assistant", content: "Entendido, Empezemos." }, // getting start
                    ...messages.slice(-empresa.inteligenceArtificial.memory), // solos los ultimo 7 mensajes
                ],
                stream: true,
                stream_options: { include_usage: true },
            });
            let contenido = "";
            let contenido2 = "";
            let removeContent = "";
            let usages: CompletionUsage | null = null;
            for await (const chunk of completion) {
                let texto = "";
                if (chunk.usage) {
                    usages = chunk.usage;
                }
                const content = chunk.choices[0]?.delta?.content || "";

                contenido += content;
                contenido2 += content;
                [removeContent] = cleanPrompt(empresa, contenido, false);
                texto = contenido2;
                const parrafos = texto.split(/\n\s*\n/);
                if (
                    empresa.inteligenceArtificial.isChunk &&
                    parrafos.length > 1
                ) {
                    for (const parrafo of parrafos) {
                        if (parrafo.length) {
                            await clientsTelegram[emp.slug].sendMessage(
                                userId,
                                parrafo
                            );
                        }
                    }
                    contenido2 = contenido2
                        .replace(/[^.!?]+[.!?]+/g, "")
                        .trim();
                }
            }
            if (!empresa.inteligenceArtificial.isChunk) {
                await clientsTelegram[emp.slug].sendMessage(
                    userId,
                    removeContent
                );
            }
            // await featuresIA(empresa, contenido);
            await updateTokensEmpresa(empresa, latestEmpresaUsage, usages!);
            const [__, urlExtraidas] = cleanPrompt(empresa, contenido, false);

            // enviar imagen
            if (urlExtraidas) {
                for (const url of urlExtraidas) {
                    await clientsTelegram[emp.slug].sendPhoto(userId, url, {
                        caption: "",
                    });
                }
            }
        }
    } catch (error) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log((error as Error).message);
        chatsTelegram[`${emp.slug}:${userId}`] = [];
    }
}

export async function updateTokensEmpresa(
    empresa: Empresas,
    latestEmpresaUsage: {
        input_tokens: number;
        output_tokens: number;
    },
    completion: CompletionUsage
) {
    const empresaUpdate = {
        inteligenceArtificial: {
            ...empresa.inteligenceArtificial,
            usage: {
                ...latestEmpresaUsage,
                input_tokens:
                    latestEmpresaUsage.input_tokens + completion.prompt_tokens,
                output_tokens:
                    latestEmpresaUsage.output_tokens +
                    completion.completion_tokens,
            },
        },
        payments: {
            ...empresa.payments,
            tokens: {
                tokens:
                    empresa.payments.tokens.tokens - completion.prompt_tokens,
            },
        },
    };
    cache.set(
        `IA_TOKENS:${empresa.slug}`,
        JSON.stringify({ ...empresaUpdate })
    );
    // await Empresas.update(empresaUpdate, { where: { slug: empresa.slug } });

    cache.set(
        `EMPRESA:${empresa.slug}`,
        JSON.stringify({ ...empresa, ...empresaUpdate })
    );
}

/**** bot to admin  *****/
export let chatAssistant: Record<
    string,
    ["user" | "assistant", string, number][]
> = {};
export async function cloudeAi(emp: string, userId: string, message: string) {
    try {
        const whatsapp = await isWhatsappTelegramIA(emp);
        if (!whatsapp) return;
        const { clientVigilio, empresa, latestEmpresaUsage } = whatsapp;
        chatAssistant = {
            ...chatAssistant,
            [`${emp}:${userId}`]: [
                ...(chatAssistant[`${emp}:${userId}`] ?? []),
                ["user", message, Date.now()],
            ],
        };

        // mapped messages to messages cloude
        const messages = chatAssistant[`${emp}:${userId}`].map(
            ([role, content]) => ({
                role,
                content,
            })
        );

        const completion = await openAis[empresa.slug].chat.completions.create({
            model: modelAiByEmpresa(whatsapp),
            max_tokens: 1000,
            messages: [
                {
                    role: "user",
                    content: `${promptAssitant(empresa!)}. `,
                },
                // guardamos los mensajes anteriores
                ...messages.slice(-(empresa.inteligenceArtificial.memory - 1)),
            ],
        });
        // get message ai
        const completionText = completion.choices[0].message.content!;
        // await updateTokensEmpresa(empresa, latestEmpresaUsage, "completion");

        chatAssistant[`${emp}:${userId}`] = [
            ...(chatAssistant[`${emp}:${userId}`] || []),
            ["assistant", completionText, Date.now()],
        ];

        return completionText;
    } catch (error) {
        return "No disponible.";
    }
}
export type ClientVigilio = {
    success: true;
    information: {
        whatsappVersion: string;
        modelDeepSeek: string;
        modelOpenAi: string;
    };
};
export async function getClientVigilio() {
    const response = await fetch(
        `${enviroments.VITE_VIGILIO_WEB}/api/information/client`
    );
    const result: ClientVigilio = await response.json();
    return result;
}

// clean CHAT
// cada 24 horas se limpiara el chat assistant de ambos para consumir menos recursos
cron.schedule("0 0 * * *", async () => {
    async function monitorSystem() {
        const cpuThreshold = 0.85; // 85%
        const diskThreshold = 90; // 90% de uso del disco
        const usageCPU = checkCPUUsage();
        const usedPercentage = await checkDiskUsage();
        const update = {
            cpu: usageCPU * 100,
            disk: usedPercentage,
        };
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(update);

        await updateVigilioServices(update);
    }
    await monitorSystem();
});

export function cleanPrompt(
    empresa: Empresas,
    completionText: string,
    hiddeImage: boolean
): [string, string[], [string, string][]] {
    let textoNormal = completionText;

    const baseURL = `${BASE_URL(empresa)}/empresas/${
        empresa.slug
    }/images/products`;
    const urlPattern = new RegExp(`${baseURL}[^\\s]*`, "g");
    const match = textoNormal.match(urlPattern);

    const urlExtraidas = [];
    if (match?.length) {
        for (const m of match) {
            if (hiddeImage) {
                if (match.length < 2) {
                    textoNormal = textoNormal.replace(m, "").trim();
                }
                urlExtraidas.push(m);
            }
        }
    }
    // cart items
    const expresionRegular = /\{\{cart\?items=[^}]+\}\}/g;
    const coincidencias = textoNormal.match(expresionRegular);
    let links: [string, string][] = [];
    if (coincidencias?.length) {
        links = coincidencias.map((c) => {
            const hash = Math.random().toString(32).slice(4, 8);
            textoNormal = textoNormal.replace(
                c,
                `${BASE_URL(empresa)}/cart/${hash}`
            );
            const urlGet = `${BASE_URL(empresa)}/${c.slice(2, -2)}`;
            return [hash, urlGet];
        });
    }
    // cancelado cita
    const regex2 = /\[\[CANCELADO_CITA:(.*?)\]\]/;
    const match2 = textoNormal.match(regex2);
    if (match2) {
        const message = textoNormal
            .replace(regex2, "")
            .replace(/\s{2,}/g, "\n");
        textoNormal = message;
    }

    // datos confirmado cita
    const regex = /\[\[DATOS_CONFIRMADOS:(.*?)\]\]/;
    const matchCitas = textoNormal.match(regex);
    if (matchCitas) {
        const message = textoNormal.replace(regex, "").replace(/\s{2,}/g, "\n");
        textoNormal = message;
    }
    return [textoNormal.replace(/\[\[([^\]]+)\]\]/g, ""), urlExtraidas, links];
}
export async function featuresIA(
    empresa: Empresas,
    completionText: string,
    links: [string, string][]
): Promise<string> {
    let textoNormal = completionText;

    if (links?.length) {
        await Promise.all(
            links.map(async ([hash, urlGet]) => {
                const date = NOW(empresa).add(1, "days").format();
                const findHash = await UrlsPayment.findOne({
                    where: { hash, empresa_id: empresa.id },
                });
                if (findHash) {
                    await findHash.update({ url: urlGet, time: date });
                } else {
                    await UrlsPayment.create({
                        hash,
                        url: urlGet,
                        empresa_id: empresa.id,
                        time: date,
                    });
                }
            })
        );
    }
    const now = NOW(empresa).utc().format();
    const after = NOW(empresa)
        .add(empresa.citasSetting.max_days, "days")
        .utc()
        .format();
    const regex2 = /\[\[CANCELADO_CITA:(.*?)\]\]/;
    const match2 = completionText.match(regex2);
    if (match2) {
        const { hour, telefono } = JSON.parse(match2[1]);
        const findCita = await Citas.findOne({
            where: {
                telephone: `${
                    (telefono as string).startsWith(empresa.dial_code)
                        ? telefono
                        : `${empresa.dial_code}${telefono}`
                }@c.us`,
                empresa_id: empresa.id,
                hour: {
                    [Op.like]: `${(hour as string).slice(0, 2)}%`,
                },
            },
        });

        if (findCita) {
            await findCita.destroy();
            cache.delete(`citas:${empresa.slug}`);
        }
    }
    const regex = /\[\[DATOS_CONFIRMADOS:(.*?)\]\]/;
    const matchCitas = completionText.match(regex);
    if (matchCitas) {
        const { hour, date, telefono, ...rest } = JSON.parse(matchCitas[1]);
        const citas = await Citas.findAll({
            where: {
                date: {
                    [Op.between]: [now, after],
                },
                telephone: {
                    [Op.like]: `%${telefono}%`,
                },
                empresa_id: empresa.id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
        });
        const citasHour = await Citas.findAll({
            where: {
                date,
                hour: {
                    [Op.like]: `${(hour as string).slice(0, 2)}%`,
                },
                empresa_id: empresa.id,
            },
            attributes: {
                exclude: ["createdAt", "updatedAt"],
            },
            raw: true,
        });

        if (citas.length >= empresa.citasSetting.maxCitas) {
            textoNormal =
                "Parece que has alcanzado el límite para crear citas.";
        } else if (citasHour.length >= empresa.citasSetting.maxCitasForHour) {
            textoNormal =
                "Lo sentimos, ya hay citas programadas para esa hora.";
        } else {
            await Citas.create({
                telephone: `${empresa.dial_code}${telefono}@c.us`,
                date,
                hour,
                answers: rest,
                empresa_id: empresa.id,
            });
            const message = completionText
                .replace(regex, "")
                .replace(/\s{2,}/g, "\n");
            textoNormal = message;
            if (empresa.citasSetting.sendAlert > 0) {
                const time = dayjs
                    .tz(`${date} ${hour}`, empresa.tz)
                    .subtract(empresa.citasSetting.sendAlert, "hour")
                    .utc()
                    .format() as unknown as Date;

                sendMessageCron({
                    empresa,
                    userId: telefono,
                    date: time,
                    name: "",
                });
            }
            cache.delete(`citas:${empresa.slug}`);
        }
    }

    // eliminar espacios innecesarios
    return textoNormal.trim();
}

interface SendMessageCronProps {
    empresa: Empresas;
    name: string;
    userId: string;
    date: Date;
}
export function sendMessageCron({
    empresa,
    name,
    userId,
    date,
}: SendMessageCronProps) {
    const task = cron.schedule("*/1 * * * *", async () => {
        const now = new Date();
        if (now.getTime() >= date.getTime()) {
            const message = `Hola *${name}*😊, nos comunicamos contigo para informarte que has realizado una reserva de cita *${TimePeru(
                empresa,
                date
            ).format(
                "YYYY-MM-DD HH:mm A"
            )}*. Por favor, no dudes en contactarnos si tienes alguna pregunta`;
            chats[`${empresa.slug}:${userId}`] = [
                ...(chats[`${empresa.slug}:${userId}`] || []),
                ["assistant", message],
            ];
            try {
                const name = empresa.whatsapp_mode!.find(
                    (w) => w.name === "docker"
                )!.name;

                await sendMessageToClient(empresa, name, userId, message);

                // Detener el cron job después de que se ejecute
                task.stop();
            } catch (error) {}
        }
    });
}

export async function executeCronDate(date: Date, cb: () => void) {
    const task = cron.schedule("*/1 * * * *", async () => {
        const now = new Date();
        if (now.getTime() >= date.getTime()) {
            cb();
            // Detener el cron job después de que se ejecute
            task.stop();
        }
    });
}
cron.schedule("0 0 * * *", () => {
    chatsTelegram = {};
});
cron.schedule("*/4 * * * *", async () => {
    const empresas = await Empresas.unscoped().findAll({
        attributes: ["id", "slug"],
    });
    for (const empresa of empresas) {
        const iaTokens = JSON.parse(
            cache.get(`IA_TOKENS:${empresa.slug}`) ?? "null"
        );

        if (iaTokens) {
            await empresa.update(iaTokens);
            cache.delete(`IA_TOKENS:${empresa.slug}`);
        }
    }
});
export async function sendMessageToClient(
    empresa: Empresas,
    name: string,
    telephone: string,
    message: string
) {
    chats[`${empresa.slug}:${telephone}`] = [
        ...(chats[`${empresa.slug}:${telephone}`] || []),
        ["assistant", message],
    ];
    await whatsappSendMessageApi(empresa, name, {
        telephone,
        message,
        delay: 2,
        options: { linkPreview: false },
    });
}
