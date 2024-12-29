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
exports.FloorsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const floors_entity_1 = require("../entities/floors.entity");
const express_core_2 = require("@vigilio/express-core");
const sequelize_1 = require("sequelize");
let FloorsApiService = class FloorsApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield floors_entity_1.Floors.findAll({
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
            const floor = yield floors_entity_1.Floors.findOne({
                where: {
                    id,
                    empresa_id: empresa.id,
                },
            });
            if (!floor)
                throw new express_core_2.NotFoundException(`No se encontró piso ${id}`);
            return {
                success: true,
                floor,
            };
        });
    }
    mesas(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { floor } = yield this.show(empresa, id);
            const data = yield floor.$get("mesas");
            return {
                success: true,
                data,
            };
        });
    }
    store(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const floor = new floors_entity_1.Floors(Object.assign(Object.assign({}, body), { empresa_id: empresa.id }));
            yield floor.save();
            return {
                success: true,
                floor,
            };
        });
    }
    update(empresa, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { floor } = yield this.show(empresa, id);
            const [byName] = yield Promise.all([
                floors_entity_1.Floors.findOne({
                    where: {
                        name: body.name,
                        empresa_id: empresa.id,
                        id: { [sequelize_1.Op.not]: id },
                    },
                    raw: true,
                }),
            ]);
            if (byName) {
                throw new express_core_2.BadRequestException(`Ya existe ese nombre para el floor ${body.name}`);
            }
            yield floor.update(body);
            return {
                success: true,
                floor,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { floor } = yield this.show(empresa, id);
            yield floor.destroy();
            return {
                success: true,
                message: `Eliminado floor correctamente ${id}`,
            };
        });
    }
};
exports.FloorsApiService = FloorsApiService;
exports.FloorsApiService = FloorsApiService = __decorate([
    (0, express_core_1.Injectable)()
], FloorsApiService);
