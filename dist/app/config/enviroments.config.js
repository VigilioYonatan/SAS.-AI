"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
const enviroments = {
    NODE_ENV: process.env.NODE_ENV,
    VITE_URL: process.env.VITE_URL,
    PORT: process.env.PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: Number(process.env.DB_PORT),
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_CONTAINER: process.env.DB_CONTAINER,
    VITE_VIGILIO_WEB: process.env.VITE_VIGILIO_WEB,
    VITE_VIGILIO_TOKEN: process.env.VITE_VIGILIO_TOKEN,
    VITE_VIGILIO_SUNAT: process.env.VITE_VIGILIO_SUNAT,
    VITE_TOKEN_VIGILIO_SERVICES: process.env.VITE_TOKEN_VIGILIO_SERVICES,
    SECRET_SESSION_KEY: process.env.SECRET_SESSION_KEY,
    VITE_DIASFACTURASBOLETA: Number(process.env.VITE_DIASFACTURASBOLETA),
    VITE_PLUBIC_VAPID_EMAIL: process.env.VITE_PLUBIC_VAPID_KEY,
    VITE_PLUBIC_VAPID_KEY: process.env.VITE_PLUBIC_VAPID_KEY,
    VITE_PRIVATE_VAPID_KEY: process.env.VITE_PRIVATE_VAPID_KEY,
    PM2_ID: process.env.PM2_ID,
    PAYPAL_SANDBOX: process.env.PAYPAL_SANDBOX,
    VITE_PAYPAL_COMISION: Number(process.env.VITE_PAYPAL_COMISION),
    VITE_PAYPAL_TRANSACTION: Number(process.env.VITE_PAYPAL_TRANSACTION),
    VITE_PAYPAL_COMISION_EURO: Number(process.env.VITE_PAYPAL_COMISION_EURO),
    VITE_PAYPAL_TRANSACTION_EURO: Number(process.env.VITE_PAYPAL_TRANSACTION_EURO),
    CLIENT: process.env.CLIENT,
    DOCKER_IMAGE_WHATSAPP: process.env.DOCKER_IMAGE_WHATSAPP,
    VITE_IZIPAY_COMISION: Number(process.env.VITE_IZIPAY_COMISION),
    VITE_IZIPAY_COMISION_IMPUESTO: (_a = Number(process.env.VITE_IZIPAY_COMISION_IMPUESTO)) !== null && _a !== void 0 ? _a : 0,
    VITE_IZIPAY_COMISION_TRANSACCION: (_b = Number(process.env.VITE_IZIPAY_COMISION_TRANSACCION)) !== null && _b !== void 0 ? _b : 0,
    VITE_STRIPE_COMISION: Number(process.env.VITE_STRIPE_COMISION),
    VITE_STRIPE_COMISION_TRANSACCION: Number(process.env.VITE_STRIPE_COMISION_TRANSACCION),
    MAX_USERS: Number((_c = process.env.MAX_USERS) !== null && _c !== void 0 ? _c : "30"),
};
exports.default = enviroments;
