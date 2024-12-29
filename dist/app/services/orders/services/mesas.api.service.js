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
exports.MesasApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const handler_1 = require("@vigilio/express-core/handler");
const mesas_entity_1 = require("../entities/mesas.entity");
const orders_entity_1 = require("../entities/orders.entity");
const status_orders_entity_1 = require("../entities/status_orders.entity");
let MesasApiService = class MesasApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield mesas_entity_1.Mesas.findAll({
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
    orders(empresa, floor_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield mesas_entity_1.Mesas.findAll({
                include: [
                    {
                        model: orders_entity_1.Orders,
                        include: [
                            {
                                model: status_orders_entity_1.StatusOrders,
                                where: {
                                    id: [1, 2],
                                },
                            },
                        ],
                        attributes: [
                            "id",
                            "order_code",
                            "status_order_id",
                        ],
                    },
                ],
                order: [["createdAt", "ASC"]],
                where: {
                    floor_id,
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
            let mesa = null;
            if (!Number.isNaN(Number(id))) {
                mesa = yield mesas_entity_1.Mesas.findOne({
                    where: { id, empresa_id: empresa.id },
                });
            }
            if (!mesa) {
                throw new handler_1.NotFoundException(`No se encontró una mesa con ${id}`);
            }
            return {
                success: true,
                mesa,
            };
        });
    }
    store(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const mesa = new mesas_entity_1.Mesas(Object.assign(Object.assign({}, body), { empresa_id: empresa.id }));
            const latestUser = yield mesas_entity_1.Mesas.findOne({
                order: [["id", "DESC"]],
                where: { floor_id: body.floor_id, empresa_id: empresa.id },
            });
            let code = null;
            if (latestUser) {
                const ultimoNumero = Number.parseInt(latestUser.mesa_code.split("-")[1]);
                code = `MESA-${String(ultimoNumero + 1).padStart(6, "0")}`;
            }
            else {
                code = "MESA-000001";
            }
            mesa.mesa_code = code;
            yield mesa.save();
            return {
                success: true,
                mesa,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mesa } = yield this.show(empresa, id);
            yield mesa.destroy();
            return {
                success: true,
                message: `La mesa con el id: ${id} fue eliminado`,
            };
        });
    }
};
exports.MesasApiService = MesasApiService;
exports.MesasApiService = MesasApiService = __decorate([
    (0, express_core_1.Injectable)()
], MesasApiService);
