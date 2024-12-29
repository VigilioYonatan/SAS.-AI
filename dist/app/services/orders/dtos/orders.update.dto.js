"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ordersUpdateDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const orders_schema_1 = require("../schemas/orders.schema");
const notes_store_dto_1 = require("./notes.store.dto");
const invoices_store_dto_1 = require("./invoices.store.dto");
const guides_store_dto_1 = require("./guides.store.dto");
exports.ordersUpdateDto = (0, valibot_1.mergeAsync)([
    (0, valibot_1.omitAsync)(orders_schema_1.ordersSchema, [
        "id",
        "order_code",
        "user_id",
        "seller_id",
        "total",
        "igv",
        "pasarela_comision",
        "paypal_token",
        "paypal_response",
        "pasarela_response",
        "moneyChange",
        "is_pasarela_client",
        "mercado_pago_token",
        "empresa_id",
        "map_marker",
        "type_pasarela",
        "stripe_token",
    ]),
    (0, valibot_1.objectAsync)({
        invoice: (0, valibot_1.nullableAsync)((0, valibot_1.omitAsync)(invoices_store_dto_1.invoicesStoreDto, [
            "cdr_path",
            "xml_path",
            "order_id",
            "response_sunat",
            "empresa_id",
        ])),
        note: (0, valibot_1.nullableAsync)((0, valibot_1.omitAsync)(notes_store_dto_1.notesStoreDto, [
            "cdr_path",
            "xml_path",
            "invoice_id",
            "order_id",
            "empresa_id",
            "response_sunat",
        ])),
        guide: (0, valibot_1.nullableAsync)((0, valibot_1.omitAsync)(guides_store_dto_1.guidesStoreDto, [
            "cdr_path",
            "xml_path",
            "order_id",
            "empresa_id",
            "response_sunat",
        ])),
        send_message: (0, valibot_1.boolean)("Este campo es obligatorio."),
    }),
]);
