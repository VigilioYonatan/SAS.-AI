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
exports.CategoriesFinanzasApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const categories_entity_1 = require("../entities/categories.entity");
const tipo_entity_1 = require("../entities/tipo.entity");
let CategoriesFinanzasApiService = class CategoriesFinanzasApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield tipo_entity_1.TipoFinanza.findAll({
                where: {
                    empresa_id: empresa.id,
                },
                include: [categories_entity_1.CategoriesFinanzas],
                order: [["createdAt", "ASC"]],
            });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const category_finanza = yield categories_entity_1.CategoriesFinanzas.findOne({
                where: { id: Number(code), empresa_id: empresa.id },
            });
            if (!category_finanza) {
                throw new express_core_1.NotFoundException(`No se encontró un proveedor con ${code}`);
            }
            return {
                success: true,
                category_finanza,
            };
        });
    }
    store(empresa, categoriesFinanzasStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const category_finanza = new categories_entity_1.CategoriesFinanzas(Object.assign(Object.assign({}, categoriesFinanzasStoreDto), { empresa_id: empresa.id }));
            yield category_finanza.save();
            return {
                success: true,
                category_finanza,
            };
        });
    }
    update(empresa, id, categoriesFinanzasStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category_finanza } = yield this.show(empresa, id);
            yield category_finanza.update(categoriesFinanzasStoreDto);
            return {
                success: true,
                category_finanza,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { category_finanza } = yield this.show(empresa, id);
            yield category_finanza.destroy();
            return {
                success: true,
                message: `Se eliminó correctamente el proveedor ${id}`,
            };
        });
    }
};
exports.CategoriesFinanzasApiService = CategoriesFinanzasApiService;
exports.CategoriesFinanzasApiService = CategoriesFinanzasApiService = __decorate([
    (0, express_core_1.Injectable)()
], CategoriesFinanzasApiService);
