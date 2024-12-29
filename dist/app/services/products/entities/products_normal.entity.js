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
exports.ProductsNormal = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const cart_entity_1 = require("@/cart/entites/cart.entity");
const categories_entity_1 = require("./categories.entity");
const detail_orders_entity_1 = require("@/orders/entities/detail_orders.entity");
const brands_entitiy_1 = require("./brands.entitiy");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const variants_entity_1 = require("./options/variants.entity");
const products_options_entity_1 = require("./options/products_options.entity");
const options_entity_1 = require("./options/options.entity");
const comments_entity_1 = require("@/polymorphism/entities/comments.entity");
const ratings_entity_1 = require("@/polymorphism/entities/ratings.entity");
const subcomments_entity_1 = require("@/polymorphism/entities/subcomments.entity");
const reactions_entity_1 = require("@/polymorphism/entities/reactions.entity");
const favorites_entity_1 = require("@/favorites/entities/favorites.entity");
const subcategories_entity_1 = require("./subcategories.entity");
let ProductsNormal = class ProductsNormal extends sequelize_typescript_1.Model {
    get price() {
        return Number.parseFloat(this.getDataValue("price"));
    }
    get discount() {
        return Number.parseFloat(this.getDataValue("discount"));
    }
};
exports.ProductsNormal = ProductsNormal;
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(80),
    }),
    __metadata("design:type", String)
], ProductsNormal.prototype, "product_code", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255) }),
    __metadata("design:type", String)
], ProductsNormal.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255) }),
    __metadata("design:type", String)
], ProductsNormal.prototype, "url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", String)
], ProductsNormal.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], ProductsNormal.prototype, "characteristics", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ProductsNormal.prototype, "price", null);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        defaultValue: 0,
    }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ProductsNormal.prototype, "discount", null);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], ProductsNormal.prototype, "enabled", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        defaultValue: [],
    }),
    __metadata("design:type", Object)
], ProductsNormal.prototype, "images", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], ProductsNormal.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => categories_entity_1.Categories),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductsNormal.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => categories_entity_1.Categories),
    __metadata("design:type", Object)
], ProductsNormal.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => subcategories_entity_1.Subcategories),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Object)
], ProductsNormal.prototype, "subcategory_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => subcategories_entity_1.Subcategories),
    __metadata("design:type", Object)
], ProductsNormal.prototype, "subcategory", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => brands_entitiy_1.Brands),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Object)
], ProductsNormal.prototype, "brand_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => brands_entitiy_1.Brands),
    __metadata("design:type", Object)
], ProductsNormal.prototype, "brand", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductsNormal.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], ProductsNormal.prototype, "empresa", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => cart_entity_1.Cart),
    __metadata("design:type", Array)
], ProductsNormal.prototype, "carts", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => options_entity_1.Options, () => products_options_entity_1.ProductsOptions),
    __metadata("design:type", Array)
], ProductsNormal.prototype, "options", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => detail_orders_entity_1.DetailOrders, { onDelete: "SET NULL" }),
    __metadata("design:type", Array)
], ProductsNormal.prototype, "detailsOrders", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => variants_entity_1.Variants),
    __metadata("design:type", Array)
], ProductsNormal.prototype, "variants", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => favorites_entity_1.Favorites),
    __metadata("design:type", Array)
], ProductsNormal.prototype, "favorites", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => comments_entity_1.Comments, {
        foreignKey: "commentsable_id",
        constraints: false,
        scope: { commentsable_type: "ProductsNormals" },
    }),
    __metadata("design:type", Array)
], ProductsNormal.prototype, "comments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => subcomments_entity_1.Subcomments, {
        foreignKey: "subcommentsable_id",
        constraints: false,
        scope: { commentsable_type: "ProductsNormals" },
    }),
    __metadata("design:type", Array)
], ProductsNormal.prototype, "subcomments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ratings_entity_1.Ratings, {
        foreignKey: "ratingsable_id",
        constraints: false,
        scope: { ratingsable_type: "ProductsNormals" },
    }),
    __metadata("design:type", Object)
], ProductsNormal.prototype, "ratings", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => reactions_entity_1.Reactions, {
        foreignKey: "ratingsable_id",
        constraints: false,
        scope: { ratingsable_type: "ProductsNormals" },
    }),
    __metadata("design:type", Object)
], ProductsNormal.prototype, "reactions", void 0);
exports.ProductsNormal = ProductsNormal = __decorate([
    (0, sequelize_typescript_1.DefaultScope)(() => ({
        include: [
            {
                model: categories_entity_1.Categories,
                attributes: ["name", "slug", "icon"],
            },
            { model: brands_entitiy_1.Brands },
        ],
    })),
    sequelize_typescript_1.Table
], ProductsNormal);
