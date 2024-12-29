"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notesSchema = exports.noteResponseSunat = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.noteResponseSunat = (0, valibot_1.object)({
    cdrResponse: (0, valibot_1.object)({ code: (0, valibot_1.number)(), description: (0, valibot_1.string)() }),
    error: (0, valibot_1.nullable)((0, valibot_1.object)({ code: (0, valibot_1.string)(), message: (0, valibot_1.string)() })),
});
exports.notesSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    serie: (0, valibot_1.string)(),
    correlativo: (0, valibot_1.string)(),
    kind_invoice_code: (0, valibot_1.string)(),
    document_code: (0, valibot_1.nullable)((0, valibot_1.string)("Documento no válido")),
    identification_number: (0, valibot_1.nullable)((0, valibot_1.string)("Documento de identidad no válido")),
    razon_social: (0, valibot_1.nullable)((0, valibot_1.string)("Razón social no válido")),
    send_sunat: (0, valibot_1.nullable)((0, valibot_1.boolean)()),
    response_sunat: (0, valibot_1.nullable)(exports.noteResponseSunat),
    xml_path: (0, valibot_1.nullable)((0, valibot_1.string)()),
    cdr_path: (0, valibot_1.nullable)((0, valibot_1.string)()),
    invoice_id: (0, valibot_1.number)(),
    kind_credit_notes_code: (0, valibot_1.nullable)((0, valibot_1.string)()),
    kind_debit_notes_code: (0, valibot_1.nullable)((0, valibot_1.string)()),
    order_id: (0, valibot_1.number)(),
    empresa_id: (0, valibot_1.number)(),
});
