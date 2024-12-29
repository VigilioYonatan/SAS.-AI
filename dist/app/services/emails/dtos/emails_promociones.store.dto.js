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
exports.emailsPromocionesStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const emails_promociones_schema_1 = require("../schemas/emails_promociones.schema");
const emails_entity_1 = require("../entities/emails.entity");
const emails_offers_entity_1 = require("../entities/emails_offers.entity");
exports.emailsPromocionesStoreDto = (0, valibot_1.omitAsync)(emails_promociones_schema_1.emailsPromocionesSchema, ["id"], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [byEmail, byEmail2] = yield Promise.all([
            emails_entity_1.Emails.findOne({
                where: {
                    email: input.email,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
            emails_offers_entity_1.EmailsPromociones.findOne({
                where: {
                    email: input.email,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
        ]);
        if (byEmail || byEmail2) {
            return (0, valibot_1.getPipeIssues)("email", "Ya estas unido a nuestras promociones", input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
