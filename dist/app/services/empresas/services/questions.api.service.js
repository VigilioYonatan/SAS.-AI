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
exports.QuestionsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const questions_entity_1 = require("../entities/questions.entity");
const cache_1 = __importDefault(require("@vigilio/express-core/cache"));
let QuestionsApiService = class QuestionsApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield questions_entity_1.Questions.findAll({
                where: {
                    empresa_id: empresa.id,
                },
            });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = yield questions_entity_1.Questions.findOne({
                where: { id, empresa_id: empresa.id },
            });
            if (!question) {
                throw new express_core_2.NotFoundException(`No se encontró un questions con el id ${id}`);
            }
            return {
                success: true,
                question,
            };
        });
    }
    store(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const question = new questions_entity_1.Questions(Object.assign(Object.assign({}, body), { empresa_id: empresa.id }));
            cache_1.default.delete(`questions-ia:${empresa.slug}`);
            cache_1.default.delete(`${empresa.slug}:questions-count`);
            yield question.save();
            return {
                success: true,
                question,
            };
        });
    }
    update(empresa, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { question } = yield this.show(empresa, id);
            cache_1.default.delete(`questions-ia:${empresa.slug}`);
            cache_1.default.delete(`${empresa.slug}:questions-count`);
            yield question.update(body);
            return {
                success: true,
                question,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { question } = yield this.show(empresa, id);
            cache_1.default.delete(`questions-ia:${empresa.slug}`);
            cache_1.default.delete(`${empresa.slug}:questions-count`);
            yield question.destroy();
            return {
                success: true,
                message: "questions eliminado",
            };
        });
    }
};
exports.QuestionsApiService = QuestionsApiService;
exports.QuestionsApiService = QuestionsApiService = __decorate([
    (0, express_core_1.Injectable)()
], QuestionsApiService);
