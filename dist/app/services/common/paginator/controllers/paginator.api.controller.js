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
exports.PaginatorApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const libs_1 = require("../libs");
const paginator_api_service_1 = require("../services/paginator.api.service");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
let PaginatorApiController = class PaginatorApiController {
    constructor(paginatorApiServices) {
        this.paginatorApiServices = paginatorApiServices;
    }
    index(model, query, req) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.paginatorApiServices.index({
                model,
                query,
                req,
            });
            return result;
        });
    }
};
exports.PaginatorApiController = PaginatorApiController;
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        model: (0, valibot_2.string)([
            (0, valibot_2.custom)((val) => libs_1.paginatorModel.includes(val), "Modelo no válido"),
        ]),
    })),
    (0, express_core_1.Get)("/:model"),
    __param(0, (0, express_core_1.Params)("model")),
    __param(1, (0, express_core_1.Query)()),
    __param(2, (0, express_core_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], PaginatorApiController.prototype, "index", null);
exports.PaginatorApiController = PaginatorApiController = __decorate([
    (0, express_core_1.Controller)("/paginator"),
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [paginator_api_service_1.PaginatorApiServices])
], PaginatorApiController);
