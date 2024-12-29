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
exports.UrlsService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const urls_entity_1 = require("../entities/urls.entity");
const sequelize_1 = require("sequelize");
let UrlsService = class UrlsService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield urls_entity_1.Urls.findAll({ where: { empresa: empresa.id } });
            return {
                success: true,
                data,
            };
        });
    }
    show(empresa, hash) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = null;
            if (!Number.isNaN(Number(hash))) {
                url = yield urls_entity_1.Urls.findByPk(Number(hash));
            }
            else {
                url = yield urls_entity_1.Urls.findOne({
                    where: {
                        hash,
                        empresa_id: empresa.id,
                    },
                });
            }
            if (!url) {
                throw new express_core_2.NotFoundException(`No se encontró un url con ${hash}`);
            }
            return {
                success: true,
                url,
            };
        });
    }
    store(urlsStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = new urls_entity_1.Urls(urlsStoreDto);
            yield url.save();
            return {
                success: true,
                url,
            };
        });
    }
    update(empresa, id, urlUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url } = yield this.show(empresa, id);
            const [byWeb, byHash] = yield Promise.all([
                urls_entity_1.Urls.findOne({
                    where: {
                        web: urlUpdateDto.web,
                        id: { [sequelize_1.Op.not]: url.id },
                    },
                    raw: true,
                }),
                urls_entity_1.Urls.findOne({
                    where: {
                        hash: urlUpdateDto.hash,
                        id: { [sequelize_1.Op.not]: url.id },
                    },
                    raw: true,
                }),
            ]);
            if (byWeb) {
                throw new express_core_2.BadRequestException(`Este url  con el nombre: ${urlUpdateDto.web} ya existe`, { body: "web" });
            }
            if (byHash) {
                throw new express_core_2.BadRequestException(`Esta url con el hash: ${urlUpdateDto.hash} ya existe`, { body: "hash" });
            }
            yield url.update(urlUpdateDto);
            return {
                success: true,
                url,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url } = yield this.show(empresa, id);
            yield url.destroy();
            return {
                success: true,
                message: "Url eliminado correctamente",
            };
        });
    }
};
exports.UrlsService = UrlsService;
exports.UrlsService = UrlsService = __decorate([
    (0, express_core_1.Injectable)()
], UrlsService);
