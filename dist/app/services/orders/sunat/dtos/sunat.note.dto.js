"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sunatNoteDto = void 0;
const empresas_schema_1 = require("@/empresas/schemas/empresas.schema");
const valibot_1 = require("@vigilio/valibot");
exports.sunatNoteDto = (0, valibot_1.objectAsync)({
    ublVersion: (0, valibot_1.string)("Este campo es obligatorio."),
    tipoOperacion: (0, valibot_1.string)("Este campo es obligatorio."),
    tipoDoc: (0, valibot_1.string)("Este campo es obligatorio."),
    serie: (0, valibot_1.string)("Este campo es obligatorio."),
    correlativo: (0, valibot_1.string)("Este campo es obligatorio."),
    tipDocAfectado: (0, valibot_1.string)("Este campo es obligatorio"),
    numDocfectado: (0, valibot_1.string)("Este campo es obligatorio"),
    codMotivo: (0, valibot_1.string)("Este campo es obligatorio"),
    desMotivo: (0, valibot_1.string)("Este campo es obligatorio"),
    fechaEmision: (0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value)),
    formaPago: (0, valibot_1.object)({
        moneda: (0, valibot_1.string)("Este campo es obligatorio."),
        tipo: (0, valibot_1.string)("Este campo es obligatorio."),
    }),
    tipoMoneda: (0, valibot_1.string)("Este campo es obligatorio."),
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
    client: (0, valibot_1.object)({
        tipoDoc: (0, valibot_1.string)("Este campo es obligatorio."),
        numDoc: (0, valibot_1.string)("Este campo es obligatorio."),
        rznSocial: (0, valibot_1.string)("Este campo es obligatorio."),
    }),
    details: (0, valibot_1.array)((0, valibot_1.object)({
        tipAfeIgv: (0, valibot_1.number)("Este campo es obligatorio."),
        codProducto: (0, valibot_1.string)("Este campo es obligatorio."),
        unidad: (0, valibot_1.string)("Este campo es obligatorio."),
        cantidad: (0, valibot_1.number)("Este campo es obligatorio."),
        mtoValorUnitario: (0, valibot_1.number)("Este campo es obligatorio."),
        descripcion: (0, valibot_1.string)("Este campo es obligatorio."),
        mtoBaseIgv: (0, valibot_1.number)("Este campo es obligatorio."),
        porcentajeIgv: (0, valibot_1.number)("Este campo es obligatorio."),
        igv: (0, valibot_1.number)("Este campo es obligatorio."),
        mtoValorVenta: (0, valibot_1.number)("Este campo es obligatorio."),
        totalImpuestos: (0, valibot_1.number)("Este campo es obligatorio."),
        mtoPrecioUnitario: (0, valibot_1.number)("Este campo es obligatorio."),
        factorIcbper: (0, valibot_1.nullable)((0, valibot_1.number)("Este campo es obligatorio.")),
        icbper: (0, valibot_1.nullable)((0, valibot_1.number)("Este campo es obligatorio.")),
    })),
});
