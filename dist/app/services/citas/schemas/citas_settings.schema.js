"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.citasSettingSchema = void 0;
const valibot_1 = require("@vigilio/valibot");
exports.citasSettingSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    max_days: (0, valibot_1.number)([(0, valibot_1.minValue)(0), (0, valibot_1.maxValue)(120)]),
    max_minutes: (0, valibot_1.number)([(0, valibot_1.minValue)(10), (0, valibot_1.maxValue)(360)]),
    enabled: (0, valibot_1.boolean)(),
    isNextDay: (0, valibot_1.boolean)(),
    maxCitas: (0, valibot_1.number)([(0, valibot_1.minValue)(1)]),
    sendQuestionChunk: (0, valibot_1.boolean)(),
    sendAlert: (0, valibot_1.nullable)((0, valibot_1.number)([(0, valibot_1.maxValue)(24)])),
    maxCitasForHour: (0, valibot_1.number)([(0, valibot_1.minValue)(1)]),
    questions: (0, valibot_1.array)((0, valibot_1.object)({
        question: (0, valibot_1.string)([(0, valibot_1.minLength)(4)]),
        options: (0, valibot_1.array)((0, valibot_1.string)([(0, valibot_1.minLength)(3), (0, valibot_1.maxLength)(30)])),
    })),
    custom: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.minLength)(10), (0, valibot_1.maxLength)(255)])),
    horario: (0, valibot_1.array)((0, valibot_1.object)({
        id: (0, valibot_1.number)(),
        day: (0, valibot_1.string)([(0, valibot_1.toTrimmed)()]),
        openTime: (0, valibot_1.string)(),
        closeTime: (0, valibot_1.string)(),
        enabled: (0, valibot_1.boolean)(),
    })),
    empresa_id: (0, valibot_1.number)(),
});
