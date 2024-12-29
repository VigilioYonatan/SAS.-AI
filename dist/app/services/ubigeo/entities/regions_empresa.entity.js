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
exports.RegionsEmpresa = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const regions_entity_1 = require("./regions.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let RegionsEmpresa = class RegionsEmpresa extends sequelize_typescript_1.Model {
    get priceShipping() {
        return Number.parseFloat(this.getDataValue("priceShipping"));
    }
};
exports.RegionsEmpresa = RegionsEmpresa;
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], RegionsEmpresa.prototype, "days", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], RegionsEmpresa.prototype, "enabled", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.DECIMAL,
    }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], RegionsEmpresa.prototype, "priceShipping", null);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => regions_entity_1.Regions),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], RegionsEmpresa.prototype, "region_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => regions_entity_1.Regions),
    __metadata("design:type", Object)
], RegionsEmpresa.prototype, "region", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], RegionsEmpresa.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], RegionsEmpresa.prototype, "empresa", void 0);
exports.RegionsEmpresa = RegionsEmpresa = __decorate([
    sequelize_typescript_1.Table
], RegionsEmpresa);
