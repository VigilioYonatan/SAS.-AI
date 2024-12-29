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
exports.SuppliersApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const suppliers_entity_1 = require("../entities/suppliers.entity");
const express_core_2 = require("@vigilio/express-core");
const helpers_1 = require("@/uploads/libs/helpers");
const helpers_2 = require("~/libs/helpers");
let SuppliersApiService = class SuppliersApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield suppliers_entity_1.Suppliers.findAll({
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
    show(empresa, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let supplier = null;
            if (!Number.isNaN(Number(code))) {
                supplier = yield suppliers_entity_1.Suppliers.findOne({
                    where: { id: Number(code), empresa_id: empresa.id },
                });
            }
            else {
                supplier = yield suppliers_entity_1.Suppliers.findOne({
                    where: {
                        supplier_code: code,
                        empresa_id: empresa.id,
                    },
                });
            }
            if (!supplier) {
                throw new express_core_2.NotFoundException(`No se encontró un proveedor con ${code}`);
            }
            return {
                success: true,
                supplier,
            };
        });
    }
    store(empresa, suppliersStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const supplier = new suppliers_entity_1.Suppliers(suppliersStoreDto);
            supplier.supplier_code = yield (0, helpers_2.generateCodeEntity)(suppliers_entity_1.Suppliers, "supplier_code", "PROV", empresa);
            yield supplier.save();
            return {
                success: true,
                supplier,
            };
        });
    }
    update(empresa, id, suppliersUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { supplier } = yield this.show(empresa, id);
            yield supplier.update(suppliersUpdateDto);
            return {
                success: true,
                supplier,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { supplier } = yield this.show(empresa, id);
            if (supplier.logo) {
                (0, helpers_1.removeFile)(empresa.slug, supplier.logo);
            }
            yield supplier.destroy();
            return {
                success: true,
                message: `Se eliminó correctamente el proveedor ${id}`,
            };
        });
    }
};
exports.SuppliersApiService = SuppliersApiService;
exports.SuppliersApiService = SuppliersApiService = __decorate([
    (0, express_core_1.Injectable)()
], SuppliersApiService);
