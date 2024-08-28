import type { Request, Response } from "express";
import formidable from "formidable";
import fs from "node:fs";
import { client, initialWhatsapp, qrImage } from "./main";
import { MessageMedia } from "whatsapp-web.js";

/** SEND MESSAGE - TEXT */
export async function sendMessage(req: Request, res: Response) {
    try {
        const body = req.body as { message: string };
        const query = req.query as { telephone: string };
        if (!body.message || !query.telephone)
            return res.status(400).json({
                success: false,
                message: "required message or telephone body",
            });
        await client.sendMessage(query.telephone, body.message);
        return res.json({
            success: true,
            message: "Mensaje enviado correctamente",
        });
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: `Server error: ${(error as Error).message}`,
        });
    }
}

/** SEND MESSAGE - IMAGE */
export async function sendImage(req: Request, res: Response) {
    try {
        const query = req.query as { telephone: string };
        if (!query.telephone)
            return res.status(400).json({
                success: false,
                message: "required telephone body",
            });
        const form = formidable();
        const [field, files] = await form.parse(req);
        if (files.message) {
            const extensions = [
                "jpg",
                "jpeg",
                "png",
                "webp",
                "svg",
                "ico",
                "png",
                "avif",
            ];
            const filePath = files.message[0].filepath;
            const extension = files.message[0].originalFilename
                ?.split(".")
                .at(-1);

            if (!extensions.includes(extension!)) {
                return res.status(401).json({
                    success: true,
                    message: `Extension no valid ${extensions.join(", ")}`,
                });
            }
            const bufferFile = Buffer.from(fs.readFileSync(filePath)).toString(
                "base64"
            );
            // delete filepath
            fs.unlinkSync(filePath);
            if (field.url) {
                await client.sendMessage(
                    query.telephone,
                    await MessageMedia.fromUrl(field.url[0])
                );
            } else {
                const file = await new MessageMedia(
                    files.message[0].mimetype!,
                    bufferFile,
                    files.message[0].originalFilename,
                    files.message[0].size
                );
                await client.sendMessage(query.telephone, file);
            }
            return res.json({
                success: true,
                message: "Mensaje enviado correctamente",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: `Server error: ${(error as Error).message}`,
        });
    }
}

/** SEND MESSAGE - AUDI */
export async function sendAudio(req: Request, res: Response) {
    try {
        const query = req.query as { telephone: string };
        if (!query.telephone)
            return res.status(400).json({
                success: false,
                message: "required telephone body",
            });
        const form = formidable();
        const [field, files] = await form.parse(req);
        if (files.message) {
            const extensions = [
                "wav",
                "mp3",
                "aac",
                "flac",
                "m4a",
                "ogg",
                "wma",
            ];
            const filePath = files.message[0].filepath;
            const extension = files.message[0].originalFilename
                ?.split(".")
                .at(-1);

            if (!extensions.includes(extension!)) {
                return res.status(401).json({
                    success: true,
                    message: `Extension no valid ${extensions.join(", ")}`,
                });
            }
            const bufferFile = Buffer.from(fs.readFileSync(filePath)).toString(
                "base64"
            );
            // delete filepath
            fs.unlinkSync(filePath);
            if (field.url) {
                await client.sendMessage(
                    query.telephone,
                    await MessageMedia.fromUrl(field.url[0])
                );
            } else {
                const file = await new MessageMedia(
                    files.message[0].mimetype!,
                    bufferFile,
                    files.message[0].originalFilename,
                    files.message[0].size
                );
                await client.sendMessage(query.telephone, file, {
                    sendAudioAsVoice: true,
                });
            }

            return res.json({
                success: true,
                message: "Mensaje enviado correctamente",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: `Server error: ${(error as Error).message}`,
        });
    }
}

/** SEND MESSAGE - STICKER */
export async function sendSticker(req: Request, res: Response) {
    try {
        const query = req.query as { telephone: string };
        if (!query.telephone)
            return res.status(400).json({
                success: false,
                message: "required telephone body",
            });
        const form = formidable();
        const [field, files] = await form.parse(req);
        if (files.message) {
            const extensions = [
                "jpg",
                "jpeg",
                "png",
                "webp",
                "svg",
                "ico",
                "png",
                "avif",
            ];
            const filePath = files.message[0].filepath;
            const extension = files.message[0].originalFilename
                ?.split(".")
                .at(-1);

            if (!extensions.includes(extension!)) {
                return res.status(401).json({
                    success: true,
                    message: `Extension no valid ${extensions.join(", ")}`,
                });
            }
            const bufferFile = Buffer.from(fs.readFileSync(filePath)).toString(
                "base64"
            );
            // delete filepath
            fs.unlinkSync(filePath);
            if (field.url) {
                await client.sendMessage(
                    query.telephone,
                    await MessageMedia.fromUrl(field.url[0]),
                    {
                        sendMediaAsSticker: true,
                    }
                );
            } else {
                const file = await new MessageMedia(
                    files.message[0].mimetype!,
                    bufferFile,
                    files.message[0].originalFilename,
                    files.message[0].size
                );
                await client.sendMessage(query.telephone, file, {
                    sendMediaAsSticker: true,
                });
            }
            return res.json({
                success: true,
                message: "Mensaje enviado correctamente",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: true,
            message: `Server error: ${(error as Error).message}`,
        });
    }
}

/** SEND MESSAGE - SEEN */
export async function sendSeen(req: Request, res: Response) {
    const query = req.query as { telephone: string };
    if (!query.telephone)
        return res.status(400).json({
            success: false,
            message: "required telephone body",
        });
    const chat = await client.getChatById(query.telephone);
    await chat.sendSeen();
}

/** SEND MESSAGE - TYPING */
export async function sendTyping(req: Request, res: Response) {
    const query = req.query as { telephone: string; delay: string };
    if (!query.telephone || query.delay)
        return res.status(400).json({
            success: false,
            message: "required telephone o delay body",
        });
    const chat = await client.getChatById(query.telephone);
    await chat.sendStateTyping();
    await new Promise((res) => setTimeout(res, Number(query.delay) * 1000));
    return { success: true, message: "typing success" };
}
/** SEND MESSAGE - QR */
export async function getQr(_req: Request, res: Response) {
    return res.sendFile(qrImage);
}
/** SEND MESSAGE - LOGOUT */
export async function sendLogout() {
    await client.logout();
    // Esperar un momento antes de re-inicializar
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await initialWhatsapp();
    return { success: true, message: "logout success" };
}
