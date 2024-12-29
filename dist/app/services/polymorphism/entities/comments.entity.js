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
exports.Comments = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_entity_1 = require("@/users/entities/users.entity");
const reactions_entity_1 = require("./reactions.entity");
const subcomments_entity_1 = require("./subcomments.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const products_normal_entity_1 = require("@/products/entities/products_normal.entity");
const products_servicio_entity_1 = require("@/products/entities/products_servicio.entity");
const products_restaurant_entity_1 = require("@/products/entities/products_restaurant.entity");
let Comments = class Comments extends sequelize_typescript_1.Model {
};
exports.Comments = Comments;
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", String)
], Comments.prototype, "content", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => users_entity_1.Users),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Comments.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Comments.prototype, "commentsable_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.STRING(100) }),
    __metadata("design:type", String)
], Comments.prototype, "commentsable_type", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Comments.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => users_entity_1.Users),
    __metadata("design:type", Object)
], Comments.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => products_normal_entity_1.ProductsNormal, {
        foreignKey: "commentsable_id",
        constraints: false,
    }),
    __metadata("design:type", Object)
], Comments.prototype, "product_normal", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => products_servicio_entity_1.ProductsServicio, {
        foreignKey: "commentsable_id",
        constraints: false,
    }),
    __metadata("design:type", Object)
], Comments.prototype, "product_servicio", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => products_restaurant_entity_1.ProductsRestaurant, {
        foreignKey: "commentsable_id",
        constraints: false,
    }),
    __metadata("design:type", Object)
], Comments.prototype, "product_restaurant", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => reactions_entity_1.Reactions, {
        foreignKey: "reactionsable_id",
        constraints: false,
        scope: { reactionsable_type: "comments" },
    }),
    __metadata("design:type", Array)
], Comments.prototype, "reactions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => subcomments_entity_1.Subcomments),
    __metadata("design:type", Array)
], Comments.prototype, "subcomments", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Comments.prototype, "empresa", void 0);
exports.Comments = Comments = __decorate([
    (0, sequelize_typescript_1.DefaultScope)(() => ({
        include: [
            {
                model: users_entity_1.Users,
                attributes: ["id", "username", "photo"],
            },
        ],
    })),
    sequelize_typescript_1.Table
], Comments);
