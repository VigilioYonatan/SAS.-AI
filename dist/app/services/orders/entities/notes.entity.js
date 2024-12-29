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
exports.Notes = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const invoices_entity_1 = require("./invoices.entity");
const documents_entity_1 = require("./documents.entity");
const kind_invoice_entity_1 = require("./kind_invoice.entity");
const kind_credit_notes_entity_1 = require("./kind_credit_notes.entity");
const kind_debit_notes_entity_1 = require("./kind_debit_notes.entity");
const orders_entity_1 = require("./orders.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let Notes = class Notes extends sequelize_typescript_1.Model {
};
exports.Notes = Notes;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => kind_invoice_entity_1.KindInvoice),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10), allowNull: false }),
    __metadata("design:type", String)
], Notes.prototype, "kind_invoice_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10), allowNull: false }),
    __metadata("design:type", String)
], Notes.prototype, "serie", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(20), allowNull: false }),
    __metadata("design:type", String)
], Notes.prototype, "correlativo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }),
    __metadata("design:type", Object)
], Notes.prototype, "razon_social", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => documents_entity_1.Documents),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10) }),
    __metadata("design:type", Object)
], Notes.prototype, "document_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100) }),
    __metadata("design:type", Object)
], Notes.prototype, "identification_number", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Object)
], Notes.prototype, "send_sunat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Object)
], Notes.prototype, "response_sunat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255) }),
    __metadata("design:type", Object)
], Notes.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) }),
    __metadata("design:type", Object)
], Notes.prototype, "xml_path", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(200) }),
    __metadata("design:type", Object)
], Notes.prototype, "cdr_path", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => kind_credit_notes_entity_1.KindCreditNotes),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10) }),
    __metadata("design:type", Object)
], Notes.prototype, "kind_credit_notes_code", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => kind_debit_notes_entity_1.KindDebitNotes),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(10) }),
    __metadata("design:type", Object)
], Notes.prototype, "kind_debit_notes_code", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => invoices_entity_1.Invoices),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Notes.prototype, "invoice_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => orders_entity_1.Orders),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Notes.prototype, "order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => orders_entity_1.Orders),
    __metadata("design:type", Object)
], Notes.prototype, "order", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => invoices_entity_1.Invoices),
    __metadata("design:type", Object)
], Notes.prototype, "invoice", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => kind_invoice_entity_1.KindInvoice),
    __metadata("design:type", Object)
], Notes.prototype, "kind_invoice", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => documents_entity_1.Documents),
    __metadata("design:type", Object)
], Notes.prototype, "document", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => kind_credit_notes_entity_1.KindCreditNotes),
    __metadata("design:type", Object)
], Notes.prototype, "kind_credit_note", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => kind_debit_notes_entity_1.KindDebitNotes),
    __metadata("design:type", Object)
], Notes.prototype, "kind_debit_note", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Notes.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Notes.prototype, "empresa", void 0);
exports.Notes = Notes = __decorate([
    sequelize_typescript_1.Table
], Notes);
