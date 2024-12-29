"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Finanzas = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const tipo_entity_1 = require("./tipo.entity");
const categories_entity_1 = require("./categories.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let Finanzas = class Finanzas extends sequelize_typescript_1.Model {
    get presupuesto() {
        return Number.parseFloat(this.getDataValue("presupuesto"));
    }
    get monto() {
        return Number.parseFloat(this.getDataValue("monto"));
    }
};
exports.Finanzas = Finanzas;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DATE }),
    __metadata("design:type", Date)
], Finanzas.prototype, "date", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }),
    __metadata("design:type", String)
], Finanzas.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Finanzas.prototype, "presupuesto", null);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], Finanzas.prototype, "monto", null);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => tipo_entity_1.TipoFinanza),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Finanzas.prototype, "tipo_finanza_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => tipo_entity_1.TipoFinanza),
    __metadata("design:type", Object)
], Finanzas.prototype, "tipoFinanza", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => categories_entity_1.CategoriesFinanzas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Finanzas.prototype, "category_finanza_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => categories_entity_1.CategoriesFinanzas),
    __metadata("design:type", Object)
], Finanzas.prototype, "categoriesFinanza", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Finanzas.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => tipo_entity_1.TipoFinanza),
    __metadata("design:type", Object)
], Finanzas.prototype, "empresa", void 0);
exports.Finanzas = Finanzas = __decorate([
    (0, sequelize_typescript_1.DefaultScope)(() => ({ include: [categories_entity_1.CategoriesFinanzas] })),
    sequelize_typescript_1.Table
], Finanzas);
