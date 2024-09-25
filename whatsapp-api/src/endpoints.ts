import type { Request, Response } from "express";
import formidable from "formidable";
import fs from "node:fs";
import { client, initialWhatsapp, qrImage } from "./main";
import WAWebJS from "whatsapp-web.js";

/** SEND MESSAGE - TEXT */
export async function sendMessage(req: Request, res: Response) {
    try {
        const body = req.body as {
            message: string;
            options?: WAWebJS.MessageSendOptions;
        };

        const query = req.query as { telephone: string };
        if (!body.message || !query.telephone)
            return res.status(400).json({
                success: false,
                message: "required message or telephone body",
            });

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

        const options: WAWebJS.MessageSendOptions = field.options
            ? JSON.parse(field.options[0])
            : {};
        if (!query.telephone)
            return res.status(400).json({
                success: false,
                message: "required telephone body or file",
            });
        if (field.url) {
            await client.sendMessage(
                query.telephone,
                await WAWebJS.MessageMedia.fromUrl(field.url[0]),
                options
            );
        }

        if (files.file) {
            const filePath = files.file[0].filepath;
            const ext = files.file[0].originalFilename?.split(".").at(-1);

            const bufferFile = Buffer.from(fs.readFileSync(filePath)).toString(
                "base64"
            );
            // delete filepath
            fs.unlinkSync(filePath);
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
}

/** SEND MESSAGE - TYPING */
export async function sendTyping(req: Request, res: Response) {
    const query = req.query as { telephone: string };
    if (!query.telephone)
        return res.status(400).json({
            success: false,
            message: "required telephone o delay body",
        });
    const chat = await client.getChatById(query.telephone);
    await chat.sendSeen();
    await chat.sendStateTyping();
    return { success: true, message: "typing success" };
}

/** SEND MESSAGE - QR */
export async function getQr(_req: Request, res: Response) {
    if (!fs.existsSync(qrImage))
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
    if (fs.existsSync(qrImage)) {
        fs.unlinkSync(qrImage);
    }
    return { success: true, message: "qr removed" };
}
