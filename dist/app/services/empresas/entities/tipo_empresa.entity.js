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
exports.TipoEmpresa = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const tipo_servicio_entity_1 = require("./tipo_servicio.entity");
const empresas_entity_1 = require("./empresas.entity");
let TipoEmpresa = class TipoEmpresa extends sequelize_typescript_1.Model {
};
exports.TipoEmpresa = TipoEmpresa;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }),
    __metadata("design:type", String)
], TipoEmpresa.prototype, "value", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => tipo_servicio_entity_1.TipoServicio),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], TipoEmpresa.prototype, "tipo_servicio_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => tipo_servicio_entity_1.TipoServicio),
    __metadata("design:type", Object)
], TipoEmpresa.prototype, "tipo_servicio", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], TipoEmpresa.prototype, "empresas", void 0);
exports.TipoEmpresa = TipoEmpresa = __decorate([
    (0, sequelize_typescript_1.DefaultScope)(() => ({ include: [tipo_servicio_entity_1.TipoServicio] })),
    sequelize_typescript_1.Table
], TipoEmpresa);
