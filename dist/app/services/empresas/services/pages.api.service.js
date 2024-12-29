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
exports.PagesApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const page_entity_1 = require("../entities/page.entity");
const grid_banner_page_entity_1 = require("../entities/grid_banner_page.entity");
const sequelize_1 = require("sequelize");
const grid_banner_entity_1 = require("../entities/grid_banner.entity");
let PagesApiService = class PagesApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield page_entity_1.Page.findAll({
                where: {
                    empresa_id: empresa.id,
                },
                order: [["id", "ASC"]],
            });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            let page = null;
            if (!Number.isNaN(Number(slug))) {
                page = yield page_entity_1.Page.findOne({
                    where: {
                        id: slug,
                        empresa_id: empresa.id,
                    },
                });
            }
            else {
                page = yield page_entity_1.Page.findOne({
                    where: {
                        slug,
                        empresa_id: empresa.id,
                    },
                });
            }
            if (!page) {
                throw new express_core_2.NotFoundException(`No se encontró una página con el ${slug}`);
            }
            const grid_banner_pages = yield page.$get("grid_banner_pages", {
                order: [["id", "ASC"]],
                include: [grid_banner_entity_1.GridBanner],
            });
            page.dataValues.grid_banner_pages = grid_banner_pages;
            return {
                success: true,
                page,
            };
        });
    }
    store(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const page = new page_entity_1.Page(Object.assign(Object.assign({}, body), { empresa_id: empresa.id }));
            yield page.save();
            yield grid_banner_page_entity_1.GridBannerPage.bulkCreate([
                {
                    html: "",
                    enabled: false,
                    empresa_id: empresa.id,
                    grid_banner_id: null,
                    page_id: page.id,
                },
                {
                    html: "",
                    enabled: false,
                    empresa_id: empresa.id,
                    page_id: page.id,
                    grid_banner_id: null,
                },
                {
                    html: "",
                    enabled: false,
                    grid_banner_id: null,
                    page_id: page.id,
                    empresa_id: empresa.id,
                },
                {
                    html: "",
                    grid_banner_id: null,
                    enabled: false,
                    page_id: page.id,
                    empresa_id: empresa.id,
                },
                {
                    html: "",
                    grid_banner_id: null,
                    enabled: false,
                    page_id: page.id,
                    empresa_id: empresa.id,
                },
            ]);
            return {
                success: true,
                page,
            };
        });
    }
    update(empresa, id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = yield this.show(empresa, id);
            const [byName, bySlug] = yield Promise.all([
                page_entity_1.Page.findOne({
                    where: {
                        title: body.title,
                        id: { [sequelize_1.Op.not]: id },
                        empresa_id: empresa.id,
                    },
                    raw: true,
                }),
                page_entity_1.Page.findOne({
                    where: {
                        slug: body.slug,
                        id: { [sequelize_1.Op.not]: id },
                        empresa_id: empresa.id,
                    },
                    raw: true,
                }),
            ]);
            if (byName) {
                throw new express_core_1.BadRequestException(`Ya existe una página ${body.title}`, { body: "title" });
            }
            if (bySlug) {
                throw new express_core_1.BadRequestException(`Ya existe una página ${body.title}`, { body: "title" });
            }
            yield page.update(Object.assign(Object.assign({}, body), { empresa_id: empresa.id }));
            return {
                success: true,
                message: "Editado correctamente gridBannerService",
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page } = yield this.show(empresa, id);
            yield page.destroy();
            return {
                success: true,
                message: "Editado correctamente gridBannerService",
            };
        });
    }
};
exports.PagesApiService = PagesApiService;
exports.PagesApiService = PagesApiService = __decorate([
    (0, express_core_1.Injectable)()
], PagesApiService);
