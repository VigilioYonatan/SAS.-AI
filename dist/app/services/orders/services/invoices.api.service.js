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
exports.InvoicesApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const invoices_entity_1 = require("../entities/invoices.entity");
let InvoicesApiService = class InvoicesApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield invoices_entity_1.Invoices.findAll({
                where: { empresa_id: empresa.id },
            });
            return {
                success: true,
                data,
            };
        });
    }
    latestCorrelativo(empresa, kind_invoice_code) {
        return __awaiter(this, void 0, void 0, function* () {
            const latestInvoice = yield invoices_entity_1.Invoices.findOne({
                order: [["createdAt", "DESC"]],
                where: {
                    kind_invoice_code,
                    empresa_id: empresa.id,
                },
            });
            let correlativo = null;
            if (latestInvoice) {
                const ultimoNumero = Number.parseInt(latestInvoice.correlativo);
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
                invoice = yield invoices_entity_1.Invoices.findByPk(serie_correlative);
            }
            else {
                const [serie, correlativo] = serie_correlative.split("-");
                invoice = yield invoices_entity_1.Invoices.findOne({
                    where: {
                        serie,
                        correlativo,
                        empresa_id: empresa.id,
                    },
                });
            }
            if (!invoice) {
                throw new express_core_2.NotFoundException(`No se encontró un boleta o factura con ${serie_correlative}`);
            }
            return {
                success: true,
                invoice,
            };
        });
    }
    store(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const invoice = new invoices_entity_1.Invoices(body);
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
exports.InvoicesApiService = InvoicesApiService;
exports.InvoicesApiService = InvoicesApiService = __decorate([
    (0, express_core_1.Injectable)()
], InvoicesApiService);
