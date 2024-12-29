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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const express_core_3 = require("@vigilio/express-core");
const uploads_service_1 = require("../services/uploads.service");
const uploads_store_pipe_1 = require("../pipes/uploads.store.pipe");
const uploads_update_pipe_1 = require("../pipes/uploads.update.pipe");
let UploadsController = class UploadsController {
    constructor(uploadsService) {
        this.uploadsService = uploadsService;
    }
    store(entity, property, req) {
        const result = this.uploadsService.store({
            req,
            property,
            entity,
        });
        return result;
    }
    update(entity, id, property, req) {
        const result = this.uploadsService.update({
            req,
            id,
            property,
            entity,
        });
        return result;
    }
};
exports.UploadsController = UploadsController;
__decorate([
    (0, valibot_1.Pipe)(uploads_store_pipe_1.uploadsStorePipe),
    (0, express_core_2.Upload)(),
    (0, express_core_1.Post)("/:entity/:property"),
    __param(0, (0, express_core_1.Params)("entity")),
    __param(1, (0, express_core_1.Params)("property")),
    __param(2, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "store", null);
__decorate([
    (0, valibot_1.Pipe)(uploads_update_pipe_1.uploadsUpdatePipe),
    (0, express_core_2.Upload)(),
    (0, express_core_1.Post)("/:entity/:property/:id"),
    __param(0, (0, express_core_1.Params)("entity")),
    __param(1, (0, express_core_1.Params)("id")),
    __param(2, (0, express_core_1.Params)("property")),
    __param(3, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", void 0)
], UploadsController.prototype, "update", null);
exports.UploadsController = UploadsController = __decorate([
    (0, express_core_3.Injectable)(),
    (0, express_core_1.Controller)("/uploads"),
    __metadata("design:paramtypes", [uploads_service_1.UploadsService])
], UploadsController);
