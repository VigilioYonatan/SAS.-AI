"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.metodosPagoSchema = void 0;
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
const valibot_1 = require("@vigilio/valibot");
exports.metodosPagoSchema = (0, valibot_1.object)({
    enable_efectivo: (0, valibot_1.boolean)(),
    paypal: (0, valibot_1.object)({
        enabled: (0, valibot_1.boolean)(),
        paypal_client_id: (0, valibot_1.nullable)((0, valibot_1.string)()),
        paypal_secret_key: (0, valibot_1.nullable)((0, valibot_1.string)()),
    }),
    mercado_pago: (0, valibot_1.object)({
        token: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.maxLength)(200)])),
        enabled: (0, valibot_1.boolean)(),
    }),
    qrYape: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)([500]))),
    qrPlin: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)([500]))),
    transferencias: (0, valibot_1.nullable)((0, valibot_1.record)((0, valibot_1.string)(), (0, valibot_1.nullable)((0, valibot_1.record)((0, valibot_1.string)(), (0, valibot_1.nullable)((0, valibot_1.string)()))))),
    izipay: (0, valibot_1.nullable)((0, valibot_1.object)({
        izipay_public_key: (0, valibot_1.nullable)((0, valibot_1.string)()),
        izipay_client_id: (0, valibot_1.nullable)((0, valibot_1.string)()),
        izipay_client_secret: (0, valibot_1.nullable)((0, valibot_1.string)()),
        izipay_hash_key: (0, valibot_1.nullable)((0, valibot_1.string)()),
        enabled: (0, valibot_1.boolean)(),
    })),
    stripe: (0, valibot_1.nullable)((0, valibot_1.object)({
        stripe_secret_key: (0, valibot_1.nullable)((0, valibot_1.string)()),
        stripe_client_secret: (0, valibot_1.nullable)((0, valibot_1.string)()),
        enabled: (0, valibot_1.boolean)(),
    })),
    empresa_id: (0, valibot_1.number)(),
});
