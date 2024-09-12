import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import qrcodeTerminal from "qrcode-terminal";
import qrcode from "qrcode";
import fs from "node:fs";
import WAWebJS from "whatsapp-web.js";
import {
    getQr,
    sendFile,
    sendLogout,
    sendMessage,
    removeQR,
    sendSeen,
    sendTyping,
} from "./endpoints";
import path from "node:path";
import { authenticateToken } from "./middleware";
import puppeteer from "puppeteer";
import morgan from "morgan";
import { HttpsProxyAgent } from "https-proxy-agent";
import https from "node:https";
dotenv.config({ path: ".env" });

const PORT = Number(process.env.PORT);
export const SESSION_NAME = process.env.SESSION_NAME;
export const VITE_TOKEN_VIGILIO_SERVICES =
    process.env.VITE_TOKEN_VIGILIO_SERVICES!;
export const NODE_ENV = process.env.NODE_ENV!;
export const qrImage = path.resolve(__dirname, "..", `${SESSION_NAME}-qr.png`);
export const BASE_URL =
    NODE_ENV === "production"
        ? `https://www.${process.env.SESSION_NAME}.vigilio-services.com`
        : `http://${process.env.SESSION_NAME}.localhost:4003`;

export let client: WAWebJS.Client;

const app = express();
app.use(cors());
app.use(morgan("dev"));
async function getIp() {
    const response = await fetch("https://free-proxy-list.net/");
    const result = await response.text();
    const $ = cheerio.load(result);
    const rows = $("table tbody tr");
    const proxies = [];

    // Itera sobre cada fila de la tabla
    rows.each((i, row) => {
        const cols = $(row).find("td");
        const proxy = {
            ipAddress: $(cols[0]).text().trim(),
            port: $(cols[1]).text().trim(),
            code: $(cols[2]).text().trim(),
            country: $(cols[3]).text().trim(),
            anonymity: $(cols[4]).text().trim(),
            google: $(cols[5]).text().trim(),
            https: $(cols[6]).text().trim(),
            lastChecked: $(cols[7]).text().trim(),
        };
        proxies.push(proxy);
    });
    console.log({ rows });

    return result;
}
function checkProxy(proxy: string) {
    return new Promise((resolve, reject) => {
        const agent = new HttpsProxyAgent(proxy);

        https
            .get("https://httpbin.org/ip", { agent, timeout: 5000 }, (res) => {
                let data = "";

                res.on("data", (chunk) => {
                    data += chunk;
                });

                res.on("end", () => {
                    try {
                        resolve(true);
                    } catch (error) {
                        console.error(
                            `Proxy ${proxy} failed to parse response. Error: ${
                                (error as Error).message
                            }`
                        );
                        reject(false);
                    }
                });
            })
            .on("error", (error) => {
                console.error(`Proxy ${proxy} failed. Error: ${error.message}`);
                reject(error);
            });
    });
}

export async function initialWhatsapp() {
    const proxies = [
        "http://149.129.226.9:3128",
        "http://81.91.151.146:3128",
        "http://68.71.247.130:4145",
        "http://103.189.116.115:8080",
        "http://83.219.145.108:3128",
        "http://64.56.104.90:15027",
        "http://116.125.141.115:80",
        "http://103.113.149.245:6969",
    ];

    let prox = null;
    for (const proxy of proxies) {
        const a = await checkProxy(proxy);
        if (a) {
            prox = proxy;
            break;
        }
    }
    console.log({ prox });

    // Selecciona un proxy aleatorio
    const proxy = proxies[Math.floor(Math.random() * proxies.length)];

    const browser = await puppeteer.launch({
        headless: true,
        args: [`--proxy-server=${prox}`], // Usar el prox
    }); // Cambia a 'true' si no necesitas ver el navegador
    try {
        const page = await browser.newPage();
        // Navegar a una página que muestra la IP
        await page.goto("https://ipinfo.io");
        // Esperar a que el contenido de la página se cargue
        await page.waitForSelector("body"); // Puedes ajustar el selector si es necesario
        // Extraer el contenido HTML del cuerpo de la página
        const html = await page.content();
        console.log(html);
        // Cerrar el navegador
        await browser.close();
    } catch (error) {
        console.error("Error:", error);
        await browser.close();
    }
    return;
    // Cerrar el navegador
    // await getIp();
    client = new WAWebJS.Client({
        authStrategy: new WAWebJS.LocalAuth(),
        puppeteer: {
            headless: true,
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                `--proxy-server=${proxyServer}`,
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
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log(JSON.stringify((await client.getContacts()).slice(0, 10)));
        await fetch(`${BASE_URL}/api/bot/whatsapp/ready`, {
            method: "POST",
            body: JSON.stringify({ contacts: await client.getContacts() }),
            headers: {
                "Content-Type": "application-json",
            },
        });
    });

    client.on("message", async (message) => {
        const chat = await message.getChat();
        async function getFile() {
            const media = await message.downloadMedia();
            const binaryData = Buffer.from(media.data, "base64");
            return binaryData;
        }
        await fetch(`${BASE_URL}/api/bot/receive-message`, {
            method: "POST",
            body: JSON.stringify({
                isGroup: chat.isGroup,
                content:
                    message.type === "chat" ? message.body : await getFile(),
                from: message.from,
                props: message,
            }),
            headers: {
                "Content-Type": "application-json",
            },
        });
    });
    client.on("disconnected", async () => {
        await fetch(`${BASE_URL}/api/bot/disconnected`, { method: "POST" });
        // eliminar qrcodee
        if (fs.existsSync(qrImage)) {
            fs.unlinkSync(qrImage);
        }
    });
    client.initialize();
}

app.post("/api/whatsapp/send-message", authenticateToken, sendMessage);
app.post("/api/whatsapp/send-file", authenticateToken, sendFile);
app.post("/api/whatsapp/send-seen", authenticateToken, sendSeen);
app.post("/api/whatsapp/send-typing", authenticateToken, sendTyping);
app.get("/api/whatsapp/qr", authenticateToken, getQr);
app.post("/api/whatsapp/logout", authenticateToken, sendLogout);
app.post("/api/whatsapp/remove-qr", authenticateToken, removeQR);

// whatsapp
initialWhatsapp();

app.listen(PORT, () => {
    // biome-ignore lint/suspicious/noConsoleLog: <explanation>
    console.log(`Running ${process.env.PORT} - ${SESSION_NAME}`);
});
