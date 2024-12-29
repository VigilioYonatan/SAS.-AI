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
exports.UbigeoApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const regions_entity_1 = require("../entities/regions.entity");
const cities_entity_1 = require("../entities/cities.entity");
const regions_empresa_entity_1 = require("../entities/regions_empresa.entity");
const countries_entity_1 = require("../entities/countries.entity");
let UbigeoApiService = class UbigeoApiService {
    regions(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield regions_entity_1.Regions.findAll({
                include: [
                    {
                        model: countries_entity_1.Countries,
                        where: {
                            code: empresa.dial_code,
                        },
                        required: true,
                    },
                ],
            });
            return {
                success: true,
                data,
            };
        });
    }
    regionsShow(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield regions_entity_1.Regions.findOne({
                include: [
                    {
                        model: countries_entity_1.Countries,
                        where: {
                            code: empresa.dial_code,
                        },
                        required: true,
                    },
                ],
                where: { id },
            });
            if (!data)
                throw new express_core_1.NotFoundException("No se encontró region.");
            const regionEmpresa = yield regions_empresa_entity_1.RegionsEmpresa.findOne({
                where: {
                    empresa_id: empresa.id,
                    region_id: data.id,
                },
            });
            data.dataValues.days = regionEmpresa === null || regionEmpresa === void 0 ? void 0 : regionEmpresa.days;
            data.dataValues.enabled = regionEmpresa === null || regionEmpresa === void 0 ? void 0 : regionEmpresa.enabled;
            data.dataValues.priceShipping = regionEmpresa === null || regionEmpresa === void 0 ? void 0 : regionEmpresa.priceShipping;
            return {
                success: true,
                data,
            };
        });
    }
    regionsUpdate(empresa, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.regionsShow(empresa, id);
            yield regions_empresa_entity_1.RegionsEmpresa.update({
                priceShipping: body.priceShipping,
                enabled: body.enabled,
                days: body.days,
            }, {
                where: {
                    region_id: data.id,
                    empresa_id: empresa.id,
                },
            });
            return {
                success: true,
                message: "Se actualizó región correctamente.",
            };
        });
    }
    cities(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield cities_entity_1.Cities.findAll({
                include: [
                    {
                        model: regions_entity_1.Regions,
                        required: true,
                        include: [
                            {
                                model: countries_entity_1.Countries,
                                where: {
                                    code: empresa.dial_code,
                                },
                                required: true,
                            },
                        ],
                    },
                ],
            });
            return {
                success: true,
                data,
            };
        });
    }
    citiesShow(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield cities_entity_1.Cities.findOne({
                where: { id },
                include: [
                    {
                        model: regions_entity_1.Regions,
                        include: [
                            {
                                model: countries_entity_1.Countries,
                                where: {
                                    code: empresa.dial_code,
                                },
                                required: true,
                            },
                        ],
                        required: true,
                    },
                ],
            });
            if (!data)
                throw new express_core_1.NotFoundException(`No se encontró ciudad ${id}`);
            const regionEmpresa = yield regions_empresa_entity_1.RegionsEmpresa.findOne({
                where: {
                    empresa_id: empresa.id,
                    region_id: data.region_id,
                },
            });
            data.dataValues.days = regionEmpresa === null || regionEmpresa === void 0 ? void 0 : regionEmpresa.days;
            data.dataValues.enabled = regionEmpresa === null || regionEmpresa === void 0 ? void 0 : regionEmpresa.enabled;
            data.dataValues.priceShipping = regionEmpresa === null || regionEmpresa === void 0 ? void 0 : regionEmpresa.priceShipping;
            return {
                success: true,
                data,
            };
        });
    }
};
exports.UbigeoApiService = UbigeoApiService;
exports.UbigeoApiService = UbigeoApiService = __decorate([
    (0, express_core_1.Injectable)()
], UbigeoApiService);
