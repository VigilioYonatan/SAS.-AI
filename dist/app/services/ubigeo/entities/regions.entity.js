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
exports.Regions = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const cities_entity_1 = require("./cities.entity");
const countries_entity_1 = require("./countries.entity");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const regions_empresa_entity_1 = require("./regions_empresa.entity");
let Regions = class Regions extends sequelize_typescript_1.Model {
};
exports.Regions = Regions;
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Regions.prototype, "code", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.STRING,
    }),
    __metadata("design:type", String)
], Regions.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => countries_entity_1.Countries),
    (0, sequelize_typescript_1.Column)({
        allowNull: false,
        type: sequelize_typescript_1.DataType.INTEGER,
    }),
    __metadata("design:type", Number)
], Regions.prototype, "country_id", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => cities_entity_1.Cities),
    __metadata("design:type", Array)
], Regions.prototype, "cities", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => countries_entity_1.Countries),
    __metadata("design:type", Object)
], Regions.prototype, "country", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsToMany)(() => empresas_entity_1.Empresas, () => regions_empresa_entity_1.RegionsEmpresa),
    __metadata("design:type", Array)
], Regions.prototype, "empresas", void 0);
exports.Regions = Regions = __decorate([
    sequelize_typescript_1.Table
], Regions);
