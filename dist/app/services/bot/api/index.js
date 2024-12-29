"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_URL_WHATSAPP = BASE_URL_WHATSAPP;
exports.whatsappSendMessageApi = whatsappSendMessageApi;
exports.whatsappSendFileApi = whatsappSendFileApi;
exports.whatsappSendSeenApi = whatsappSendSeenApi;
exports.whatsappSendTypingApi = whatsappSendTypingApi;
exports.whatsappGetQrApi = whatsappGetQrApi;
exports.whatsappLogout = whatsappLogout;
exports.whatsappRemoveQR = whatsappRemoveQR;
const express_core_1 = require("@vigilio/express-core");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
function BASE_URL_WHATSAPP(empresa) {
    return enviroments_config_1.default.NODE_ENV === "production"
        ? `https://www.${empresa.slug}.docker.vigilio-services.com`
        : "https://1cae-201-218-157-99.ngrok-free.app";
}
function whatsappSendMessageApi(empresa, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { telephone } = body, rest = __rest(body, ["telephone"]);
        const response = yield fetch(`${BASE_URL_WHATSAPP(empresa)}/api/whatsapp/send-message?telephone=${telephone}`, {
            method: "POST",
            body: JSON.stringify(rest),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        });
        const result = yield response.json();
        if (!response.ok)
            throw new express_core_1.InternalServerErrorException(result.message);
        return result;
    });
}
function whatsappSendFileApi(empresa, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { telephone } = body, rest = __rest(body, ["telephone"]);
        const formdata = new FormData();
        if (rest.name) {
            formdata.append("name", rest.name);
        }
        if (rest.file) {
            formdata.append("file", rest.file);
        }
        if (rest.url) {
            formdata.append("url", rest.url);
        }
        if (rest.delay) {
            formdata.append("delay", String(rest.delay));
        }
        if (rest.options) {
            formdata.append("options", JSON.stringify(JSON.stringify(rest.options)));
        }
        const response = yield fetch(`${BASE_URL_WHATSAPP(empresa)}/api/whatsapp/send-file?telephone=${telephone}`, {
            method: "POST",
            body: formdata,
            headers: {
                Authorization: `Bearer ${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        });
        const result = yield response.json();
        if (!response.ok)
            throw new express_core_1.InternalServerErrorException(result.message);
        return result;
    });
}
function whatsappSendSeenApi(empresa, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { telephone } = body;
        const response = yield fetch(`${BASE_URL_WHATSAPP(empresa)}/api/whatsapp/send-seen?telephone=${telephone}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        });
        const result = yield response.json();
        return result;
    });
}
function whatsappSendTypingApi(empresa, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const { telephone } = body;
        const response = yield fetch(`${BASE_URL_WHATSAPP(empresa)}/api/whatsapp/send-typing?telephone=${telephone}`, {
            method: "POST",
            body: JSON.stringify({ delay: body.delay }),
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        });
        const result = yield response.json();
        return result;
    });
}
function whatsappGetQrApi(empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${BASE_URL_WHATSAPP(empresa)}/api/whatsapp/qr`, {
            headers: {
                Authorization: `Bearer ${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        });
        const result = yield response.arrayBuffer();
        return result;
    });
}
function whatsappLogout(empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${BASE_URL_WHATSAPP(empresa)}/api/whatsapp/logout`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        });
        const result = yield response.json();
        return result;
    });
}
function whatsappRemoveQR(empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${BASE_URL_WHATSAPP(empresa)}/api/whatsapp/remove-qr`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES}`,
            },
        });
        const result = yield response.json();
        return result;
    });
}
