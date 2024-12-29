"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponsStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const coupons_schema_1 = require("../schemas/coupons.schema");
const coupons_entity_1 = require("../entities/coupons.entity");
exports.couponsStoreDto = (0, valibot_1.omitAsync)(coupons_schema_1.couponsSchema, ["id"], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [byCoupon] = yield Promise.all([
            coupons_entity_1.Coupons.findOne({
                where: {
                    coupon: input.coupon,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
        ]);
        if (byCoupon) {
            return (0, valibot_1.getPipeIssues)("coupon", `Ya existe el cupon con el nombre: ${input.coupon}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
