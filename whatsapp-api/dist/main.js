"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.BASE_URL = exports.qrImage = exports.NODE_ENV = exports.VITE_TOKEN_VIGILIO_SERVICES = exports.SESSION_NAME = void 0;
exports.terminal = terminal;
exports.initialWhatsapp = initialWhatsapp;
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const qrcode_1 = __importDefault(require("qrcode"));
const node_fs_1 = __importDefault(require("node:fs"));
const whatsapp_web_js_1 = __importDefault(require("whatsapp-web.js"));
const endpoints_1 = require("./endpoints");
const node_path_1 = __importDefault(require("node:path"));
const middleware_1 = require("./middleware");
const morgan_1 = __importDefault(require("morgan"));
const node_util_1 = __importDefault(require("node:util"));
const node_child_process_1 = require("node:child_process");
dotenv_1.default.config({ path: ".env" });
const execAsync = node_util_1.default.promisify(node_child_process_1.exec);
async function terminal(comando) {
    try {
        const { stdout, stderr } = await execAsync(comando);
        if (stderr) {
            throw new Error(`Error en el comando, ${stderr}`);
        }
        return stdout;
    }
    catch (error) {
        throw new Error(`Error server, ${error.message}`);
    }
}
const PORT = Number(process.env.PORT);
exports.SESSION_NAME = process.env.SESSION_NAME;
exports.VITE_TOKEN_VIGILIO_SERVICES = process.env.VITE_TOKEN_VIGILIO_SERVICES;
exports.NODE_ENV = process.env.NODE_ENV;
exports.qrImage = node_path_1.default.resolve(__dirname, "..", `${exports.SESSION_NAME}-qr.png`);
exports.BASE_URL = exports.NODE_ENV === "production"
    ? `https://www.${exports.SESSION_NAME}.vigilio-services.com`
    : "https://vigilioservices2.loca.lt";
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "100mb" }));
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)("dev"));
initialWhatsapp();
async function initialWhatsapp() {
    exports.client = new whatsapp_web_js_1.default.Client({
        authStrategy: new whatsapp_web_js_1.default.LocalAuth(),
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
    exports.client.on("qr", (qr) => {
        if (!node_fs_1.default.existsSync(exports.qrImage))
            qrcode_terminal_1.default.generate(qr, { small: true }, () => {
                qrcode_1.default.toFile(exports.qrImage, qr, (err) => {
                    if (err)
                        throw err;
                    console.log("Código QR generado con éxito");
                });
            });
    });
    exports.client.on("ready", async () => {
        console.log("******      ready      *********");
        console.log(JSON.stringify((await exports.client.getContacts()).slice(0, 10)));
        const contacts = await exports.client.getContacts();
        const response = await fetch(`${exports.BASE_URL}/api/whatsapp/ready`, {
            method: "POST",
            body: JSON.stringify({
                contacts: contacts.map((c) => ({
                    name: c.name,
                    id: { _serialized: c.id._serialized },
                })),
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const resultready = await response.json();
        console.log({ resultready });
    });
    exports.client.on("message", async (message) => {
        const chat = await message.getChat();
        async function getFile() {
            const media = await message.downloadMedia();
            if (media.data) {
                const binaryData = Buffer.from(media.data, "base64");
                return binaryData;
            }
            return null;
        }
        const content = message.type === "chat" ? message.body : await getFile();
        if (!content)
            return null;
        const notifyName = message._data.notifyName;
        const quotedMessageId = message.id._serialized;
        const response = await fetch(`${exports.BASE_URL}/api/whatsapp/receive-message`, {
            method: "POST",
            body: JSON.stringify({
                isGroup: chat.isGroup,
                content,
                from: message.from,
                type: message.type,
                notifyName,
                quotedMessageId,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const resultMessage = await response.json();
    });
    exports.client.on("disconnected", async () => {
        const response = await fetch(`${exports.BASE_URL}/api/whatsapp/disconnected`, {
            method: "POST",
        });
        const resultDisconnected = await response.json();
        console.log({ resultDisconnected });
        if (node_fs_1.default.existsSync(exports.qrImage)) {
            node_fs_1.default.unlinkSync(exports.qrImage);
        }
    });
    await exports.client.initialize();
}
app.post("/api/whatsapp/send-message", middleware_1.authenticateToken, endpoints_1.sendMessage);
app.post("/api/whatsapp/send-file", middleware_1.authenticateToken, endpoints_1.sendFile);
app.post("/api/whatsapp/send-seen", middleware_1.authenticateToken, endpoints_1.sendSeen);
app.post("/api/whatsapp/send-typing", middleware_1.authenticateToken, endpoints_1.sendTyping);
app.get("/api/whatsapp/qr", middleware_1.authenticateToken, endpoints_1.getQr);
app.post("/api/whatsapp/logout", middleware_1.authenticateToken, endpoints_1.sendLogout);
app.post("/api/whatsapp/remove-qr", middleware_1.authenticateToken, endpoints_1.restart);
app.listen(PORT, () => {
    console.log(`Running ${process.env.PORT} - ${exports.SESSION_NAME}`);
});
