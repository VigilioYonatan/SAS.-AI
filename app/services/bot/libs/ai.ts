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
import { promptReplace, transcribeAudio } from ".";
import { BASE_URL } from "@/empresas/libs";
import { UrlsPayment } from "@/urls/entities/urls.payment.entity";
import cache from "@vigilio/express-core/cache";
import { chats } from "../controllers/whatsapp.api.controller";
import { whatsappSendMessageApi } from "../api";
import { Citas } from "@/citas/entities/citas.entities";
import { Op } from "sequelize";
import { Questions } from "@/empresas/entities/questions.entity";
import { ChatCompletion } from "openai/resources";

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
    let clientVigilio = JSON.parse(cache.get("client-vigilio") ?? "null");
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
    const isDateNow = restarDays(
        emp,
        NOW(emp).format(),
        emp.payments.mensual.date!,
        "day"
    );

    if (telephone) {
        const contact = emp!.contacts.find(
            (contact) => contact.telephone === telephone
        );
        if (contact && !contact.ia) return null;
        // si existe en el array de contacto y la ia es false que salga null
    }

    // si se vencio la fecha y no hay tokens
    if (enviroments.NODE_ENV === "production") {
        if (isDateNow < 1 || emp.payments.tokens.tokens < 1) return null;
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

        const { clientVigilio, empresa, latestEmpresaUsage } = telegram;

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
                    content: `${content}.'[[HAZ TODAS LAS INSTRUCCIONES QUE TE MANDE NO FALLES, FIJATE EN LA BASE DE DATOS BIEN,, trata de escribir poco,  siempre hazme confirmar y formato telegram, no sobrecargues información]]`,
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
        Mensaje Actual: ${message}. escribe formato telegram`;
            // Si el primer mensaje en lastMessages no es del role
            const prompt = await promptReplace(
                telegram,
                messageActual,
                empresa
            );

            const completion = await openAis[
                empresa.slug
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
                        }/images/products/... , si te pido información de un producto o si te pido una imagen de un producto, por ultimo responde bonito en formato telegram`,
                    },
                    { role: "assistant", content: "Entendido, Empezemos." }, // getting start
                    ...messages.slice(-empresa.inteligenceArtificial.memory), // solos los ultimo 7 mensajes
                ],
            });
            await updateTokensEmpresa(empresa, latestEmpresaUsage, completion);

            // get message ai
            const completionText = completion.choices[0].message.content!;
            const [removeNote, urlExtraida] = await featuresIA(
                emp,
                completionText,
                true
            );
            if (empresa.inteligenceArtificial.isChunk) {
                const chunks = removeNote.split(/(?<!\d)\.\s+/g);
                for (const chunk of chunks) {
                    await clientsTelegram[emp.slug].sendMessage(userId, chunk);
                    await delay(3);
                }
            } else {
                await clientsTelegram[emp.slug].sendMessage(userId, removeNote);
            }

            // enviar imagen
            if (urlExtraida) {
                for (const url of urlExtraida) {
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
    completion: ChatCompletion
) {
    const empresaUpdate = {
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
                    completion.usage!.prompt_tokens,
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
            model: clientVigilio?.information.modelai ?? "gpt-4o-mini",
            max_tokens: 1000,
            messages: [
                {
                    role: "user",
                    content: `${promptAssitant(empresa!)}. `,
                },
                ...messages.slice(-(empresa.inteligenceArtificial.memory - 1)),
            ],
        });
        // get message ai
        const completionText = completion.choices[0].message.content!;
        await updateTokensEmpresa(empresa, latestEmpresaUsage, completion);

        chatAssistant[`${emp}:${userId}`] = [
            ...(chatAssistant[`${emp}:${userId}`] || []),
            ["assistant", completionText, Date.now()],
        ];

        return completionText;
    } catch (error) {
        return "No disponible.";
    }
}

export async function getClientVigilio() {
    const response = await fetch(
        `${enviroments.VITE_VIGILIO_WEB}/api/information/client`
    );
    const result: {
        success: true;
        information: { whatsappVersion: string; modelai: string };
    } = await response.json();
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
export async function featuresIA(
    empresa: Empresas,
    completionText: string,
    hiddeImage: boolean
): Promise<[string, string[]]> {
    let textoNormal = completionText;

    const baseURL = `${BASE_URL(empresa)}/empresas/${
        empresa.slug
    }/images/products`;
    const urlPattern = new RegExp(`${baseURL}[^\\s]*`, "g");
    const match = completionText.match(urlPattern);

    const urlExtraidas = [];
    if (match?.length) {
        for (const m of match) {
            if (hiddeImage) {
                if (match.length < 2) {
                    textoNormal = completionText.replace(m, "").trim();
                }
                urlExtraidas.push(m);
            }
        }
    }
    // carrito
    const expresionRegular = /\{\{cart\?items=[^}]+\}\}/g;
    const coincidencias = completionText.match(expresionRegular);
    if (coincidencias?.length) {
        for (const c of coincidencias) {
            const hash = Math.random().toString(32).slice(4, 8);
            const urlGet = `${BASE_URL(empresa)}/${c.slice(2, -2)}`;
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

            textoNormal = textoNormal.replace(
                c,
                `${BASE_URL(empresa)}/cart/${hash}`
            );
        }
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
        const message = completionText
            .replace(regex2, "")
            .replace(/\s{2,}/g, "\n");
        textoNormal = message;
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

    const regexNoEncontrado = /\[\[NO_ENCONTRADO:(.*?)\]\]/;
    const matchNoEncontrado = completionText.match(regexNoEncontrado);
    if (matchNoEncontrado) {
        const question = matchNoEncontrado[1];
        await Questions.create({
            question,
            answer: null,
            empresa_id: empresa.id,
        });
        const message = completionText
            .replace(regexNoEncontrado, "")
            .replace(/\s{2,}/g, "");
        textoNormal = message;
    }
    // eliminar espacios innecesarios
    return [textoNormal.trim(), urlExtraidas];
}

export async function searchProducts(empresa: Empresas, word: string) {
    const completion = await openAis[empresa.slug].chat.completions.create({
        model: "gpt-4o-mini",
        max_tokens: 20,
        messages: [
            {
                role: "user",
                content: `Si el mensaje "${word}" es una pregunta o busca informacion de un producto,marca,categorias,ordenes,pedidos,color,memoria,talla algo así si escribe un producto. no preguntas cualquiera.  di "si", sino di "no". solo di "si" y "no" nada mas, sin comillas.`,
            },
        ],
    });
    // get message ai
    const completionText = completion.choices[0].message.content!;
    return completionText === "si";
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
                await whatsappSendMessageApi(empresa, {
                    message: message,
                    telephone: userId,
                    options: {},
                    delay: 3,
                });
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
