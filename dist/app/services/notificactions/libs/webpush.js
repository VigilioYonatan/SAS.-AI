"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_push_1 = __importDefault(require("web-push"));
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
web_push_1.default.setVapidDetails(`mailto:${enviroments_config_1.default.VITE_PLUBIC_VAPID_EMAIL}`, enviroments_config_1.default.VITE_PLUBIC_VAPID_KEY, enviroments_config_1.default.VITE_PRIVATE_VAPID_KEY);
exports.default = web_push_1.default;
