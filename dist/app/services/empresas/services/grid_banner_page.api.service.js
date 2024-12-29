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
exports.GridBannerPageApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const grid_banner_entity_1 = require("../entities/grid_banner.entity");
const grid_banner_page_entity_1 = require("../entities/grid_banner_page.entity");
let GridBannerPageApiService = class GridBannerPageApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield grid_banner_page_entity_1.GridBannerPage.findAll({
                where: {
                    empresa_id: empresa.id,
                },
                include: [
                    {
                        model: grid_banner_entity_1.GridBanner,
                    },
                ],
                order: [["id", "ASC"]],
            });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const gridBannerService = yield grid_banner_page_entity_1.GridBannerPage.findOne({
                where: {
                    id,
                    empresa_id: empresa.id,
                },
                include: [
                    {
                        model: grid_banner_entity_1.GridBanner,
                    },
                ],
            });
            if (!gridBannerService) {
                throw new express_core_2.NotFoundException(`No se encontró un reclamo con el id ${id}`);
            }
            return {
                success: true,
                gridBannerService,
            };
        });
    }
    update(empresa, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { gridBannerService } = yield this.show(empresa, id);
            yield gridBannerService.update(Object.assign(Object.assign({}, body), { empresa_id: empresa.id }));
            return {
                success: true,
                message: "Editado correctamente gridBannerService",
            };
        });
    }
};
exports.GridBannerPageApiService = GridBannerPageApiService;
exports.GridBannerPageApiService = GridBannerPageApiService = __decorate([
    (0, express_core_1.Injectable)()
], GridBannerPageApiService);
