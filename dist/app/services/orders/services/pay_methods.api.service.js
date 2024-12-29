"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.PayMethodsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const pay_methods_entity_1 = require("../entities/pay_methods.entity");
const express_core_2 = require("@vigilio/express-core");
let PayMethodsApiService = class PayMethodsApiService {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield pay_methods_entity_1.PayMethods.findAll();
            return {
                success: true,
                data,
            };
        });
    }
    show(id) {
        return __awaiter(this, void 0, void 0, function* () {
            let order = null;
            if (!Number.isNaN(Number(id))) {
                order = yield pay_methods_entity_1.PayMethods.findByPk(id);
            }
            if (!order) {
                throw new express_core_2.NotFoundException(`No se encontró un orden con ${id}`);
            }
            return {
                success: true,
                order,
            };
        });
    }
};
exports.PayMethodsApiService = PayMethodsApiService;
exports.PayMethodsApiService = PayMethodsApiService = __decorate([
    (0, express_core_1.Injectable)()
], PayMethodsApiService);
