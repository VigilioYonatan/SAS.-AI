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
exports.Reactions = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_entity_1 = require("@/users/entities/users.entity");
const comments_entity_1 = require("./comments.entity");
const subcomments_entity_1 = require("./subcomments.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let Reactions = class Reactions extends sequelize_typescript_1.Model {
};
exports.Reactions = Reactions;
__decorate([
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Boolean)
], Reactions.prototype, "isLike", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => users_entity_1.Users),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], Reactions.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Reactions.prototype, "reactionsable_id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }),
    __metadata("design:type", String)
], Reactions.prototype, "reactionsable_type", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Reactions.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => users_entity_1.Users),
    __metadata("design:type", Object)
], Reactions.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => comments_entity_1.Comments, {
        foreignKey: "reactionsable_id",
        constraints: false,
    }),
    __metadata("design:type", Object)
], Reactions.prototype, "comments", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => subcomments_entity_1.Subcomments, {
        foreignKey: "reactionsable_id",
        constraints: false,
    }),
    __metadata("design:type", Object)
], Reactions.prototype, "subcomments", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Reactions.prototype, "empresa", void 0);
exports.Reactions = Reactions = __decorate([
    sequelize_typescript_1.Table
], Reactions);
