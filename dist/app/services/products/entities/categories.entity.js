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
exports.Categories = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const products_restaurant_entity_1 = require("./products_restaurant.entity");
const products_servicio_entity_1 = require("./products_servicio.entity");
const subcategories_entity_1 = require("./subcategories.entity");
let Categories = class Categories extends sequelize_typescript_1.Model {
};
exports.Categories = Categories;
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(30),
    }),
    __metadata("design:type", String)
], Categories.prototype, "category_code", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], Categories.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.BOOLEAN,
    }),
    __metadata("design:type", Boolean)
], Categories.prototype, "isService", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        defaultValue: [],
    }),
    __metadata("design:type", Object)
], Categories.prototype, "image", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Categories.prototype, "wallpaper", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], Categories.prototype, "icon", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], Categories.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => products_normal_entity_1.ProductsNormal),
    __metadata("design:type", Array)
], Categories.prototype, "productsNormals", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => subcategories_entity_1.Subcategories),
    __metadata("design:type", Array)
], Categories.prototype, "subcategories", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => products_restaurant_entity_1.ProductsRestaurant),
    __metadata("design:type", Array)
], Categories.prototype, "productsRestaurants", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => products_servicio_entity_1.ProductsServicio),
    __metadata("design:type", Array)
], Categories.prototype, "productsServicios", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Categories.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Categories.prototype, "empresa", void 0);
exports.Categories = Categories = __decorate([
    sequelize_typescript_1.Table
], Categories);
