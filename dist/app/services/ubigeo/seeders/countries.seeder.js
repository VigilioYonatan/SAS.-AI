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
exports.countriesSeeder = void 0;
exports.ubigeoSeeder = ubigeoSeeder;
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
const countries_entity_1 = require("../entities/countries.entity");
const departments_seeder_1 = require("./peru/departments.seeder");
const districts_seeder_1 = require("./peru/districts.seeder");
const regiones_seeder_1 = require("./chile/regiones.seeder");
const province_seeder_1 = require("./chile/province.seeder");
const communes_seeder_1 = require("./chile/communes.seeder");
const estados_seeder_1 = require("./argentina/estados.seeder");
const localidades_seeder_1 = require("./argentina/localidades.seeder");
const todo_seeder_1 = require("./colombia/todo.seeder");
const estados_seeder_2 = require("./mexico/estados.seeder");
const ciudades_seeder_1 = require("./mexico/ciudades.seeder");
const estados_seeder_3 = require("./brazil/estados.seeder");
const ciudades_seeder_2 = require("./brazil/ciudades.seeder");
const uruguay_seeder_1 = require("./uruguay/uruguay.seeder");
const libs_1 = require("@/empresas/libs");
const comunidades_seeder_1 = require("./espa\u00F1a/comunidades.seeder");
const provincias_seeder_1 = require("./ecuador/provincias.seeder");
const cantones_seeder_1 = require("./ecuador/cantones.seeder");
const parroquias_seeder_1 = require("./ecuador/parroquias.seeder");
exports.countriesSeeder = [
    {
        value: "Perú",
        key: "pe",
        dial_code: "51",
        map_marker: { lat: -12.053221, lng: -77.044861 },
        money: "Sol Peruano",
        simbolo: "PEN",
        international_simbolo: "es-PE",
        image: "https://flagcdn.com/w320/pe.png",
        impuesto: 18,
        bancos: [
            {
                key: "bcp",
                value: "BCP",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/bcp.png`,
            },
            {
                key: "interbank",
                value: "Interbank",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/interbank.png`,
            },
            {
                key: "bbva",
                value: "BBVA",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/bbva.png`,
            },
        ],
    },
    {
        value: "Chile",
        key: "cl",
        dial_code: "56",
        map_marker: { lat: -33.4489, lng: -70.6693 },
        impuesto: 19,
        money: "Peso Chileno",
        simbolo: "CLP",
        image: "https://flagcdn.com/w320/cl.png",
        international_simbolo: "es-CL",
        bancos: [
            {
                key: "banco_de_chile",
                value: "Banco de Chile",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/bancochile.png`,
            },
            {
                key: "banco_santander_chile",
                value: "Banco Santander Chile",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/santander.png`,
            },
            {
                key: "bci",
                value: "BCI",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/bci.png`,
            },
        ],
    },
    {
        value: "Argentina",
        key: "ar",
        dial_code: "54",
        map_marker: { lat: -34.6037, lng: -58.3816 },
        money: "Peso Argentino",
        simbolo: "ARS",
        international_simbolo: "es-AR",
        image: "https://flagcdn.com/w320/ar.png",
        impuesto: 21,
        bancos: [
            {
                key: "banco_nacion",
                value: "Banco Nación",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/banconacion.png`,
            },
            {
                key: "banco_galicia",
                value: "Banco Galicia",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/galicia.png`,
            },
            {
                key: "banco_santander_rio",
                value: "Banco Santander Río",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/santander.png`,
            },
        ],
    },
    {
        value: "Colombia",
        key: "co",
        dial_code: "57",
        map_marker: { lat: 4.611, lng: -74.081 },
        impuesto: 19,
        money: "Peso Colombiano",
        simbolo: "COP",
        international_simbolo: "es-CO",
        image: "https://flagcdn.com/w320/co.png",
        bancos: [
            {
                key: "bancolombia",
                value: "Bancolombia",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/bancolombia.webp`,
            },
            {
                key: "banco_de_bogota",
                value: "Banco de Bogotá",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/bancobogota.webp`,
            },
            {
                key: "davivienda",
                value: "Davivienda",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/davivienda.webp`,
            },
        ],
    },
    {
        value: "México",
        key: "mx",
        dial_code: "52",
        map_marker: { lat: 19.4326, lng: -99.1332 },
        impuesto: 16,
        money: "Peso Mexicano",
        simbolo: "MXN",
        international_simbolo: "es-MX",
        image: "https://flagcdn.com/w320/mx.png",
        bancos: [
            {
                key: "bbva",
                value: "BBVA",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/bbva.png`,
            },
            {
                key: "citibanamex",
                value: "Citibanamex",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/citibanamex.png`,
            },
            {
                key: "banco_santander",
                value: "Santander",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/santander.png`,
            },
        ],
    },
    {
        value: "Brazil",
        key: "br",
        dial_code: "55",
        map_marker: { lat: -15.7801, lng: -47.9292 },
        impuesto: 17,
        money: "Real Brasileño",
        simbolo: "BRL",
        international_simbolo: "pt-BR",
        image: "https://flagcdn.com/w320/br.png",
        bancos: [
            {
                key: "itau",
                value: "Itaú ",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/itau.svg`,
            },
            {
                key: "bradesco",
                value: "Bradesco",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/bradesco.png`,
            },
            {
                key: "santander",
                value: "Santander",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/santander.png`,
            },
        ],
    },
    {
        value: "Uruguay",
        key: "uy",
        dial_code: "598",
        map_marker: { lat: -34.9036, lng: -56.1882 },
        impuesto: 22,
        money: "Peso Uruguayo",
        simbolo: "UYU",
        international_simbolo: "es-UY",
        image: "https://flagcdn.com/w320/uy.png",
        bancos: [
            {
                key: "Banco_republica",
                value: "Banco República",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/brou.png`,
            },
            {
                key: "santander",
                value: "Santander",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/santander.png`,
            },
            {
                key: "bbva",
                value: "BBVA",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/bbva.png`,
            },
        ],
    },
    {
        value: "Ecuador",
        key: "ec",
        dial_code: "593",
        map_marker: { lat: -0.2316, lng: -78.5283 },
        impuesto: 12,
        money: "Dólar Estadounidense",
        simbolo: "USD",
        international_simbolo: "es-EC",
        image: "https://flagcdn.com/w320/ec.png",
        bancos: [
            {
                key: "pichincha",
                value: "Pichincha",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/pichincha.png`,
            },
            {
                key: "banco_del_pacifico",
                value: "Banco del Pacífico",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/bancopacifico.png`,
            },
            {
                key: "produbanco",
                value: "Produbanco",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/produbanco.png`,
            },
        ],
    },
    {
        value: "España",
        key: "es",
        dial_code: "34",
        tz: "Europe/Madrid",
        map_marker: { lat: 40.4168, lng: -3.7038 },
        impuestos: [21, 0],
        impuesto: 21,
        money: "Euro",
        simbolo: "EUR",
        tipo_impuesto: "IVA",
        international_simbolo: "es-ES",
        mercado_pago_comision: {
            comision: 3.4,
            transaccion: 0.35,
            url: "https://www.mercadopago.es/ayuda/que-tarifas-aplican-en-mercado-pago_153",
        },
        pricing: {
            dolar: { mensual: 49, facturacion: 39, telegram: 29, tokens: 4.99 },
            local: { mensual: 49, facturacion: 39, telegram: 29, tokens: 4.99 },
        },
        bancos: [
            {
                key: "bbva",
                value: "BBVA",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/bbva.png`,
            },
            {
                key: "santander",
                value: "Banco Santander",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/santander.png`,
            },
            {
                key: "caixa",
                value: "CaixaBank",
                image: `${enviroments_config_1.default.VITE_VIGILIO_WEB}/images/settings/others/bancos/caixabank.png`,
            },
        ],
    },
];
function ubigeoSeeder() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.all(exports.countriesSeeder.map((c) => __awaiter(this, void 0, void 0, function* () {
            const country = yield countries_entity_1.Countries.create({
                code: c.dial_code,
                name: c.value,
            });
            if (c.dial_code === "51")
                yield Promise.all(departments_seeder_1.departmentsSeeder.map((department) => __awaiter(this, void 0, void 0, function* () {
                    const region = yield country.$create("region", {
                        code: department.ubigeo,
                        name: department.name,
                    });
                    const distritos = districts_seeder_1.districtsSeeder.filter((dist) => dist.department_id === department.ubigeo);
                    yield Promise.all(distritos.map((district) => __awaiter(this, void 0, void 0, function* () {
                        return yield region.$create("city", {
                            code: district.ubigeo,
                            name: district.name,
                        });
                    })));
                })));
            if (c.dial_code === "56") {
                yield Promise.all(regiones_seeder_1.regionesSeederChile.map((re) => __awaiter(this, void 0, void 0, function* () {
                    const region = yield country.$create("region", {
                        code: re.code,
                        name: re.name.short,
                        priceShipping: 0,
                        enabled: true,
                        days: 3,
                    });
                    const communesSeeder = province_seeder_1.provinceSeederChile.filter((pro) => {
                        const findCommunes = communes_seeder_1.communesSeederChile.find((c) => c.province === pro.code && pro.region === re.code);
                        return findCommunes;
                    });
                    yield Promise.all(communesSeeder.map((com) => __awaiter(this, void 0, void 0, function* () {
                        yield region.$create("city", {
                            code: com.code,
                            name: com.name,
                        });
                    })));
                })));
            }
            if (c.dial_code === "54") {
                yield Promise.all(estados_seeder_1.estadosSeeder.map((estado) => __awaiter(this, void 0, void 0, function* () {
                    const region = yield country.$create("region", {
                        code: estado.code,
                        name: estado.name,
                        priceShipping: 0,
                        enabled: true,
                        days: 3,
                    });
                    const localidades = localidades_seeder_1.localidadesArgentinaSeeder.filter((localidad) => localidad.code === estado.code);
                    yield Promise.all(localidades.map((local, i) => __awaiter(this, void 0, void 0, function* () {
                        yield region.$create("city", {
                            code: String(i + 1),
                            name: local.name,
                        });
                    })));
                })));
            }
            if (c.dial_code === "57") {
                yield Promise.all(todo_seeder_1.todoSeederColombia.map((todo) => __awaiter(this, void 0, void 0, function* () {
                    const region = yield country.$create("region", {
                        code: String(todo.id),
                        name: todo.departamento,
                        priceShipping: 0,
                        enabled: true,
                        days: 3,
                    });
                    yield Promise.all(todo.ciudades.map((ciudad, i) => __awaiter(this, void 0, void 0, function* () {
                        yield region.$create("city", {
                            code: `${todo.id}${i}`,
                            name: ciudad,
                        });
                    })));
                })));
            }
            if (c.dial_code === "52") {
                yield Promise.all(estados_seeder_2.estadosSeederMexico.map((estado) => __awaiter(this, void 0, void 0, function* () {
                    const region = yield country.$create("region", {
                        code: String(estado.key),
                        name: estado.name,
                        priceShipping: 0,
                        enabled: true,
                        days: 3,
                    });
                    const citites = ciudades_seeder_1.ciudadesSeederMexico.filter((c) => c.state_id === estado.key);
                    yield Promise.all(citites.map((city) => __awaiter(this, void 0, void 0, function* () {
                        yield region.$create("city", {
                            code: city.key,
                            name: city.name,
                        });
                    })));
                })));
            }
            if (c.dial_code === "55") {
                yield Promise.all(estados_seeder_3.estadosSeederBrasil.map((estado) => __awaiter(this, void 0, void 0, function* () {
                    const region = yield country.$create("region", {
                        code: String(estado.ID),
                        name: estado.Nome,
                        priceShipping: 0,
                        enabled: true,
                        days: 3,
                    });
                    const cities = ciudades_seeder_2.ciudadesSeederBrazil.filter((c) => c.Estado === estado.ID);
                    yield Promise.all(cities.map((city) => __awaiter(this, void 0, void 0, function* () {
                        yield region.$create("city", {
                            code: city.ID,
                            name: city.Nome,
                        });
                    })));
                })));
            }
            if (c.dial_code === "598") {
                yield Promise.all(uruguay_seeder_1.uruguaySeeder.map((uru, i) => __awaiter(this, void 0, void 0, function* () {
                    const region = yield country.$create("region", {
                        code: String(i + 1),
                        name: uru.departamento,
                        priceShipping: 0,
                        enabled: true,
                        days: 3,
                    });
                    yield Promise.all(uru.ciudades.map((city, i) => __awaiter(this, void 0, void 0, function* () {
                        yield region.$create("city", {
                            code: `${i + 1}${i}`,
                            name: city,
                        });
                    })));
                })));
            }
            if (c.dial_code === "593") {
                yield Promise.all(provincias_seeder_1.provinciasSeederEcuador.map((uru) => __awaiter(this, void 0, void 0, function* () {
                    const region = yield country.$create("region", {
                        code: String(uru.id),
                        name: uru.name,
                        priceShipping: 0,
                        enabled: true,
                        days: 3,
                    });
                    const parroquias = cantones_seeder_1.cantonesSeederEcuador.filter((c) => parroquias_seeder_1.parroquiasSeederEcuador.find((p) => p.cantone_id === c.id));
                    yield Promise.all(parroquias.map((parroquia) => __awaiter(this, void 0, void 0, function* () {
                        yield region.$create("city", {
                            code: parroquia.id,
                            name: parroquia.name,
                        });
                    })));
                })));
            }
            if (c.dial_code === libs_1.DIALCODE.españa) {
                yield Promise.all(comunidades_seeder_1.comunidadesEspañaSeeder.map((esp, i) => __awaiter(this, void 0, void 0, function* () {
                    const region = yield country.$create("region", {
                        code: String(i + 1),
                        name: esp.name,
                        priceShipping: 0,
                        enabled: true,
                        days: 3,
                    });
                    yield Promise.all(esp.provincias.map((provincia) => __awaiter(this, void 0, void 0, function* () {
                        yield region.$create("city", {
                            code: provincia.ubigeo,
                            name: provincia.name,
                        });
                    })));
                })));
            }
        })));
    });
}
