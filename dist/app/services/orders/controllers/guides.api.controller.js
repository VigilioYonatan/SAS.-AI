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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuidesApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const guides_api_service_1 = require("../services/guides.api.service");
let GuidesApiController = class GuidesApiController {
    constructor(guidesApiService) {
        this.guidesApiService = guidesApiService;
    }
    latestCorrelativo(empresa, kind_guide_code) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.guidesApiService.latestCorrelativo(empresa, kind_guide_code);
            return result;
        });
    }
    show(empresa, serie_correlative) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.guidesApiService.show(empresa, serie_correlative);
            return result;
        });
    }
};
exports.GuidesApiController = GuidesApiController;
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ kind_guide_code: (0, valibot_2.string)("Este campo es obligatorio") })),
    (0, express_core_2.Get)("/latest_correlativo/:kind_guide_code"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_2.Params)("kind_guide_code")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String]),
    __metadata("design:returntype", Promise)
], GuidesApiController.prototype, "latestCorrelativo", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        serie_correlative: (0, valibot_2.string)("Este campo es obligatorio"),
    })),
    (0, express_core_2.Get)("/:serie_correlative"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_2.Params)("serie_correlative")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String]),
    __metadata("design:returntype", Promise)
], GuidesApiController.prototype, "show", null);
exports.GuidesApiController = GuidesApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/guides"),
    __metadata("design:paramtypes", [guides_api_service_1.GuidesApiService])
], GuidesApiController);
