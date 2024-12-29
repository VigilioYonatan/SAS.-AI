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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouponsApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const coupons_entity_1 = require("../entities/coupons.entity");
const express_core_2 = require("@vigilio/express-core");
const sequelize_1 = require("sequelize");
const categories_api_service_1 = require("./categories.api.service");
const dayjs_1 = __importDefault(require("dayjs"));
let CouponsApiService = class CouponsApiService {
    constructor(categoriesApiService) {
        this.categoriesApiService = categoriesApiService;
    }
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield coupons_entity_1.Coupons.findAll({
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
    show(empresa, cupon) {
        return __awaiter(this, void 0, void 0, function* () {
            let coupon = null;
            if (!Number.isNaN(Number(cupon))) {
                coupon = yield coupons_entity_1.Coupons.findOne({
                    where: {
                        id: cupon,
                        empresa_id: empresa.id,
                    },
                });
            }
            else {
                coupon = yield coupons_entity_1.Coupons.findOne({
                    where: {
                        coupon: cupon,
                        empresa_id: empresa.id,
                    },
                });
            }
            if (!coupon) {
                throw new express_core_2.NotFoundException(`No se encontró un cupón con ${cupon}`);
            }
            const couponMapped = yield Promise.all(coupon.categories.map((coupon) => __awaiter(this, void 0, void 0, function* () {
                const { category } = yield this.categoriesApiService.show(empresa, String(coupon));
                return {
                    id: category.id,
                    name: category.name,
                };
            })));
            coupon.dataValues.category = couponMapped;
            return {
                success: true,
                coupon,
            };
        });
    }
    store(empresa, couponsStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const date = dayjs_1.default.tz(couponsStoreDto.date, empresa.tz).utc().format();
            const coupon = new coupons_entity_1.Coupons(Object.assign(Object.assign({}, couponsStoreDto), { empresa_id: empresa.id, date }));
            yield coupon.save();
            return {
                success: true,
                coupon,
            };
        });
    }
    update(empresa, id, couponsUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { coupon } = yield this.show(empresa, id);
            const [byCoupon] = yield Promise.all([
                coupons_entity_1.Coupons.findOne({
                    where: {
                        coupon: couponsUpdateDto.coupon,
                        id: { [sequelize_1.Op.not]: id },
                        empresa_id: empresa.id,
                    },
                    raw: true,
                }),
            ]);
            if (byCoupon) {
                throw new express_core_2.BadRequestException(`Ya existe el cúpon: ${couponsUpdateDto.coupon}`, { body: "coupon" });
            }
            const date = dayjs_1.default.tz(couponsUpdateDto.date, empresa.tz).utc().format();
            yield coupon.update(Object.assign(Object.assign({}, couponsUpdateDto), { date }));
            return {
                success: true,
                coupon,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { coupon } = yield this.show(empresa, id);
            yield coupon.destroy();
            return {
                success: true,
                message: `El coupon con el id: ${id} fue eliminado`,
            };
        });
    }
};
exports.CouponsApiService = CouponsApiService;
exports.CouponsApiService = CouponsApiService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [categories_api_service_1.CategoriesApiService])
], CouponsApiService);
