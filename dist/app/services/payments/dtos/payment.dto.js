"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentDto = void 0;
const credit_card_schema_1 = require("../schemas/credit-card.schema");
const yape_schema_1 = require("../schemas/yape.schema");
const orders_store_dto_1 = require("@/orders/dtos/orders.store.dto");
const valibot_1 = require("@vigilio/valibot");
exports.paymentDto = (0, valibot_1.mergeAsync)([
    orders_store_dto_1.ordersStoreDto,
    (0, valibot_1.object)({
        creditCard: (0, valibot_1.nullable)(credit_card_schema_1.creditCardSchema),
        yape: (0, valibot_1.nullable)(yape_schema_1.yapeSchema),
    }),
]);
