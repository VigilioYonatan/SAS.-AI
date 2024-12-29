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
exports.NotificationsUser = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const users_entity_1 = require("@/users/entities/users.entity");
const notifications_entity_1 = require("./notifications.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
let NotificationsUser = class NotificationsUser extends sequelize_typescript_1.Model {
};
exports.NotificationsUser = NotificationsUser;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false }),
    __metadata("design:type", Boolean)
], NotificationsUser.prototype, "isRead", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => users_entity_1.Users),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], NotificationsUser.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => notifications_entity_1.Notifications),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], NotificationsUser.prototype, "notification_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => users_entity_1.Users),
    __metadata("design:type", Array)
], NotificationsUser.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => notifications_entity_1.Notifications),
    __metadata("design:type", Array)
], NotificationsUser.prototype, "notification", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], NotificationsUser.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], NotificationsUser.prototype, "empresa", void 0);
exports.NotificationsUser = NotificationsUser = __decorate([
    (0, sequelize_typescript_1.DefaultScope)(() => ({
        include: [
            {
                model: users_entity_1.Users,
                attributes: ["id", "username", "photo", "role_id"],
            },
        ],
    })),
    sequelize_typescript_1.Table
], NotificationsUser);
