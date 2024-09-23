import { delay, randomNumber } from "~/libs/helpers";
import { Empresas } from "@/empresas/entities/empresas.entity";
import { promptAssitant } from "./prompt";
import { NOW, restarDays } from "~/libs/dayjs";
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

let clientsTelegram: Record<string, TelegramBot>;
export async function initializeBot(empresa: Empresas) {
    try {
        if (
            !empresa.telegram_token ||
            (empresa.payments.telegram.enabled &&
                restarDays(
                    NOW(empresa).toDate(),
                    empresa.payments.telegram.date as Date
                ) <= 0)
        )
            return;
        const bot = new TelegramBot(empresa.telegram_token, { polling: true });
        bot.on("message", async (msg) => {
            await AiTelegram(empresa, msg);
        });
        clientsTelegram = { ...clientsTelegram, [empresa.slug]: bot };
    } catch (error) {
        delete clientsTelegram[empresa.slug];
    }
}

export async function isWhatsappIA(empresa: string, telephone?: string) {
    let clientVigilio = JSON.parse(cache.get("client-vigilio") ?? "null");
    try {
        if (!clientVigilio) {
            clientVigilio = await getClientVigilio();
            const hour24 = 24 * 3600;
            cache.set("client-vigilio", JSON.stringify(clientVigilio), hour24);
        }
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
            attributes: {
                exclude: ["certificado", "groupWhatsapp"],
            },
        }),
    ]);
    if (!empresa) return null;
    const latestEmpresaUsage = emp!.inteligenceArtificial.usage;
    if (!emp?.enabledBot) return null;
    const isDateNow = restarDays(
        NOW(emp).toDate(),
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
export async function isTelegramIA(empresa: string) {
    let clientVigilio = null;
    try {
        clientVigilio = await getClientVigilio();
    } catch (error) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Error al hacer fetch a la empresa");
    }
    const [emp] = await Promise.all([
        Empresas.findOne({
            where: { slug: empresa },
            attributes: {
                exclude: ["certificado", "groupWhatsapp"],
            },
        }),
    ]);
    if (!emp) return null;
    const latestEmpresaUsage = emp!.inteligenceArtificial.usage;
    if (!emp?.enabledBot) return null;
    const isDateNow = restarDays(
        NOW(emp).toDate(),
        emp.payments.telegram.date!,
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

export let chatsTelegram: Record<
    string,
    Record<string, ["assistant" | "user", string][]>
> = {};
export async function AiTelegram(emp: Empresas, message: TelegramBot.Message) {
    const userId = message.chat.id;
    let body = message.text ?? null;
    const voice = message.voice ?? null;

    if (!voice && !body) return;

    try {
        const telegram = await isTelegramIA(emp.slug);
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
            const fileLink = await clientsTelegram[empresa.slug].getFileLink(
                voice.file_id
            );
            const getVoice = await fetch(fileLink, { method: "GET" });
            const responseGetVoice = await getVoice.arrayBuffer();
            const binaryData = Buffer.from(responseGetVoice);
            const audioToTxt = await transcribeAudio(empresa.slug, binaryData);
            body = audioToTxt.text;
        }
        const buenas = buenosDias(
            body!,
            // biome-ignore lint/suspicious/noExplicitAny: <explanation>
            (message as any)._data.notifyName,
            empresa
        );
        const thanks = gracias(body!);
        if (buenas) {
            await clientsTelegram[empresa.slug].sendMessage(userId, buenas);
            return;
        }
        if (thanks) {
            await clientsTelegram[empresa.slug].sendMessage(userId, thanks);
            return;
        }
        // imporante que esto este acá
        chatsTelegram[empresa.slug][userId] = [
            ...(chatsTelegram[empresa.slug][userId] ?? []),
            ["user", body!],
        ];
        if (chatsTelegram[empresa.slug][userId]) {
            const messages = chatsTelegram[empresa.slug][userId].map(
                ([role, content]) => ({
                    role,
                    content,
                })
            );
            // Si el primer mensaje en lastMessages no es del role
            const prompt = await promptReplace(body!, empresa);

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
            // actualizamos uso de tokens
            await empresa.update({
                ...empresa,
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
            });
            // get message ai
            const completionText = completion.choices[0].message.content!;
            const [removeNote, urlExtraida] = await featuresIA(
                emp,
                completionText,
                true
            );
            await clientsTelegram[empresa.slug].sendMessage(userId, removeNote);
            // enviar imagen
            if (urlExtraida) {
                for (const url of urlExtraida) {
                    await clientsTelegram[empresa.slug].sendPhoto(userId, url, {
                        caption: "",
                    });
                }
            }
        }
    } catch (error) {
        chatsTelegram[emp.slug][userId] = [];
    }
}
/**** bot to admin  *****/
export let chatAssistant: Record<
    string,
    ["user" | "assistant", string, number][]
> = {};
export async function cloudeAi(emp: string, userId: string, message: string) {
    try {
        const whatsapp = await isWhatsappIA(emp);
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
            max_tokens: 300,
            messages: [
                {
                    role: "user",
                    content: promptAssitant(empresa!),
                },
                ...messages.slice(-(empresa.inteligenceArtificial.memory - 1)),
            ],
        });
        // get message ai
        const completionText = completion.choices[0].message.content!;
        await empresa!.update({
            ...empresa!.inteligenceArtificial,
            usage: {
                ...latestEmpresaUsage,
                input_tokens:
                    latestEmpresaUsage.input_tokens +
                    completion.usage!.prompt_tokens,
                output_tokens:
                    latestEmpresaUsage.output_tokens +
                    completion.usage!.completion_tokens,
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
                textoNormal = completionText.replace(m, "").trim();
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
            const urlGet = `${BASE_URL(empresa)}/${c
                .replace(/^\{\{/, "")
                .replace(/\}\}$/, "")}`;
            const date = NOW(empresa).add(1, "days");
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
    // eliminar espacios innecesarios
    return [textoNormal.replace(/\s+/g, " "), urlExtraidas];
}
cron.schedule("0 0 * * *", () => {
    chatsTelegram = {};
});
