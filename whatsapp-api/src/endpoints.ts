import type { Request, Response } from "express";
import formidable from "formidable";
import fs from "node:fs/promises";
import { client, initialWhatsapp, qrImage } from "./main";
import WAWebJS from "whatsapp-web.js";

/** SEND MESSAGE - TEXT */
export async function sendMessage(req: Request, res: Response) {
    try {
        const body = req.body as {
            message: string;
            options?: WAWebJS.MessageSendOptions;
            delay: number;
        };

        const query = req.query as { telephone: string };
        if (!body.message || !query.telephone)
            return res.status(400).json({
                success: false,
                message: "required message or telephone body",
            });
        const chat = await client.getChatById(query.telephone);
        await chat.sendSeen();
        await chat.sendStateTyping();
        await new Promise((resolve) =>
            setTimeout(resolve, Number(body.delay) * 1000)
        );
        await client.sendMessage(
            query.telephone,
            body.message,
            body.options ?? {}
        );
        return res.json({
            success: true,
            message: "Mensaje enviado correctamente",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error: ${(error as Error).message}`,
        });
    }
}

/** SEND MESSAGE - IMAGE */
export async function sendFile(req: Request, res: Response) {
    try {
        const query = req.query as { telephone: string };
        const form = formidable();
        const [field, files] = await form.parse(req);
        const chat = await client.getChatById(query.telephone);
        await chat.sendSeen();
        await chat.sendStateTyping();
        await new Promise((resolve) =>
            setTimeout(
                resolve,
                Number(field.delay ? Number(field.delay[0]) : 1) * 1000
            )
        );

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const options: any = field.options
            ? JSON.parse(JSON.parse(field.options[0]))
            : {};

        if (!query.telephone)
            return res.status(400).json({
                success: false,
                message: "required telephone body or file",
            });
        if (field.url) {
            const image = await WAWebJS.MessageMedia.fromUrl(field.url[0]);
            await client.sendMessage(query.telephone, image, options);
            return res.json({
                success: true,
                message: "Mensaje enviado correctamente",
            });
        }

        if (files.file) {
            const filePath = files.file[0].filepath;
            const ext = files.file[0].originalFilename?.split(".").at(-1);
            const buffer = await fs.readFile(filePath);
            const bufferFile = buffer.toString("base64");
            // delete filepath
            await fs.unlink(filePath);
            const file = new WAWebJS.MessageMedia(
                files.file[0].mimetype!,
                bufferFile,
                field.name
                    ? `${field.name[0]}.${ext}`
                    : files.file[0].originalFilename,
                files.file[0].size
            );
            await client.sendMessage(query.telephone, file, options);
            return res.json({
                success: true,
                message: "Mensaje enviado correctamente",
            });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
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
    return { success: true, message: "OK" };
}

/** SEND MESSAGE - TYPING */
export async function sendTyping(req: Request, res: Response) {
    const query = req.query as { telephone: string };
    if (!query.telephone)
        return res.status(400).json({
            success: false,
            message: "required telephone",
        });
    const chat = await client.getChatById(query.telephone);
    await new Promise((resolve) =>
        setTimeout(resolve, Number(req.body.delay) * 1000)
    );
    await chat.sendSeen();
    await chat.sendStateTyping();

    return { success: true, message: "typing success" };
}

/** SEND MESSAGE - QR */
export async function getQr(_req: Request, res: Response) {
    if (!(await fs.exists(qrImage)))
        return res.status(404).json({ success: false, message: "No hay qr" });
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
export async function restart() {
    if (await fs.exists(qrImage)) {
        await fs.unlink(qrImage);
    }
    return { success: true, message: "qr removed" };
}
