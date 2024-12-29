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
exports.guideSendSunatApi = guideSendSunatApi;
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const express_core_1 = require("@vigilio/express-core");
function guideSendSunatApi(body) {
    return __awaiter(this, void 0, void 0, function* () {
        const response = yield fetch(`${enviroments_config_1.default.VITE_VIGILIO_SUNAT}/api/despatches/send`, {
            body: JSON.stringify(body),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = yield response.json();
        if (!response.ok)
            throw new express_core_1.BadRequestException("Hubo un error, comunicarte con la empresa");
        return result;
    });
}
