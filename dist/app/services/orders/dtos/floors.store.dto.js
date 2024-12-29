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
exports.floorsStoreDto = void 0;
const valibot_1 = require("valibot");
const floors_schema_1 = require("../schemas/floors.schema");
const floors_entity_1 = require("../entities/floors.entity");
exports.floorsStoreDto = (0, valibot_1.omitAsync)(floors_schema_1.floorsSchema, ["id"], [
    (input) => __awaiter(void 0, void 0, void 0, function* () {
        const [by_name] = yield Promise.all([
            floors_entity_1.Floors.findOne({
                where: {
                    name: input.name,
                    empresa_id: input.empresa_id,
                },
                raw: true,
            }),
        ]);
        if (by_name) {
            return (0, valibot_1.getPipeIssues)("name", `Ya existe un floor con el nombre: ${input.name}`, input);
        }
        return (0, valibot_1.getOutput)(input);
    }),
]);
