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
exports.DetailOrdersApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const detail_orders_entity_1 = require("../entities/detail_orders.entity");
let DetailOrdersApiService = class DetailOrdersApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield detail_orders_entity_1.DetailOrders.findAll({
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
            let detailOrder = null;
            if (!Number.isNaN(Number(id))) {
                detailOrder = yield detail_orders_entity_1.DetailOrders.findOne({
                    where: {
                        empresa_id: empresa.id,
                        id,
                    },
                });
            }
            if (!detailOrder) {
                throw new express_core_2.NotFoundException(`No se encontró un orden con ${id}`);
            }
            return {
                success: true,
                detailOrder,
            };
        });
    }
    store(empresa, detailOrdersStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const detailOrder = new detail_orders_entity_1.DetailOrders(Object.assign(Object.assign({}, detailOrdersStoreDto), { empresa_id: empresa.id }));
            yield detailOrder.save();
            return {
                success: true,
                detailOrder,
            };
        });
    }
    update(empresa, id, detailOrdersUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { detailOrder } = yield this.show(empresa, id);
            yield detailOrder.update(detailOrdersUpdateDto);
            return {
                success: true,
                detailOrder,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { detailOrder } = yield this.show(empresa, id);
            yield detailOrder.destroy();
            return {
                success: true,
                message: `El orden con el id: ${id} fue eliminado`,
            };
        });
    }
};
exports.DetailOrdersApiService = DetailOrdersApiService;
exports.DetailOrdersApiService = DetailOrdersApiService = __decorate([
    (0, express_core_1.Injectable)()
], DetailOrdersApiService);
