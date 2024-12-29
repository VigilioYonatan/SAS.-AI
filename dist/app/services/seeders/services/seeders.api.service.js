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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedersApiService = void 0;
const pay_methods_entity_1 = require("@/orders/entities/pay_methods.entity");
const status_orders_entity_1 = require("@/orders/entities/status_orders.entity");
const pay_methods_seeder_1 = require("@/orders/seeders/pay_methods.seeder");
const status_orders_seeder_1 = require("@/orders/seeders/status_orders.seeder");
const express_core_1 = require("@vigilio/express-core");
const db_config_1 = require("~/config/db.config");
const kind_invoice_entity_1 = require("@/orders/entities/kind_invoice.entity");
const kind_invoice_seeder_1 = require("@/orders/seeders/kind_invoice.seeder");
const documents_seeder_1 = require("@/orders/seeders/documents.seeder");
const documents_entity_1 = require("@/orders/entities/documents.entity");
const kind_credit_notes_entity_1 = require("@/orders/entities/kind_credit_notes.entity");
const kind_debit_notes_entity_1 = require("@/orders/entities/kind_debit_notes.entity");
const kind_credit_notes_seeder_1 = require("@/orders/seeders/kind_credit_notes.seeder");
const kind_debit_notes_seeder_1 = require("@/orders/seeders/kind_debit_notes.seeder");
const options_entity_1 = require("@/products/entities/options/options.entity");
const options_seeder_1 = require("@/products/seeders/options.seeder");
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const tipo_servicio_entity_1 = require("@/empresas/entities/tipo_servicio.entity");
const tipo_empresa_seeder_1 = require("@/empresas/seeders/tipo_empresa.seeder");
const countries_seeder_1 = require("@/ubigeo/seeders/countries.seeder");
const information_entity_1 = require("@/empresas/entities/information.entity");
const empresas_seeder_1 = require("@/empresas/seeders/empresas.seeder");
const empresas_api_service_1 = require("@/empresas/services/empresas.api.service");
const address_entity_1 = require("@/empresas/entities/address.entity");
const address_seeder_1 = require("@/empresas/seeders/address.seeder");
const users_entity_1 = require("@/users/entities/users.entity");
const users_seeder_1 = require("@/users/seeders/users.seeder");
const test_1 = require("../test");
let SeedersApiService = class SeedersApiService {
    constructor(empresasApiService) {
        this.empresasApiService = empresasApiService;
    }
    index() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (enviroments_config_1.default.NODE_ENV !== "production") {
                    yield db_config_1.sequelize.sync({ force: true });
                }
                yield Promise.all([
                    information_entity_1.Information.create({ token: enviroments_config_1.default.VITE_VIGILIO_TOKEN }),
                    status_orders_entity_1.StatusOrders.bulkCreate(status_orders_seeder_1.statusOrdersSeeder),
                    pay_methods_entity_1.PayMethods.bulkCreate(pay_methods_seeder_1.payMethodsSeeder),
                    documents_entity_1.Documents.bulkCreate(documents_seeder_1.documentsSeeder),
                    kind_credit_notes_entity_1.KindCreditNotes.bulkCreate(kind_credit_notes_seeder_1.kindCreditNotesSeeder),
                    kind_debit_notes_entity_1.KindDebitNotes.bulkCreate(kind_debit_notes_seeder_1.kindDebitNotesSeeder),
                ]);
                yield Promise.all([kind_invoice_entity_1.KindInvoice.bulkCreate(kind_invoice_seeder_1.kindInvoiceSeeder)]);
                yield Promise.all(tipo_empresa_seeder_1.servicios.map((servicio) => __awaiter(this, void 0, void 0, function* () {
                    const { tipo, empresas, id } = servicio;
                    const service = yield tipo_servicio_entity_1.TipoServicio.create({ id, tipo });
                    yield Promise.all(empresas.map((empresa) => __awaiter(this, void 0, void 0, function* () {
                        yield service.$create("tipo_empresa", empresa);
                    })));
                })));
                yield (0, countries_seeder_1.ubigeoSeeder)();
                yield Promise.all(options_seeder_1.optionsSeeder.map((prod) => __awaiter(this, void 0, void 0, function* () {
                    const { features } = prod, rest = __rest(prod, ["features"]);
                    const option = yield options_entity_1.Options.create(rest);
                    yield Promise.all(features.map((feature) => __awaiter(this, void 0, void 0, function* () {
                        yield option.$create("feature", {
                            id: feature.id,
                            value: feature.value,
                            description: feature.description,
                        });
                    })));
                })));
                if (enviroments_config_1.default.NODE_ENV === "development") {
                    const empresa = yield (0, empresas_seeder_1.empresasSeeder2)();
                    yield this.empresasApiService.store(Object.assign(Object.assign(Object.assign({}, empresa), { fullname: "Yonatan Vigilio", password: "123456a", servicio_id: 2 }), test_1.test));
                    yield Promise.all([address_entity_1.Address.bulkCreate(address_seeder_1.addressSeeder)]);
                    yield Promise.all([users_entity_1.Users.bulkCreate(users_seeder_1.usersSeeder)]);
                }
                return { success: true, message: "Seed executed" };
            }
            catch (error) {
                console.log(error.message);
                return {
                    success: false,
                    message: JSON.stringify(error.message),
                };
            }
        });
    }
};
exports.SeedersApiService = SeedersApiService;
exports.SeedersApiService = SeedersApiService = __decorate([
    (0, express_core_1.Injectable)(),
    __metadata("design:paramtypes", [empresas_api_service_1.EmpresasApiService])
], SeedersApiService);
