"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const orders_schema_1 = require("../schemas/orders.schema");
const detail_orders_store_dto_1 = require("./detail_orders.store.dto");
const invoices_store_dto_1 = require("./invoices.store.dto");
exports.ordersStoreDto = (0, valibot_1.mergeAsync)([
    (0, valibot_1.omitAsync)(orders_schema_1.ordersSchema, [
        "id",
        "order_code",
        "igv",
        "pasarela_comision",
        "pasarela_response",
        "paypal_response",
        "paypal_token",
        "moneyChange",
        "is_pasarela_client",
        "empresa_id",
        "type_pasarela",
        "mercado_pago_token",
        "stripe_token",
    ]),
    (0, valibot_1.objectAsync)({
        invoice: (0, valibot_1.nullableAsync)((0, valibot_1.omitAsync)(invoices_store_dto_1.invoicesStoreDto, [
            "cdr_path",
            "serie",
            "xml_path",
            "order_id",
            "correlativo",
            "response_sunat",
            "empresa_id",
        ])),
        details_orders: (0, valibot_1.arrayAsync)((0, valibot_1.omitAsync)(detail_orders_store_dto_1.detailOrdersStoreDto, ["order_id"])),
        fullName: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(30)])),
    }),
    (0, valibot_1.object)({
        password: (0, valibot_1.nullable)((0, valibot_1.string)([
            (0, valibot_1.toTrimmed)(),
            (0, valibot_1.minLength)(1),
            (0, valibot_1.minLength)(6),
            (0, valibot_1.maxLength)(30),
            (0, valibot_1.custom)((val) => /[a-zA-Z]/.test(val), "Deber tener por lo menos una letra."),
            (0, valibot_1.custom)((val) => /\d/.test(val), "Deber tener por lo menos un número."),
        ])),
        repeat_password: (0, valibot_1.nullable)((0, valibot_1.string)([
            (0, valibot_1.toTrimmed)(),
            (0, valibot_1.minLength)(1),
            (0, valibot_1.minLength)(6),
            (0, valibot_1.maxLength)(30),
            (0, valibot_1.custom)((val) => /[a-zA-Z]/.test(val), "Deber tener por lo menos una letra."),
            (0, valibot_1.custom)((val) => /\d/.test(val), "Deber tener por lo menos un número."),
        ])),
    }),
]);
