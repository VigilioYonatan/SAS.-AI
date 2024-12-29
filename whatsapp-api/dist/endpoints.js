"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMessage = sendMessage;
exports.sendFile = sendFile;
exports.sendSeen = sendSeen;
exports.sendTyping = sendTyping;
exports.getQr = getQr;
exports.sendLogout = sendLogout;
exports.restart = restart;
const formidable_1 = __importDefault(require("formidable"));
const node_fs_1 = __importDefault(require("node:fs"));
const main_1 = require("./main");
const whatsapp_web_js_1 = __importDefault(require("whatsapp-web.js"));
async function sendMessage(req, res) {
    try {
        const body = req.body;
        const query = req.query;
        if (!body.message || !query.telephone)
            return res.status(400).json({
                success: false,
                message: "required message or telephone body",
            });
        const chat = await main_1.client.getChatById(query.telephone);
        await chat.sendSeen();
        await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, Number(body.delay) * 1000));
        await main_1.client.sendMessage(query.telephone, body.message, body.options ?? {});
        return res.json({
            success: true,
            message: "Mensaje enviado correctamente",
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`,
        });
    }
}
async function sendFile(req, res) {
    try {
        const query = req.query;
        const form = (0, formidable_1.default)();
        const [field, files] = await form.parse(req);
        const chat = await main_1.client.getChatById(query.telephone);
        await chat.sendSeen();
        await chat.sendStateTyping();
        await new Promise((resolve) => setTimeout(resolve, Number(field.delay ? Number(field.delay[0]) : 1) * 1000));
        const options = field.options
            ? JSON.parse(JSON.parse(field.options[0]))
            : {};
        if (!query.telephone)
            return res.status(400).json({
                success: false,
                message: "required telephone body or file",
            });
        if (field.url) {
            const image = await whatsapp_web_js_1.default.MessageMedia.fromUrl(field.url[0]);
            await main_1.client.sendMessage(query.telephone, image, options);
            return res.json({
                success: true,
                message: "Mensaje enviado correctamente",
            });
        }
        if (files.file) {
            const filePath = files.file[0].filepath;
            const ext = files.file[0].originalFilename?.split(".").at(-1);
            const bufferFile = Buffer.from(node_fs_1.default.readFileSync(filePath)).toString("base64");
            node_fs_1.default.unlinkSync(filePath);
            const file = new whatsapp_web_js_1.default.MessageMedia(files.file[0].mimetype, bufferFile, field.name
                ? `${field.name[0]}.${ext}`
                : files.file[0].originalFilename, files.file[0].size);
            await main_1.client.sendMessage(query.telephone, file, options);
            return res.json({
                success: true,
                message: "Mensaje enviado correctamente",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: `Server error: ${error.message}`,
        });
    }
}
async function sendSeen(req, res) {
    const query = req.query;
    if (!query.telephone)
        return res.status(400).json({
            success: false,
            message: "required telephone body",
        });
    const chat = await main_1.client.getChatById(query.telephone);
    await chat.sendSeen();
    return { success: true, message: "OK" };
}
async function sendTyping(req, res) {
    const query = req.query;
    if (!query.telephone)
        return res.status(400).json({
            success: false,
            message: "required telephone",
        });
    const chat = await main_1.client.getChatById(query.telephone);
    await new Promise((resolve) => setTimeout(resolve, Number(req.body.delay) * 1000));
    await chat.sendSeen();
    await chat.sendStateTyping();
    return { success: true, message: "typing success" };
}
async function getQr(_req, res) {
    if (!node_fs_1.default.existsSync(main_1.qrImage))
        return res.status(404).json({ success: false, message: "No hay qr" });
    return res.sendFile(main_1.qrImage);
}
async function sendLogout() {
    await main_1.client.logout();
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await (0, main_1.initialWhatsapp)();
    return { success: true, message: "logout success" };
}
async function restart() {
    if (node_fs_1.default.existsSync(main_1.qrImage)) {
        node_fs_1.default.unlinkSync(main_1.qrImage);
    }
    return { success: true, message: "qr removed" };
}
