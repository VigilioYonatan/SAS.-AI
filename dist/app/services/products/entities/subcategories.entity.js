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
exports.Subcategories = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const categories_entity_1 = require("./categories.entity");
const products_normal_entity_1 = require("./products_normal.entity");
const products_restaurant_entity_1 = require("./products_restaurant.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let Subcategories = class Subcategories extends sequelize_typescript_1.Model {
};
exports.Subcategories = Subcategories;
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(30),
    }),
    __metadata("design:type", String)
], Subcategories.prototype, "subcategory_code", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], Subcategories.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Subcategories.prototype, "image", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], Subcategories.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => categories_entity_1.Categories),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Subcategories.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => categories_entity_1.Categories),
    __metadata("design:type", Object)
], Subcategories.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => products_normal_entity_1.ProductsNormal),
    __metadata("design:type", Array)
], Subcategories.prototype, "productsNormals", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => products_restaurant_entity_1.ProductsRestaurant),
    __metadata("design:type", Array)
], Subcategories.prototype, "productsRestaurants", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Subcategories.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Subcategories.prototype, "empresa", void 0);
exports.Subcategories = Subcategories = __decorate([
    (0, sequelize_typescript_1.DefaultScope)(() => ({
        include: [{ model: categories_entity_1.Categories, attributes: ["id", "name", "slug"] }],
    })),
    sequelize_typescript_1.Table
], Subcategories);
