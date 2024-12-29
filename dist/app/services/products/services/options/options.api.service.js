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
exports.OptionsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const options_entity_1 = require("@/products/entities/options/options.entity");
let OptionsApiService = class OptionsApiService {
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield options_entity_1.Options.findAll({ order: [["id", "ASC"]] });
            return {
                success: true,
                data,
            };
        });
    }
    features(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.index();
            const features = yield Promise.all(data.map((option) => __awaiter(this, void 0, void 0, function* () {
                let features = (yield option.$get("features"));
                if (option.name === "Calzado") {
                    if (empresa.dial_code === "52") {
                        features = features.filter((f) => f.description.endsWith("MX"));
                    }
                    if (empresa.dial_code === "55")
                        features = features.filter((f) => f.description.endsWith("BR"));
                    if (!["52", "55"].includes(empresa.dial_code)) {
                        features = features.filter((f) => !f.description.endsWith("BR") &&
                            !f.description.endsWith("MX"));
                    }
                }
                return Object.assign(Object.assign({}, option.toJSON()), { features });
            })));
            return {
                success: true,
                data: features,
            };
        });
    }
};
exports.OptionsApiService = OptionsApiService;
exports.OptionsApiService = OptionsApiService = __decorate([
    (0, express_core_1.Injectable)()
], OptionsApiService);
