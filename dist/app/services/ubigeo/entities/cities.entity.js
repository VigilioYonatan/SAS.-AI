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
exports.Cities = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const regions_entity_1 = require("./regions.entity");
const address_entity_1 = require("@/empresas/entities/address.entity");
let Cities = class Cities extends sequelize_typescript_1.Model {
};
exports.Cities = Cities;
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Cities.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING(255),
    }),
    __metadata("design:type", String)
], Cities.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => regions_entity_1.Regions),
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Cities.prototype, "region_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => regions_entity_1.Regions),
    __metadata("design:type", Object)
], Cities.prototype, "region", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => address_entity_1.Address),
    __metadata("design:type", Object)
], Cities.prototype, "address", void 0);
exports.Cities = Cities = __decorate([
    (0, sequelize_typescript_1.DefaultScope)(() => ({ include: [regions_entity_1.Regions] })),
    sequelize_typescript_1.Table
], Cities);
