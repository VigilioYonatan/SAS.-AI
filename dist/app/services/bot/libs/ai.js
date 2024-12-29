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
exports.chatAssistant = exports.chatsTelegram = exports.clientsTelegram = void 0;
exports.buenosDias = buenosDias;
exports.gracias = gracias;
exports.initializeBot = initializeBot;
exports.isWhatsappTelegramIA = isWhatsappTelegramIA;
exports.isRedesIA = isRedesIA;
exports.AiTelegram = AiTelegram;
exports.updateTokensEmpresa = updateTokensEmpresa;
exports.cloudeAi = cloudeAi;
exports.getClientVigilio = getClientVigilio;
exports.featuresIA = featuresIA;
exports.searchProducts = searchProducts;
exports.sendMessageCron = sendMessageCron;
exports.executeCronDate = executeCronDate;
const helpers_1 = require("~/libs/helpers");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const prompt_1 = require("./prompt");
const dayjs_1 = __importStar(require("~/libs/dayjs"));
const node_cron_1 = __importDefault(require("node-cron"));
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const os_1 = require("~/libs/os");
const empresas_api_service_1 = require("@/empresas/services/empresas.api.service");
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const _1 = require(".");
const libs_1 = require("@/empresas/libs");
const urls_payment_entity_1 = require("@/urls/entities/urls.payment.entity");
const cache_1 = __importDefault(require("@vigilio/express-core/cache"));
const whatsapp_api_controller_1 = require("../controllers/whatsapp.api.controller");
const api_1 = require("../api");
const citas_entities_1 = require("@/citas/entities/citas.entities");
const sequelize_1 = require("sequelize");
const questions_entity_1 = require("@/empresas/entities/questions.entity");
function buenosDias(query, name, empresa) {
    const messages = [
        `¡Hola ${name}! Bienvenido a ${empresa.name_empresa}, ¿en qué puedo ayudarte hoy? 😊.`,
        `¡Hola ${name}! ¿Cómo puedo ayudarte el día de hoy? 😀.\n `,
    ];
    if ([
        "buenos dias",
        "hola",
        "buenas",
        "buenas noches",
        "buenas tardes",
    ].includes(query.toLowerCase())) {
        return messages[(0, helpers_1.randomNumber)(0, 1)];
    }
    return null;
}
function gracias(query) {
    const messages = [
        "De nada, estamos aquí para ayudarte 😊.\n",
        "Que bien, estamos aquí para ayudarte 😊.\n .",
    ];
    if (["gracias", "muchas gracias"].includes(query.toLowerCase())) {
        return messages[(0, helpers_1.randomNumber)(0, 1)];
    }
    return null;
}
function initializeBot(empresa, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const bot = new node_telegram_bot_api_1.default(token);
        if (exports.clientsTelegram === null || exports.clientsTelegram === void 0 ? void 0 : exports.clientsTelegram[empresa.slug]) {
            delete exports.clientsTelegram[empresa.slug];
        }
        exports.clientsTelegram = Object.assign(Object.assign({}, exports.clientsTelegram), { [empresa.slug]: bot });
        exports.clientsTelegram[empresa.slug].setWebHook(`${(0, libs_1.BASE_URL)(empresa)}/api/telegram/${token}`);
        exports.clientsTelegram[empresa.slug].on("message", (msg) => __awaiter(this, void 0, void 0, function* () {
            yield AiTelegram(empresa, msg);
        }));
        console.log(`Conectado TELEGRAM BOT ${token}`);
    });
}
function isWhatsappTelegramIA(empresa, telephone) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        let clientVigilio = JSON.parse((_a = cache_1.default.get("client-vigilio")) !== null && _a !== void 0 ? _a : "null");
        try {
            if (!clientVigilio) {
                clientVigilio = yield getClientVigilio();
                const hour24 = 24 * 60 * 1000;
                cache_1.default.set("client-vigilio", JSON.stringify(clientVigilio), hour24);
            }
        }
        catch (error) {
            console.log("Error al hacer fetch a la empresa");
        }
        const where = !Number.isNaN(Number(empresa))
            ? { id: empresa }
            : { slug: empresa };
        let emp = JSON.parse((_b = cache_1.default.get(`EMPRESA:${empresa}`)) !== null && _b !== void 0 ? _b : "null");
        if (!emp) {
            const e = yield empresas_entity_1.Empresas.findOne({
                where,
            });
            if (!e)
                return null;
            emp = e.toJSON();
            const hour24 = 24 * 60 * 60 * 1000;
            cache_1.default.set(`EMPRESA:${empresa}`, JSON.stringify(e.slug), hour24);
        }
        if (!emp)
            return null;
        const latestEmpresaUsage = emp.inteligenceArtificial.usage;
        const isDateNow = (0, dayjs_1.restarDays)(emp, (0, dayjs_1.NOW)(emp).format(), emp.payments.mensual.date, "day");
        if (telephone) {
            const contact = emp.contacts.find((contact) => contact.telephone === telephone);
            if (contact && !contact.ia)
                return null;
        }
        if (enviroments_config_1.default.NODE_ENV === "production") {
            if (isDateNow < 1 || emp.payments.tokens.tokens < 1)
                return null;
        }
        return {
            empresa: emp,
            clientVigilio,
            latestEmpresaUsage,
        };
    });
}
function isRedesIA(empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        let clientVigilio = null;
        try {
            clientVigilio = yield getClientVigilio();
        }
        catch (error) {
            console.log("Error al hacer fetch a la empresa");
        }
        const where = !Number.isNaN(Number(empresa))
            ? { id: empresa }
            : { slug: empresa };
        const [emp] = yield Promise.all([
            empresas_entity_1.Empresas.findOne({
                where,
            }),
        ]);
        if (!emp)
            return null;
        const latestEmpresaUsage = emp.inteligenceArtificial.usage;
        if (!(emp === null || emp === void 0 ? void 0 : emp.enabledBot))
            return null;
        const isDateNow = (0, dayjs_1.restarDays)(emp, (0, dayjs_1.NOW)(emp).format(), emp.payments.redes.date, "day");
        if (isDateNow < 1 || emp.payments.tokens.tokens < 1)
            return null;
        return {
            empresa: emp,
            clientVigilio,
            latestEmpresaUsage,
        };
    });
}
exports.chatsTelegram = {};
function AiTelegram(emp, message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        const userId = message.chat.id;
        let body = (_a = message.text) !== null && _a !== void 0 ? _a : null;
        const voice = (_b = message.voice) !== null && _b !== void 0 ? _b : null;
        if (!voice && !body)
            return;
        try {
            const telegram = yield isWhatsappTelegramIA(emp.slug);
            if (!telegram)
                return;
            const { clientVigilio, empresa, latestEmpresaUsage } = telegram;
            const random = (0, helpers_1.randomNumber)(empresa.inteligenceArtificial.timer.start, empresa.inteligenceArtificial.timer.finish);
            yield (0, helpers_1.delay)(random);
            if (voice) {
                const fileLink = yield exports.clientsTelegram[emp.slug].getFileLink(voice.file_id);
                const getVoice = yield fetch(fileLink, { method: "GET" });
                const responseGetVoice = yield getVoice.arrayBuffer();
                const binaryData = Buffer.from(responseGetVoice);
                const audioToTxt = yield (0, _1.transcribeAudio)(empresa.slug, binaryData);
                body = audioToTxt.text;
            }
            const buenas = buenosDias(body, "", empresa);
            const thanks = gracias(body);
            if (buenas) {
                yield exports.clientsTelegram[emp.slug].sendMessage(userId, buenas);
                return;
            }
            if (thanks) {
                yield exports.clientsTelegram[emp.slug].sendMessage(userId, thanks);
                return;
            }
            exports.chatsTelegram[`${empresa.slug}:${userId}`] = [
                ...((_c = exports.chatsTelegram[`${empresa.slug}:${userId}`]) !== null && _c !== void 0 ? _c : []),
                ["user", body],
            ];
            if (exports.chatsTelegram[`${empresa.slug}:${userId}`]) {
                const messages = exports.chatsTelegram[`${empresa.slug}:${userId}`].map(([role, content]) => ({
                    role,
                    content: `${content}.'[[en formato telegram, no markdown, revisa base de datos y SIEMPRE RESPONDEME EN EL IDIOMA QUE TE ESCRIBA.]]`,
                }));
                const messageAnterior = messages
                    .filter((a) => a.role === "user")
                    .slice(-5, -1)
                    .map((c) => c.content);
                const messageActual = `Mensajes Anterior: ${messageAnterior.join(", ")}.\n
        Mensaje Actual: ${message}. escribe formato telegram`;
                const prompt = yield (0, _1.promptReplace)(telegram, messageActual, empresa);
                const completion = yield empresas_api_service_1.openAis[empresa.slug].chat.completions.create({
                    model: clientVigilio
                        ? clientVigilio.information.modelai
                        : "gpt-4o-mini",
                    max_tokens: empresa.inteligenceArtificial.max_length,
                    messages: [
                        {
                            role: "user",
                            content: `${prompt} -  Solo enviamen la imagen ( mandarme la url de la imagen) ${(0, libs_1.BASE_URL)(empresa)}/${empresa.slug}/images/products/... , si te pido información de un producto o si te pido una imagen de un producto, por ultimo responde bonito en formato telegram`,
                        },
                        { role: "assistant", content: "Entendido, Empezemos." },
                        ...messages.slice(-empresa.inteligenceArtificial.memory),
                    ],
                });
                yield updateTokensEmpresa(empresa, latestEmpresaUsage, completion);
                const completionText = completion.choices[0].message.content;
                const [removeNote, urlExtraida] = yield featuresIA(emp, completionText, true);
                if (empresa.inteligenceArtificial.isChunk) {
                    const chunks = removeNote.split(/(?<!\d)\.\s+/g);
                    for (const chunk of chunks) {
                        yield exports.clientsTelegram[emp.slug].sendMessage(userId, chunk);
                        yield (0, helpers_1.delay)(3);
                    }
                }
                else {
                    yield exports.clientsTelegram[emp.slug].sendMessage(userId, removeNote);
                }
                if (urlExtraida) {
                    for (const url of urlExtraida) {
                        yield exports.clientsTelegram[emp.slug].sendPhoto(userId, url, {
                            caption: "",
                        });
                    }
                }
            }
        }
        catch (error) {
            console.log(error.message);
            exports.chatsTelegram[`${emp.slug}:${userId}`] = [];
        }
    });
}
function updateTokensEmpresa(empresa, latestEmpresaUsage, completion) {
    return __awaiter(this, void 0, void 0, function* () {
        const empresaUpdate = {
            inteligenceArtificial: Object.assign(Object.assign({}, empresa.inteligenceArtificial), { usage: Object.assign(Object.assign({}, latestEmpresaUsage), { input_tokens: latestEmpresaUsage.input_tokens +
                        completion.usage.prompt_tokens, output_tokens: latestEmpresaUsage.output_tokens +
                        completion.usage.completion_tokens }) }),
            payments: Object.assign(Object.assign({}, empresa.payments), { tokens: {
                    tokens: empresa.payments.tokens.tokens -
                        completion.usage.prompt_tokens,
                } }),
        };
        cache_1.default.set(`IA_TOKENS:${empresa.slug}`, JSON.stringify(Object.assign({}, empresaUpdate)));
        cache_1.default.set(`EMPRESA:${empresa.slug}`, JSON.stringify(Object.assign(Object.assign({}, empresa), empresaUpdate)));
    });
}
exports.chatAssistant = {};
function cloudeAi(emp, userId, message) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const whatsapp = yield isWhatsappTelegramIA(emp);
            if (!whatsapp)
                return;
            const { clientVigilio, empresa, latestEmpresaUsage } = whatsapp;
            exports.chatAssistant = Object.assign(Object.assign({}, exports.chatAssistant), { [`${emp}:${userId}`]: [
                    ...((_a = exports.chatAssistant[`${emp}:${userId}`]) !== null && _a !== void 0 ? _a : []),
                    ["user", message, Date.now()],
                ] });
            const messages = exports.chatAssistant[`${emp}:${userId}`].map(([role, content]) => ({
                role,
                content,
            }));
            const completion = yield empresas_api_service_1.openAis[empresa.slug].chat.completions.create({
                model: (_b = clientVigilio === null || clientVigilio === void 0 ? void 0 : clientVigilio.information.modelai) !== null && _b !== void 0 ? _b : "gpt-4o-mini",
                max_tokens: 1000,
                messages: [
                    {
                        role: "user",
                        content: `${(0, prompt_1.promptAssitant)(empresa)}. `,
                    },
                    ...messages.slice(-(empresa.inteligenceArtificial.memory - 1)),
                ],
            });
            const completionText = completion.choices[0].message.content;
            yield updateTokensEmpresa(empresa, latestEmpresaUsage, completion);
            exports.chatAssistant[`${emp}:${userId}`] = [
                ...(exports.chatAssistant[`${emp}:${userId}`] || []),
                ["assistant", completionText, Date.now()],
            ];
            return completionText;
        }
        catch (error) {
            return "No disponible.";
        }
    });
}
function getClientVigilio() {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${enviroments_config_1.default.VITE_VIGILIO_WEB}/api/information/client`);
        const result = yield response.json();
        return result;
    });
}
node_cron_1.default.schedule("0 0 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    function monitorSystem() {
        return __awaiter(this, void 0, void 0, function* () {
            const cpuThreshold = 0.85;
            const diskThreshold = 90;
            const usageCPU = (0, os_1.checkCPUUsage)();
            const usedPercentage = yield (0, os_1.checkDiskUsage)();
            const update = {
                cpu: usageCPU * 100,
                disk: usedPercentage,
            };
            console.log(update);
            yield (0, os_1.updateVigilioServices)(update);
        });
    }
    yield monitorSystem();
}));
function featuresIA(empresa, completionText, hiddeImage) {
    return __awaiter(this, void 0, void 0, function* () {
        let textoNormal = completionText;
        const baseURL = `${(0, libs_1.BASE_URL)(empresa)}/empresas/${empresa.slug}/images/products`;
        const urlPattern = new RegExp(`${baseURL}[^\\s]*`, "g");
        const match = completionText.match(urlPattern);
        const urlExtraidas = [];
        if (match === null || match === void 0 ? void 0 : match.length) {
            for (const m of match) {
                if (hiddeImage) {
                    if (match.length < 2) {
                        textoNormal = completionText.replace(m, "").trim();
                    }
                    urlExtraidas.push(m);
                }
            }
        }
        const expresionRegular = /\{\{cart\?items=[^}]+\}\}/g;
        const coincidencias = completionText.match(expresionRegular);
        if (coincidencias === null || coincidencias === void 0 ? void 0 : coincidencias.length) {
            for (const c of coincidencias) {
                const hash = Math.random().toString(32).slice(4, 8);
                const urlGet = `${(0, libs_1.BASE_URL)(empresa)}/${c.slice(2, -2)}`;
                const date = (0, dayjs_1.NOW)(empresa).add(1, "days").format();
                const findHash = yield urls_payment_entity_1.UrlsPayment.findOne({
                    where: { hash, empresa_id: empresa.id },
                });
                if (findHash) {
                    yield findHash.update({ url: urlGet, time: date });
                }
                else {
                    yield urls_payment_entity_1.UrlsPayment.create({
                        hash,
                        url: urlGet,
                        empresa_id: empresa.id,
                        time: date,
                    });
                }
                textoNormal = textoNormal.replace(c, `${(0, libs_1.BASE_URL)(empresa)}/cart/${hash}`);
            }
        }
        const now = (0, dayjs_1.NOW)(empresa).utc().format();
        const after = (0, dayjs_1.NOW)(empresa)
            .add(empresa.citasSetting.max_days, "days")
            .utc()
            .format();
        const regex2 = /\[\[CANCELADO_CITA:(.*?)\]\]/;
        const match2 = completionText.match(regex2);
        if (match2) {
            const { hour, telefono } = JSON.parse(match2[1]);
            const findCita = yield citas_entities_1.Citas.findOne({
                where: {
                    telephone: telefono,
                    empresa_id: empresa.id,
                    hour: {
                        [sequelize_1.Op.like]: `${hour}%`,
                    },
                },
            });
            if (findCita) {
                yield findCita.destroy();
            }
            const message = completionText
                .replace(regex2, "")
                .replace(/\s{2,}/g, "\n");
            textoNormal = message;
        }
        const regex = /\[\[DATOS_CONFIRMADOS:(.*?)\]\]/;
        const matchCitas = completionText.match(regex);
        if (matchCitas) {
            const _a = JSON.parse(matchCitas[1]), { hour, date, telefono } = _a, rest = __rest(_a, ["hour", "date", "telefono"]);
            const citas = yield citas_entities_1.Citas.findAll({
                where: {
                    date: {
                        [sequelize_1.Op.between]: [now, after],
                    },
                    telephone: telefono,
                    empresa_id: empresa.id,
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
            });
            const citasHour = yield citas_entities_1.Citas.findAll({
                where: {
                    date,
                    hour: {
                        [sequelize_1.Op.like]: `${hour}%`,
                    },
                    empresa_id: empresa.id,
                },
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                raw: true,
            });
            if (citas.length > empresa.citasSetting.maxCitas) {
                textoNormal =
                    "Parece que has alcanzado el límite para crear citas.";
            }
            else if (citasHour.length > empresa.citasSetting.maxCitasForHour) {
                textoNormal =
                    "Lo sentimos, ya hay citas programadas para esa hora.";
            }
            else {
                yield citas_entities_1.Citas.create({
                    telephone: `${empresa.dial_code}${telefono}@c.us`,
                    date,
                    hour,
                    answers: rest,
                    empresa_id: empresa.id,
                });
                const message = completionText
                    .replace(regex, "")
                    .replace(/\s{2,}/g, "\n");
                textoNormal = message;
                if (empresa.citasSetting.sendAlert > 0) {
                    const time = dayjs_1.default
                        .tz(`${date} ${hour}`, empresa.tz)
                        .subtract(empresa.citasSetting.sendAlert, "hour")
                        .utc()
                        .format();
                    sendMessageCron({
                        empresa,
                        userId: telefono,
                        date: time,
                        name: "",
                    });
                }
            }
        }
        const regexNoEncontrado = /\[\[NO_ENCONTRADO:(.*?)\]\]/;
        const matchNoEncontrado = completionText.match(regexNoEncontrado);
        if (matchNoEncontrado) {
            const question = matchNoEncontrado[1];
            yield questions_entity_1.Questions.create({
                question,
                answer: null,
                empresa_id: empresa.id,
            });
            const message = completionText
                .replace(regexNoEncontrado, "")
                .replace(/\s{2,}/g, "");
            textoNormal = message;
        }
        return [textoNormal.trim(), urlExtraidas];
    });
}
function searchProducts(empresa, word) {
    return __awaiter(this, void 0, void 0, function* () {
        const completion = yield empresas_api_service_1.openAis[empresa.slug].chat.completions.create({
            model: "gpt-4o-mini",
            max_tokens: 20,
            messages: [
                {
                    role: "user",
                    content: `Si el mensaje "${word}" es una pregunta o busca informacion de un producto,marca,categorias,ordenes,pedidos,color,memoria,talla algo así si escribe un producto. no preguntas cualquiera.  di "si", sino di "no". solo di "si" y "no" nada mas, sin comillas.`,
                },
            ],
        });
        const completionText = completion.choices[0].message.content;
        return completionText === "si";
    });
}
function sendMessageCron({ empresa, name, userId, date, }) {
    const task = node_cron_1.default.schedule("*/1 * * * *", () => __awaiter(this, void 0, void 0, function* () {
        const now = new Date();
        if (now.getTime() >= date.getTime()) {
            const message = `Hola *${name}*😊, nos comunicamos contigo para informarte que has realizado una reserva de cita *${(0, dayjs_1.TimePeru)(empresa, date).format("YYYY-MM-DD HH:mm A")}*. Por favor, no dudes en contactarnos si tienes alguna pregunta`;
            whatsapp_api_controller_1.chats[`${empresa.slug}:${userId}`] = [
                ...(whatsapp_api_controller_1.chats[`${empresa.slug}:${userId}`] || []),
                ["assistant", message],
            ];
            yield (0, api_1.whatsappSendMessageApi)(empresa, {
                message: message,
                telephone: userId,
                options: {},
                delay: 3,
            });
            task.stop();
        }
    }));
}
function executeCronDate(date, cb) {
    return __awaiter(this, void 0, void 0, function* () {
        const task = node_cron_1.default.schedule("*/1 * * * *", () => __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            if (now.getTime() >= date.getTime()) {
                cb();
                task.stop();
            }
        }));
    });
}
node_cron_1.default.schedule("0 0 * * *", () => {
    exports.chatsTelegram = {};
});
node_cron_1.default.schedule("*/4 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const empresas = yield empresas_entity_1.Empresas.unscoped().findAll({
        attributes: ["id", "slug"],
    });
    for (const empresa of empresas) {
        const iaTokens = JSON.parse((_a = cache_1.default.get(`IA_TOKENS:${empresa.slug}`)) !== null && _a !== void 0 ? _a : "null");
        if (iaTokens) {
            yield empresa.update(iaTokens);
            cache_1.default.delete(`IA_TOKENS:${empresa.slug}`);
        }
    }
}));
