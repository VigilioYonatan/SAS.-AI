"use strict";
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
exports.MONEYDOLARES = exports.MONEYLOCAL = exports.empresaOTROID = exports.otherServicio = exports.backgroundQualities = exports.empresasLogoPWAQualities = exports.empresasLogoQualities = exports.DIALCODE = void 0;
exports.BASE_URL = BASE_URL;
exports.regionsCountry = regionsCountry;
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const regions_entity_1 = require("@/ubigeo/entities/regions.entity");
const countries_entity_1 = require("@/ubigeo/entities/countries.entity");
const regions_empresa_entity_1 = require("@/ubigeo/entities/regions_empresa.entity");
var DIALCODE;
(function (DIALCODE) {
    DIALCODE["mexico"] = "52";
    DIALCODE["peru"] = "51";
    DIALCODE["espa\u00F1a"] = "34";
})(DIALCODE || (exports.DIALCODE = DIALCODE = {}));
function BASE_URL(empresa) {
    var _a, _b, _c;
    return enviroments_config_1.default.NODE_ENV === "production"
        ? ((_a = empresa.setting) === null || _a === void 0 ? void 0 : _a.host.host) &&
            ((_b = empresa.setting) === null || _b === void 0 ? void 0 : _b.host.enabled)
            ? `https://www.${(_c = empresa.setting) === null || _c === void 0 ? void 0 : _c.host.host}`
            : `https://www.${empresa.slug}.vigilio-services.com`
        : `http://www.${empresa.slug}.localhost:4003`;
}
exports.empresasLogoQualities = [100, 300];
exports.empresasLogoPWAQualities = [73, 94, 145, 153, 193, 513];
exports.backgroundQualities = [100, 1600];
exports.otherServicio = [40, 41, 42];
exports.empresaOTROID = {
    1: 40,
    2: 41,
    3: 42,
};
function regionsCountry(empresa) {
    return __awaiter(this, void 0, void 0, function* () {
        const regions = yield regions_entity_1.Regions.findAll({
            include: [
                {
                    model: countries_entity_1.Countries,
                    where: {
                        code: empresa.dial_code,
                    },
                    required: true,
                    attributes: ["code"],
                },
            ],
        });
        const allData = yield Promise.all(regions.map((data) => __awaiter(this, void 0, void 0, function* () {
            const regionsEmpresa = yield regions_empresa_entity_1.RegionsEmpresa.findOne({
                where: {
                    empresa_id: empresa.id,
                    region_id: data.id,
                },
            });
            return Object.assign(Object.assign({}, data.toJSON()), { priceShipping: regionsEmpresa === null || regionsEmpresa === void 0 ? void 0 : regionsEmpresa.priceShipping, enabled: regionsEmpresa === null || regionsEmpresa === void 0 ? void 0 : regionsEmpresa.enabled, days: regionsEmpresa === null || regionsEmpresa === void 0 ? void 0 : regionsEmpresa.days });
        })));
        return allData.map((c) => ({
            name: c.name,
            price: c.priceShipping,
            days: c.days,
            enabled: c.enabled,
        }));
    });
}
exports.MONEYLOCAL = "LOCAL";
exports.MONEYDOLARES = "DOLARES";
