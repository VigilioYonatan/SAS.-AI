import {
    Args,
    Connect,
    SocketController,
    Disconnect,
    Event,
    IO,
    Socket,
} from "@vigilio/express-core";
import * as socket from "socket.io";
import { WebsocketsService } from "../services/websockets.service";
import {
    chatAssistant,
    cleanPrompt,
    cloudeAi,
    executeCronDate,
    featuresIA,
    isWhatsappTelegramIA,
    updateTokensEmpresa,
} from "@/bot/libs/ai";
import { Injectable } from "@vigilio/express-core";
import { openAis } from "@/empresas/services/empresas.api.service";
import cron from "node-cron";
import { modelAiByEmpresa, promptReplace } from "@/bot/libs";
import { Empresas } from "@/empresas/entities/empresas.entity";
import type { CompletionUsage } from "openai/resources";
import cache from "@vigilio/express-core/cache";
export function HTMLPROMPT(_empresa: Empresas) {
    return `- Responde con formato html, envia links ó urls con <a clas="text-primary"></a>  estilos de tailwind underline, (tablas solo carrito de compra ) , etc y usar <b class="font-bold"></b> en vez de **   en palabras importantes. Por ultimo SIEMPRE usa solo un <br> para separar parrafos, usa etiqueta a <a href="url" class='text-primary underline'>text</a> para links o enlaces, etc. usa <ul class="list-disc list-inside"><li class="ml-4"></li></ul>   para listas, pedidos, información,separare preguntas 1.,2., opciones, items, etc. etiqueta de letra p,h1,span esos text-sm, imagenes maximo width 100px,  html limpio no markdown, los .jpg, o extension imagen en img.`;
}
export let chatAssistantWeb: Record<
    string,
    [string, "user" | "assistant", string][]
> = {};
export let usersInWeb: Record<string, string[]> = {};
async function cloudeAiWeb(
    emp: string,
    token: string,
    data: { id: string; message: string },
    io: socket.Socket
) {
    try {
        const whatsapp = await isWhatsappTelegramIA(emp);
        if (!whatsapp)
            return "En estos momentos no estoy disponible. Inteligencia Artificial o Token es requerido";
        const { empresa, latestEmpresaUsage } = whatsapp;

        chatAssistantWeb = {
            ...(chatAssistantWeb ?? {}),
            [`${emp}:${token}`]: [
                ...(chatAssistantWeb[`${emp}:${token}`] ?? []),
                [data.id, "user", data.message],
            ],
        };
        if (
            chatAssistantWeb[`${emp}:${token}`].length > 30 &&
            empresa.isTemplate
        ) {
            return "Gracias por probar nuestra inteligencia artificial, más información en https://www.vigilio-services.com";
        }
        if (chatAssistantWeb[`${emp}:${token}`].length > 300) {
            return "Gracias por probar nuestra inteligencia Artificial, puedes probarlo de nuevo más tarde.";
        }

        // mapped messages to messages cloude
        const messages = chatAssistantWeb[`${emp}:${token}`].map(
            ([_, role, content]) => ({
                role,
                content:
                    role === "user"
                        ? `${content} '[[${HTMLPROMPT(empresa)}]]'`
                        : content,
            })
        );

        const messageAnterior = messages
            .slice(-5, -1)
            .map(
                (c) =>
                    `${c.role === "user" ? "yo" : c.role}:  ${c.content.replace(
                        /\[\[([^\]]+)\]\]/g,
                        ""
                    )}`
            );
        const messageActual = `Mensajes Anterior: ${messageAnterior.join(
            ", "
        )}.\n
        Mensaje Actual: ${data.message}.`;
        const prompt = await promptReplace(whatsapp, messageActual!, empresa);

        const completion = await openAis[empresa.slug].chat.completions.create({
            model: modelAiByEmpresa(whatsapp),
            max_tokens: empresa.inteligenceArtificial.max_length,
            messages: [
                {
                    role: "user",
                    content: `${prompt}.\n ${HTMLPROMPT(empresa)}`,
                },
                ...messages.slice(-(empresa.inteligenceArtificial.memory - 1)),
            ],
            stream: true,
            stream_options: { include_usage: true },
        });
        const id = Date.now().toString(32).slice(4);
        let contenido = "";
        let contenido2 = "";
        let removeContent = "";
        let usages: CompletionUsage | null = null;
        const texts: string[] = [];
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
            if (parrafos.length > 1) {
                for (const parrafo of parrafos) {
                    texts.push(parrafo.trim());
                }
                contenido2 = contenido2.replace(/.+\n\s*\n/g, "").trim();
            }
            if (empresa.inteligenceArtificial.isChunk) {
                io.to(token).emit("chat:send-message", [
                    id,
                    "assistant",
                    removeContent,
                ]);
            }
        }

        if (!empresa.inteligenceArtificial.isChunk) {
            io.to(token).emit("chat:send-message", [
                id,
                "assistant",
                removeContent,
            ]);
        }
        const [__, _, links] = cleanPrompt(empresa, contenido, false);

        // agrega citas etc
        await featuresIA(empresa, contenido, links);

        // completion.
        // get message ai
        await updateTokensEmpresa(empresa, latestEmpresaUsage, usages!);
        chatAssistantWeb[`${emp}:${token}`] = [
            ...(chatAssistantWeb[`${emp}:${token}`] || []),
            [id, "assistant", removeContent],
        ];

        chatAssistantWeb[`${emp}:${token}`] = chatAssistantWeb[
            `${emp}:${token}`
        ].map((val) => [id, val[1], val[2].replace(/\[\[([^\]]+)\]\]/g, "")]);
        return contenido.replace(/\[\[([^\]]+)\]\]/g, "");
    } catch (error) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log((error as Error).message);
        return "Hubo un error al usar ia, posible errores no hay tokens.";
    }
}
@Injectable()
@SocketController("/")
export class WebsocketsController {
    constructor(private readonly websocketsService: WebsocketsService) {}

    @Disconnect()
    async disconnect(@Socket() socket: socket.Socket, @IO() io: socket.Socket) {
        const token = (socket.handshake.query?.["x-token"] as string) ?? "null";
        const empresa =
            (socket.handshake.query?.["x-empresa"] as string) ?? "null";

        if (token === "null" || empresa === "null") return;

        usersInWeb = {
            ...usersInWeb,
            [empresa]: (usersInWeb[empresa] ?? []).filter(
                (user) => user !== token
            ),
        };
        io.emit("users-count:index", usersInWeb.length);
        const user = await this.websocketsService.index(
            socket.handshake.query?.["x-user"] as string
        );
        if (user?.isOnline) {
            // update user
            await user.update({ isOnline: false });
        }
    }

    @Connect()
    async index(@Socket() socket: socket.Socket, @IO() io: socket.Socket) {
        // token localstorage
        const token = (socket.handshake.query?.["x-token"] as string) ?? "null";
        const empresa =
            (socket.handshake.query?.["x-empresa"] as string) ?? "null";
        // empresa -> id
        if (token === "null" || empresa === "null") return;

        const empCache = JSON.parse(cache.get(`EMPRESA:${empresa}`) || "null");
        socket.join(token);
        if (!(chatAssistantWeb[`${empresa}:${token}`] ?? []).length) {
            chatAssistantWeb = {
                ...(chatAssistantWeb ?? {}),
                [`${empresa}:${token}`]: [
                    ...(chatAssistantWeb[`${empresa}:${token}`] ?? []),
                    [
                        "test-id",
                        "assistant",
                        `Hola, Soy ${
                            empCache
                                ? `<b class="font-bold">${
                                      (empCache as Empresas)
                                          .inteligenceArtificial.nameIa
                                  }</b> `
                                : ""
                        }su asistente virtual 😀. ¿En que le podriamos ayudar?`,
                    ],
                ],
            };
        }
        io.to(token).emit("chat:ai", chatAssistantWeb[`${empresa}:${token}`]);
        // user - user auth
        const user = await this.websocketsService.index(
            socket.handshake.query?.["x-user"] as string
        );
        // unir en la sala
        if (user) {
            // update user
            if (!user.isOnline) {
                await user.update({ isOnline: true });
            }
            const floors = await this.websocketsService.floorsMesas(
                empresa,
                user
            );

            if (floors) {
                io.emit("floors_mesas:index", floors);
            }
            socket.join(user.id);
            if (!(chatAssistant[`${empresa}:${user.id}`] ?? [])?.length) {
                chatAssistant[`${empresa}:${user.id}`] = [
                    [
                        "assistant",
                        `Hola ${user.username}, Soy ${
                            empCache
                                ? `<b class="font-bold">${
                                      (empCache as Empresas)
                                          .inteligenceArtificial.nameIa
                                  }</b> `
                                : ""
                        }su asistente virtual 😀.`,
                        Date.now(),
                    ],
                ];
            }
            io.to(user.id).emit(
                "chat-assistant:ai",
                chatAssistant[`${empresa}:${user.id}`]
            );
        }
        const existUserInWeb = (usersInWeb[empresa] ?? []).find((tk) => {
            return tk === token;
        });

        if (!existUserInWeb) {
            // si no existe usuari con el mismo token que ya no agregre
            usersInWeb = {
                ...usersInWeb,
                [empresa]: [...(usersInWeb[empresa] ?? []), token],
            }; // add user
        }
        // si es gratis
        if (usersInWeb[empresa].length > 30) {
            const emp = await Empresas.unscoped().findOne({
                where: {
                    id: empresa,
                    isFreeVPS: true,
                },
                attributes: ["enabled_catalogo", "isFreeVPS"],
            });
            if (emp?.isFreeVPS && emp?.enabled_catalogo) {
                await Empresas.update(
                    { enabled_catalogo: false },
                    { where: { id: empresa, isFreeVPS: true } }
                );
                const now = new Date();
                now.setMinutes(now.getMinutes() + 15);
                await executeCronDate(now, async () => {
                    await Empresas.update(
                        { enabled_catalogo: true },
                        { where: { id: empresa, isFreeVPS: true } }
                    );
                });
            }
        }
        io.emit("users-count:index", usersInWeb[empresa].length);
    }

    @Event("notifications:order-store")
    async orderStore(
        @Args()
        body: {
            user_id: number;
            order_code: string;
            total: number;
        },
        @IO() io: socket.Socket,
        @Socket() socket: socket.Socket
    ) {
        const empresa =
            (socket.handshake.query?.["x-empresa"] as string) ?? "null";

        if (empresa === "null") return;
        const result = await this.websocketsService.orderStore(empresa, body);
        io.emit("notifications:store", result);
    }
    @Event("chat:send-message")
    async sendMessage(
        @Args() args: { id: string; message: string },
        @Socket() socket: socket.Socket,
        @IO() io: socket.Socket
    ) {
        const token = socket.handshake.query["x-token"] as string;
        const empresa =
            (socket.handshake.query?.["x-empresa"] as string) ?? "null";

        if (empresa === "null") return;
        await cloudeAiWeb(empresa, token, args, io);
        // io.to(token).emit("chat:send-message", [
        //     "assistant",
        //     message,
        //     Date.now(),
        // ]);
    }
    @Event("chat:restart")
    async restart(@Socket() socket: socket.Socket, @IO() io: socket.Socket) {
        const token = socket.handshake.query["x-token"] as string;
        const empresa =
            (socket.handshake.query?.["x-empresa"] as string) ?? "null";

        if (empresa === "null") return;
        const empCache = JSON.parse(cache.get(`EMPRESA:${empresa}`) || "null");
        chatAssistantWeb[`${empresa}:${token}`] = [];
        io.to(token).emit("chat:ai", [
            [
                "test-id",
                "assistant",
                `Hola, Soy ${
                    empCache
                        ? `<b class="font-bold">${
                              (empCache as Empresas).inteligenceArtificial
                                  .nameIa
                          }</b> `
                        : ""
                }su asistente virtual 😀.`,
            ],
        ]);
    }
    @Event("chat-assistant:send-message")
    async sendAssistantMessage(
        @Args() args: { message: string },
        @Socket() socket: socket.Socket,
        @IO() io: socket.Socket
    ) {
        const token = (socket.handshake.query?.["x-token"] as string) ?? "null";
        if (!token) return;
        // user - user auth
        const user = await this.websocketsService.index(
            socket.handshake.query?.["x-user"] as string
        );
        if (!user) return;
        //! aca
        const message = await cloudeAi(
            (user!.empresa as Empresas).slug,
            user.id,
            args.message
        );
        io.to(token).emit("chat-assistant:send-message", [
            "assistant",
            message,
            Date.now(),
        ]);
    }
    @Event("floors_mesas:index")
    async floorsChange(
        @Socket() socket: socket.Socket,
        @IO() io: socket.Socket
    ) {
        const user = await this.websocketsService.index(
            socket.handshake.query?.["x-user"] as string
        );
        const empresa =
            (socket.handshake.query?.["x-empresa"] as string) ?? "null";

        if (empresa === "null") return;
        if (user) {
            const floors = await this.websocketsService.floorsMesas(
                empresa,
                user
            );

            if (floors) {
                io.emit("floors_mesas:index", floors);
            }
        }
    }
    @Event("notifications:auth-register")
    async authRegister(
        @Args() body: { user_id: number; username: string; slug: string },
        @IO() io: socket.Socket,
        @Socket() socket: socket.Socket
    ) {
        const empresa =
            (socket.handshake.query?.["x-empresa"] as string) ?? "null";

        if (empresa === "null") return;
        const result = await this.websocketsService.authRegister(empresa, body);
        io.emit("notifications:store", result);
    }
    @Event("notifications:comment-store")
    async commentStore(
        @Args()
        body: {
            product_id: number;
            user_id: number;
            isService: boolean;
            comment_id: number;
            content: string;
        },
        @IO() io: socket.Socket,
        @Socket() socket: socket.Socket
    ) {
        const empresa =
            (socket.handshake.query?.["x-empresa"] as string) ?? "null";

        if (empresa === "null") return;
        const result = await this.websocketsService.commentStore(
            empresa,
            socket.handshake.query?.["x-user"] as string,
            body
        );
        io.emit("notifications:store", result);
    }
    @Event("notifications:subcomment-store")
    async subcommentStore(
        @Args()
        body: {
            product_id: number;
            user_id: number;
            receptores: number[];
            comment_id: number;
            isService: boolean;
            content: string;
        },
        @IO() io: socket.Socket,
        @Socket() socket: socket.Socket
    ) {
        const empresa =
            (socket.handshake.query?.["x-empresa"] as string) ?? "null";

        if (empresa === "null") return;
        const result = await this.websocketsService.subcommentStore(
            empresa,
            socket.handshake.query?.["x-user"] as string,
            body
        );
        io.emit("notifications:store", result);
    }
}
// cada 24 horas
cron.schedule("0 0 * * *", () => {
    chatAssistantWeb = {};
});
