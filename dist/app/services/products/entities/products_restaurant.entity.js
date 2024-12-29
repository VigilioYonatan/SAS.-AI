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
exports.ProductsRestaurant = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const cart_entity_1 = require("@/cart/entites/cart.entity");
const categories_entity_1 = require("./categories.entity");
const detail_orders_entity_1 = require("@/orders/entities/detail_orders.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const comments_entity_1 = require("@/polymorphism/entities/comments.entity");
const ratings_entity_1 = require("@/polymorphism/entities/ratings.entity");
const subcomments_entity_1 = require("@/polymorphism/entities/subcomments.entity");
const reactions_entity_1 = require("@/polymorphism/entities/reactions.entity");
const favorites_entity_1 = require("@/favorites/entities/favorites.entity");
const subcategories_entity_1 = require("./subcategories.entity");
let ProductsRestaurant = class ProductsRestaurant extends sequelize_typescript_1.Model {
    get price() {
        return Number.parseFloat(this.getDataValue("price"));
    }
    get discount() {
        return Number.parseFloat(this.getDataValue("discount"));
    }
};
exports.ProductsRestaurant = ProductsRestaurant;
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(80),
    }),
    __metadata("design:type", String)
], ProductsRestaurant.prototype, "product_code", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255) }),
    __metadata("design:type", String)
], ProductsRestaurant.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255) }),
    __metadata("design:type", String)
], ProductsRestaurant.prototype, "url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", String)
], ProductsRestaurant.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], ProductsRestaurant.prototype, "characteristics", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ProductsRestaurant.prototype, "price", null);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        defaultValue: 0,
    }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ProductsRestaurant.prototype, "discount", null);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductsRestaurant.prototype, "stock", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false }),
    __metadata("design:type", Boolean)
], ProductsRestaurant.prototype, "ilimit", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], ProductsRestaurant.prototype, "enabled", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        defaultValue: [],
    }),
    __metadata("design:type", Object)
], ProductsRestaurant.prototype, "images", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], ProductsRestaurant.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => categories_entity_1.Categories),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductsRestaurant.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => categories_entity_1.Categories),
    __metadata("design:type", Object)
], ProductsRestaurant.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => subcategories_entity_1.Subcategories),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], ProductsRestaurant.prototype, "subcategory_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => subcategories_entity_1.Subcategories),
    __metadata("design:type", Object)
], ProductsRestaurant.prototype, "subcategory", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => cart_entity_1.Cart),
    __metadata("design:type", Array)
], ProductsRestaurant.prototype, "carts", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => detail_orders_entity_1.DetailOrders, { onDelete: "SET NULL" }),
    __metadata("design:type", Array)
], ProductsRestaurant.prototype, "detailsOrders", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductsRestaurant.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], ProductsRestaurant.prototype, "empresa", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => favorites_entity_1.Favorites),
    __metadata("design:type", Array)
], ProductsRestaurant.prototype, "favorites", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => comments_entity_1.Comments, {
        foreignKey: "commentsable_id",
        constraints: false,
        scope: { commentsable_type: "ProductsRestaurants" },
    }),
    __metadata("design:type", Array)
], ProductsRestaurant.prototype, "comments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => subcomments_entity_1.Subcomments, {
        foreignKey: "subcommentsable_id",
        constraints: false,
        scope: { commentsable_type: "ProductsRestaurants" },
    }),
    __metadata("design:type", Array)
], ProductsRestaurant.prototype, "subcomments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ratings_entity_1.Ratings, {
        foreignKey: "ratingsable_id",
        constraints: false,
        scope: { ratingsable_type: "ProductsRestaurants" },
    }),
    __metadata("design:type", Object)
], ProductsRestaurant.prototype, "ratings", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => reactions_entity_1.Reactions, {
        foreignKey: "ratingsable_id",
        constraints: false,
        scope: { ratingsable_type: "ProductsRestaurants" },
    }),
    __metadata("design:type", Object)
], ProductsRestaurant.prototype, "reactions", void 0);
exports.ProductsRestaurant = ProductsRestaurant = __decorate([
    (0, sequelize_typescript_1.DefaultScope)(() => ({
        include: [
            {
                model: categories_entity_1.Categories,
                attributes: ["name", "slug", "icon"],
            },
        ],
    })),
    sequelize_typescript_1.Table
], ProductsRestaurant);
