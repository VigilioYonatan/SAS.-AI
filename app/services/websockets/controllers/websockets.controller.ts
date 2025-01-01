import {
    Args,
    Connect,
    SocketController,
    Disconnect,
    Event,
    IO,
    Socket,
} from "@vigilio/express-core";
// biome-ignore lint/correctness/noUnusedImports: <explanation>
import * as socket from "socket.io";
import { WebsocketsService } from "../services/websockets.service";
import {
    chatAssistant,
    cloudeAi,
    executeCronDate,
    featuresIA,
    isWhatsappTelegramIA,
    updateTokensEmpresa,
} from "@/bot/libs/ai";
import { Injectable } from "@vigilio/express-core";
import { openAis } from "@/empresas/services/empresas.api.service";
import cron from "node-cron";
import { promptReplace } from "@/bot/libs";
import { Empresas } from "@/empresas/entities/empresas.entity";
export function HTMLPROMPT(_empresa: Empresas) {
    return `- IMPORTANTE: Por ultimo siempre responde con etiquetas html y clases de tailwind,  y recuerda enviar links ó urls con ETIQUETA <a></a>  estilos de tailwind underline, (tablas solo carrito de compra ) , etc y usa <b class="font-bold"></b> en vez de **   en palabras importantes. Por ultimo usa solo un <br></br> para separar parrafos, usa etiqueta a <a href="url" class='text-primary underline'>text</a> para links o enlaces, etc. usa <ul class="list-disc list-inside"><li></li></ul>  para listas, pedidos, información, etc. etiqueta de letra p,h1,span esos text-sm, imagenes maximo width 100px,  html limpio no markdown`;
}
export let chatAssistantWeb: Record<string, ["user" | "assistant", string][]> =
    {};
export let usersInWeb: Record<string, string[]> = {};
async function cloudeAiWeb(emp: string, token: string, message: string) {
    try {
        const whatsapp = await isWhatsappTelegramIA(emp);
        if (!whatsapp)
            return "En estos momentos no estoy disponible. Inteligencia Artificial o Token es requerido";

        const { clientVigilio, empresa, latestEmpresaUsage } = whatsapp;

        chatAssistantWeb = {
            ...(chatAssistantWeb ?? {}),
            [`${emp}:${token}`]: [
                ...(chatAssistantWeb[`${emp}:${token}`] ?? []),
                [
                    "user",
                    // `${message}. [[en html no mkdown, formato chat persona a persona, no web, los links recuerda <a></a>,imagenes width 100px revisa base de datos y SIEMPRE RESPONDEME EN EL IDIOMA QUE TE ESCRIBA!!!.]]`,
                    `${message}. [[HAZ TODAS LAS INSTRUCCIONES QUE TE MANDE NO FALLES, trata de escribir poco, no sobrecargues información]]]`,
                ],
            ],
        };
        if (
            chatAssistantWeb[`${emp}:${token}`].length > 30 &&
            empresa.isTemplate
        ) {
            return "Gracias por probar nuestra inteligencia artificial, más información en https://www.vigilio-services.com";
        }

        // mapped messages to messages cloude
        const messages = chatAssistantWeb[`${emp}:${token}`].map(
            ([role, content]) => ({
                role,
                content,
            })
        );
        const messageAnterior = messages
            .filter((a) => a.role === "user")
            .slice(-5, -1)
            .map((c) => c.content);
        const messageActual = `Mensajes Anterior: ${messageAnterior.join(
            ", "
        )}.\n
        Mensaje Actual: ${message}.`;

        const prompt = await promptReplace(whatsapp, messageActual!, empresa);

        const completion = await openAis[empresa.slug].chat.completions.create({
            model: clientVigilio
                ? clientVigilio.information.modelai
                : "gpt-4o-mini",
            max_tokens: empresa.inteligenceArtificial.max_length,
            messages: [
                {
                    role: "user",
                    content: `${prompt}. ${HTMLPROMPT(empresa)}`,
                },
                ...messages.slice(-(empresa.inteligenceArtificial.memory - 1)),
            ],
        });

        // get message ai
        const completionText = completion.choices[0].message.content!;

        const [removeNote] = await featuresIA(empresa, completionText, false);
        await updateTokensEmpresa(empresa, latestEmpresaUsage, completion);
        chatAssistantWeb[`${emp}:${token}`] = [
            ...(chatAssistantWeb[`${emp}:${token}`] ?? []),
            ["assistant", removeNote],
        ];
        chatAssistantWeb[`${emp}:${token}`] = chatAssistantWeb[
            `${emp}:${token}`
        ].map((val) =>
            val[0] === "user"
                ? [val[0], val[1].replace(/\[\[([^\]]+)\]\]/g, "")]
                : val
        );
        return removeNote.replace(/\[\[([^\]]+)\]\]/g, "");
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
        socket.join(token);
        if (!(chatAssistantWeb[`${empresa}:${token}`] ?? []).length) {
            chatAssistantWeb = {
                ...(chatAssistantWeb ?? {}),
                [`${empresa}:${token}`]: [
                    ...(chatAssistantWeb[`${empresa}:${token}`] ?? []),
                    [
                        "assistant",
                        "Hola, Soy tu asistente virtual 😀. ¿En que le podriamos ayudar?",
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
                        `Hola ${user.username}, Soy tu asistente virtual 😀. ¿En que  podriamos ayudarte?`,
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
        @Args() args: { message: string },
        @Socket() socket: socket.Socket,
        @IO() io: socket.Socket
    ) {
        const token = socket.handshake.query["x-token"] as string;
        const empresa =
            (socket.handshake.query?.["x-empresa"] as string) ?? "null";

        if (empresa === "null") return;
        const message = await cloudeAiWeb(empresa, token, args.message);
        io.to(token).emit("chat:send-message", [
            "assistant",
            message,
            Date.now(),
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
