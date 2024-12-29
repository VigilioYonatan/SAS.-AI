"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.guidesSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
const invoices_schema_1 = require("./invoices.schema");
exports.guidesSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    serie: (0, valibot_1.string)(),
    correlativo: (0, valibot_1.string)(),
    kind_guide_code: (0, valibot_1.string)(),
    destinatario: (0, valibot_1.object)({
        razon_social: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
        document_code: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
        identification_number: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
    }),
    datos_envio: (0, valibot_1.object)({
        motivo_traslado: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
        modalidad_traslado: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
        fecha_initial_traslado: (0, valibot_1.coerce)((0, valibot_1.date)(), (value) => new Date(value)),
        peso_total: (0, valibot_1.number)([(0, valibot_1.minValue)(0, "Minimo 0")]),
        unidad: (0, valibot_1.string)(),
        dato_transportista: (0, valibot_1.object)({
            razon_social: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
            document_code: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
            identification_number: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
        }),
        punta_partida: (0, valibot_1.object)({
            address: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
            ubigeo: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
        }),
        punta_llegada: (0, valibot_1.object)({
            address: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
            ubigeo: (0, valibot_1.string)([(0, valibot_1.minLength)(1)]),
        }),
    }),
    send_sunat: (0, valibot_1.nullable)((0, valibot_1.boolean)()),
    response_sunat: (0, valibot_1.nullable)(invoices_schema_1.invoiceResponseSunat),
    xml_path: (0, valibot_1.nullable)((0, valibot_1.string)()),
    cdr_path: (0, valibot_1.nullable)((0, valibot_1.string)()),
    order_id: (0, valibot_1.number)(),
    empresa_id: (0, valibot_1.number)(),
});
