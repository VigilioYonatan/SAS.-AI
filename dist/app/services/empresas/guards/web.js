"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebTechnologies = getWebTechnologies;
exports.getTechnologies = getTechnologies;
const enviroments_config_1 = __importDefault(require("~/config/enviroments.config"));
function getWebTechnologies() {
    return {
        technologies: [
            {
                id: 1,
                enabled: true,
                tokens: null,
                features: {
                    clientes_registrados: 100,
                    trabajadores_cantidad: 100,
                    products_total: 100,
                },
            },
            {
                id: 2,
                date: "3025-07-07T00:00:00.000Z",
                enabled: true,
                tokens: null,
            },
            {
                id: 3,
                date: "3025-08-20T00:00:00.000Z",
                enabled: true,
                tokens: null,
            },
            {
                id: 4,
                date: "3025-08-30T00:00:00.000Z",
                enabled: true,
                tokens: 10000000,
            },
            { id: 5, enabled: true },
            { id: 6, enabled: true },
            { id: 7, enabled: true },
        ],
    };
}
function getTechnologies(req) {
    let technologies = null;
    if (enviroments_config_1.default.NODE_ENV !== "production") {
        technologies = getWebTechnologies();
    }
    else {
        technologies = req.$web;
    }
    return technologies;
}
