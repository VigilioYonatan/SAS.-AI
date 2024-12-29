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
exports.NewApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const new_entity_1 = require("../entities/new.entity");
let NewApiService = class NewApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield new_entity_1.New.findAll({
                where: {
                    empresa_id: empresa.id,
                },
            });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const nuevo = yield new_entity_1.New.findOne({
                where: { id, empresa_id: empresa.id },
            });
            if (!nuevo) {
                throw new express_core_2.NotFoundException(`No se encontró un new con el id ${id}`);
            }
            return {
                success: true,
                nuevo,
            };
        });
    }
    store(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const exist = yield new_entity_1.New.count({
                where: { empresa_id: empresa.id },
            });
            if (exist > 0)
                throw new express_core_1.BadRequestException("Ya hay new");
            const nuevo = new new_entity_1.New(Object.assign(Object.assign({}, body), { empresa_id: empresa.id }));
            yield nuevo.save();
            return {
                success: true,
                nuevo,
            };
        });
    }
    update(empresa, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nuevo } = yield this.show(empresa, id);
            yield nuevo.update(body);
            return {
                success: true,
                nuevo,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { nuevo } = yield this.show(empresa, id);
            yield nuevo.destroy();
            return {
                success: true,
                message: "new eliminado",
            };
        });
    }
};
exports.NewApiService = NewApiService;
exports.NewApiService = NewApiService = __decorate([
    (0, express_core_1.Injectable)()
], NewApiService);
