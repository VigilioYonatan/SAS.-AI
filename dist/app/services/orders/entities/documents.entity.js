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
exports.Documents = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const invoices_entity_1 = require("./invoices.entity");
const notes_entity_1 = require("./notes.entity");
let Documents = class Documents extends sequelize_typescript_1.Model {
};
exports.Documents = Documents;
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false, unique: true }),
    __metadata("design:type", String)
], Documents.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false, unique: true }),
    __metadata("design:type", String)
], Documents.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => invoices_entity_1.Invoices),
    __metadata("design:type", Array)
], Documents.prototype, "invoices", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => notes_entity_1.Notes),
    __metadata("design:type", Array)
], Documents.prototype, "notes", void 0);
exports.Documents = Documents = __decorate([
    sequelize_typescript_1.Table
], Documents);
