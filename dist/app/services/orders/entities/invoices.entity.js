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
exports.Invoices = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const orders_entity_1 = require("./orders.entity");
const notes_entity_1 = require("./notes.entity");
const kind_invoice_entity_1 = require("./kind_invoice.entity");
const documents_entity_1 = require("./documents.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let Invoices = class Invoices extends sequelize_typescript_1.Model {
};
exports.Invoices = Invoices;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => kind_invoice_entity_1.KindInvoice),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10), allowNull: false }),
    __metadata("design:type", String)
], Invoices.prototype, "kind_invoice_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10), allowNull: false }),
    __metadata("design:type", String)
], Invoices.prototype, "serie", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(20), allowNull: false }),
    __metadata("design:type", String)
], Invoices.prototype, "correlativo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), defaultValue: false }),
    __metadata("design:type", String)
], Invoices.prototype, "razon_social", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => documents_entity_1.Documents),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10) }),
    __metadata("design:type", Object)
], Invoices.prototype, "document_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), defaultValue: false }),
    __metadata("design:type", Object)
], Invoices.prototype, "identification_number", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Object)
], Invoices.prototype, "send_sunat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Object)
], Invoices.prototype, "response_sunat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) }),
    __metadata("design:type", Object)
], Invoices.prototype, "xml_path", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) }),
    __metadata("design:type", Object)
], Invoices.prototype, "cdr_path", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => orders_entity_1.Orders),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Invoices.prototype, "order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => orders_entity_1.Orders),
    __metadata("design:type", Object)
], Invoices.prototype, "order", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => notes_entity_1.Notes),
    __metadata("design:type", Object)
], Invoices.prototype, "note", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => kind_invoice_entity_1.KindInvoice),
    __metadata("design:type", Object)
], Invoices.prototype, "kind_invoice", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => documents_entity_1.Documents),
    __metadata("design:type", Object)
], Invoices.prototype, "document", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Invoices.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Invoices.prototype, "empresa", void 0);
exports.Invoices = Invoices = __decorate([
    sequelize_typescript_1.Table
], Invoices);
