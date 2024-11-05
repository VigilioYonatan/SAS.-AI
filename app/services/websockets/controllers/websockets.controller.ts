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
    featuresIA,
    isWhatsappTelegramIA,
} from "@/bot/libs/ai";
import { Injectable } from "@vigilio/express-core";
import { openAis } from "@/empresas/services/empresas.api.service";
import cron from "node-cron";
import { promptReplace } from "@/bot/libs";
import type { Empresas } from "@/empresas/entities/empresas.entity";
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
                ["user", message],
            ],
        };
        // mapped messages to messages cloude
        const messages = chatAssistantWeb[`${emp}:${token}`].map(
            ([role, content]) => ({
                role,
                content,
            })
        );
        const prompt = await promptReplace(message!, empresa);
        const completion = await openAis[empresa.slug].chat.completions.create({
            model: clientVigilio
                ? clientVigilio.information.modelai
                : "gpt-4o-mini",
            max_tokens: empresa.inteligenceArtificial.max_length,
            messages: [
                {
                    role: "user",
                    content: `${prompt} - Por ultimo, cada vez que te pida informacion de un producto  trate de responder con una imagen o link. si envias imagen , que sea en etiqueta image <img width="100" height="100" class="w-[100px] h-[150px] rounded-md object-contain"/>   y si  envias cualquier tipo de link  SIEMPRE por favor etiqueta html <a href="http...link"  class="text-primary font-semibold"corto_mensaje_sobre_el_llink_que_envias</a> , no preguntes porque, responde como si fuera html con espacios usando br en productos o pedidos. para que lea bien.  y no uses ** mejor utiliza la etiqueta <b></b>, y si envias caracterisiticas o algo aso por favor que sea en table, como el carrito de lo que pide el cliente y la letra 13px . si dices una lista por traelas con etqueta li y  la letra 13px, y cuando use ** traela con etiqueta b class="font-bold", POR ULTIMO. siempre cuando me respondas lista, hacelo con una tabla html porfav. SIEMPRE HTML y no en markdown`,
                },
                ...messages.slice(-(empresa.inteligenceArtificial.memory - 1)),
            ],
        });
        // get message ai
        const completionText = completion.choices[0].message.content!;

        const [removeNote] = await featuresIA(empresa, completionText, false);

        await empresa!.update({
            inteligenceArtificial: {
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

        chatAssistantWeb[`${emp}:${token}`] = [
            ...(chatAssistantWeb[`${emp}:${token}`] ?? []),
            ["assistant", removeNote],
        ];

        return removeNote;
    } catch (error) {
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

        io.emit("users-count:index", usersInWeb[empresa].length);
    }

    @Event("notifications:order-store")
    async orderStore(
        @Args()
        body: {
            client_id: number;
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
}
// cada 24 horas
cron.schedule("0 0 * * *", () => {
    chatAssistantWeb = {};
});
