"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sunatGuideDto = void 0;
const empresas_schema_1 = require("@/empresas/schemas/empresas.schema");
const valibot_1 = require("@vigilio/valibot");
exports.sunatGuideDto = (0, valibot_1.objectAsync)({
    version: (0, valibot_1.string)("Este campo es obligatorio."),
    tipoDoc: (0, valibot_1.string)("Este campo es obligatorio."),
    serie: (0, valibot_1.string)("Este campo es obligatorio."),
    correlativo: (0, valibot_1.string)("Este campo es obligatorio."),
    fechaEmision: (0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value)),
    destinatario: (0, valibot_1.object)({
        tipoDoc: (0, valibot_1.string)(),
        numDoc: (0, valibot_1.string)(),
        rznSocial: (0, valibot_1.string)(),
    }),
    envio: (0, valibot_1.object)({
        codTraslado: (0, valibot_1.string)(),
        modTraslado: (0, valibot_1.string)(),
        fecTraslado: (0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value)),
        pesoTotal: (0, valibot_1.number)(),
        undPesoTotal: (0, valibot_1.string)(),
        llegada: (0, valibot_1.object)({ ubigeo: (0, valibot_1.string)(), direccion: (0, valibot_1.string)() }),
        partida: (0, valibot_1.object)({ ubigeo: (0, valibot_1.string)(), direccion: (0, valibot_1.string)() }),
        transportista: (0, valibot_1.object)({
            tipoDoc: (0, valibot_1.string)(),
            numDoc: (0, valibot_1.string)(),
            rznSocial: (0, valibot_1.string)(),
        }),
    }),
    company: (0, valibot_1.mergeAsync)([
        empresas_schema_1.companySchema,
        (0, valibot_1.object)({
            telephone: (0, valibot_1.string)(),
            logo: (0, valibot_1.string)(),
            certificado: (0, valibot_1.nullable)((0, valibot_1.string)()),
            condicion_pago: (0, valibot_1.string)(),
            vendedor: (0, valibot_1.string)(),
            address: (0, valibot_1.object)({
                ubigeo: (0, valibot_1.string)("Este campo es obligatorio."),
                departamento: (0, valibot_1.string)("Este campo es obligatorio."),
                provincia: (0, valibot_1.string)("Este campo es obligatorio."),
                distrito: (0, valibot_1.string)("Este campo es obligatorio."),
                urbanizacion: (0, valibot_1.string)("Este campo es obligatorio."),
                direccion: (0, valibot_1.string)("Este campo es obligatorio."),
                codLocal: (0, valibot_1.string)("Este campo es obligatorio."),
            }),
        }),
    ]),
    details: (0, valibot_1.array)((0, valibot_1.object)({
        codigo: (0, valibot_1.string)("Este campo es obligatorio."),
        unidad: (0, valibot_1.string)("Este campo es obligatorio."),
        cantidad: (0, valibot_1.number)("Este campo es obligatorio."),
        descripcion: (0, valibot_1.string)("Este campo es obligatorio."),
    })),
});
