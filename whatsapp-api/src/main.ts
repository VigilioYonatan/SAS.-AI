import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import qrcodeTerminal from "qrcode-terminal";
import qrcode from "qrcode";
import fs from "node:fs";
import { Client, LocalAuth } from "whatsapp-web.js";
import {
    getQr,
    sendAudio,
    sendImage,
    sendMessage,
    sendSeen,
    sendTyping,
} from "./endpoints";
import path from "node:path";
dotenv.config({ path: ".env" });

const PORT = Number(process.env.PORT);
export const SESSION_NAME = process.env.SESSION_NAME;
export const qrImage = path.resolve(__dirname, "..", `${SESSION_NAME}-qr.png`);

export let client: Client;

const app = express();
app.use(cors());

export async function initialWhatsapp() {
    client = new Client({
        authStrategy: new LocalAuth({
            clientId: SESSION_NAME,
            // dataPath: path.join(__dirname, SESSION_NAME!),
        }),
    });

    client.on("qr", (qr) => {
        if (!fs.existsSync(qrImage))
            qrcodeTerminal.generate(qr, { small: true }, () => {
                qrcode.toFile(qrImage, qr, (err) => {
                    if (err) throw err;
                    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
                    console.log("Código QR generado con éxito");
                });
            });
    });

    // Opcional: Manejar eventos para cada cliente
    client.on("ready", async () => {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log("******      ready      *********");
        await fetch(
            `https://www.${SESSION_NAME}.vigilio-services.com/api/bot/ready`,
            { method: "POST" }
        );
    });

    client.on("message", async (message) => {
        const chat = await message.getChat();
        async function getFile() {
            const media = await message.downloadMedia();
            const binaryData = Buffer.from(media.data, "base64");
            return binaryData;
        }
        await fetch(
            `https://www.${SESSION_NAME}.vigilio-services.com/api/bot/receive-message`,
            {
                method: "POST",
                body: JSON.stringify({
                    type: message.type,
                    isGroup: chat.isGroup,
                    content:
                        message.type === "chat"
                            ? message.body
                            : await getFile(),
                    from: message.from,
                }),
            }
        );
    });
    client.on("disconnected", async () => {
        await fetch(
            `https://www.${SESSION_NAME}.vigilio-services.com/api/bot/disconnected`,
            { method: "POST" }
        );
        // eliminar qrcodee
        if (fs.existsSync(qrImage)) {
            fs.unlinkSync(qrImage);
        }
    });
    client.initialize();
}

app.post("/api/whatsapp/send-message", sendMessage);
app.post("/api/whatsapp/send-image", sendImage);
app.post("/api/whatsapp/send-sticker", sendImage);
app.post("/api/whatsapp/send-audio", sendAudio);
app.post("/api/whatsapp/send-seen", sendSeen);
app.post("/api/whatsapp/send-typing", sendTyping);
app.post("/api/whatsapp/qr", getQr);

// whatsapp
initialWhatsapp();

app.listen(PORT, () => {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(`Running ${process.env.PORT} - ${SESSION_NAME}`);
});
