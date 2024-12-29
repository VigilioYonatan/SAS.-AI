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
exports.mesasStoreDto = void 0;
const valibot_1 = require("valibot");
const mesas_schema_1 = require("../schemas/mesas.schema");
const floors_entity_1 = require("../entities/floors.entity");
exports.mesasStoreDto = (0, valibot_1.omitAsync)(mesas_schema_1.mesasSchema, ["id", "mesa_code", "empresa_id"], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [byFloor] = yield Promise.all([floors_entity_1.Floors.findByPk(input.floor_id)]);
        if (!byFloor) {
            return (0, valibot_1.getPipeIssues)("floor_id", `No existe un floor con el id: ${input.floor_id}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
