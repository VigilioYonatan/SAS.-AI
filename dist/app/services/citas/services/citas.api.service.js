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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitasApiService = void 0;
const express_core_1 = require("@vigilio/express-core");
const express_core_2 = require("@vigilio/express-core");
const empresas_entity_1 = require("@/empresas/entities/empresas.entity");
const citas_entities_1 = require("../entities/citas.entities");
const citas_settings_entity_1 = require("../entities/citas_settings.entity");
const dayjs_1 = __importDefault(require("~/libs/dayjs"));
const sequelize_1 = require("sequelize");
let CitasApiService = class CitasApiService {
    index(empresa) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield citas_entities_1.Citas.findAll({
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
    settingUpdate(empresa, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const citaSetting = yield citas_settings_entity_1.CitasSettings.findOne({
                where: {
                    empresa_id: empresa.id,
                },
            });
            if (!citaSetting)
                throw new express_core_1.BadRequestException("No setting");
            yield citaSetting.update(body);
            return {
                success: true,
                message: "Editado correctamente.",
            };
        });
    }
    show(empresa, slug) {
        return __awaiter(this, void 0, void 0, function* () {
            const cita = yield citas_entities_1.Citas.findOne({
                where: { id: slug, empresa_id: empresa.id },
            });
            if (!cita) {
                throw new express_core_2.NotFoundException(`No se encontró una cita con ${slug}`);
            }
            return {
                success: true,
                cita,
            };
        });
    }
    day(empresa, time) {
        return __awaiter(this, void 0, void 0, function* () {
            const day = (0, dayjs_1.default)(time);
            const startOfDay = day.startOf("day").utc().format();
            const endOfDay = day.endOf("day").utc().format();
            const citas = yield citas_entities_1.Citas.unscoped().findAll({
                where: {
                    empresa_id: empresa.id,
                    date: {
                        [sequelize_1.Op.between]: [startOfDay, endOfDay],
                    },
                },
                raw: true,
            });
            const empresasContacts = yield empresas_entity_1.Empresas.unscoped().findOne({
                where: { slug: empresa.slug },
                attributes: ["id", "contacts"],
            });
            if (!empresasContacts)
                throw new express_core_2.NotFoundException("Error empresas.");
            return {
                success: true,
                citas: citas.map((cita) => {
                    const contact = empresasContacts.contacts.find((contact) => contact.telephone === cita.telephone);
                    return Object.assign(Object.assign({}, cita), { contact });
                }),
            };
        });
    }
    month(empresa, year, month) {
        return __awaiter(this, void 0, void 0, function* () {
            const fecha = (0, dayjs_1.default)(new Date(Number(year), Number(month) - 1));
            const dias = fecha.daysInMonth();
            const cites = yield Promise.all(Array.from({ length: dias }).map((_, i) => __awaiter(this, void 0, void 0, function* () {
                const startOfDay = fecha
                    .date(i + 1)
                    .startOf("day")
                    .utc()
                    .format();
                const endOfDay = fecha
                    .date(i + 1)
                    .endOf("day")
                    .utc()
                    .format();
                const qty = yield citas_entities_1.Citas.unscoped().count({
                    where: {
                        empresa_id: empresa.id,
                        date: {
                            [sequelize_1.Op.between]: [startOfDay, endOfDay],
                        },
                    },
                });
                return [i + 1, qty];
            })));
            const citasCount = cites.reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {});
            return { success: true, citasCount };
        });
    }
    store(empresa, citasStoreDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const cita = new citas_entities_1.Citas(Object.assign(Object.assign({}, citasStoreDto), { telephone: `${empresa.dial_code}${citasStoreDto.telephone}@c.us`, empresa_id: empresa.id }));
            yield cita.save();
            return {
                success: true,
            };
        });
    }
    update(empresa, id, citasUpdateDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cita } = yield this.show(empresa, id);
            yield cita.update(Object.assign(Object.assign({}, citasUpdateDto), { telephone: `${empresa.dial_code}${citasUpdateDto.telephone}@c.us` }));
            return {
                success: true,
                cita,
            };
        });
    }
    destroy(empresa, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const { cita } = yield this.show(empresa, id);
            yield cita.destroy();
            return {
                success: true,
                message: `La cita con el id: ${id} fue eliminado`,
            };
        });
    }
};
exports.CitasApiService = CitasApiService;
exports.CitasApiService = CitasApiService = __decorate([
    (0, express_core_1.Injectable)()
], CitasApiService);
