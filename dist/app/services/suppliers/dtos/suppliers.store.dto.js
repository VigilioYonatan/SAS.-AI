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
exports.suppliersStoreDto = void 0;
const valibot_1 = require("@vigilio/valibot");
const suppliers_schema_1 = require("../schemas/suppliers.schema");
const suppliers_entity_1 = require("../entities/suppliers.entity");
exports.suppliersStoreDto = (0, valibot_1.omitAsync)(suppliers_schema_1.suppliersSchema, ["id", "supplier_code"], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [byRuc, byRazonSocial] = yield Promise.all([
            suppliers_entity_1.Suppliers.findOne({
                where: {
                    ruc: input.ruc,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
            suppliers_entity_1.Suppliers.findOne({
                where: {
                    razon_social: input.razon_social,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
        ]);
        if (byRuc) {
            return (0, valibot_1.getPipeIssues)("ruc", `Ya existe un proveedor con el ruc: ${input.ruc}`, input);
        }
        if (byRazonSocial) {
            return (0, valibot_1.getPipeIssues)("razon_social", `Ya existe un proveedor con razon social: ${input.razon_social}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
