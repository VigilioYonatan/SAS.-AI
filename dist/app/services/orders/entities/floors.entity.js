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
exports.Floors = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const mesas_entity_1 = require("./mesas.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let Floors = class Floors extends sequelize_typescript_1.Model {
};
exports.Floors = Floors;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }),
    __metadata("design:type", String)
], Floors.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => mesas_entity_1.Mesas),
    __metadata("design:type", Array)
], Floors.prototype, "mesas", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Floors.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Floors.prototype, "empresa", void 0);
exports.Floors = Floors = __decorate([
    sequelize_typescript_1.Table
], Floors);
