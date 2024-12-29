"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
const libs_1 = require("../libs");
exports.ordersSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    order_code: (0, valibot_1.string)(),
    address: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(10), (0, valibot_1.maxLength)(100)])),
    reference: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(10), (0, valibot_1.maxLength)(100)])),
    email: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.email)()])),
    telephone: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.minLength)(6),
        (0, valibot_1.custom)((value) => /^\d+$/.test(value), "Este campo permite solo números."),
    ])),
    total: (0, valibot_1.number)([(0, valibot_1.minValue)(0, "Total no válido.")]),
    description: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(255)])),
    status_order_id: (0, valibot_1.number)(),
    pay_method_id: (0, valibot_1.number)(),
    pasarela_comision: (0, valibot_1.boolean)(),
    mercado_pago_token: (0, valibot_1.nullable)((0, valibot_1.string)()),
    paypal_token: (0, valibot_1.nullable)((0, valibot_1.string)()),
    stripe_token: (0, valibot_1.nullable)((0, valibot_1.string)()),
    paypal_response: (0, valibot_1.nullable)((0, valibot_1.object)({})),
    pasarela_response: (0, valibot_1.nullable)((0, valibot_1.object)({})),
    transferencia_image: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)(libs_1.ordersTransferenciaImage))),
    isDelivery: (0, valibot_1.boolean)(),
    moneyChange: (0, valibot_1.number)(),
    igv: (0, valibot_1.boolean)(),
    is_pasarela_client: (0, valibot_1.boolean)(),
    city_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    map_marker: (0, valibot_1.nullable)((0, valibot_1.object)({ lng: (0, valibot_1.number)(), lat: (0, valibot_1.number)() }, "Coordenadas no válida.")),
    empresa_id: (0, valibot_1.number)(),
    user_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    seller_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    mesa_id: (0, valibot_1.nullable)((0, valibot_1.number)()),
    type_pasarela: (0, valibot_1.nullable)((0, valibot_1.string)()),
    isService: (0, valibot_1.boolean)(),
});
