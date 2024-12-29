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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tvalibot = exports.t = void 0;
exports.cookiei18next = cookiei18next;
exports.i18nextMiddleware = i18nextMiddleware;
const i18next_1 = __importStar(require("i18next"));
const i18next_http_backend_1 = __importDefault(require("i18next-http-backend"));
const i18nextHttpMiddleware = __importStar(require("i18next-http-middleware"));
i18next_1.default
    .use(i18next_http_backend_1.default)
    .use(i18nextHttpMiddleware.LanguageDetector)
    .init({
    debug: false,
    backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
    lng: "es",
    fallbackLng: "es",
    interpolation: { escapeValue: false },
    ns: ["home", "translation", "validation"],
});
const t = (key, options) => {
    return (0, i18next_1.t)(key, options);
};
exports.t = t;
const tvalibot = (key, options) => {
    return JSON.stringify([key, options]);
};
exports.tvalibot = tvalibot;
function cookiei18next(language) {
    const closeSession = 24 * 60 * 60 * 1000 * 30;
    return (res) => {
        res.cookie("i18next", language, {
            httpOnly: false,
            maxAge: closeSession,
        });
    };
}
function i18nextMiddleware(req, res, next) {
    var _a;
    const country = (_a = req.headers["accept-language"]) === null || _a === void 0 ? void 0 : _a.split(",")[0];
    let detectedLanguage = req.language;
    if (req.cookies.i18next === undefined) {
        if (country === "en" || country === "en-US") {
            detectedLanguage = "en";
        }
        else if (country === "es" || country === "es-ES") {
            detectedLanguage = "es";
        }
        else if (country === "zh" || country === "zh-CN") {
            detectedLanguage = "zh";
        }
        else if (country === "pt" || country === "pt-BR") {
            detectedLanguage = "pt";
        }
        else {
            detectedLanguage = "en";
        }
        cookiei18next(detectedLanguage)(res);
    }
    next();
}
exports.default = i18next_1.default;
