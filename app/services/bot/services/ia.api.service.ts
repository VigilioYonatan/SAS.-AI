import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from "@vigilio/express-core";
import type { Response } from "express";
import enviroments from "~/config/enviroments.config";
import type { RequestVigilio } from "~/config/types";
import { hmacAuthMiddleware } from "~/libs/security.middleware";
import { isWhatsappTelegramIA } from "../libs/ai";
import { HTMLPROMPT } from "@/websockets/controllers/websockets.controller";
import { openAis } from "@/empresas/services/empresas.api.service";
import { modelAiByEmpresa } from "../libs";

export let chatAssistantWeb: Record<string, ["user" | "assistant", string][]> =
    {};

@Injectable()
export class IAApiService {
    async chatIndex(req: RequestVigilio) {
        const isValid = hmacAuthMiddleware(req, enviroments.HMAC_CHAT_AI, true);
        if (!isValid) {
            throw new UnauthorizedException("unauthorized");
        }
        const emp = req.empresa.slug;
        let chats = chatAssistantWeb[`${emp}:${req.query.token}`] || [];
        chats = !chats.length
            ? [
                  [
                      "assistant",
                      "Hola, Soy su asistente virtual con Inteligencia Artificial 😀. ¿En que le podriamos ayudar?",
                  ],
              ]
            : chats;
        return {
            success: true,
            chats,
        };
    }
    async chat(req: RequestVigilio, res: Response) {
        const emp = req.empresa.slug;
        const token = req.query.token;
        const message = req.query.message as string;
        if (!message) {
            throw new BadRequestException("message is required");
        }
        const isValid = hmacAuthMiddleware(req, enviroments.HMAC_CHAT_AI, true);
        if (!isValid) {
            throw new UnauthorizedException("unauthorized");
        }
        const whatsapp = await isWhatsappTelegramIA(emp);
        if (!whatsapp)
            return "En estos momentos no estoy disponible. Inteligencia Artificial o Token es requerido";
        const { empresa, latestEmpresaUsage } = whatsapp;

        chatAssistantWeb = {
            ...(chatAssistantWeb ?? {}),
            [`${emp}:${token}`]: [
                ...(chatAssistantWeb[`${emp}:${token}`] ?? []),
                ["user", message],
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
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");
        res.setHeader("X-Accel-Buffering", "no");
        res.flushHeaders();

        const keepAlive = setInterval(() => {
            res.write(":keep-alive\n\n"); // Comentario SSE
        }, 15000);
        try {
            // mapped messages to messages cloude
            const messages = chatAssistantWeb[`${emp}:${token}`].map(
                ([role, content]) => ({
                    role,
                    content:
                        role === "user"
                            ? `${""} '[[${HTMLPROMPT(empresa)}]]'`
                            : content,
                })
            );

            const messageAnterior = messages
                .slice(-5, -1)
                .map(
                    (c) =>
                        `${
                            c.role === "user" ? "yo" : c.role
                        }:  ${c.content.replace(/\[\[([^\]]+)\]\]/g, "")}`
                );
            const messageActual = `Mensajes Anterior: ${messageAnterior.join(
                ", "
            )}.\n
              Mensaje Actual: ${message}.`;
            // const prompt = await promptReplace(
            //     whatsapp,
            //     messageActual!,
            //     empresa
            // );

            const completion = await openAis[
                empresa.slug
            ].chat.completions.create({
                model: modelAiByEmpresa(whatsapp),
                // max_tokens: empresa.inteligenceArtificial.max_length,
                messages: [
                    {
                        role: "user",
                        content: `.\n ${HTMLPROMPT(empresa)}`,
                    },
                    ...messages.slice(
                        -(empresa.inteligenceArtificial.memory - 1)
                    ),
                ],
                stream: true,
                stream_options: { include_usage: true },
            });
            let contenido = "";
            for await (const chunk of completion) {
                if (chunk.choices[0]?.delta?.content) {
                    const content = chunk.choices[0].delta.content;
                    contenido += content;
                    res.write(`data: ${JSON.stringify({ content })}\n\n`);
                    if (typeof res.flush === "function") res.flush();
                }
            }
            chatAssistantWeb[`${emp}:${token}`] = [
                ...(chatAssistantWeb[`${emp}:${token}`] || []),
                ["assistant", contenido],
            ];
            res.write('event: end\ndata: {"status": "completed"}\n\n'); // Señal de fin
        } catch (error) {
            console.error("Error:", error);
            res.write(
                `event: error\ndata: ${JSON.stringify({
                    error: "Failed to generate response",
                })}\n\n`
            );
        } finally {
            clearInterval(keepAlive);
            res.end();
        }
    }
}
