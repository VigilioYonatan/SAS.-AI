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
exports.ProductsOptions = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const options_entity_1 = require("./options.entity");
const products_normal_entity_1 = require("../products_normal.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let ProductsOptions = class ProductsOptions extends sequelize_typescript_1.Model {
};
exports.ProductsOptions = ProductsOptions;
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => products_normal_entity_1.ProductsNormal),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductsOptions.prototype, "product_normal_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductsOptions.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => options_entity_1.Options),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductsOptions.prototype, "option_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSONB, allowNull: false }),
    __metadata("design:type", Array)
], ProductsOptions.prototype, "features", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => products_normal_entity_1.ProductsNormal),
    __metadata("design:type", Object)
], ProductsOptions.prototype, "productsNormal", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => options_entity_1.Options),
    __metadata("design:type", Object)
], ProductsOptions.prototype, "option", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], ProductsOptions.prototype, "empresa", void 0);
exports.ProductsOptions = ProductsOptions = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: false })
], ProductsOptions);
