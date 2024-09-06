import { randomNumber } from "~/libs/helpers";
import { InformationEntity } from "@/information/entities/information.entity";
import { promptAssitant } from "./prompt";
import { NOW, restarDays } from "~/libs/dayjs";
import cron from "node-cron";
import enviroments from "~/config/enviroments.config";
import {
    checkCPUUsage,
    checkDiskUsage,
    updateVigilioServices,
} from "~/libs/os";
import { openAis } from "@/information/services/information.api.service";

export function buenosDias(
    query: string,
    name: string,
    information: InformationEntity
) {
    const messages = [
        `¡Hola ${name}! Bienvenido a ${information.name_empresa}, ¿en qué puedo ayudarte hoy? 😊.`,
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

// export async function loadAnthropic() {
// 	const anthropic = await import("@anthropic-ai/sdk");
// 	return new anthropic.Anthropic({
// 		apiKey: enviroments.CLOUDE_TOKEN,
// 	});
// }

// export async function loadMistral() {
// 	const mistral = await import("@mistralai/mistralai");

// 	return new mistral.default(enviroments.MISTRAL_TOKEN);
// }

// export async function initializeBot(slug: string, _token: string) {
//     try {
//         if (clientsTelegram[slug]) {
//             return;
//         }

//         const bot = new TelegramBot(
//             "7504180864:AAG70K8XyFmAM7qGf2OWF6DGP2tkrJyInOU",
//             { polling: true }
//         );
//         bot.on("message", async (msg) => {
//             const chatId = msg.chat.id;
//             const messageText = msg.text;
//             // Envía una respuesta al usuario
//             bot.sendMessage(
//                 chatId,
//                 `Recibido tu mensaje: ${chatId} : ${messageText}`
//             );
//             await AiTelegram(slug, msg);
//         });
//         clientsTelegram = { ...clientsTelegram, [slug]: bot };
//     } catch (error) {
//         delete clientsTelegram[slug];
//     }
// }

export async function isWhatsappIA(empresa: string, telephone?: string) {
    let clientVigilio = null;
    try {
        clientVigilio = await getClientVigilio();
    } catch (error) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("Error al hacer fetch a la empresa");
    }
    const [information] = await Promise.all([
        InformationEntity.findOne({
            where: { slug: empresa },
            attributes: {
                exclude: ["certificado", "groupWhatsapp"],
            },
        }),
    ]);
    if (!information) return null;
    const latestInformationUsage = information!.inteligenceArtificial.usage;
    if (!information?.enabledBot) return null;
    const isDateNow = restarDays(NOW().toDate(), information.payments.ia.date!);
    if (!information?.enabledBot) return null;
    if (telephone) {
        const contact = information!.contacts.find(
            (contact) => contact.telephone === telephone
        );
        if (contact && !contact.ia) return null;
        // si existe en el array de contacto y la ia es false que salga null
    }
    if (isDateNow <= 0 && latestInformationUsage.input_tokens <= 0) {
        // actualizamos uso de tokens
        await information.update({
            ...information,
            inteligenceArtificial: {
                ...information.inteligenceArtificial,
                usage: {
                    ...latestInformationUsage,
                    input_tokens: 0,
                    output_tokens: 0,
                },
            },
        });
    }

    return {
        information,
        clientVigilio,
        latestInformationUsage,
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
    const [information] = await Promise.all([
        InformationEntity.findOne({
            where: { slug: empresa },
            attributes: {
                exclude: ["certificado", "groupWhatsapp"],
            },
        }),
    ]);
    if (!information) return null;
    const latestInformationUsage = information!.inteligenceArtificial.usage;
    if (!information?.enabledBot) return null;
    const isDateNow = restarDays(
        NOW().toDate(),
        information.payments.telegram.date!
    );
    if (isDateNow <= 0 && latestInformationUsage.input_tokens <= 0) {
        // actualizamos uso de tokens
        await information.update({
            ...information,
            inteligenceArtificial: {
                ...information.inteligenceArtificial,
                usage: {
                    ...latestInformationUsage,
                    input_tokens: 0,
                    output_tokens: 0,
                },
            },
        });
    }

    return {
        information,
        clientVigilio,
        latestInformationUsage,
    };
}

// export const chatsTelegram: Record<
//     string,
//     Record<string, ["assistant" | "user", string][]>
// > = {};
// export async function AiTelegram(
//     empresa: string,
//     message: TelegramBot.Message
// ) {
//     const userId = message.chat.id;
//     let body = message.text ?? null;
//     const voice = message.voice ?? null;

//     if (!voice && !body) return;

//     try {
//         const telegram = await isTelegramIA(empresa);
//         if (!telegram) return;
//         const { clientVigilio, information, latestInformationUsage } = telegram;

//         const random = randomNumber(
//             information.inteligenceArtificial.timer.start,
//             information.inteligenceArtificial.timer.finish
//         );
//         // delay en 5 - 15 segundos
//         await delay(random);
//         //  cuando cierra el restaurante
//         const findDay = information.schedule.find(
//             (day) => day.id === NOW().day()
//         );
//         if (
//             NOW().isAfter(formatTime(findDay!.openTime)) &&
//             NOW().isBefore(formatTime(findDay!.closeTime))
//         ) {
//         } else {
//             return;
//         }
//         if (voice) {
//             const fileLink = await clientsTelegram[empresa].getFileLink(
//                 voice.file_id
//             );
//             const getVoice = await fetch(fileLink, { method: "GET" });
//             const responseGetVoice = await getVoice.arrayBuffer();
//             const binaryData = Buffer.from(responseGetVoice);
//             const audioToTxt = await transcribeAudio(empresa, binaryData);
//             body = audioToTxt.text;
//         }
//         const buenas = buenosDias(
//             body!,
//             // biome-ignore lint/suspicious/noExplicitAny: <explanation>
//             (message as any)._data.notifyName,
//             information
//         );
//         const thanks = gracias(body!);
//         if (buenas) {
//             await clientsTelegram[empresa].sendMessage(userId, buenas);
//             return;
//         }
//         if (thanks) {
//             await clientsTelegram[empresa].sendMessage(userId, thanks);
//             return;
//         }
//         // imporante que esto este acá
//         chatsTelegram[empresa][userId] = [
//             ...(chatsTelegram[empresa][userId] ?? []),
//             ["user", body!],
//         ];
//         if (chatsTelegram[empresa][userId]) {
//             const messages = chatsTelegram[empresa][userId].map(
//                 ([role, content]) => ({
//                     role,
//                     content,
//                 })
//             );
//             // Si el primer mensaje en lastMessages no es del role
//             const prompt = await promptReplace(body!, information);

//             const completion = await openAis[
//                 information.slug
//             ].chat.completions.create({
//                 model: clientVigilio
//                     ? clientVigilio.information.modelai
//                     : enviroments.MODEL_AI,
//                 max_tokens: 300,
//                 messages: [
//                     {
//                         role: "user",
//                         content: `${prompt} -  Solo enviamen la imagen ( mandarme la url de la imagen) ${enviroments.VITE_URL}/images/products/... , si te pido información de un producto o si te pido una imagen de un producto, por ultimo responde bonito en formato whatsapp`,
//                     },
//                     { role: "assistant", content: "Entendido, Empezemos." }, // getting start
//                     ...messages.slice(
//                         -information.inteligenceArtificial.memory
//                     ), // solos los ultimo 7 mensajes
//                 ],
//             });
//             // actualizamos uso de tokens
//             await information.update({
//                 ...information,
//                 inteligenceArtificial: {
//                     ...information.inteligenceArtificial,
//                     usage: {
//                         ...latestInformationUsage,
//                         input_tokens:
//                             latestInformationUsage.input_tokens +
//                             completion.usage!.prompt_tokens,
//                         output_tokens:
//                             latestInformationUsage.output_tokens +
//                             completion.usage!.completion_tokens,
//                     },
//                 },
//             });
//             // get message ai
//             const completionText = completion.choices[0].message.content!;
//             let removeNote = completionText.replace(/\s*\(.*?\)\s*/g, " ");
//             // quitar las imagenes para enviar imagen
//             const baseURL = `${BASE_URL(information)}/${
//                 information.slug
//             }/images/products`;
//             const urlPattern = new RegExp(`${baseURL}[^\\s]*`, "g");
//             const match = removeNote.match(urlPattern);
//             const urlExtraida = match ? match[0] : null;

//             if (urlExtraida) {
//                 removeNote = removeNote.replace(urlPattern, "").trim();
//             }

//             chatsTelegram[empresa][userId] = [
//                 ...(chatsTelegram[empresa][userId] || []),
//                 ["assistant", removeNote],
//             ];

//             await clientsTelegram[empresa].sendMessage(userId, removeNote);
//             // enviar imagen
//             if (urlExtraida) {
//                 await clientsTelegram[empresa].sendMessage(userId, urlExtraida);
//             }
//         }
//     } catch (error) {
//         chatsTelegram[empresa][userId] = [];
//     }
// }
/**** bot to admin  *****/
export const chatAssistant: Record<
    string,
    Record<string, ["user" | "assistant", string, number][]>
> = {};
export async function cloudeAi(
    empresa: string,
    userId: string,
    message: string
) {
    try {
        const whatsapp = await isWhatsappIA(empresa);
        if (!whatsapp) return;
        const { clientVigilio, information, latestInformationUsage } = whatsapp;

        chatAssistant[empresa][userId] = [
            ...(chatAssistant[empresa][userId] || []),
            ["user", message, Date.now()],
        ];
        // mapped messages to messages cloude
        const messages = chatAssistant[empresa][userId].map(
            ([role, content]) => ({
                role,
                content,
            })
        );

        const completion = await openAis[
            information.slug
        ].chat.completions.create({
            model: clientVigilio
                ? clientVigilio.information.modelai
                : enviroments.MODEL_AI,
            max_tokens: 300,
            messages: [
                {
                    role: "user",
                    content: promptAssitant(information!),
                },
                ...messages.slice(
                    -(information.inteligenceArtificial.memory - 1)
                ),
            ],
        });
        // get message ai
        const completionText = completion.choices[0].message.content!;
        const removeNote = completionText.replace(/\s*\(.*?\)\s*/g, " ");
        await information!.update({
            ...information!.inteligenceArtificial,
            usage: {
                ...latestInformationUsage,
                input_tokens:
                    latestInformationUsage.input_tokens +
                    completion.usage!.prompt_tokens,
                output_tokens:
                    latestInformationUsage.output_tokens +
                    completion.usage!.completion_tokens,
            },
        });

        chatAssistant[empresa][userId] = [
            ...(chatAssistant[empresa][userId] || []),
            ["assistant", removeNote, Date.now()],
        ];

        return removeNote;
    } catch (error) {
        return "Hubo un error al usar ia, posible errores no hay tokens.";
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
export const chatAssistantWeb: Record<
    string,
    ["user" | "assistant", string][]
> = {};
export async function cloudeAiWeb(
    empresa: string,
    token: string,
    message: string
) {
    try {
        const whatsapp = await isWhatsappIA(empresa);
        if (!whatsapp) return;
        const { clientVigilio, information, latestInformationUsage } = whatsapp;

        (chatAssistant[empresa] ?? [])[token] = [
            ...((chatAssistant[empresa] ?? [])[token] || []),
            ["user", message, Date.now()],
        ];
        // mapped messages to messages cloude
        const messages = (chatAssistant[empresa] ?? [])[token].map(
            ([role, content]) => ({
                role,
                content,
            })
        );

        const completion = await openAis[
            information.slug
        ].chat.completions.create({
            model: clientVigilio
                ? clientVigilio.information.modelai
                : enviroments.MODEL_AI,
            max_tokens: 300,
            messages: [
                {
                    role: "user",
                    content: `${promptAssitant(
                        information!
                    )} - Por ultimo, cada vez que te pida informacion de un producto  trate de responder con una imagen o link. si envias imagen , que sea en etiqueta image <img width="100" height="100" class="w-[100px] h-[150px] rounded-md object-contain"/>   y si te pido links por favor etiqueta html <a href="..." class="text-primary font-semibold"></a> , responde como si fuera html con espacios usando br en productos o pedidos. para que lea bien.  y no uses ** mejor utiliza la etiqueta <b></b>`,
                },
                ...messages.slice(
                    -(information.inteligenceArtificial.memory - 1)
                ),
            ],
        });
        // get message ai
        const completionText = completion.choices[0].message.content!;
        const removeNote = completionText.replace(/\s*\(.*?\)\s*/g, " ");
        await information!.update({
            ...information!.inteligenceArtificial,
            usage: {
                ...latestInformationUsage,
                input_tokens:
                    latestInformationUsage.input_tokens +
                    completion.usage!.prompt_tokens,
                output_tokens:
                    latestInformationUsage.output_tokens +
                    completion.usage!.completion_tokens,
            },
        });

        (chatAssistant[empresa] ?? [])[token] = [
            ...((chatAssistant[empresa] ?? [])[token] || []),
            ["assistant", removeNote, Date.now()],
        ];

        return removeNote;
    } catch (error) {
        return "Hubo un error al usar ia, posible errores no hay tokens.";
    }
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
        // Verificar CPU
        if (usageCPU > cpuThreshold) {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log("Advertencia: El uso de CPU es alto");
            await updateVigilioServices({ enabled: false });
        } else {
            await updateVigilioServices({ enabled: true });
        }

        // Verificar Disco
        if (usedPercentage > diskThreshold) {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log("Advertencia: El uso del disco es alto");
            await updateVigilioServices({ enabled: false });
        } else {
            await updateVigilioServices({ enabled: true });
        }
    }
    await monitorSystem();
});
