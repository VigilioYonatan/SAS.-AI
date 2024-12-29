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
exports.NotesApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const notes_api_service_1 = require("../services/notes.api.service");
let NotesApiController = class NotesApiController {
    constructor(notesApiService) {
        this.notesApiService = notesApiService;
    }
    latestCorrelativo(kind_invoice_code, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.notesApiService.latestCorrelativo(empresa, kind_invoice_code);
            return result;
        });
    }
    show(serie_correlative, empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.notesApiService.show(empresa, serie_correlative);
            return result;
        });
    }
};
exports.NotesApiController = NotesApiController;
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({ kind_invoice_code: (0, valibot_2.string)("Este campo es obligatorio") })),
    (0, express_core_2.Get)("/latest_correlativo/:kind_invoice_code"),
    __param(0, (0, express_core_2.Params)("kind_invoice_code")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], NotesApiController.prototype, "latestCorrelativo", null);
__decorate([
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        serie_correlative: (0, valibot_2.string)("Este campo es obligatorio"),
    })),
    (0, express_core_2.Get)("/:serie_correlative"),
    __param(0, (0, express_core_2.Params)("serie_correlative")),
    __param(1, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", Promise)
], NotesApiController.prototype, "show", null);
exports.NotesApiController = NotesApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/notes"),
    __metadata("design:paramtypes", [notes_api_service_1.NotesApiService])
], NotesApiController);
