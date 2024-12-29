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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = exports.dirMode = void 0;
const node_path_1 = __importDefault(require("node:path"));
const enviroments_config_1 = __importDefault(require("./enviroments.config"));
const settings_entity_1 = require("@/empresas/entities/settings.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const sequelize_1 = require("sequelize");
exports.dirMode = enviroments_config_1.default.NODE_ENV === "production"
    ? node_path_1.default.resolve(__dirname, "..", "..", "..")
    : node_path_1.default.resolve(__dirname, "..", "..");
exports.corsOptions = {
    origin: (origin, callback) => __awaiter(void 0, void 0, void 0, function* () {
        const empresas = yield empresas_entity_1.Empresas.unscoped().findAll({
            include: [
                {
                    model: settings_entity_1.Settings,
                    where: sequelize_1.Sequelize.where(sequelize_1.Sequelize.literal(`host->>'host'`), {
                        [sequelize_1.Op.ne]: null,
                    }),
                    required: true,
                    attributes: ["host"],
                },
            ],
            attributes: ["id", "slug"],
        });
        const allowedOrigins = [
            "https://*.vigilio-services.com",
            `http://*.localhost:${enviroments_config_1.default.PORT}`,
            "https://vigilioservices2.loca.lt",
            `https://${enviroments_config_1.default.CLIENT.toLowerCase()}.vigilio-services.com`,
            ...empresas.map((emp) => `https://www.${emp.setting.host.host}`),
        ];
        if (!origin ||
            allowedOrigins.some((allowedOrigin) => new RegExp(allowedOrigin.replace(/\*/g, ".*")).test(origin))) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    }),
    credentials: true,
};
