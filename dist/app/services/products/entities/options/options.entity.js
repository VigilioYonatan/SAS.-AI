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
exports.Options = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const features_entity_1 = require("./features.entity");
const products_options_entity_1 = require("./products_options.entity");
const products_normal_entity_1 = require("../products_normal.entity");
let Options = class Options extends sequelize_typescript_1.Model {
};
exports.Options = Options;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }),
    __metadata("design:type", String)
], Options.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Options.prototype, "type", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => features_entity_1.Features),
    __metadata("design:type", Array)
], Options.prototype, "features", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => products_normal_entity_1.ProductsNormal, () => products_options_entity_1.ProductsOptions),
    __metadata("design:type", Array)
], Options.prototype, "products", void 0);
exports.Options = Options = __decorate([
    sequelize_typescript_1.Table
], Options);
