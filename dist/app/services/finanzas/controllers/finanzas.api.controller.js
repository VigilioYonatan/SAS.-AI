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
exports.FinanzasApiController = void 0;
const permission_admin_guard_1 = require("@/auth/guards/permission-admin.guard");
const express_core_1 = require("@vigilio/express-core");
const valibot_1 = require("@vigilio/express-core/valibot");
const valibot_2 = require("@vigilio/valibot");
const finanzas_api_service_1 = require("../services/finanzas.api.service");
const finanzas_store_dto_1 = require("../dtos/finanzas.store.dto");
const finanzas_entity_1 = require("../entities/finanzas.entity");
const sequelize_1 = require("sequelize");
const categories_entity_1 = require("../entities/categories.entity");
let FinanzasApiController = class FinanzasApiController {
    constructor(finanzasApiService) {
        this.finanzasApiService = finanzasApiService;
    }
    month(empresa, month, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = {
                month: month || new Date().getMonth(),
                year: year || new Date().getFullYear(),
            };
            const startDate = new Date(Number(date.year), Number(date.month) - 1, 1);
            const endDate = new Date(Number(date.year), Number(date.month), 0);
            const where = {
                createdAt: {
                    [sequelize_1.Op.between]: [startDate, endDate],
                },
                empresa_id: empresa.id,
            };
            const [ingresos, egresos, categoriesIngresos, resume_ingresos, categoriesEgresos, resume_egresos,] = yield Promise.all([
                finanzas_entity_1.Finanzas.unscoped().findAll({
                    where: Object.assign({ tipo_finanza_id: 1 }, where),
                    attributes: ["monto", "presupuesto"],
                }),
                finanzas_entity_1.Finanzas.unscoped().findAll({
                    where: Object.assign({ tipo_finanza_id: 2 }, where),
                    attributes: ["monto", "presupuesto"],
                }),
                categories_entity_1.CategoriesFinanzas.findAll({
                    where: {
                        tipo_finanza_id: 1,
                        empresa_id: empresa.id,
                    },
                    raw: true,
                }),
                finanzas_entity_1.Finanzas.unscoped().findAll({
                    attributes: [
                        "category_finanza_id",
                        [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("monto")), "total_monto"],
                        [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("presupuesto")), "total_presupuesto"],
                    ],
                    group: ["category_finanza_id"],
                    where: Object.assign({ tipo_finanza_id: 1 }, where),
                    raw: true,
                }),
                categories_entity_1.CategoriesFinanzas.unscoped().findAll({
                    where: {
                        tipo_finanza_id: 2,
                        empresa_id: empresa.id,
                    },
                    raw: true,
                }),
                finanzas_entity_1.Finanzas.unscoped().findAll({
                    attributes: [
                        "category_finanza_id",
                        [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("monto")), "total_monto"],
                        [(0, sequelize_1.fn)("SUM", (0, sequelize_1.col)("presupuesto")), "total_presupuesto"],
                    ],
                    group: ["category_finanza_id"],
                    where: Object.assign({ tipo_finanza_id: 2 }, where),
                    raw: true,
                }),
            ]);
            const ingresosTotales = ingresos.reduce((a, b) => a + b.monto, 0);
            const egresosTotales = egresos.reduce((a, b) => a + b.monto, 0);
            const presupuestoIngresos = ingresos.reduce((a, b) => a + b.presupuesto, 0);
            const presupuestoEgresos = egresos.reduce((a, b) => a + b.presupuesto, 0);
            const saldo = ingresosTotales - egresosTotales;
            const resumeIngresos = categoriesIngresos.map((category) => {
                const existCategory = resume_ingresos.find((ingreso) => ingreso.category_finanza_id === category.id);
                if (existCategory) {
                    return {
                        id: category.id,
                        name: category.value,
                        presupuesto: Number(existCategory.total_presupuesto),
                        monto: Number(existCategory.total_monto),
                    };
                }
                return {
                    id: category.id,
                    name: category.value,
                    presupuesto: 0,
                    monto: 0,
                };
            });
            const resumeEgresos = categoriesEgresos.map((category) => {
                const existCategory = resume_egresos.find((egreso) => egreso.category_finanza_id === category.id);
                if (existCategory) {
                    return {
                        id: category.id,
                        name: category.value,
                        presupuesto: Number(existCategory.total_presupuesto),
                        monto: Number(existCategory.total_monto),
                    };
                }
                return {
                    id: category.id,
                    name: category.value,
                    presupuesto: 0,
                    monto: 0,
                };
            });
            return {
                success: true,
                data: {
                    ingresosTotales,
                    egresosTotales,
                    resumeIngresos,
                    presupuestoIngresos,
                    saldo,
                    resumeEgresos,
                    presupuestoEgresos,
                },
            };
        });
    }
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.finanzasApiService.index(empresa);
            return result;
        });
    }
    tipos(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.finanzasApiService.tipos(empresa);
            return result;
        });
    }
    store(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.finanzasApiService.store(empresa, body);
            return result;
        });
    }
    update(empresa, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.finanzasApiService.update(empresa, id, body);
            return result;
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.finanzasApiService.destroy(empresa, id);
            return result;
        });
    }
};
exports.FinanzasApiController = FinanzasApiController;
__decorate([
    (0, express_core_1.Get)("/all"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Query)("month")),
    __param(2, (0, express_core_1.Query)("year")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, String]),
    __metadata("design:returntype", Promise)
], FinanzasApiController.prototype, "month", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Get)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], FinanzasApiController.prototype, "index", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, express_core_1.Get)("/tipos"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", Promise)
], FinanzasApiController.prototype, "tipos", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(finanzas_store_dto_1.finanzasStoreDto),
    (0, express_core_1.Post)("/"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, Object]),
    __metadata("design:returntype", Promise)
], FinanzasApiController.prototype, "store", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Validator)(finanzas_store_dto_1.finanzasStoreDto),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Put)("/:id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("id")),
    __param(2, (0, express_core_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String, Object]),
    __metadata("design:returntype", Promise)
], FinanzasApiController.prototype, "update", null);
__decorate([
    (0, permission_admin_guard_1.PermissionAdmin)(),
    (0, valibot_1.Pipe)((0, valibot_2.objectAsync)({
        id: (0, valibot_2.string)(),
    })),
    (0, express_core_1.Delete)("/:id"),
    __param(0, (0, express_core_1.Req)("empresa")),
    __param(1, (0, express_core_1.Params)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function, String]),
    __metadata("design:returntype", Promise)
], FinanzasApiController.prototype, "destroy", null);
exports.FinanzasApiController = FinanzasApiController = __decorate([
    (0, express_core_1.Injectable)(),
    (0, express_core_1.Controller)("/finanzas"),
    __metadata("design:paramtypes", [finanzas_api_service_1.FinanzasApiService])
], FinanzasApiController);
