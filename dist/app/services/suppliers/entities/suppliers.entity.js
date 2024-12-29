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
exports.Suppliers = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let Suppliers = class Suppliers extends sequelize_typescript_1.Model {
};
exports.Suppliers = Suppliers;
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(30),
    }),
    __metadata("design:type", String)
], Suppliers.prototype, "supplier_code", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(30), allowNull: false }),
    __metadata("design:type", String)
], Suppliers.prototype, "ruc", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], Suppliers.prototype, "razon_social", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], Suppliers.prototype, "activity", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], Suppliers.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(30) }),
    __metadata("design:type", Object)
], Suppliers.prototype, "contact", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(30), allowNull: false }),
    __metadata("design:type", String)
], Suppliers.prototype, "phone_one", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(30) }),
    __metadata("design:type", Object)
], Suppliers.prototype, "phone_two", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255), allowNull: false }),
    __metadata("design:type", String)
], Suppliers.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255) }),
    __metadata("design:type", Object)
], Suppliers.prototype, "email2", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }),
    __metadata("design:type", Object)
], Suppliers.prototype, "web", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Object)
], Suppliers.prototype, "logo", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Suppliers.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Suppliers.prototype, "empresa", void 0);
exports.Suppliers = Suppliers = __decorate([
    sequelize_typescript_1.Table
], Suppliers);
