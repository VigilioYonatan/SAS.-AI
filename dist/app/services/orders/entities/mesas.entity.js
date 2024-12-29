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
exports.Mesas = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const orders_entity_1 = require("./orders.entity");
const floors_entity_1 = require("./floors.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let Mesas = class Mesas extends sequelize_typescript_1.Model {
};
exports.Mesas = Mesas;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }),
    __metadata("design:type", String)
], Mesas.prototype, "mesa_code", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => floors_entity_1.Floors),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Mesas.prototype, "floor_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Mesas.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => floors_entity_1.Floors),
    __metadata("design:type", Object)
], Mesas.prototype, "floor", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => orders_entity_1.Orders),
    __metadata("design:type", Array)
], Mesas.prototype, "orders", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Mesas.prototype, "empresa", void 0);
exports.Mesas = Mesas = __decorate([
    sequelize_typescript_1.Table
], Mesas);
