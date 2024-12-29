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
exports.KindDebitNotesApiController = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const kind_debit_notes_api_service_1 = require("../services/kind_debit_notes.api.service");
let KindDebitNotesApiController = class KindDebitNotesApiController {
    constructor(kindDebitNotesApiService) {
        this.kindDebitNotesApiService = kindDebitNotesApiService;
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.kindDebitNotesApiService.index();
            return result;
        });
    }
};
exports.KindDebitNotesApiController = KindDebitNotesApiController;
__decorate([
    (0, express_core_2.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], KindDebitNotesApiController.prototype, "index", null);
exports.KindDebitNotesApiController = KindDebitNotesApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_2.Controller)("/kind_debit_notes"),
    __metadata("design:paramtypes", [kind_debit_notes_api_service_1.KindDebitNotesApiService])
], KindDebitNotesApiController);
