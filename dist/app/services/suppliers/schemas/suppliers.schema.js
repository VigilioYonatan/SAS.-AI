"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.suppliersSchema = void 0;
const uploads_schema_1 = require("@/uploads/schemas/uploads.schema");
const valibot_1 = require("@vigilio/valibot");
const libs_1 = require("../libs");
exports.suppliersSchema = (0, valibot_1.objectAsync)({
    id: (0, valibot_1.number)(),
    supplier_code: (0, valibot_1.string)(),
    ruc: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.regex)(/^(10|20)\d{9}$/, "Ruc no válido")]),
    razon_social: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(5), (0, valibot_1.maxLength)(255)]),
    activity: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(5), (0, valibot_1.maxLength)(100)]),
    address: (0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(5), (0, valibot_1.maxLength)(100)]),
    contact: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.toTrimmed)(), (0, valibot_1.minLength)(5), (0, valibot_1.maxLength)(19)])),
    phone_one: (0, valibot_1.string)([
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.minLength)(9),
        (0, valibot_1.maxLength)(20),
        (0, valibot_1.custom)((value) => /^\d+$/.test(value), "Numero de celular no válido."),
    ]),
    phone_two: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.toTrimmed)(),
        (0, valibot_1.minLength)(9),
        (0, valibot_1.maxLength)(20),
        (0, valibot_1.custom)((value) => /^\d+$/.test(value), "Numero de celular no válido"),
    ])),
    email: (0, valibot_1.string)([(0, valibot_1.email)()]),
    email2: (0, valibot_1.nullable)((0, valibot_1.string)([(0, valibot_1.email)()])),
    web: (0, valibot_1.nullable)((0, valibot_1.string)([
        (0, valibot_1.regex)(/^(https?:\/\/)?[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,}(\/\S*)?$/, "Web no válida"),
    ])),
    logo: (0, valibot_1.nullable)((0, valibot_1.array)((0, uploads_schema_1.filesSchema)(libs_1.suppliersLogoQualities))),
    empresa_id: (0, valibot_1.number)(),
});
