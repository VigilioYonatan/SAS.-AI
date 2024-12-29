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
exports.Users = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const orders_entity_1 = require("@/orders/entities/orders.entity");
const cart_entity_1 = require("@/cart/entites/cart.entity");
const notifications_entity_1 = require("@/notificactions/entities/notifications.entity");
const notifications_user_entity_1 = require("@/notificactions/entities/notifications_user.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const posts_entity_1 = require("@/posts/entities/posts.entity");
const cities_entity_1 = require("@/ubigeo/entities/cities.entity");
let Users = class Users extends sequelize_typescript_1.Model {
};
exports.Users = Users;
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(30),
    }),
    __metadata("design:type", String)
], Users.prototype, "user_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(30),
    }),
    __metadata("design:type", String)
], Users.prototype, "username", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Users.prototype, "reference", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Users.prototype, "identification_number", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(30),
    }),
    __metadata("design:type", String)
], Users.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Users.prototype, "lastname", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Users.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", Object)
], Users.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(80),
        allowNull: false,
    }),
    __metadata("design:type", String)
], Users.prototype, "telephone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(80),
        defaultValue: null,
    }),
    __metadata("design:type", Object)
], Users.prototype, "speciality", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Users.prototype, "photo", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "enabled", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Object)
], Users.prototype, "enabledNotification", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Object)
], Users.prototype, "enabledEmailsOffers", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "isOnline", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.BOOLEAN,
        defaultValue: false,
    }),
    __metadata("design:type", Boolean)
], Users.prototype, "isBot", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Users.prototype, "subscription", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.DATE,
    }),
    __metadata("design:type", Date)
], Users.prototype, "birthday", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", Object)
], Users.prototype, "token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Users.prototype, "map_marker", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Users.prototype, "buys", void 0);
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(30),
    }),
    __metadata("design:type", String)
], Users.prototype, "slug", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Users.prototype, "role_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => cities_entity_1.Cities),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Object)
], Users.prototype, "city_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Users.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Users.prototype, "empresa", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => orders_entity_1.Orders),
    __metadata("design:type", Array)
], Users.prototype, "orders", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => cart_entity_1.Cart),
    __metadata("design:type", Array)
], Users.prototype, "carts", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => notifications_entity_1.Notifications, () => notifications_user_entity_1.NotificationsUser),
    __metadata("design:type", Array)
], Users.prototype, "notificationsusers", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => posts_entity_1.Posts),
    __metadata("design:type", Array)
], Users.prototype, "posts", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => cities_entity_1.Cities),
    __metadata("design:type", Object)
], Users.prototype, "city", void 0);
exports.Users = Users = __decorate([
    (0, sequelize_typescript_1.Scopes)(() => ({
        hiddePassword: {
            attributes: { exclude: ["password"] },
        },
    })),
    sequelize_typescript_1.Table
], Users);
