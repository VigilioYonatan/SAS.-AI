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
exports.PayMethods = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const orders_entity_1 = require("./orders.entity");
let PayMethods = class PayMethods extends sequelize_typescript_1.Model {
};
exports.PayMethods = PayMethods;
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(100),
        unique: true,
    }),
    __metadata("design:type", String)
], PayMethods.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => orders_entity_1.Orders),
    __metadata("design:type", Array)
], PayMethods.prototype, "orders", void 0);
exports.PayMethods = PayMethods = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "pay_methods" })
], PayMethods);
