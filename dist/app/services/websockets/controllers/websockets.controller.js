"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketsController = exports.usersInWeb = exports.chatAssistantWeb = void 0;
exports.HTMLPROMPT = HTMLPROMPT;
const express_core_1 = require("@vigilio/express-core");
const socket = __importStar(require("socket.io"));
const websockets_service_1 = require("../services/websockets.service");
const ai_1 = require("@/bot/libs/ai");
const express_core_2 = require("@vigilio/express-core");
const empresas_api_service_1 = require("@/empresas/services/empresas.api.service");
const node_cron_1 = __importDefault(require("node-cron"));
const libs_1 = require("@/bot/libs");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
function HTMLPROMPT(_empresa) {
    return `- IMPORTANTE: Por ultimo siempre responde con etiquetas html y clases de tailwind,  y recuerda enviar links ó urls con estilos de tailwind underline, (tablas solo carrito de compra ) , etc y usa <b class="font-bold"></b> en vez de **   en palabras importantes. Por ultimo usa solo un <br></br> para separar parrafos, usa etiqueta a <a href="url" class='text-primary underline'>text</a> para links o enlaces, etc. usa <ul class="list-disc list-inside"><li></li></ul>  para listas, pedidos, información, etc. etiqueta de letra p,h1,span esos text-sm, imagenes maximo width 100px,  html limpio no markdown`;
}
exports.chatAssistantWeb = {};
exports.usersInWeb = {};
function cloudeAiWeb(emp, token, message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const whatsapp = yield (0, ai_1.isWhatsappTelegramIA)(emp);
            if (!whatsapp)
                return "En estos momentos no estoy disponible. Inteligencia Artificial o Token es requerido";
            const { clientVigilio, empresa, latestEmpresaUsage } = whatsapp;
            exports.chatAssistantWeb = Object.assign(Object.assign({}, (exports.chatAssistantWeb !== null && exports.chatAssistantWeb !== void 0 ? exports.chatAssistantWeb : {})), { [`${emp}:${token}`]: [
                    ...((_a = exports.chatAssistantWeb[`${emp}:${token}`]) !== null && _a !== void 0 ? _a : []),
                    [
                        "user",
                        `${message}. [[en html no mkdown, formato chat persona a persona, no web, los links recuerda <a></a>,imagenes width 100px revisa base de datos y SIEMPRE RESPONDEME EN EL IDIOMA QUE TE ESCRIBA!!!.]]`,
                    ],
                ] });
            if (exports.chatAssistantWeb[`${emp}:${token}`].length > 30 &&
                empresa.isTemplate) {
                return "Gracias por probar nuestra inteligencia artificial, más información en https://www.vigilio-services.com";
            }
            const messages = exports.chatAssistantWeb[`${emp}:${token}`].map(([role, content]) => ({
                role,
                content,
            }));
            const messageAnterior = messages
                .filter((a) => a.role === "user")
                .slice(-5, -1)
                .map((c) => c.content);
            const messageActual = `Mensajes Anterior: ${messageAnterior.join(", ")}.\n
        Mensaje Actual: ${message}.`;
            const prompt = yield (0, libs_1.promptReplace)(whatsapp, messageActual, empresa);
            const completion = yield empresas_api_service_1.openAis[empresa.slug].chat.completions.create({
                model: clientVigilio
                    ? clientVigilio.information.modelai
                    : "gpt-4o-mini",
                max_tokens: empresa.inteligenceArtificial.max_length,
                messages: [
                    {
                        role: "user",
                        content: `${prompt}. ${HTMLPROMPT(empresa)}`,
                    },
                    ...messages.slice(-(empresa.inteligenceArtificial.memory - 1)),
                ],
            });
            const completionText = completion.choices[0].message.content;
            const [removeNote] = yield (0, ai_1.featuresIA)(empresa, completionText, false);
            yield (0, ai_1.updateTokensEmpresa)(empresa, latestEmpresaUsage, completion);
            exports.chatAssistantWeb[`${emp}:${token}`] = [
                ...((_b = exports.chatAssistantWeb[`${emp}:${token}`]) !== null && _b !== void 0 ? _b : []),
                ["assistant", removeNote],
            ];
            exports.chatAssistantWeb[`${emp}:${token}`] = exports.chatAssistantWeb[`${emp}:${token}`].map((val) => val[0] === "user"
                ? [val[0], val[1].replace(/\[\[([^\]]+)\]\]/g, "")]
                : val);
            return removeNote.replace(/\[\[([^\]]+)\]\]/g, "");
        }
        catch (error) {
            console.log(error.message);
            return "Hubo un error al usar ia, posible errores no hay tokens.";
        }
    });
}
let WebsocketsController = class WebsocketsController {
    constructor(websocketsService) {
        this.websocketsService = websocketsService;
    }
    disconnect(socket, io) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f;
            const token = (_b = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a["x-token"]) !== null && _b !== void 0 ? _b : "null";
            const empresa = (_d = (_c = socket.handshake.query) === null || _c === void 0 ? void 0 : _c["x-empresa"]) !== null && _d !== void 0 ? _d : "null";
            if (token === "null" || empresa === "null")
                return;
            exports.usersInWeb = Object.assign(Object.assign({}, exports.usersInWeb), { [empresa]: ((_e = exports.usersInWeb[empresa]) !== null && _e !== void 0 ? _e : []).filter((user) => user !== token) });
            io.emit("users-count:index", exports.usersInWeb.length);
            const user = yield this.websocketsService.index((_f = socket.handshake.query) === null || _f === void 0 ? void 0 : _f["x-user"]);
            if (user === null || user === void 0 ? void 0 : user.isOnline) {
                yield user.update({ isOnline: false });
            }
        });
    }
    index(socket, io) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
            const token = (_b = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a["x-token"]) !== null && _b !== void 0 ? _b : "null";
            const empresa = (_d = (_c = socket.handshake.query) === null || _c === void 0 ? void 0 : _c["x-empresa"]) !== null && _d !== void 0 ? _d : "null";
            if (token === "null" || empresa === "null")
                return;
            socket.join(token);
            if (!((_e = exports.chatAssistantWeb[`${empresa}:${token}`]) !== null && _e !== void 0 ? _e : []).length) {
                exports.chatAssistantWeb = Object.assign(Object.assign({}, (exports.chatAssistantWeb !== null && exports.chatAssistantWeb !== void 0 ? exports.chatAssistantWeb : {})), { [`${empresa}:${token}`]: [
                        ...((_f = exports.chatAssistantWeb[`${empresa}:${token}`]) !== null && _f !== void 0 ? _f : []),
                        [
                            "assistant",
                            "Hola, Soy tu asistente virtual 😀. ¿En que le podriamos ayudar?",
                        ],
                    ] });
            }
            io.to(token).emit("chat:ai", exports.chatAssistantWeb[`${empresa}:${token}`]);
            const user = yield this.websocketsService.index((_g = socket.handshake.query) === null || _g === void 0 ? void 0 : _g["x-user"]);
            if (user) {
                if (!user.isOnline) {
                    yield user.update({ isOnline: true });
                }
                const floors = yield this.websocketsService.floorsMesas(empresa, user);
                if (floors) {
                    io.emit("floors_mesas:index", floors);
                }
                socket.join(user.id);
                if (!((_j = ((_h = ai_1.chatAssistant[`${empresa}:${user.id}`]) !== null && _h !== void 0 ? _h : [])) === null || _j === void 0 ? void 0 : _j.length)) {
                    ai_1.chatAssistant[`${empresa}:${user.id}`] = [
                        [
                            "assistant",
                            `Hola ${user.username}, Soy tu asistente virtual 😀. ¿En que  podriamos ayudarte?`,
                            Date.now(),
                        ],
                    ];
                }
                io.to(user.id).emit("chat-assistant:ai", ai_1.chatAssistant[`${empresa}:${user.id}`]);
            }
            const existUserInWeb = ((_k = exports.usersInWeb[empresa]) !== null && _k !== void 0 ? _k : []).find((tk) => {
                return tk === token;
            });
            if (!existUserInWeb) {
                exports.usersInWeb = Object.assign(Object.assign({}, exports.usersInWeb), { [empresa]: [...((_l = exports.usersInWeb[empresa]) !== null && _l !== void 0 ? _l : []), token] });
            }
            if (exports.usersInWeb[empresa].length > 30) {
                const emp = yield empresas_entity_1.Empresas.unscoped().findOne({
                    where: {
                        id: empresa,
                        isFreeVPS: true,
                    },
                    attributes: ["enabled_catalogo", "isFreeVPS"],
                });
                if ((emp === null || emp === void 0 ? void 0 : emp.isFreeVPS) && (emp === null || emp === void 0 ? void 0 : emp.enabled_catalogo)) {
                    yield empresas_entity_1.Empresas.update({ enabled_catalogo: false }, { where: { id: empresa, isFreeVPS: true } });
                    const now = new Date();
                    now.setMinutes(now.getMinutes() + 15);
                    yield (0, ai_1.executeCronDate)(now, () => __awaiter(this, void 0, void 0, function* () {
                        yield empresas_entity_1.Empresas.update({ enabled_catalogo: true }, { where: { id: empresa, isFreeVPS: true } });
                    }));
                }
            }
            io.emit("users-count:index", exports.usersInWeb[empresa].length);
        });
    }
    orderStore(body, io, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const empresa = (_b = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a["x-empresa"]) !== null && _b !== void 0 ? _b : "null";
            if (empresa === "null")
                return;
            const result = yield this.websocketsService.orderStore(empresa, body);
            io.emit("notifications:store", result);
        });
    }
    sendMessage(args, socket, io) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const token = socket.handshake.query["x-token"];
            const empresa = (_b = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a["x-empresa"]) !== null && _b !== void 0 ? _b : "null";
            if (empresa === "null")
                return;
            const message = yield cloudeAiWeb(empresa, token, args.message);
            io.to(token).emit("chat:send-message", [
                "assistant",
                message,
                Date.now(),
            ]);
        });
    }
    sendAssistantMessage(args, socket, io) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const token = (_b = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a["x-token"]) !== null && _b !== void 0 ? _b : "null";
            if (!token)
                return;
            const user = yield this.websocketsService.index((_c = socket.handshake.query) === null || _c === void 0 ? void 0 : _c["x-user"]);
            if (!user)
                return;
            const message = yield (0, ai_1.cloudeAi)(user.empresa.slug, user.id, args.message);
            io.to(token).emit("chat-assistant:send-message", [
                "assistant",
                message,
                Date.now(),
            ]);
        });
    }
    floorsChange(socket, io) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const user = yield this.websocketsService.index((_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a["x-user"]);
            const empresa = (_c = (_b = socket.handshake.query) === null || _b === void 0 ? void 0 : _b["x-empresa"]) !== null && _c !== void 0 ? _c : "null";
            if (empresa === "null")
                return;
            if (user) {
                const floors = yield this.websocketsService.floorsMesas(empresa, user);
                if (floors) {
                    io.emit("floors_mesas:index", floors);
                }
            }
        });
    }
    authRegister(body, io, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const empresa = (_b = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a["x-empresa"]) !== null && _b !== void 0 ? _b : "null";
            if (empresa === "null")
                return;
            const result = yield this.websocketsService.authRegister(empresa, body);
            io.emit("notifications:store", result);
        });
    }
    commentStore(body, io, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const empresa = (_b = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a["x-empresa"]) !== null && _b !== void 0 ? _b : "null";
            if (empresa === "null")
                return;
            const result = yield this.websocketsService.commentStore(empresa, (_c = socket.handshake.query) === null || _c === void 0 ? void 0 : _c["x-user"], body);
            io.emit("notifications:store", result);
        });
    }
    subcommentStore(body, io, socket) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const empresa = (_b = (_a = socket.handshake.query) === null || _a === void 0 ? void 0 : _a["x-empresa"]) !== null && _b !== void 0 ? _b : "null";
            if (empresa === "null")
                return;
            const result = yield this.websocketsService.subcommentStore(empresa, (_c = socket.handshake.query) === null || _c === void 0 ? void 0 : _c["x-user"], body);
            io.emit("notifications:store", result);
        });
    }
};
exports.WebsocketsController = WebsocketsController;
__decorate([
    (0, express_core_1.Disconnect)(),
    __param(0, (0, express_core_1.Socket)()),
    __param(1, (0, express_core_1.IO)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket.Socket, socket.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketsController.prototype, "disconnect", null);
__decorate([
    (0, express_core_1.Connect)(),
    __param(0, (0, express_core_1.Socket)()),
    __param(1, (0, express_core_1.IO)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket.Socket, socket.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketsController.prototype, "index", null);
__decorate([
    (0, express_core_1.Event)("notifications:order-store"),
    __param(0, (0, express_core_1.Args)()),
    __param(1, (0, express_core_1.IO)()),
    __param(2, (0, express_core_1.Socket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket.Socket, socket.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketsController.prototype, "orderStore", null);
__decorate([
    (0, express_core_1.Event)("chat:send-message"),
    __param(0, (0, express_core_1.Args)()),
    __param(1, (0, express_core_1.Socket)()),
    __param(2, (0, express_core_1.IO)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket.Socket, socket.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketsController.prototype, "sendMessage", null);
__decorate([
    (0, express_core_1.Event)("chat-assistant:send-message"),
    __param(0, (0, express_core_1.Args)()),
    __param(1, (0, express_core_1.Socket)()),
    __param(2, (0, express_core_1.IO)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket.Socket, socket.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketsController.prototype, "sendAssistantMessage", null);
__decorate([
    (0, express_core_1.Event)("floors_mesas:index"),
    __param(0, (0, express_core_1.Socket)()),
    __param(1, (0, express_core_1.IO)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket.Socket, socket.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketsController.prototype, "floorsChange", null);
__decorate([
    (0, express_core_1.Event)("notifications:auth-register"),
    __param(0, (0, express_core_1.Args)()),
    __param(1, (0, express_core_1.IO)()),
    __param(2, (0, express_core_1.Socket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket.Socket, socket.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketsController.prototype, "authRegister", null);
__decorate([
    (0, express_core_1.Event)("notifications:comment-store"),
    __param(0, (0, express_core_1.Args)()),
    __param(1, (0, express_core_1.IO)()),
    __param(2, (0, express_core_1.Socket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket.Socket, socket.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketsController.prototype, "commentStore", null);
__decorate([
    (0, express_core_1.Event)("notifications:subcomment-store"),
    __param(0, (0, express_core_1.Args)()),
    __param(1, (0, express_core_1.IO)()),
    __param(2, (0, express_core_1.Socket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, socket.Socket, socket.Socket]),
    __metadata("design:returntype", Promise)
], WebsocketsController.prototype, "subcommentStore", null);
exports.WebsocketsController = WebsocketsController = __decorate([
    (0, express_core_2.Injectable)(),
    (0, express_core_1.SocketController)("/"),
    __metadata("design:paramtypes", [websockets_service_1.WebsocketsService])
], WebsocketsController);
node_cron_1.default.schedule("0 0 * * *", () => {
    exports.chatAssistantWeb = {};
});
