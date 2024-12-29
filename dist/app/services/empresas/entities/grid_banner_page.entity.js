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
exports.GridBannerPage = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const empresas_entity_1 = require("./empresas.entity");
const grid_banner_entity_1 = require("./grid_banner.entity");
const page_entity_1 = require("./page.entity");
let GridBannerPage = class GridBannerPage extends sequelize_typescript_1.Model {
};
exports.GridBannerPage = GridBannerPage;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", Object)
], GridBannerPage.prototype, "title", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.TEXT }),
    __metadata("design:type", Object)
], GridBannerPage.prototype, "html", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.BOOLEAN }),
    __metadata("design:type", Boolean)
], GridBannerPage.prototype, "enabled", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => grid_banner_entity_1.GridBanner),
    __metadata("design:type", Object)
], GridBannerPage.prototype, "grid_banner_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => grid_banner_entity_1.GridBanner),
    __metadata("design:type", Object)
], GridBannerPage.prototype, "grid_banner", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => page_entity_1.Page),
    __metadata("design:type", Number)
], GridBannerPage.prototype, "page_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => page_entity_1.Page),
    __metadata("design:type", Object)
], GridBannerPage.prototype, "page", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.INTEGER,
        allowNull: false,
    }),
    __metadata("design:type", Number)
], GridBannerPage.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], GridBannerPage.prototype, "empresa", void 0);
exports.GridBannerPage = GridBannerPage = __decorate([
    sequelize_typescript_1.Table
], GridBannerPage);
