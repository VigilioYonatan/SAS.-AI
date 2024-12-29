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
exports.ProductsServicio = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const detail_orders_entity_1 = require("@/orders/entities/detail_orders.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const categories_entity_1 = require("./categories.entity");
const comments_entity_1 = require("@/polymorphism/entities/comments.entity");
const ratings_entity_1 = require("@/polymorphism/entities/ratings.entity");
const subcomments_entity_1 = require("@/polymorphism/entities/subcomments.entity");
const reactions_entity_1 = require("@/polymorphism/entities/reactions.entity");
const favorites_entity_1 = require("@/favorites/entities/favorites.entity");
let ProductsServicio = class ProductsServicio extends sequelize_typescript_1.Model {
    get price() {
        return Number.parseFloat(this.getDataValue("price"));
    }
    get discount() {
        return Number.parseFloat(this.getDataValue("discount"));
    }
};
exports.ProductsServicio = ProductsServicio;
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(80),
    }),
    __metadata("design:type", String)
], ProductsServicio.prototype, "product_code", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255) }),
    __metadata("design:type", String)
], ProductsServicio.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(255) }),
    __metadata("design:type", String)
], ProductsServicio.prototype, "url", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", String)
], ProductsServicio.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Array)
], ProductsServicio.prototype, "days", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Boolean)
], ProductsServicio.prototype, "showHorario", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        allowNull: false,
    }),
    __metadata("design:type", Array)
], ProductsServicio.prototype, "characteristics", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        allowNull: false,
    }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ProductsServicio.prototype, "price", null);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DECIMAL(10, 2),
        defaultValue: 0,
    }),
    __metadata("design:type", Number),
    __metadata("design:paramtypes", [])
], ProductsServicio.prototype, "discount", null);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: true,
    }),
    __metadata("design:type", Boolean)
], ProductsServicio.prototype, "enabled", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
        defaultValue: [],
    }),
    __metadata("design:type", Object)
], ProductsServicio.prototype, "images", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], ProductsServicio.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => categories_entity_1.Categories),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductsServicio.prototype, "category_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => categories_entity_1.Categories),
    __metadata("design:type", Object)
], ProductsServicio.prototype, "category", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => detail_orders_entity_1.DetailOrders, { onDelete: "SET NULL" }),
    __metadata("design:type", Array)
], ProductsServicio.prototype, "detailsOrders", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], ProductsServicio.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], ProductsServicio.prototype, "empresa", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => comments_entity_1.Comments, {
        foreignKey: "commentsable_id",
        constraints: false,
        scope: { commentsable_type: "ProductsServicios" },
    }),
    __metadata("design:type", Array)
], ProductsServicio.prototype, "comments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => subcomments_entity_1.Subcomments, {
        foreignKey: "subcommentsable_id",
        constraints: false,
        scope: { commentsable_type: "ProductsServicios" },
    }),
    __metadata("design:type", Array)
], ProductsServicio.prototype, "subcomments", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => favorites_entity_1.Favorites),
    __metadata("design:type", Array)
], ProductsServicio.prototype, "favorites", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => ratings_entity_1.Ratings, {
        foreignKey: "ratingsable_id",
        constraints: false,
        scope: { ratingsable_type: "ProductsServicios" },
    }),
    __metadata("design:type", Object)
], ProductsServicio.prototype, "ratings", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => reactions_entity_1.Reactions, {
        foreignKey: "ratingsable_id",
        constraints: false,
        scope: { ratingsable_type: "ProductsServicios" },
    }),
    __metadata("design:type", Object)
], ProductsServicio.prototype, "reactions", void 0);
exports.ProductsServicio = ProductsServicio = __decorate([
    (0, sequelize_typescript_1.DefaultScope)(() => ({
        include: [
            {
                model: categories_entity_1.Categories,
                attributes: ["name", "slug", "icon"],
            },
        ],
    })),
    sequelize_typescript_1.Table
], ProductsServicio);
