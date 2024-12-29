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
exports.RedesChat = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const empresas_entity_1 = require("./empresas.entity");
let RedesChat = class RedesChat extends sequelize_typescript_1.Model {
};
exports.RedesChat = RedesChat;
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Array)
], RedesChat.prototype, "whatsapp_chat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Array)
], RedesChat.prototype, "tiktok_chat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Array)
], RedesChat.prototype, "linkedin_chat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Array)
], RedesChat.prototype, "messenger_chat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Array)
], RedesChat.prototype, "instagram_chat", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.JSON }),
    __metadata("design:type", Array)
], RedesChat.prototype, "telegram_chat", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => empresas_entity_1.Empresas),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], RedesChat.prototype, "empresa_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => empresas_entity_1.Empresas),
    __metadata("design:type", Object)
], RedesChat.prototype, "empresa", void 0);
exports.RedesChat = RedesChat = __decorate([
    sequelize_typescript_1.Table
], RedesChat);
