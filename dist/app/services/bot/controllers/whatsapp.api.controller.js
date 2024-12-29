"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.whatsappApiController = exports.chatsWait = exports.chats = void 0;
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const express_core_1 = require("@vigilio/express-core");
const api_1 = require("../api");
const helpers_1 = require("~/libs/helpers");
const ai_1 = require("../libs/ai");
const dayjs_1 = require("~/libs/dayjs");
const libs_1 = require("../libs");
const empresas_api_service_1 = require("@/empresas/services/empresas.api.service");
const formidable_1 = __importDefault(require("formidable"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_cron_1 = __importDefault(require("node-cron"));
const node_ssh_1 = require("node-ssh");
const backup_api_service_1 = require("@/empresas/services/backup.api.service");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const cache_1 = __importDefault(require("@vigilio/express-core/cache"));
exports.chats = {};
exports.chatsWait = {};
let whatsappApiController = class whatsappApiController {
    ready(client, info) {
        return __awaiter(this, void 0, void 0, function* () {
            const empresa = yield empresas_entity_1.Empresas.findOne({
                where: { slug: info.slug },
                attributes: ["id", "contacts", "slug"],
            });
            if (!empresa)
                throw new express_core_1.BadRequestException("Server error");
            if (!empresa.contacts.length || empresa.contacts.length < 10) {
                const contacts = client.contacts;
                const mappedcontacts = contacts.map((contact) => ({
                    name: contact.name,
                    telephone: contact.id._serialized,
                    isFavorite: false,
                    ia: true,
                }));
                yield empresa.update({ contacts: mappedcontacts });
            }
            yield (empresa === null || empresa === void 0 ? void 0 : empresa.update({ enabledBot: true }));
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                message: "OK",
            };
        });
    }
    receiveMessage(info, body) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            let content = body.content;
            const userId = body.from;
            try {
                const whatsapp = yield (0, ai_1.isWhatsappTelegramIA)(info.slug, userId);
                if (!whatsapp)
                    throw new express_core_1.BadRequestException("whatsapp no permited");
                if (!(info === null || info === void 0 ? void 0 : info.enabledBot))
                    throw new express_core_1.BadRequestException("whatsapp desabilitado");
                const { clientVigilio, latestEmpresaUsage, empresa } = whatsapp;
                if (body.isGroup)
                    throw new express_core_1.BadRequestException("whatsapp no permited");
                if (!["ptt", "chat", "image"].includes(body.type))
                    throw new express_core_1.BadRequestException("no audio o other");
                const opt = Math.random() < 0.5
                    ? {
                        quotedMessageId: body.quotedMessageId,
                    }
                    : {};
                if (body.type === "ptt") {
                    const audioToTxt = yield (0, libs_1.transcribeAudio)(empresa.slug, Buffer.from(content.data));
                    content = audioToTxt.text;
                }
                if (body.type === "image") {
                    const imageText = yield (0, libs_1.interpretarImagen)(whatsapp, Buffer.from(content.data));
                    if (imageText === "null") {
                        yield (0, api_1.whatsappSendMessageApi)(empresa, {
                            message: "No se pudo analizar esta imagen o no se encontró 😢.",
                            telephone: userId,
                            options: opt,
                            delay: 1,
                        });
                        return {
                            success: true,
                            message: "executed",
                        };
                    }
                    content = `TE ENVIE UNA IMAGEN DE : '${imageText}'`;
                }
                const existNumber = empresa.contacts.find((contact) => contact.telephone === userId);
                if (!existNumber) {
                    const mappedcontacts = [
                        ...empresa.contacts,
                        {
                            name: body.notifyName,
                            telephone: userId,
                            isFavorite: false,
                            ia: true,
                        },
                    ];
                    yield empresas_entity_1.Empresas.update({ contacts: mappedcontacts }, { where: { slug: empresa.slug } });
                    cache_1.default.delete(`EMPRESA:${empresa.slug}`);
                }
                const random = (0, helpers_1.randomNumber)(empresa.inteligenceArtificial.timer.start, empresa.inteligenceArtificial.timer.finish);
                exports.chats[`${info.slug}:${userId}`] = [
                    ...((_a = exports.chats[`${info.slug}:${userId}`]) !== null && _a !== void 0 ? _a : []),
                    [
                        "user",
                        `${content}.'[[en formato whatsapp, revisa base de datos, no markdown y SIEMPRE RESPONDEME EN EL IDIOMA QUE TE ESCRIBA.]]`,
                    ],
                ];
                exports.chatsWait[`${info.slug}:${userId}`] = [
                    ...((_b = exports.chatsWait[`${info.slug}:${userId}`]) !== null && _b !== void 0 ? _b : []),
                    content,
                ];
                if (exports.chatsWait[`${info.slug}:${userId}`].length > 70) {
                    throw new express_core_1.BadRequestException("Limite de conversación");
                }
                yield (0, helpers_1.delay)(random);
                const isSimilar = exports.chatsWait[`${info.slug}:${userId}`].at(-1) === content;
                if (!isSimilar) {
                    exports.chats[`${info.slug}:${userId}`] = exports.chats[`${info.slug}:${userId}`].filter(([assistant, val]) => assistant === "user" && val !== content);
                    return { success: true, message: "executed" };
                }
                exports.chats[`${info.slug}:${userId}`] = exports.chats[`${info.slug}:${userId}`].map(([assistant, val]) => {
                    if (assistant === "user" && val === content) {
                        return [
                            assistant,
                            exports.chatsWait[`${info.slug}:${userId}`].join(", "),
                        ];
                    }
                    return [assistant, val];
                });
                exports.chatsWait[`${info.slug}:${userId}`] = [];
                const buenas = (0, ai_1.buenosDias)(content, body.notifyName, empresa);
                const thanks = (0, ai_1.gracias)(content);
                if (buenas) {
                    yield (0, api_1.whatsappSendMessageApi)(empresa, {
                        message: buenas,
                        telephone: userId,
                        options: opt,
                        delay: 1,
                    });
                    return {
                        success: true,
                        message: "OK",
                    };
                }
                if (thanks) {
                    yield (0, api_1.whatsappSendMessageApi)(empresa, {
                        message: thanks,
                        telephone: userId,
                        options: opt,
                        delay: 1,
                    });
                    return {
                        success: true,
                        message: "OK",
                    };
                }
                if (exports.chats[`${info.slug}:${userId}`]) {
                    const messages = exports.chats[`${info.slug}:${userId}`].map(([role, content]) => ({
                        role,
                        content,
                    }));
                    const messageAnterior = messages
                        .filter((a) => a.role === "user")
                        .slice(-5, -1)
                        .map((c) => c.content);
                    const messageActual = `Mensajes Anterior: ${messageAnterior.join(", ")}.\n
				Mensaje Actual: ${content}. escribe formato whatsapp`;
                    const prompt = yield (0, libs_1.promptReplace)(whatsapp, messageActual, empresa);
                    const completion = yield empresas_api_service_1.openAis[info.slug].chat.completions.create({
                        model: clientVigilio
                            ? clientVigilio.information.modelai
                            : "gpt-4o-mini",
                        max_tokens: empresa.inteligenceArtificial.max_length,
                        messages: [
                            {
                                role: "user",
                                content: `${prompt}.
                                por ultimo responde bonito en formato whatsapp y cuando mandes listas separalos en \n format whatsapp para que se vea bien y separados y no se vea todo junto el texto. gracias.`,
                            },
                            {
                                role: "assistant",
                                content: "Entendido, Empezemos.",
                            },
                            ...messages.slice(-empresa.inteligenceArtificial.memory),
                        ],
                    });
                    yield (0, ai_1.updateTokensEmpresa)(empresa, latestEmpresaUsage, completion);
                    const completionText = completion.choices[0].message.content;
                    const [removeNote, urlExtraidas] = yield (0, ai_1.featuresIA)(empresa, completionText, true);
                    exports.chats[`${info.slug}:${userId}`] = [
                        ...(exports.chats[`${info.slug}:${userId}`] || []),
                        ["assistant", removeNote],
                    ];
                    if (empresa.inteligenceArtificial.isChunk) {
                        const chunks = removeNote.split(/(?<!\d)\.\s+/g);
                        for (const chunk of chunks) {
                            yield (0, api_1.whatsappSendMessageApi)(empresa, {
                                message: chunk,
                                telephone: userId,
                                options: opt,
                                delay: 2,
                            });
                        }
                    }
                    else {
                        yield (0, api_1.whatsappSendMessageApi)(empresa, {
                            message: removeNote,
                            telephone: userId,
                            options: opt,
                            delay: 2,
                        });
                    }
                    if (urlExtraidas.length < 2) {
                        for (const url of urlExtraidas) {
                            const options = {
                                sendMediaAsSticker: true,
                            };
                            yield (0, api_1.whatsappSendFileApi)(empresa, {
                                telephone: userId,
                                url,
                                options,
                                delay: 1,
                            });
                        }
                    }
                }
                return {
                    success: true,
                    message: "OK",
                };
            }
            catch (error) {
                exports.chats[`${info.slug}:${userId}`] = [];
                throw new express_core_1.BadRequestException(error.message);
            }
        });
    }
    sendMessage(empresa, telephone, body) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield (0, api_1.whatsappSendMessageApi)(empresa, Object.assign(Object.assign({}, body), { telephone, delay: 0 }));
                return result;
            }
            catch (error) {
                throw new express_core_1.BadRequestException("POSIBLE ERROR: conectar a Whatsapp");
            }
        });
    }
    sendFile(req) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const form = (0, formidable_1.default)();
            const [fields, files] = yield form.parse(req);
            const empresa = req.empresa;
            const file = files.file
                ? new File([yield node_fs_1.default.promises.readFile(files.file[0].filepath)], (_a = files.file[0].originalFilename) !== null && _a !== void 0 ? _a : "archivo", {
                    type: files.file[0].mimetype,
                })
                : null;
            const data = {
                file,
                telephone: req.query.telephone,
                name: fields.name ? fields.name[0] : null,
                options: fields.option ? JSON.parse(fields.option[0]) : null,
                url: fields.url ? JSON.parse(fields.url[0]) : null,
                delay: 0,
            };
            const result = yield (0, api_1.whatsappSendFileApi)(empresa, data);
            return result;
        });
    }
    sendSeen(empresa, telephone) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, api_1.whatsappSendSeenApi)(empresa, { telephone });
            return result;
        });
    }
    sendTyping(empresa, body, telephone) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, api_1.whatsappSendTypingApi)(empresa, Object.assign(Object.assign({}, body), { telephone }));
            return result;
        });
    }
    disconnected(emp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield empresas_entity_1.Empresas.update({ enabledBot: false }, { where: { slug: emp.slug } });
            cache_1.default.delete(`EMPRESA:${emp.slug}`);
            return {
                success: true,
                message: "OK",
            };
        });
    }
    restart(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            yield empresas_entity_1.Empresas.update({ timeWhatsapp: (0, dayjs_1.NOW)(empresa).add(1, "minute").format() }, { where: { slug: empresa.slug } });
            if (empresa.whatsapp_mode.type === "VPS") {
                function onSSH() {
                    return new Promise((res, _) => {
                        const ssh = new node_ssh_1.NodeSSH();
                        ssh.connect({
                            host: empresa.whatsapp_mode.ip,
                            username: "root",
                            password: empresa.whatsapp_mode.password,
                        })
                            .then(() => {
                            console.log("Conectado correctamente a vps");
                            const commands = `docker exec ${empresa.slug} sh -c "rm -rf ${empresa.slug}-qr.png && rm -rf .wwebjs_auth && rm -rf .wwebjs_cache" && docker restart ${empresa.slug} `;
                            return ssh.execCommand(commands);
                        })
                            .then((result) => {
                            console.log(`STDOUT: ${result.stdout}`);
                            console.error(`STDERR: ${result.stderr}`);
                            res(true);
                        })
                            .catch(() => {
                            res(true);
                        })
                            .finally(() => {
                            ssh.dispose();
                        });
                    });
                }
                yield onSSH();
            }
            else {
                const comando = `docker exec ${empresa.slug} sh -c "rm -rf ${empresa.slug}-qr.png && rm -rf .wwebjs_auth && rm -rf .wwebjs_cache" && docker restart ${empresa.slug} `;
                console.log(`Ejecutando comando: ${comando}`);
                yield (0, helpers_1.terminal)(comando, true);
                console.log("Ejecutó correctamente");
            }
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                message: "Se reinició correctamente.",
            };
        });
    }
    update(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            if (empresa.whatsapp_mode.type === "VPS") {
                const ssh = new node_ssh_1.NodeSSH();
                try {
                    yield ssh.connect({
                        host: empresa.whatsapp_mode.ip,
                        username: "root",
                        password: empresa.whatsapp_mode.password,
                    });
                    console.log("Conectado correctamente a vps");
                    yield ssh.execCommand(`docker ps -a -q --filter ancestor=${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP} | xargs -I {} docker rm -f {} || true && docker rmi -f ${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP}|| true`);
                    yield ssh.execCommand(`docker volume create ${empresa.slug} && docker run -d --name ${empresa.slug} -e PORT=5000 -e NODE_ENV=${enviroments_config_1.default.NODE_ENV} -e SESSION_NAME=${empresa.slug} -e VITE_TOKEN_VIGILIO_SERVICES=${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES} --restart always --memory="${Number(empresa.whatsapp_mode.memory) - 0.2 || "1"}g" --memory-swap="${Number(empresa.whatsapp_mode.memory) - 0.2 || "1"}g" --cpus="${Number(empresa.whatsapp_mode.cpu) - 0.2 || "1"}" -p ${empresa.port}:5000 -v ${empresa.slug}:/app/data ${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP}`);
                    console.error("STDERR: error bash a la hora de reiniciar");
                }
                catch (error) {
                    console.error("Hubo un error: ", error);
                }
                finally {
                    ssh.dispose();
                }
            }
            else {
                const command1 = `docker rm -f ${empresa.slug} || true`;
                const command2 = `docker volume rm ${empresa.slug}  || true`;
                yield (0, helpers_1.terminal)(command1, true);
                yield (0, helpers_1.terminal)(command2, true);
                const result = yield (0, backup_api_service_1.vpsShowApi)();
                yield (0, helpers_1.terminal)(`docker rmi ${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP} || true`, true);
                yield (0, helpers_1.terminal)(`docker volume create ${empresa.slug} && docker run -d --name ${empresa.slug} -e PORT=5000 -e NODE_ENV=${enviroments_config_1.default.NODE_ENV} -e SESSION_NAME=${empresa.slug} -e VITE_TOKEN_VIGILIO_SERVICES=${enviroments_config_1.default.VITE_TOKEN_VIGILIO_SERVICES} --restart always --memory="${result.vps.whatsapp_ram || "1000"}m" --memory-swap="${result.vps.whatsapp_ram || "1000"}m" --cpus="${result.vps.whatsapp_cpu_max || "1"}" -p ${empresa.port}:5000 -v ${empresa.slug}:/app/data ${enviroments_config_1.default.DOCKER_IMAGE_WHATSAPP}`);
            }
            yield empresas_entity_1.Empresas.update({
                timeWhatsapp: (0, dayjs_1.NOW)(empresa).add(3, "minute").format(),
            }, {
                where: {
                    slug: empresa.slug,
                },
            });
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                message: "Se reinició correctamente.",
            };
        });
    }
    qr(empresa, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield (0, api_1.whatsappGetQrApi)(empresa);
            res.setHeader("Content-Type", "image/png");
            res.send(Buffer.from(result));
        });
    }
    logout(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            let comando = "";
            if (empresa.whatsapp_mode.type === "VPS") {
                function onSSH() {
                    return new Promise((res, _) => {
                        const ssh = new node_ssh_1.NodeSSH();
                        ssh.connect({
                            host: empresa.whatsapp_mode.ip,
                            username: "root",
                            password: empresa.whatsapp_mode.password,
                        })
                            .then(() => __awaiter(this, void 0, void 0, function* () {
                            let command = "";
                            console.log("Conectado correctamente a vps");
                            if (empresa.enabledBot) {
                                command = `docker stop ${empresa.slug}`;
                                yield empresas_entity_1.Empresas.update({ enabledBot: false }, {
                                    where: {
                                        slug: empresa.slug,
                                    },
                                });
                            }
                            else {
                                comando = `docker start ${empresa.slug}`;
                                yield empresas_entity_1.Empresas.update({ enabledBot: true }, {
                                    where: {
                                        slug: empresa.slug,
                                    },
                                });
                            }
                            return ssh.execCommand(command);
                        }))
                            .then((result) => {
                            console.log(`STDOUT: ${result.stdout}`);
                            console.error(`STDERR: ${result.stderr}`);
                            res(true);
                        })
                            .catch(() => {
                            res(true);
                        })
                            .finally(() => {
                            ssh.dispose();
                        });
                    });
                }
                yield onSSH();
            }
            else {
                if (empresa.enabledBot) {
                    comando = `docker stop ${empresa.slug}`;
                    yield (0, helpers_1.terminal)(comando);
                    yield empresas_entity_1.Empresas.update({ enabledBot: false }, {
                        where: {
                            slug: empresa.slug,
                        },
                    });
                }
                else {
                    comando = `docker start ${empresa.slug}`;
                    yield (0, helpers_1.terminal)(comando);
                    yield empresas_entity_1.Empresas.update({ enabledBot: true }, {
                        where: {
                            slug: empresa.slug,
                        },
                    });
                }
            }
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            console.log(`Ejecutando comando: ${comando}`);
            return {
                success: true,
                message: "Se reinició correctamente.",
            };
        });
    }
};
exports.whatsappApiController = whatsappApiController;
__decorate([
    (0, express_core_1.Post)("/ready"),
    __param(0, (0, express_core_1.Body)()),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], whatsappApiController.prototype, "ready", null);
__decorate([
    (0, express_core_1.Post)("/receive-message"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas, Object]),
    __metadata("design:returntype", Promise)
], whatsappApiController.prototype, "receiveMessage", null);
__decorate([
    (0, express_core_1.Post)("/send-message"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Query)("telephone")),
    __param(2, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas, String, Object]),
    __metadata("design:returntype", Promise)
], whatsappApiController.prototype, "sendMessage", null);
__decorate([
    (0, express_core_1.Post)("/send-file"),
    __param(0, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], whatsappApiController.prototype, "sendFile", null);
__decorate([
    (0, express_core_1.Post)("/send-seen"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Query)("telephone")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas, String]),
    __metadata("design:returntype", Promise)
], whatsappApiController.prototype, "sendSeen", null);
__decorate([
    (0, express_core_1.Post)("/send-typing"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Body)()),
    __param(2, (0, express_core_1.Query)("telephone")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas, Object, String]),
    __metadata("design:returntype", Promise)
], whatsappApiController.prototype, "sendTyping", null);
__decorate([
    (0, express_core_1.Post)("/disconnected"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], whatsappApiController.prototype, "disconnected", null);
__decorate([
    (0, express_core_1.Post)("/restart"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], whatsappApiController.prototype, "restart", null);
__decorate([
    (0, express_core_1.Post)("/update"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], whatsappApiController.prototype, "update", null);
__decorate([
    (0, express_core_1.Get)("/qr"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas, Object]),
    __metadata("design:returntype", Promise)
], whatsappApiController.prototype, "qr", null);
__decorate([
    (0, express_core_1.Post)("/logout"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [empresas_entity_1.Empresas]),
    __metadata("design:returntype", Promise)
], whatsappApiController.prototype, "logout", null);
exports.whatsappApiController = whatsappApiController = __decorate([
    (0, express_core_1.Controller)("/whatsapp")
], whatsappApiController);
node_cron_1.default.schedule("0 0 * * *", () => {
    exports.chats = {};
});
