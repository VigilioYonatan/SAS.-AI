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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotesApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const notes_entity_1 = require("../entities/notes.entity");
const express_core_2 = require("@vigilio/express-core");
let NotesApiService = class NotesApiService {
    latestCorrelativo(empresa, kind_invoice_code) {
        return __awaiter(this, void 0, void 0, function* () {
            const latestNote = yield notes_entity_1.Notes.findOne({
                order: [["createdAt", "DESC"]],
                where: {
                    kind_invoice_code,
                    empresa_id: empresa.id,
                },
            });
            let correlativo = null;
            if (latestNote) {
                const ultimoNumero = Number.parseInt(latestNote.correlativo);
                correlativo = `${String(ultimoNumero + 1).padStart(6, "0")}`;
            }
            else {
                correlativo = "000001";
            }
            return { success: true, correlativo };
        });
    }
    show(empresa, serie_correlative) {
        return __awaiter(this, void 0, void 0, function* () {
            let invoice = null;
            if (!Number.isNaN(Number(serie_correlative))) {
                invoice = yield notes_entity_1.Notes.findByPk(serie_correlative);
            }
            else {
                const [serie, correlativo] = serie_correlative.split("-");
                invoice = yield notes_entity_1.Notes.findOne({
                    where: {
                        serie,
                        correlativo,
                        empresa_id: empresa.id,
                    },
                });
            }
            if (!invoice) {
                throw new express_core_2.NotFoundException(`No se encontró una nota de credito o debito con ${serie_correlative}`);
            }
            return {
                success: true,
                invoice,
            };
        });
    }
    store(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = new notes_entity_1.Notes(body);
            yield invoice.save();
            return {
                success: true,
                invoice,
            };
        });
    }
    update(empresa, serie_correlative, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { invoice } = yield this.show(empresa, serie_correlative);
            yield invoice.update(body);
            return {
                success: true,
                invoice,
            };
        });
    }
};
exports.NotesApiService = NotesApiService;
exports.NotesApiService = NotesApiService = __decorate([
    (0, express_core_1.Injectable)()
], NotesApiService);
