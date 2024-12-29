"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.SettingsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const settings_entity_1 = require("../entities/settings.entity");
const cache_1 = __importDefault(require("@vigilio/express-core/cache"));
let SettingsApiService = class SettingsApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield settings_entity_1.Settings.findOne({
                where: {
                    empresa_id: empresa.id,
                },
            });
            if (!data)
                throw new express_core_1.NotFoundException("no se encontró settings");
            return {
                success: true,
                data,
            };
        });
    }
    update(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.index(empresa);
            yield data.update(body);
            cache_1.default.delete(`EMPRESA:${empresa.slug}`);
            return {
                success: true,
                message: "Actualizado correctamente",
            };
        });
    }
};
exports.SettingsApiService = SettingsApiService;
exports.SettingsApiService = SettingsApiService = __decorate([
    (0, express_core_1.Injectable)()
], SettingsApiService);
