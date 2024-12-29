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
exports.Orders = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const status_orders_entity_1 = require("./status_orders.entity");
const pay_methods_entity_1 = require("./pay_methods.entity");
const detail_orders_entity_1 = require("./detail_orders.entity");
const invoices_entity_1 = require("./invoices.entity");
const notes_entity_1 = require("./notes.entity");
const guides_entity_1 = require("./guides.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const users_entity_1 = require("@/users/entities/users.entity");
const cities_entity_1 = require("@/ubigeo/entities/cities.entity");
const mesas_entity_1 = require("./mesas.entity");
const floors_entity_1 = require("./floors.entity");
let Orders = class Orders extends sequelize_typescript_1.Model {
    get total() {
        return Number.parseFloat(this.getDataValue("total"));
    }
    get moneyChange() {
        return Number.parseFloat(this.getDataValue("moneyChange"));
    }
};
exports.Orders = Orders;
__decorate([
    sequelize_typescript_1.Index,
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(100),
    }),
    __metadata("design:type", String)
], Orders.prototype, "order_code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", String)
], Orders.prototype, "address", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", Object)
], Orders.prototype, "email", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", Object)
], Orders.prototype, "type_pasarela", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(200),
    }),
    __metadata("design:type", Object)
], Orders.prototype, "reference", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.STRING(20),
    }),
    __metadata("design:type", String)
], Orders.prototype, "telephone", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", Object)
], Orders.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL(10, 2) }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Orders.prototype, "total", null);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false }),
    __metadata("design:type", Boolean)
], Orders.prototype, "igv", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false }),
    __metadata("design:type", Boolean)
], Orders.prototype, "isService", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false }),
    __metadata("design:type", Boolean)
], Orders.prototype, "is_pasarela_client", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false }),
    __metadata("design:type", Boolean)
], Orders.prototype, "pasarela_comision", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN, allowNull: false }),
    __metadata("design:type", Boolean)
], Orders.prototype, "isDelivery", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.DECIMAL, allowNull: false, defaultValue: 1 }),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], Orders.prototype, "moneyChange", null);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, defaultValue: null }),
    __metadata("design:type", Object)
], Orders.prototype, "pasarela_response", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON, defaultValue: null }),
    __metadata("design:type", Object)
], Orders.prototype, "paypal_response", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, defaultValue: null }),
    __metadata("design:type", String)
], Orders.prototype, "paypal_token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, defaultValue: null }),
    __metadata("design:type", String)
], Orders.prototype, "stripe_token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING, defaultValue: null }),
    __metadata("design:type", String)
], Orders.prototype, "mercado_pago_token", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Orders.prototype, "map_marker", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.JSON,
    }),
    __metadata("design:type", Object)
], Orders.prototype, "transferencia_image", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => status_orders_entity_1.StatusOrders),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Orders.prototype, "status_order_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => users_entity_1.Users),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Object)
], Orders.prototype, "user_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => users_entity_1.Users),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Object)
], Orders.prototype, "seller_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => pay_methods_entity_1.PayMethods),
    (0, sequelize_typescript_1.Column)({ allowNull: false, type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], Orders.prototype, "pay_method_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => mesas_entity_1.Mesas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Object)
], Orders.prototype, "mesa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => cities_entity_1.Cities),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Object)
], Orders.prototype, "city_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => cities_entity_1.Cities),
    __metadata("design:type", Object)
], Orders.prototype, "city", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => users_entity_1.Users, { as: "user", foreignKey: "user_id" }),
    __metadata("design:type", Object)
], Orders.prototype, "user", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => users_entity_1.Users, { as: "seller", foreignKey: "seller_id" }),
    __metadata("design:type", Object)
], Orders.prototype, "seller", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => status_orders_entity_1.StatusOrders),
    __metadata("design:type", Object)
], Orders.prototype, "status_order", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => pay_methods_entity_1.PayMethods),
    __metadata("design:type", Object)
], Orders.prototype, "pay_method", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => detail_orders_entity_1.DetailOrders),
    __metadata("design:type", Array)
], Orders.prototype, "details_orders", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => invoices_entity_1.Invoices),
    __metadata("design:type", Object)
], Orders.prototype, "invoice", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => notes_entity_1.Notes),
    __metadata("design:type", Object)
], Orders.prototype, "note", void 0);
__decorate([
    (0, sequelize_typescript_1.HasOne)(() => guides_entity_1.Guides),
    __metadata("design:type", Object)
], Orders.prototype, "guide", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Orders.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], Orders.prototype, "empresa", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => mesas_entity_1.Mesas, { onDelete: "SET NULL" }),
    __metadata("design:type", Object)
], Orders.prototype, "mesa", void 0);
exports.Orders = Orders = __decorate([
    (0, sequelize_typescript_1.DefaultScope)(() => ({
        include: [
            {
                model: pay_methods_entity_1.PayMethods,
                attributes: ["id", "name"],
            },
            {
                model: status_orders_entity_1.StatusOrders,
                attributes: ["id", "name"],
            },
            { model: cities_entity_1.Cities },
            {
                model: users_entity_1.Users,
                attributes: [
                    "id",
                    "username",
                    "name",
                    "lastname",
                    "photo",
                    "email",
                    "role_id",
                ],
                as: "user",
            },
            {
                model: users_entity_1.Users,
                attributes: [
                    "id",
                    "username",
                    "name",
                    "lastname",
                    "photo",
                    "email",
                    "role_id",
                ],
                as: "seller",
            },
            {
                model: mesas_entity_1.Mesas,
                include: [{ model: floors_entity_1.Floors }],
            },
        ],
    })),
    sequelize_typescript_1.Table
], Orders);
