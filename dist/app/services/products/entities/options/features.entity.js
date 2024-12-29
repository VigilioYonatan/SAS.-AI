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
exports.Features = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const variants_features_entity_1 = require("./variants_features.entity");
const variants_entity_1 = require("./variants.entity");
const options_entity_1 = require("./options.entity");
let Features = class Features extends sequelize_typescript_1.Model {
};
exports.Features = Features;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }),
    __metadata("design:type", String)
], Features.prototype, "value", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING(100), allowNull: false }),
    __metadata("design:type", String)
], Features.prototype, "description", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => options_entity_1.Options),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Features.prototype, "option_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => options_entity_1.Options),
    __metadata("design:type", Object)
], Features.prototype, "option", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => variants_entity_1.Variants, () => variants_features_entity_1.VariantsFeatures),
    __metadata("design:type", Array)
], Features.prototype, "variants", void 0);
exports.Features = Features = __decorate([
    sequelize_typescript_1.Table
], Features);
