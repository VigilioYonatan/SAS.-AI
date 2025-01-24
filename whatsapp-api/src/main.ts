import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import qrcodeTerminal from "qrcode-terminal";
import qrcode from "qrcode";
import fs from "node:fs";
import WAWebJS from "whatsapp-web.js";
import {
    getQr,
    restart,
    sendFile,
    sendLogout,
    sendMessage,
    sendSeen,
    sendTyping,
} from "./endpoints";
import path from "node:path";
import { authenticateToken } from "./middleware";
import morgan from "morgan";
import util from "node:util";
import { exec } from "node:child_process";
dotenv.config({ path: ".env" });
const execAsync = util.promisify(exec);

export async function terminal(comando: string) {
    try {
        const { stdout, stderr } = await execAsync(comando);
        if (stderr) {
            throw new Error(`Error en el comando, ${stderr}`);
        }
        return stdout; // Devuelve la salida estándar
    } catch (error) {
        throw new Error(`Error server, ${(error as Error).message}`);
    }
}
const PORT = Number(process.env.PORT);
export const SESSION_NAME = process.env.SESSION_NAME;
export const NAME = process.env.NAME;
export const VITE_TOKEN_VIGILIO_SERVICES =
    process.env.VITE_TOKEN_VIGILIO_SERVICES!;
export const NODE_ENV = process.env.NODE_ENV;
export const qrImage = path.resolve(__dirname, "..", `${SESSION_NAME}-qr.png`);
export const BASE_URL =
    NODE_ENV === "production"
        ? `https://www.${SESSION_NAME}.vigilio-services.com`
        : "https://vigilioservices2.loca.lt";

export let client: WAWebJS.Client;

const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(cors());
app.use(morgan("dev"));
// whatsapp
initialWhatsapp();
export async function initialWhatsapp() {
    client = new WAWebJS.Client({
        authStrategy: new WAWebJS.LocalAuth(),
        puppeteer: {
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-gpu",
                "--disable-infobars",
                "--disable-dev-shm-usage",
                "--window-size=800,600",
                "--disable-web-security",
                "--disable-extensions",
                "--disable-default-apps",
                "--disable-plugins",
                "--disable-session-crashed-bubble",
                "--disable-accelerated-2d-canvas",
                "--no-first-run",
                "--no-zygote",
                "--single-process",
                "--noerrdialogs",
            ],
        },
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
        try {
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log(
                JSON.stringify((await client.getContacts()).slice(0, 10))
            );
            const contacts = await client.getContacts();
            const response = await fetch(
                `${BASE_URL}/api/whatsapp/ready/${NAME}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        contacts: contacts.map((c) => ({
                            name: c.name || "desconocido",
                            id: { _serialized: c.id._serialized },
                        })),
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const resultready = await response.json();
            // biome-ignore lint/suspicious/noConsoleLog: <explanation>
            console.log({ resultready });
        } catch (error) {}
    });

    client.on("message", async (message) => {
        const chat = await message.getChat();
        async function getFile() {
            const media = await message.downloadMedia();
            if (media.data) {
                const binaryData = Buffer.from(media.data, "base64");
                return binaryData;
            }
            return null;
        }
        const content =
            message.type === "chat" ? message.body : await getFile();
        if (!content) return null;
        // console.log({ chat });
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const contact = (await message.getContact()) as any;

        // console.log(JSON.stringify(message));

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const notifyName = (message as any)._data.notifyName;
        const quotedMessageId = message.id._serialized;
        try {
            const response = await fetch(
                `${BASE_URL}/api/whatsapp/receive-message/${NAME}`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        isGroup: chat.isGroup,
                        content,
                        from: message.from,
                        type: message.type,
                        quotedMessageId,
                        contact: {
                            name: notifyName,
                            description: contact.isBusiness
                                ? contact?.businessProfile.description
                                : "",
                            category: contact.isBusiness
                                ? contact.categories?.length
                                    ? contact.categories[0]
                                          .localized_display_name
                                    : ""
                                : "",
                            isBusiness: contact.isBusiness,
                        },
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            const resultMessage = await response.json();
        } catch (error) {}
    });
    client.on("disconnected", async () => {
        const response = await fetch(
            `${BASE_URL}/api/whatsapp/disconnected/${NAME}`,
            {
                method: "POST",
            }
        );
        const resultDisconnected = await response.json();
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log({ resultDisconnected });
        // eliminar qrcodee
        if (fs.existsSync(qrImage)) {
            fs.unlinkSync(qrImage);
        }
    });
    await client.initialize();
}

app.post("/api/whatsapp/send-message", authenticateToken, sendMessage);
app.post("/api/whatsapp/send-file", authenticateToken, sendFile);
app.post("/api/whatsapp/send-seen", authenticateToken, sendSeen);
app.post("/api/whatsapp/send-typing", authenticateToken, sendTyping);
app.get("/api/whatsapp/qr", authenticateToken, getQr);
app.post("/api/whatsapp/logout", authenticateToken, sendLogout);
app.post("/api/whatsapp/remove-qr", authenticateToken, restart);

app.listen(PORT, () => {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(`Running ${process.env.PORT} - ${SESSION_NAME}`);
});
